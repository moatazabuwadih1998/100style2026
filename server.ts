import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Simple in-memory rate limiting and usage tracker
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const ipRateLimits = new Map<string, RateLimitEntry>();
let totalRequestsToday = 0;
let lastResetDay = new Date().getUTCDate();

function checkDailyReset() {
  const currentDay = new Date().getUTCDate();
  if (currentDay !== lastResetDay) {
    totalRequestsToday = 0;
    lastResetDay = currentDay;
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  checkDailyReset();
  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
  
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    serverTime: new Date().toISOString(),
    hasOpenAiKey,
    dailyRequestsUsed: totalRequestsToday,
    dailyRequestsLimit: 100
  });
});

// Image Generation Proxy Endpoint
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    checkDailyReset();
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    // Rate limiting: 10 requests per minute per IP
    const now = Date.now();
    const ipRecord = ipRateLimits.get(clientIp);
    if (ipRecord && now < ipRecord.resetTime) {
      if (ipRecord.count >= 10) {
        return res.status(429).json({
          error: 'تم تجاوز الحد الأقصى للطلبات في الدقيقة الواحدة. يرجى الانتظار قليلاً قبل إعادة المحاولة.',
          code: 'RATE_LIMIT_EXCEEDED'
        });
      }
      ipRecord.count += 1;
    } else {
      ipRateLimits.set(clientIp, { count: 1, resetTime: now + 60000 });
    }

    // Daily limit
    if (totalRequestsToday >= 100) {
      return res.status(429).json({
        error: 'تم الوصول إلى الحد الأقصى اليومي لطلبات التوليد (100 طلب).',
        code: 'DAILY_LIMIT_REACHED'
      });
    }

    const {
      prompt,
      styleNameEn,
      styleNameAr,
      settings,
      referenceImageBase64,
      preserveIdentity
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'البرومبت مطلوب ويجب أن يكون نصاً صالحاً.',
        code: 'INVALID_PROMPT'
      });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return res.status(400).json({
        error: 'مفتاح OpenAI API غير مهيأ في الخادم. يرجى تعيين OPENAI_API_KEY في ملف .env للبيئة لبدء التوليد الفعلي بالذكاء الاصطناعي.',
        code: 'MISSING_API_KEY'
      });
    }

    // Map aspect ratios to DALL-E 3 supported dimensions
    // DALL-E 3 supports: 1024x1024 (square), 1024x1792 (portrait), 1792x1024 (landscape)
    let openAiSize = '1024x1024';
    if (settings?.aspectRatio === '9:16' || settings?.aspectRatio === '3:4' || settings?.aspectRatio === '4:5') {
      openAiSize = '1024x1792';
    }

    // Assemble rich prompt with identity preservation instructions
    let enhancedPrompt = prompt;
    if (referenceIdentityText(preserveIdentity, styleNameEn)) {
      enhancedPrompt = `${referenceIdentityText(preserveIdentity, styleNameEn)}: ${prompt}`;
    }

    // Call OpenAI Images API
    totalRequestsToday += 1;

    const requestPayload: {
      model: string;
      prompt: string;
      n: number;
      size: string;
      quality?: string;
      response_format?: string;
    } = {
      model: settings?.model === 'dall-e-2' ? 'dall-e-2' : 'dall-e-3',
      prompt: enhancedPrompt.slice(0, 4000),
      n: 1,
      size: settings?.model === 'dall-e-2' ? '1024x1024' : openAiSize,
      quality: settings?.quality === 'hd' ? 'hd' : 'standard',
      response_format: 'b64_json'
    };

    const openAiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestPayload)
    });

    const openAiData = await openAiResponse.json();

    if (!openAiResponse.ok) {
      const errMsg = openAiData?.error?.message || 'فشل الاتصال بخدمة توليد الصور من OpenAI';
      let translatedError = errMsg;

      if (openAiResponse.status === 401) {
        translatedError = 'مفتاح OpenAI API غير صالح أو منتهي الصلاحية. يرجى التحقق من المفتاح في الخادم.';
      } else if (openAiResponse.status === 429) {
        translatedError = 'تم استنفاذ رصيد أو تجاوز معدل استهلاك حساب OpenAI الخاص بك. يرجى مراجعة فوترة الحساب.';
      } else if (errMsg.includes('safety system') || errMsg.includes('content policy')) {
        translatedError = 'تم رفض الطلب بواسطة نظام حماية المحتوى لدى المزود. يرجى تعديل البرومبت وتجنب الكلمات الحساسة.';
      }

      return res.status(openAiResponse.status).json({
        error: translatedError,
        rawError: errMsg,
        code: openAiData?.error?.code || 'OPENAI_ERROR'
      });
    }

    const firstItem = openAiData?.data?.[0];
    if (!firstItem) {
      return res.status(500).json({
        error: 'لم تُرجع الخدمة أي صورة صالحة.',
        code: 'EMPTY_RESPONSE'
      });
    }

    let resultBase64 = '';
    if (firstItem.b64_json) {
      resultBase64 = `data:image/png;base64,${firstItem.b64_json}`;
    } else if (firstItem.url) {
      // If URL returned, download and convert to base64 so client has stable image
      try {
        const imgFetch = await fetch(firstItem.url);
        const arrayBuf = await imgFetch.arrayBuffer();
        const b64 = Buffer.from(arrayBuf).toString('base64');
        resultBase64 = `data:image/png;base64,${b64}`;
      } catch {
        resultBase64 = firstItem.url;
      }
    }

    return res.json({
      success: true,
      resultImageBase64: resultBase64,
      resultImageUrl: firstItem.url || '',
      revisedPrompt: firstItem.revised_prompt || enhancedPrompt
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ داخلي في الخادم';
    console.error('Server error in /api/generate-image:', message);
    return res.status(500).json({
      error: `حدث خطأ غير متوقع في الخادم: ${message}`,
      code: 'INTERNAL_ERROR'
    });
  }
});

function referenceIdentityText(preserveIdentity?: boolean, styleNameEn?: string): string {
  if (preserveIdentity) {
    return `Masterpiece art in ${styleNameEn || 'Anime and Game Style'}. Crucial instructions: Meticulously preserve the exact person's facial features, eye shape, nose structure, facial hair, skin tone and distinctive physical identity from the reference subject while fully rendering in this unique artistic style.`;
  }
  return '';
}

// Dev and Prod Vite serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
