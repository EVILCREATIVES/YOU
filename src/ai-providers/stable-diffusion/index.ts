import {
  ImageProvider,
  ProviderType,
  ImageResponse,
  ImageGenerationOptions,
  ProviderConfig,
  AIProviderError
} from '../../types';

/**
 * Stable Diffusion provider for image generation
 * Can work with local installations or cloud APIs
 * Requires STABLE_DIFFUSION_API_URL environment variable
 */
export class StableDiffusionProvider implements ImageProvider {
  readonly name = 'Stable Diffusion';
  readonly type = ProviderType.IMAGE;
  
  private apiKey: string;
  private model: string;
  private apiUrl: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey || process.env.STABLE_DIFFUSION_API_KEY || '';
    this.model = config.model || process.env.STABLE_DIFFUSION_MODEL || 'sd-xl-base-1.0';
    this.apiUrl = config.apiUrl || process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860';
  }

  isConfigured(): boolean {
    // Stable Diffusion can work without API key if using local installation
    return !!this.apiUrl;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      // Try to ping the health endpoint
      const response = await fetch(`${this.apiUrl}/healthcheck`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageResponse> {
    if (!this.isConfigured()) {
      throw new AIProviderError(
        'Stable Diffusion provider is not configured. Please set STABLE_DIFFUSION_API_URL environment variable.',
        this.name,
        'NOT_CONFIGURED'
      );
    }

    try {
      const payload = this.buildRequestPayload(prompt, options);
      const response = await this.makeRequest(payload);

      if (!response.ok) {
        const error = await response.text();
        throw new AIProviderError(
          `Stable Diffusion API request failed: ${error}`,
          this.name,
          'API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      return this.parseResponse(data, options);
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        `Stable Diffusion provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name
      );
    }
  }

  private buildRequestPayload(prompt: string, options?: ImageGenerationOptions): any {
    const payload: any = {
      prompt,
      negative_prompt: options?.negativePrompt || '',
      width: options?.width || 512,
      height: options?.height || 512,
      steps: options?.steps || 20,
      cfg_scale: options?.guidanceScale || 7.5,
      seed: options?.seed || -1,
      sampler_name: 'Euler a',
      batch_size: 1,
      n_iter: 1
    };

    // Handle aspect ratio if specified
    if (options?.aspectRatio) {
      const [w, h] = this.parseAspectRatio(options.aspectRatio);
      payload.width = w;
      payload.height = h;
    }

    return payload;
  }

  private parseAspectRatio(ratio: string): [number, number] {
    const ratios: Record<string, [number, number]> = {
      '1:1': [512, 512],
      '16:9': [768, 432],
      '9:16': [432, 768],
      '4:3': [640, 480],
      '3:4': [480, 640],
      '21:9': [1024, 440]
    };

    return ratios[ratio] || [512, 512];
  }

  private parseResponse(data: any, options?: ImageGenerationOptions): ImageResponse {
    // Stable Diffusion returns base64 encoded images in the 'images' array
    const imageBase64 = data.images?.[0] || '';
    
    return {
      imageBase64,
      provider: this.name,
      model: this.model,
      width: options?.width || 512,
      height: options?.height || 512,
      seed: data.seed || options?.seed,
      metadata: {
        parameters: data.parameters,
        info: data.info
      }
    };
  }

  private async makeRequest(body: any): Promise<Response> {
    // Default endpoint for txt2img
    const url = `${this.apiUrl}/sdapi/v1/txt2img`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add API key if provided (for cloud services)
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    return fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
  }
}
