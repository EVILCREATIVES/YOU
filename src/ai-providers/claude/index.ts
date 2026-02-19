import {
  TextProvider,
  ProviderType,
  TextResponse,
  TextGenerationOptions,
  ProviderConfig,
  AIProviderError
} from '../../types';

/**
 * Anthropic Claude provider for text generation
 * Requires CLAUDE_API_KEY environment variable
 */
export class ClaudeProvider implements TextProvider {
  readonly name = 'Anthropic Claude';
  readonly type = ProviderType.TEXT;
  
  private apiKey: string;
  private model: string;
  private apiUrl = 'https://api.anthropic.com/v1';

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey || process.env.CLAUDE_API_KEY || '';
    this.model = config.model || process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      // Make a minimal request to verify the API key works
      const response = await this.makeRequest('messages', {
        model: this.model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResponse> {
    if (!this.isConfigured()) {
      throw new AIProviderError(
        'Claude provider is not configured. Please set CLAUDE_API_KEY environment variable.',
        this.name,
        'NOT_CONFIGURED'
      );
    }

    try {
      const payload = this.buildRequestPayload(prompt, options);
      const response = await this.makeRequest('messages', payload);

      if (!response.ok) {
        const error = await response.json();
        throw new AIProviderError(
          error.error?.message || 'Claude API request failed',
          this.name,
          error.error?.type,
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
        `Claude provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name
      );
    }
  }

  async *generateStream(prompt: string, options?: TextGenerationOptions): AsyncGenerator<string> {
    if (!this.isConfigured()) {
      throw new AIProviderError(
        'Claude provider is not configured. Please set CLAUDE_API_KEY environment variable.',
        this.name,
        'NOT_CONFIGURED'
      );
    }

    // Note: Implement streaming support using Claude's streaming API with SSE
    // For now, fall back to non-streaming
    const response = await this.generateText(prompt, options);
    yield response.text;
  }

  private buildRequestPayload(prompt: string, options?: TextGenerationOptions): any {
    const messages = [];

    // Add conversation history if provided
    if (options?.conversationHistory) {
      for (const message of options.conversationHistory) {
        messages.push({
          role: message.role === 'assistant' ? 'assistant' : 'user',
          content: message.content
        });
      }
    }

    // Add current prompt
    messages.push({
      role: 'user',
      content: prompt
    });

    const payload: any = {
      model: this.model,
      max_tokens: options?.maxTokens || parseInt(process.env.CLAUDE_MAX_TOKENS || '4096'),
      messages
    };

    // Add system prompt if provided
    if (options?.systemPrompt) {
      payload.system = options.systemPrompt;
    }

    // Add generation parameters
    if (options?.temperature !== undefined) {
      payload.temperature = options.temperature;
    }

    if (options?.topP !== undefined) {
      payload.top_p = options.topP;
    }

    if (options?.stopSequences && options.stopSequences.length > 0) {
      payload.stop_sequences = options.stopSequences;
    }

    return payload;
  }

  private parseResponse(data: any): TextResponse {
    const content = data.content?.[0]?.text || '';
    
    return {
      text: content,
      provider: this.name,
      model: data.model || this.model,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
      finishReason: data.stop_reason === 'end_turn' ? 'stop' : data.stop_reason,
      metadata: {
        usage: data.usage,
        stopReason: data.stop_reason
      }
    };
  }

  private async makeRequest(endpoint: string, body: any): Promise<Response> {
    const url = `${this.apiUrl}/${endpoint}`;
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
  }
}
