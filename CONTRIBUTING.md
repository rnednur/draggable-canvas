# Contributing to Draggable Canvas

Thank you for your interest in contributing to Draggable Canvas! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/draggable-canvas.git
   cd draggable-canvas
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include a clear description and steps to reproduce
- Add screenshots if applicable
- Specify your environment (OS, browser, Node.js version)

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its use case
- Consider the impact on existing functionality

### Code Contributions

#### Before You Start
- Check existing issues and PRs to avoid duplication
- For large changes, discuss your approach in an issue first

#### Development Workflow
1. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow existing code style
   - Add TypeScript types where needed
   - Update documentation if necessary

3. **Test your changes**:
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

#### Code Style Guidelines
- Use TypeScript for all new code
- Follow the existing component structure
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure components are accessible

#### Component Development
- Use the existing shadcn/ui components when possible
- Follow the DraggableItem wrapper pattern for new components
- Ensure new components work with the save/load system
- Add proper TypeScript interfaces

## 🎯 Areas for Contribution

### High Priority
- **Mobile responsiveness** improvements
- **Performance optimization** for large canvases
- **Accessibility** enhancements
- **Test coverage** additions

### Feature Ideas
- New chart types (scatter, radar, etc.)
- Grid snapping functionality
- Multi-select operations
- Real-time collaboration
- Custom component plugins
- Template gallery

### Bug Fixes
- Check the issues tab for open bugs
- Focus on cross-browser compatibility
- Performance improvements

## 📋 Pull Request Process

1. **Update documentation** for any new features
2. **Add or update tests** as appropriate
3. **Ensure the build passes**: `npm run build`
4. **Write a clear PR description**:
   - What changes were made?
   - Why were they made?
   - How to test the changes?

## 🔍 Code Review

- Be respectful and constructive
- Focus on the code, not the person
- Explain your suggestions
- Be open to feedback

## 📚 Development Resources

- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Framework**: [Next.js](https://nextjs.org/)

## 🤝 Community

- Be respectful and inclusive
- Help newcomers get started
- Share knowledge and best practices
- Follow the code of conduct

## 💡 Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Open a new issue with the "question" label
- Reach out to maintainers

Thank you for contributing to make Draggable Canvas better! 🎉 