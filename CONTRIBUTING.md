# Contributing to YOU Creative Canvas

Thank you for your interest in contributing to YOU! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- 🐛 **Report bugs** and issues
- 💡 **Suggest new features** or enhancements
- 📝 **Improve documentation**
- 🔧 **Submit bug fixes**
- ✨ **Add new features**
- 🎨 **Improve UI/UX**
- 🧪 **Write tests**
- 🌍 **Translate** (future)

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- A GitHub account

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOU.git
   cd YOU
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/EVILCREATIVES/YOU.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Create a `.env` file** (optional):
   ```bash
   cp .env.example .env
   # Configure your API keys if needed
   ```

## 📋 Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Type check
npm run type-check

# Run tests
npm test

# Build the project
npm run build

# Test locally
npm run dev
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add new canvas export format"
# or
git commit -m "fix: resolve image scaling issue"
# or
git commit -m "docs: update API documentation"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill in the PR template
5. Submit the PR

## 📝 Code Guidelines

### TypeScript Style

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` type when possible
- Use interfaces for object types
- Export types that might be used externally

Example:
```typescript
// Good
interface UserOptions {
  name: string;
  age: number;
  email?: string;
}

function createUser(options: UserOptions): User {
  // ...
}

// Avoid
function createUser(options: any) {
  // ...
}
```

### Code Organization

- One feature per file when possible
- Group related functionality
- Use index files to export public APIs
- Keep files under 500 lines when possible

### Naming Conventions

- **Classes**: `PascalCase` (e.g., `CanvasManager`)
- **Functions/Methods**: `camelCase` (e.g., `generateText`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- **Interfaces/Types**: `PascalCase` (e.g., `TextProvider`)
- **Files**: `kebab-case` (e.g., `ai-provider.types.ts`)

### Comments

- Use JSDoc for public APIs
- Explain "why" not "what"
- Keep comments up-to-date

Example:
```typescript
/**
 * Generate text using the configured AI provider
 * @param prompt - The text prompt to generate from
 * @param options - Optional generation parameters
 * @returns Promise containing the generated text response
 */
async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResponse> {
  // ...
}
```

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for new features
- Ensure tests are isolated
- Use descriptive test names
- Test edge cases

Example:
```typescript
describe('CanvasManager', () => {
  it('should create a canvas with default dimensions', () => {
    const canvas = new CanvasManager();
    expect(canvas.getCanvas().width).toBe(1920);
    expect(canvas.getCanvas().height).toBe(1080);
  });

  it('should add text element to canvas', () => {
    const canvas = new CanvasManager();
    const element = canvas.addTextElement('Hello', 0, 0);
    expect(element.content).toBe('Hello');
  });
});
```

## 🔒 Security Guidelines

- **Never commit API keys** or secrets
- **Use environment variables** for sensitive data
- **Review security implications** of your changes
- **Report security vulnerabilities** privately (see SECURITY.md)

## 📚 Documentation Guidelines

- Update README.md if you change public APIs
- Add JSDoc comments to public functions
- Include usage examples for new features
- Keep documentation concise and clear

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - How to reproduce the issue
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment** - OS, Node.js version, etc.
6. **Screenshots** - If applicable
7. **Code Samples** - Minimal reproduction code

## 💡 Feature Requests

When suggesting features, please include:

1. **Use Case** - Why is this feature needed?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other approaches considered
4. **Additional Context** - Any other relevant information

## 🔄 Pull Request Process

### Before Submitting

- ✅ Code follows style guidelines
- ✅ Tests pass locally
- ✅ Documentation updated
- ✅ No merge conflicts
- ✅ Commit messages follow conventions
- ✅ Branch is up-to-date with main

### PR Review Process

1. **Automated checks** will run
2. **Maintainers** will review your code
3. **Changes** may be requested
4. Once approved, it will be **merged**

### After Merging

- Your branch will be deleted
- You can delete your local branch:
  ```bash
  git branch -d feature/your-feature-name
  ```
- Update your fork:
  ```bash
  git checkout main
  git pull upstream main
  git push origin main
  ```

## 🎯 Good First Issues

Look for issues labeled `good-first-issue` - these are great for newcomers!

## 💬 Communication

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Pull Requests** - Code review and technical discussion

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior.

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)
- README acknowledgments (for major contributions)

## 📞 Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Open a new discussion
- Reach out to maintainers

---

Thank you for contributing to YOU Creative Canvas! Your efforts help make creative tools more accessible to everyone. 🎨✨
