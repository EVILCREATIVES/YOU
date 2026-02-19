# YOU - Universal Creative Canvas

<div align="center">

**A universal canvas where users can create assets, edit them, and produce stories, films, videos, games, and comics—whatever they imagine—without ever leaving the space.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green)](https://nodejs.org/)

*This is about your creativity, not the interface.*

</div>

---

## 🌟 Overview

**YOU** is an AI-powered creative platform that provides a universal canvas for content creation. Whether you're writing stories, creating films, designing games, or producing comics, YOU provides the tools and AI assistance you need—all in one unified environment.

### Key Features

- **🎨 Universal Canvas**: Flexible, multi-purpose canvas supporting text, images, video, audio, and interactive elements
- **🤖 AI-Powered Creation**: Integrated support for multiple AI providers (Google Gemini, Anthropic Claude, FLUX, Stable Diffusion)
- **📦 Asset Management**: Organize and manage all your creative assets in one place
- **🎬 Multi-Format Projects**: Create stories, films, videos, games, and comics with project-specific workflows
- **🔌 Provider-Agnostic Architecture**: Clean, modular AI provider system with automatic fallback to mock providers
- **🛠️ Developer-Friendly**: TypeScript-based with comprehensive types and interfaces

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/EVILCREATIVES/YOU.git
   cd YOU
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (optional for AI providers):
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

4. **Run in development mode**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

### Running Without API Keys

YOU can run completely offline using mock AI providers! Simply skip the `.env` configuration, and the app will automatically use mock providers for local development and testing.

---

## 📖 Usage Examples

### Basic Canvas Creation

```typescript
import { you } from './src';

// Create a new canvas
const canvas = you.createCanvas(1920, 1080);

// Add text elements
canvas.addTextElement('Hello, Creative World!', 100, 100, {
  fontSize: 48,
  fontFamily: 'Arial',
  color: '#3b82f6'
});

// Add images
canvas.addImageElement(
  'path/to/image.jpg',
  100,
  200,
  400,
  300
);

// Export canvas
const exported = canvas.export();
```

### AI Text Generation

```typescript
import { you } from './src';

const aiManager = you.getAIManager();
const textProvider = aiManager.getTextProvider();

// Generate text
const response = await textProvider.generateText(
  'Write a creative story about...',
  {
    maxTokens: 500,
    temperature: 0.7
  }
);

console.log(response.text);
```

### AI Image Generation

```typescript
import { you } from './src';

const aiManager = you.getAIManager();
const imageProvider = aiManager.getImageProvider();

// Generate an image
const response = await imageProvider.generateImage(
  'A futuristic creative workspace',
  {
    width: 1024,
    height: 1024,
    aspectRatio: '1:1'
  }
);

console.log(response.imageUrl);
```

### Project Management

```typescript
import { you, ProjectType } from './src';

// Create a comic project
const project = you.createProject('My Comic', ProjectType.COMIC);

// Create multiple panels
const panel1 = you.createCanvas(800, 600);
const panel2 = you.createCanvas(800, 600);

// Add canvases to project
project.addCanvas(panel1.getCanvas());
project.addCanvas(panel2.getCanvas());

// Export project
const exported = project.export();
```

---

## 🤖 AI Provider Configuration

### Supported Providers

| Provider | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| **Google Gemini** | Text | `GEMINI_API_KEY` | Advanced language model for text generation |
| **Anthropic Claude** | Text | `CLAUDE_API_KEY` | Powerful conversational AI |
| **FLUX** | Image | `FLUX_API_KEY` | High-quality image generation |
| **Stable Diffusion** | Image | `STABLE_DIFFUSION_API_URL` | Open-source image generation (local or cloud) |
| **Mock** | Both | N/A | Local development provider (no API required) |

### Configuration Steps

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys** to `.env`:
   ```env
   # Google Gemini
   GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL=gemini-pro
   
   # Anthropic Claude
   CLAUDE_API_KEY=your_api_key_here
   CLAUDE_MODEL=claude-3-sonnet-20240229
   
   # FLUX
   FLUX_API_KEY=your_api_key_here
   
   # Stable Diffusion (local)
   STABLE_DIFFUSION_API_URL=http://localhost:7860
   ```

3. **Set default providers**:
   ```env
   DEFAULT_TEXT_PROVIDER=gemini  # or claude, mock
   DEFAULT_IMAGE_PROVIDER=flux   # or stable-diffusion, mock
   ```

### Getting API Keys

- **Google Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Anthropic Claude**: [Anthropic Console](https://console.anthropic.com/)
- **FLUX**: [FLUX Platform](https://api.bfl.ml/)
- **Stable Diffusion**: [Local Installation Guide](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

---

## 🏗️ Architecture

### Project Structure

```
YOU/
├── src/
│   ├── ai-providers/          # AI provider implementations
│   │   ├── gemini/           # Google Gemini provider
│   │   ├── claude/           # Anthropic Claude provider
│   │   ├── flux/             # FLUX image provider
│   │   ├── stable-diffusion/ # Stable Diffusion provider
│   │   ├── mock/             # Mock provider for local dev
│   │   └── index.ts          # Provider factory & manager
│   ├── canvas/               # Canvas and project management
│   │   └── index.ts          # Canvas & project managers
│   ├── types/                # TypeScript type definitions
│   │   ├── ai-provider.types.ts
│   │   ├── canvas.types.ts
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── env.ts           # Environment variable handling
│   │   └── index.ts
│   ├── examples/             # Usage examples
│   │   ├── ai-examples.ts
│   │   └── canvas-examples.ts
│   └── index.ts              # Main entry point
├── .env.example              # Example environment configuration
├── .gitignore               # Git ignore rules
├── package.json             # Node.js dependencies
├── tsconfig.json            # TypeScript configuration
├── LICENSE                  # MIT License
└── README.md                # This file
```

### Core Components

#### 1. AI Provider System

The AI provider system is modular and extensible:

```typescript
// All providers implement these interfaces
interface TextProvider {
  generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResponse>;
  generateStream(prompt: string, options?: TextGenerationOptions): AsyncGenerator<string>;
}

interface ImageProvider {
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageResponse>;
}
```

#### 2. Canvas System

The canvas system provides a flexible drawing/editing surface:

- **CanvasManager**: Manages individual canvases
- **ProjectManager**: Manages multi-canvas projects
- **Elements**: Text, images, shapes, video, audio

#### 3. Provider Factory

The `AIProviderManager` automatically handles:
- Provider selection based on environment variables
- Automatic fallback to mock providers
- Health checking
- Configuration validation

---

## 🔒 Security & Privacy

This repository is designed to be **publicly safe**:

✅ **No API keys or secrets committed**  
✅ **All sensitive data in `.env` (gitignored)**  
✅ **Mock providers for keyless development**  
✅ **No proprietary prompts or system messages**  
✅ **No billing-enabled endpoints hardcoded**  

### Best Practices

- **Never commit** `.env` files
- **Always use** environment variables for secrets
- **Rotate API keys** regularly
- **Use mock providers** for testing and development
- **Review** code before committing

---

## 📚 API Documentation

### AIProviderManager

```typescript
class AIProviderManager {
  getTextProvider(): TextProvider
  getImageProvider(): ImageProvider
  checkHealth(): Promise<{ text: boolean; image: boolean }>
  getStatus(): ProviderStatus
}
```

### CanvasManager

```typescript
class CanvasManager {
  addTextElement(content: string, x: number, y: number, options?: Partial<TextElement>): TextElement
  addImageElement(src: string, x: number, y: number, width: number, height: number, options?: Partial<ImageElement>): ImageElement
  removeElement(elementId: string): boolean
  updateElement(elementId: string, updates: Partial<CanvasElement>): boolean
  export(): string
  import(json: string): void
}
```

### ProjectManager

```typescript
class ProjectManager {
  addCanvas(canvas: Canvas): void
  removeCanvas(canvasId: string): boolean
  export(): string
  import(json: string): void
}
```

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Run in development mode with ts-node
npm run build        # Build TypeScript to JavaScript
npm start           # Run built application
npm test            # Run tests
npm run lint        # Lint code
npm run format      # Format code with Prettier
npm run type-check  # Check TypeScript types
```

### Running Examples

```bash
# AI examples
npm run dev src/examples/ai-examples.ts

# Canvas examples
npm run dev src/examples/canvas-examples.ts
```

---

## 🗺️ Roadmap

- [ ] **Video Generation**: Integration with video AI models
- [ ] **Audio Generation**: Voice and music synthesis
- [ ] **Game Engine**: Interactive game development tools
- [ ] **Collaboration**: Real-time multi-user editing
- [ ] **Export Formats**: PDF, video, executable games
- [ ] **Plugin System**: Extensible architecture for custom tools
- [ ] **Cloud Sync**: Optional cloud storage integration
- [ ] **Mobile Support**: React Native companion app

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** for advanced language models
- **Anthropic** for Claude AI
- **FLUX** for image generation capabilities
- **Stable Diffusion** community for open-source image generation
- All contributors and users of this project

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/EVILCREATIVES/YOU/issues)
- **Discussions**: [GitHub Discussions](https://github.com/EVILCREATIVES/YOU/discussions)

---

<div align="center">

**Made with ❤️ by EVILCREATIVES**

*Empowering creativity through AI*

</div>
