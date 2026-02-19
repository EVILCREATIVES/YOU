# Architecture Overview

This document provides a detailed overview of the YOU Creative Canvas architecture.

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                    (Future: Web/Desktop/Mobile)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                      Core Application Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Canvas     │  │   Project    │  │   AI Provider      │   │
│  │   Manager    │  │   Manager    │  │   Manager          │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                      Provider Layer                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Gemini  │  │  Claude  │  │   FLUX   │  │    Stable    │   │
│  │ Provider │  │ Provider │  │ Provider │  │  Diffusion   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                     ┌──────────────┐                             │
│                     │     Mock     │                             │
│                     │   Provider   │                             │
│                     └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Module Structure

### 1. Core Modules

#### **index.ts** - Main Entry Point
- Initializes the application
- Loads environment variables
- Creates default instances
- Exports public API

#### **types/** - Type Definitions
- `ai-provider.types.ts` - AI provider interfaces and types
- `canvas.types.ts` - Canvas and project types
- Provider-agnostic type definitions

#### **utils/** - Utility Functions
- `env.ts` - Environment variable management
- Secure configuration loading
- Type-safe environment access

### 2. Canvas System

```
canvas/
└── index.ts
    ├── CanvasManager    - Single canvas operations
    └── ProjectManager   - Multi-canvas projects
```

**CanvasManager** responsibilities:
- Create and manage canvas elements
- Add/remove/update elements
- Handle element positioning
- Export/import canvas state

**ProjectManager** responsibilities:
- Organize multiple canvases
- Project-level metadata
- Asset management
- Export/import complete projects

**Element Types**:
- Text elements (with fonts, colors, styles)
- Image elements (with filters)
- Shape elements (future)
- Video elements (future)
- Audio elements (future)

### 3. AI Provider System

```
ai-providers/
├── index.ts                 - Factory and Manager
├── gemini/                  - Google Gemini
├── claude/                  - Anthropic Claude
├── flux/                    - FLUX Image Gen
├── stable-diffusion/        - Stable Diffusion
└── mock/                    - Mock Providers
```

#### Provider Architecture

All providers implement standard interfaces:

```typescript
interface TextProvider {
  name: string
  type: ProviderType
  isConfigured(): boolean
  healthCheck(): Promise<boolean>
  generateText(prompt, options): Promise<TextResponse>
  generateStream(prompt, options): AsyncGenerator<string>
}

interface ImageProvider {
  name: string
  type: ProviderType
  isConfigured(): boolean
  healthCheck(): Promise<boolean>
  generateImage(prompt, options): Promise<ImageResponse>
}
```

#### Provider Factory

**ProviderFactory** creates provider instances:
- Type-based provider creation
- Configuration injection
- Error handling

**AIProviderManager** orchestrates providers:
- Automatic provider selection
- Fallback to mock providers
- Health checking
- Configuration validation

#### Provider Implementations

**Gemini Provider** (`gemini/index.ts`):
- Google Generative AI API
- Text generation
- Conversation history support
- Streaming support (planned)

**Claude Provider** (`claude/index.ts`):
- Anthropic Claude API
- Advanced text generation
- System prompts
- Conversation context

**FLUX Provider** (`flux/index.ts`):
- FLUX image generation API
- High-quality images
- Aspect ratio support
- Style controls

**Stable Diffusion Provider** (`stable-diffusion/index.ts`):
- Local or cloud Stable Diffusion
- Open-source model support
- Extensive customization
- No API key for local

**Mock Provider** (`mock/index.ts`):
- No external dependencies
- Simulated responses
- Configurable delay
- Perfect for development

## 🔄 Data Flow

### Text Generation Flow

```
User Request
    ↓
AIProviderManager.getTextProvider()
    ↓
TextProvider.generateText(prompt, options)
    ↓
[Provider checks configuration]
    ↓
[Build API request]
    ↓
[Call external API or mock]
    ↓
[Parse response]
    ↓
Return TextResponse
    ↓
User receives generated text
```

### Image Generation Flow

```
User Request
    ↓
AIProviderManager.getImageProvider()
    ↓
ImageProvider.generateImage(prompt, options)
    ↓
[Provider checks configuration]
    ↓
[Build API request with dimensions/style]
    ↓
[Call external API or mock]
    ↓
[Parse response - URL or base64]
    ↓
Return ImageResponse
    ↓
User receives image
```

