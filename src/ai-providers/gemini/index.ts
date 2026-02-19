import {
  TextProvider,
  ProviderType,
  TextResponse,
  TextGenerationOptions,
  ProviderConfig,
  AIProviderError
} from '../../types';

/**
 * Google Gemini provider for text generation
 * Requires GEMINI_API_KEY environment variable
 */
export class GeminiProvider implements TextProvider {
  readonly name = 'Google Gemini';
  readonly type = ProviderType.TEXT;
  
  private apiKey: string;
  private model: string;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || '';
    this.model = config.model || process.env.GEMINI_MODEL || 'gemini-pro';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      // Make a simple request to verify the API key works
      const response = await this.makeRequest('models', 'GET');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResponse> {
    if (!this.isConfigured()) {
      throw new AIProviderError(
        'Gemini provider is not configured. Please set GEMINI_API_KEY environment variable.',
        this.name,
        'NOT_CONFIGURED'
      );
    }

    try {
      const payload = this.buildRequestPayload(prompt, options);
      const response = await this.makeRequest(
        `models/${this.model}:generateContent`,
        'POST',
        payload
      );

      if (!response.ok) {
        const error = await response.json();
        throw new AIProviderError(
          error.error?.message || 'Gemini API request failed',
          this.name,
          error.error?.code,
          response.status
        );
      }

      const data = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(
        `Gemini provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name
      );
    }
  }

  async *generateStream(prompt: string, options?: TextGenerationOptions): AsyncGenerator<string> {
    if (!this.isConfigured()) {
      throw new AIProviderError(
        'Gemini provider is not configured. Please set GEMINI_API_KEY environment variable.',
        this.name,
        'NOT_CONFIGURED'
      );
    }

    // Note: Implement streaming support based on Gemini's streaming API
    // For now, fall back to non-streaming
    const response = await this.generateText(prompt, options);
    yield response.text;
  }

  private buildRequestPayload(prompt: string, options?: TextGenerationOptions): any {
    const contents = [];

    // Add system prompt if provided
    if (options?.systemPrompt) {
      contents.push({
        role: 'user',
        parts: [{ text: options.systemPrompt }]
      });
    }

    // Add conversation history if provided
    if (options?.conversationHistory) {
      for (const message of options.conversationHistory) {
        contents.push({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }]
        });
      }
    }

    // Add current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    return {
      contents,
      generationConfig: {
        temperature: options?.temperature || 0.7,
        topP: options?.topP || 0.95,
        maxOutputTokens: options?.maxTokens || 2048,
        stopSequences: options?.stopSequences || []
      }
    };
  }

  private parseResponse(data: any): TextResponse {
    const candidate = data.candidates?.[0];
    const content = candidate?.content?.parts?.[0]?.text || '';
    const finishReason = candidate?.finishReason?.toLowerCase() || 'stop';

    return {
      text: content,
      provider: this.name,
      model: this.model,
      tokensUsed: data.usageMetadata?.totalTokenCount,
      finishReason: finishReason as any,
      metadata: {
        safetyRatings: candidate?.safetyRatings,
        citationMetadata: candidate?.citationMetadata
      }
    };
  }

  private async makeRequest(endpoint: string, method: string, body?: any): Promise<Response> {
    const url = `${this.apiUrl}/${endpoint}?key=${this.apiKey}`;
    
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
  }
}
