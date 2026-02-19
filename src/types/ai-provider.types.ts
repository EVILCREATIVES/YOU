/**
 * Base interface for all AI providers
 */
export interface AIProvider {
  readonly name: string;
  readonly type: ProviderType;
  isConfigured(): boolean;
  healthCheck(): Promise<boolean>;
}

/**
 * Provider types
 */
export enum ProviderType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  MOCK = 'mock'
}

/**
 * Text generation provider interface
 */
export interface TextProvider extends AIProvider {
  generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResponse>;
  generateStream(prompt: string, options?: TextGenerationOptions): AsyncGenerator<string>;
}

/**
 * Image generation provider interface
 */
export interface ImageProvider extends AIProvider {
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageResponse>;
}

/**
 * Text generation options
 */
export interface TextGenerationOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
  systemPrompt?: string;
  conversationHistory?: Message[];
}

/**
 * Image generation options
 */
export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  aspectRatio?: AspectRatio;
  steps?: number;
  guidanceScale?: number;
  negativePrompt?: string;
  seed?: number;
  style?: ImageStyle;
}

/**
 * Message format for conversation history
 */
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

/**
 * Text generation response
 */
export interface TextResponse {
  text: string;
  provider: string;
  model: string;
  tokensUsed?: number;
  finishReason?: 'stop' | 'length' | 'error';
  metadata?: Record<string, any>;
}

/**
 * Image generation response
 */
export interface ImageResponse {
  imageUrl?: string;
  imageBase64?: string;
  provider: string;
  model: string;
  width: number;
  height: number;
  seed?: number;
  metadata?: Record<string, any>;
}

/**
 * Aspect ratios for image generation
 */
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';

/**
 * Image styles
 */
export enum ImageStyle {
  REALISTIC = 'realistic',
  ARTISTIC = 'artistic',
  ANIME = 'anime',
  DIGITAL_ART = 'digital_art',
  CINEMATIC = 'cinematic',
  COMIC = 'comic',
  PHOTOGRAPH = 'photograph'
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  apiKey?: string;
  apiUrl?: string;
  model?: string;
  timeout?: number;
  retries?: number;
  mockDelay?: number;
}

/**
 * AI Provider error
 */
export class AIProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}
