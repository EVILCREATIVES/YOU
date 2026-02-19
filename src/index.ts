import { loadEnvironment } from './utils';
import { AIProviderManager } from './ai-providers';
import { CanvasManager, ProjectManager } from './canvas';
import { ProjectType } from './types';

// Load environment variables
loadEnvironment();

/**
 * Main application class
 */
export class YouCreativeCanvas {
  private aiManager: AIProviderManager;

  constructor() {
    // Initialize AI provider manager
    this.aiManager = new AIProviderManager();
    
    console.log('YOU Creative Canvas initialized');
    this.printProviderStatus();
  }

  /**
   * Get AI provider manager
   */
  getAIManager(): AIProviderManager {
    return this.aiManager;
  }

  /**
   * Create a new canvas
   */
  createCanvas(width?: number, height?: number): CanvasManager {
    return new CanvasManager(width, height);
  }

  /**
   * Create a new project
   */
  createProject(name: string, type?: ProjectType): ProjectManager {
    return new ProjectManager(name, type);
  }

  /**
   * Print provider status
   */
  private printProviderStatus(): void {
    const status = this.aiManager.getStatus();
    console.log('\nAI Provider Status:');
    console.log(`- Text Provider: ${status.text.name} (${status.text.configured ? 'configured' : 'not configured'})`);
    console.log(`- Image Provider: ${status.image.name} (${status.image.configured ? 'configured' : 'not configured'})`);
    
    if (!status.text.configured || !status.image.configured) {
      console.log('\n⚠️  Some providers are not configured. Using mock providers for local development.');
      console.log('To use real AI providers, copy .env.example to .env and add your API keys.\n');
    }
  }

  /**
   * Check health of all providers
   */
  async checkHealth(): Promise<void> {
    console.log('Checking AI provider health...');
    const health = await this.aiManager.checkHealth();
    console.log(`- Text Provider: ${health.text ? '✓ healthy' : '✗ unhealthy'}`);
    console.log(`- Image Provider: ${health.image ? '✓ healthy' : '✗ unhealthy'}`);
  }
}

// Export types and classes
export * from './types';
export * from './ai-providers';
export * from './canvas';
export * from './utils';

// Create a default instance
export const you = new YouCreativeCanvas();
