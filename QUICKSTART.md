# Quick Start Guide

Get started with YOU Creative Canvas in 5 minutes!

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/EVILCREATIVES/YOU.git
cd YOU

# Install dependencies
npm install
```

## ✨ First Run (No API Keys Needed!)

```bash
# Run canvas examples
npx ts-node src/examples/canvas-examples.ts

# Run AI examples with mock providers
npx ts-node src/examples/ai-examples.ts
```

The application will automatically use mock providers, so you can explore the features without any API keys!

## 🔑 Adding Real AI Providers (Optional)

1. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys** to `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   CLAUDE_API_KEY=your_claude_key_here
   FLUX_API_KEY=your_flux_key_here
   ```

3. **Set your preferred providers**:
   ```env
   DEFAULT_TEXT_PROVIDER=gemini
   DEFAULT_IMAGE_PROVIDER=flux
   ```

4. **Run the examples again** - they'll now use real AI!

## 📝 Your First Script

Create a new file `my-first-canvas.ts`:

```typescript
import { you } from './src';

async function main() {
  // Create a canvas
  const canvas = you.createCanvas(1920, 1080);
  
  // Add a title
  canvas.addTextElement('My First Canvas', 100, 100, {
    fontSize: 48,
    color: '#3b82f6'
  });
  
  // Generate AI content
  const aiManager = you.getAIManager();
  const textProvider = aiManager.getTextProvider();
  
  const story = await textProvider.generateText(
    'Write a short paragraph about creativity'
  );
  
  // Add the generated text to canvas
  canvas.addTextElement(story.text, 100, 200, {
    fontSize: 18,
    width: 800
  });
  
  console.log('Canvas created!');
  console.log(canvas.export());
}

main().catch(console.error);
```

Run it:
```bash
npx ts-node my-first-canvas.ts
```

## 🎨 What's Next?

- Explore the [full documentation](README.md)
- Check out more [examples](src/examples/)
- Read the [API documentation](README.md#-api-documentation)
- Learn about [AI providers](README.md#-ai-provider-configuration)

## 🤔 Common Questions

**Q: Do I need API keys to try this?**  
A: No! The app works great with mock providers for learning and development.

**Q: Which AI provider should I use?**  
A: 
- **Gemini** - Great for creative text
- **Claude** - Excellent for structured content
- **FLUX** - High-quality images
- **Stable Diffusion** - Free, runs locally

**Q: How do I contribute?**  
A: Check out [CONTRIBUTING.md](CONTRIBUTING.md)!

**Q: Is this free to use?**  
A: The software is MIT licensed and free. AI providers have their own pricing.

## 🐛 Having Issues?

- Check the [README](README.md)
- Search [existing issues](https://github.com/EVILCREATIVES/YOU/issues)
- Open a [new issue](https://github.com/EVILCREATIVES/YOU/issues/new)

---

Happy Creating! 🎨✨
