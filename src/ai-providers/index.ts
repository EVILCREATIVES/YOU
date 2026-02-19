import { TextProvider, ImageProvider, ProviderConfig } from '../types';
import { MockTextProvider, MockImageProvider } from './mock';
import { GeminiProvider } from './gemini';
import { ClaudeProvider } from './claude';
import { FluxProvider } from './flux';
import { StableDiffusionProvider } from './stable-diffusion';

/**
 * Provider Factory for creating AI provider instances
 */
export class ProviderFactory {
  /**
   * Create a text provider based on the specified type
   */
  static createTextProvider(
    providerType: 'gemini' | 'claude' | 'mock',
    config?: ProviderConfig
  ): TextProvider {
    const providerConfig = config || {};

    switch (providerType) {
      case 'gemini':
        return new GeminiProvider(providerConfig);
      case 'claude':
        return new ClaudeProvider(providerConfig);
      case 'mock':
        return new MockTextProvider(providerConfig.mockDelay);
      default:
        throw new Error(`Unknown text provider type: ${providerType}`);
    }
  }

  /**
   * Create an image provider based on the specified type
   */
  static createImageProvider(
    providerType: 'flux' | 'stable-diffusion' | 'mock',
    config?: ProviderConfig
  ): ImageProvider {
    const providerConfig = config || {};

    switch (providerType) {
      case 'flux':
        return new FluxProvider(providerConfig);
      case 'stable-diffusion':
        return new StableDiffusionProvider(providerConfig);
      case 'mock':
        return new MockImageProvider(providerConfig.mockDelay);
      default:
        throw new Error(`Unknown image provider type: ${providerType}`);
    }
  }
}

/**
 * AI Provider Manager for managing multiple providers
 * Handles fallback to mock providers if real providers are not configured
 */
export class AIProviderManager {
  private textProvider: TextProvider;
  private imageProvider: ImageProvider;

  constructor(
    textProviderType?: string,
    imageProviderType?: string,
    config?: ProviderConfig
  ) {
    // Get provider types from environment or use defaults
    const textType = (textProviderType || process.env.DEFAULT_TEXT_PROVIDER || 'mock') as any;
    const imageType = (imageProviderType || process.env.DEFAULT_IMAGE_PROVIDER || 'mock') as any;

    // Create providers
    this.textProvider = this.createTextProviderWithFallback(textType, config);
    this.imageProvider = this.createImageProviderWithFallback(imageType, config);
  }

  /**
   * Get the current text provider
   */
  getTextProvider(): TextProvider {
    return this.textProvider;
  }

  /**
   * Get the current image provider
   */
  getImageProvider(): ImageProvider {
    return this.imageProvider;
  }

  /**
   * Check if all providers are healthy
   */
  async checkHealth(): Promise<{ text: boolean; image: boolean }> {
    const [textHealth, imageHealth] = await Promise.all([
      this.textProvider.healthCheck(),
      this.imageProvider.healthCheck()
    ]);

    return {
      text: textHealth,
      image: imageHealth
    };
  }

  /**
   * Get provider status information
   */
  getStatus() {
    return {
      text: {
        name: this.textProvider.name,
        configured: this.textProvider.isConfigured(),
        type: this.textProvider.type
      },
      image: {
        name: this.imageProvider.name,
        configured: this.imageProvider.isConfigured(),
        type: this.imageProvider.type
      }
    };
  }

  /**
   * Create a text provider with automatic fallback to mock
   */
  private createTextProviderWithFallback(
    providerType: string,
    config?: ProviderConfig
  ): TextProvider {
    try {
      const provider = ProviderFactory.createTextProvider(providerType as any, config);
      
      // If provider is not configured, fall back to mock
      if (!provider.isConfigured()) {
        console.warn(
          `${provider.name} is not configured. Falling back to mock provider. ` +
          `Set the appropriate API key in your .env file to use real providers.`
        );
        return new MockTextProvider(config?.mockDelay);
      }

      return provider;
    } catch (error) {
      console.warn(`Failed to create text provider: ${error}. Using mock provider.`);
      return new MockTextProvider(config?.mockDelay);
    }
  }

  /**
   * Create an image provider with automatic fallback to mock
   */
  private createImageProviderWithFallback(
    providerType: string,
    config?: ProviderConfig
  ): ImageProvider {
    try {
      const provider = ProviderFactory.createImageProvider(providerType as any, config);
      
      // If provider is not configured, fall back to mock
      if (!provider.isConfigured()) {
        console.warn(
          `${provider.name} is not configured. Falling back to mock provider. ` +
          `Set the appropriate API key in your .env file to use real providers.`
        );
        return new MockImageProvider(config?.mockDelay);
      }

      return provider;
    } catch (error) {
      console.warn(`Failed to create image provider: ${error}. Using mock provider.`);
      return new MockImageProvider(config?.mockDelay);
    }
  }
}
