import { ApiServerStatus, GenerationSettings } from '../types/styles';

export interface GenerateImagePayload {
  prompt: string;
  negativePrompt?: string;
  styleId: string;
  styleNameAr: string;
  styleNameEn: string;
  settings: GenerationSettings;
  referenceImageBase64?: string;
  preserveIdentity?: boolean;
}

export interface GenerateImageResponse {
  success: boolean;
  resultImageBase64?: string;
  resultImageUrl?: string;
  revisedPrompt?: string;
  error?: string;
  code?: string;
}

export async function fetchServerHealth(): Promise<ApiServerStatus> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return {
      status: 'online',
      hasOpenAiKey: !!data.hasOpenAiKey,
      serverTime: data.serverTime,
      dailyRequestsUsed: data.dailyRequestsUsed || 0,
      dailyRequestsLimit: data.dailyRequestsLimit || 50
    };
  } catch {
    return {
      status: 'offline',
      hasOpenAiKey: false,
      dailyRequestsUsed: 0,
      dailyRequestsLimit: 50
    };
  }
}

export async function sendGenerateImageRequest(payload: GenerateImagePayload): Promise<GenerateImageResponse> {
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error || `خطأ في الخادم (${res.status})`,
        code: data.code || 'SERVER_ERROR'
      };
    }

    return {
      success: true,
      resultImageBase64: data.resultImageBase64,
      resultImageUrl: data.resultImageUrl,
      revisedPrompt: data.revisedPrompt
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'تعذر الاتصال بالخادم الخلفي';
    return {
      success: false,
      error: `فشل الاتصال: ${message}. تأكد من تشغيل الخادم والاتصال بالشبكة.`,
      code: 'NETWORK_ERROR'
    };
  }
}
