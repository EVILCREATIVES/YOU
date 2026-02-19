import {
  ImageProvider,
  ProviderType,
  ImageResponse,
  ImageGenerationOptions,
  ProviderConfig,
  AIProviderError
} from '../../types';

/**
 * FLUX image generation provider
 * Requires FLUX_API_KEY environment variable
 */
export class FluxProvider implements ImageProvider {
  readonly name = 'FLUX';
  readonly type = ProviderType.IMAGE;
  
  private apiKey: string;
  private model: string;
  private apiUrl: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey || process.env.FLUX_API_KEY || '';
    this.model = config.model || process.env.FLUX_MODEL || 'flux-pro';
    this.apiUrl = config.apiUrl || process.env.FLUX_API_URL || 'https://api.bfl.ml';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    // FLUX doesn't have a dedicated health endpoint, so we'll just check if configured
    return true;
  }

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageResponse> {
    if (!this.isConfigured()) {
      throw new AIProviderError(
        'FLUX provider is not configured. Please set FLUX_API_KEY environment variable.',
        this.name,
        'NOT_CONFIGURED'
      );
    }

    try {
      const payload = this.buildRequestPayload(prompt, options);
      const response = await this.makeRequest(payload);

      if (!response.ok) {
        const error = await response.json();
        throw new AIProviderError(
          error.message || 'FLUX API request failed',
          this.name,
          error.code,
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
        `FLUX provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name
      );
    }
  }

  private buildRequestPayload(prompt: string, options?: ImageGenerationOptions): any {
    const width = options?.width || 512;
    const height = options?.height || 512;

    const payload: any = {
      prompt,
      width,
      height,
      steps: options?.steps || 4,
      prompt_upsampling: false,
      seed: options?.seed,
      guidance: options?.guidanceScale || 3.5,
      output_format: 'jpeg'
    };

    // Add negative prompt if provided
    if (options?.negativePrompt) {
      payload.negative_prompt = options.negativePrompt;
    }

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
      '1:1': [1024, 1024],
      '16:9': [1344, 768],
      '9:16': [768, 1344],
      '4:3': [1152, 896],
      '3:4': [896, 1152],
      '21:9': [1536, 640]
    };

    return ratios[ratio] || [1024, 1024];
  }

  private parseResponse(data: any, options?: ImageGenerationOptions): ImageResponse {
    // FLUX returns image in different formats depending on the endpoint used
    const imageData = data.sample || data.image || data.result;
    
    return {
      imageBase64: imageData,
      provider: this.name,
      model: this.model,
      width: options?.width || 512,
      height: options?.height || 512,
      seed: data.seed || options?.seed,
      metadata: {
        promptUpsampling: data.prompt_upsampling,
        hasNsfw: data.has_nsfw,
        timings: data.timings
      }
    };
  }

  private async makeRequest(body: any): Promise<Response> {
    // FLUX API endpoint may vary based on model
    const endpoint = this.model === 'flux-pro' ? 'v1/flux-pro' : 'v1/image';
    const url = `${this.apiUrl}/${endpoint}`;
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key': this.apiKey
      },
      body: JSON.stringify(body)
    });
  }
}