### Canvas Creation Flow

```
you.createCanvas(width, height)
    ↓
new CanvasManager(width, height)
    ↓
Initialize empty canvas with metadata
    ↓
canvas.addTextElement(...) or canvas.addImageElement(...)
    ↓
Create element with properties
    ↓
Add to canvas.elements array
    ↓
Update canvas.updatedAt
    ↓
Return element reference
```

## 🔐 Security Architecture

### Secret Management

```
Environment Variables (.env)
    ↓
loadEnvironment() in utils/env.ts
    ↓
process.env.* in provider constructors
    ↓
Private properties in provider instances
    ↓
Never exposed in responses or logs
```

**Security layers**:
1. `.env` files never committed (in `.gitignore`)
2. Environment variables loaded at startup
3. Providers check configuration before use
4. Automatic fallback to mock if not configured
5. No secrets in error messages or logs

### API Key Protection

- Stored only in environment variables
- Never hardcoded in source
- Not included in responses
- Not logged
- Validated before use

## 🚀 Extensibility

### Adding a New AI Provider

1. **Create provider directory**: `src/ai-providers/new-provider/`

2. **Implement the interface**:
   ```typescript
   export class NewProvider implements TextProvider {
     readonly name = 'New Provider';
     readonly type = ProviderType.TEXT;
     
     isConfigured(): boolean { /* ... */ }
     healthCheck(): Promise<boolean> { /* ... */ }
     generateText(prompt, options): Promise<TextResponse> { /* ... */ }
     generateStream(prompt, options): AsyncGenerator<string> { /* ... */ }
   }
   ```

3. **Add to factory**: Update `ProviderFactory.createTextProvider()`

4. **Add environment variables**: Update `.env.example`

5. **Document**: Update README.md

### Adding New Canvas Element Types

1. **Define type**: Add to `ElementType` enum in `canvas.types.ts`

2. **Create interface**: Add element interface extending `CanvasElement`

3. **Implement in CanvasManager**: Add `addXxxElement()` method

4. **Update export/import**: Handle new type in serialization

### Adding New Project Types

1. **Add to enum**: Update `ProjectType` in `canvas.types.ts`

2. **Add templates**: Create project type templates

3. **Update ProjectManager**: Add type-specific logic

## 🧪 Testing Architecture

### Test Structure (Future)

```
tests/
├── unit/
│   ├── ai-providers/
│   ├── canvas/
│   └── utils/
├── integration/
│   ├── provider-manager.test.ts
│   └── canvas-workflow.test.ts
└── e2e/
    └── full-workflow.test.ts
```

### Mock Provider Usage

Mock providers enable:
- Development without API keys
- Fast test execution
- Predictable test results
- Offline development
- Cost-free testing

## 📊 Performance Considerations

### Current Design

- **Synchronous canvas operations** - Fast, in-memory
- **Asynchronous AI calls** - Non-blocking
- **Streaming support** - For real-time text generation
- **Lazy loading** - Providers created on-demand

### Future Optimizations

- Canvas operation batching
- Element caching
- Background AI request queuing
- Response caching
- WebWorker support for heavy operations

## 🔮 Future Architecture Plans

### Phase 1: Core (Current)
- ✅ Canvas system
- ✅ AI provider abstraction
- ✅ Mock providers
- ✅ Basic examples

### Phase 2: Enhancement
- [ ] Video generation support
- [ ] Audio generation support
- [ ] Real-time collaboration
- [ ] Plugin system

### Phase 3: Scale
- [ ] Cloud storage
- [ ] User authentication
- [ ] API rate limiting
- [ ] Caching layer

### Phase 4: Platform
- [ ] Web interface
- [ ] Desktop application
- [ ] Mobile apps
- [ ] API server

## 📚 Design Principles

1. **Provider Agnostic**: Easy to swap AI providers
2. **Fail Gracefully**: Fallback to mock if unavailable
3. **Type Safe**: Full TypeScript types
4. **Extensible**: Easy to add new features
5. **Secure by Default**: No secrets in code
6. **Developer Friendly**: Clear APIs and examples
7. **Production Ready**: Proper error handling

## 🤝 Contributing to Architecture

When proposing architectural changes:

1. Open an issue for discussion
2. Explain the problem being solved
3. Provide alternative solutions
4. Show impact on existing code
5. Include migration strategy

---

For questions about architecture, open a GitHub discussion!
