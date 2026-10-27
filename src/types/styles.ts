/**
 * Data structures and types for the 100 Art Styles Platform
 */

export interface ArtStyle {
  id: string; // e.g. "g01-s01"
  groupId: string; // e.g. "g01"
  indexInGroup: number; // 1 to 10
  groupNameAr: string;
  groupNameEn: string;
  styleNameAr: string;
  styleNameEn: string;
  description: string;
  detailedDescriptionAr: string;
  keywords: string[];
  visualTraits: {
    lineArt: string;
    coloring: string;
    lighting: string;
    atmosphere: string;
  };
  promptTemplate: string;
  negativePrompt: string;
  characterArchetypeTips: string;
  paletteColors: string[];
  tags: string[];
  previewAlt: string;
  previewStatus: 'available' | 'generated' | 'fallback';
}

export interface StyleGroup {
  id: string; // "g01" to "g10"
  number: number; // 1 to 10
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  iconName: string;
  themeColor: string;
  styles: ArtStyle[];
}

export interface PromptBuilderOptions {
  characterType: 'man' | 'woman' | 'fantasy' | 'game_hero' | 'custom';
  customCharacterDesc: string;
  selectedStyleId: string;
  background: 'studio' | 'cyberpunk_city' | 'nature' | 'fantasy_realm' | 'cinematic' | 'custom';
  customBackgroundDesc: string;
  lighting: 'cinematic' | 'soft' | 'dramatic' | 'neon' | 'studio' | 'natural';
  detailLevel: 'simple' | 'medium' | 'high' | 'ultra';
  shotAngle: 'close_up' | 'half_body' | 'full_body' | 'dutch_angle';
  aspectRatio: '1:1' | '4:5' | '3:4' | '9:16';
  preserveIdentity: boolean;
  preserveClothing: boolean;
  preserveHair: boolean;
  customNotes: string;
}

export interface GenerationSettings {
  aspectRatio: '1:1' | '4:5' | '3:4' | '9:16';
  quality: 'standard' | 'hd';
  model: 'dall-e-3' | 'dall-e-2';
  referenceFidelityPrompt: boolean;
  styleStrength: number; // 1 to 100
}

export interface GenerationRecord {
  id: string;
  timestamp: number;
  status: 'ready' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled';
  styleId: string;
  styleNameAr: string;
  styleNameEn: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: string;
  dimensions?: string;
  quality?: string;
  referenceImageBase64?: string;
  resultImageBase64?: string;
  resultImageUrl?: string;
  errorMessage?: string;
  iterationCount: number;
  parentRecordId?: string;
}

export interface ApiServerStatus {
  status: 'online' | 'offline' | 'checking';
  hasOpenAiKey: boolean;
  serverTime?: string;
  dailyRequestsUsed: number;
  dailyRequestsLimit: number;
}
