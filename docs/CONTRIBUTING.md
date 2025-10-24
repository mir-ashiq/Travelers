# Contributing to JKLG Travel

Thank you for interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Communicate clearly
- Welcome different perspectives
- Report violations to conduct@jklgtravel.com

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
git clone https://github.com/your-username/travelers.git
cd travelers
npm install
npm run dev
```

## Making Changes

### Branch Naming

```
feature/description       - New features
fix/description          - Bug fixes
docs/description         - Documentation
refactor/description     - Code refactoring
test/description         - Test additions
```

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: resolve issue #123
docs: update README
refactor: improve performance
test: add unit tests
chore: update dependencies
```

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Keep functions small and focused
- Add JSDoc comments for complex functions

### Testing

Before submitting:

```bash
# Run type check
npm run type-check

# Run linter
npm run lint -- --fix

# Build
npm run build
```

## Pull Request Process

1. **Create PR with description:**

   - What changes does it make?
   - Why are these changes needed?
   - Are there any breaking changes?

2. **PR Title Format:**

   ```
   [Type] Description (Issue #123)
   Example: [Feature] Add payment integration (Issue #45)
   ```

3. **PR Checklist:**

   ```markdown
   - [ ] Code follows style guidelines
   - [ ] Changes include tests
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   - [ ] Commits are squashed
   - [ ] Ready for review
   ```

4. **Code Review:**
   - Address feedback promptly
   - Ask for clarification if needed
   - Be open to suggestions

## Documentation

- Update README.md for feature changes
- Add JSDoc comments to functions
- Update API docs for endpoint changes
- Include examples for complex features

## Types of Contributions

### Bug Reports

- Use GitHub Issues
- Include reproduction steps
- Specify expected vs actual behavior
- Include environment details

### Feature Requests

- Describe the use case
- Explain benefits
- Provide mockups if UI-related
- Consider backward compatibility

### Documentation

- Fix typos
- Clarify instructions
- Add examples
- Update outdated info

### Code

- Follow style guidelines
- Add tests
- Update documentation
- Keep PRs focused

## Review Criteria

PRs will be reviewed for:

- ✅ Code quality
- ✅ Test coverage
- ✅ Documentation
- ✅ Performance impact
- ✅ Security implications
- ✅ Backwards compatibility

## Project Structure

```
src/
├── components/     # React components
├── contexts/       # Context providers
├── hooks/          # Custom hooks
├── lib/            # Utilities
├── pages/          # Page components
├── admin/          # Admin pages
└── App.tsx         # Root component
```

## Performance Guidelines

- Avoid creating new objects in renders
- Use useCallback for event handlers
- Implement code splitting
- Optimize images
- Minimize bundle size

## Security Guidelines

- Never commit secrets
- Validate all user inputs
- Sanitize HTML content
- Use environment variables
- Report security issues privately

## Testing Guidelines

- Write tests for bug fixes
- Aim for >80% coverage
- Test edge cases
- Mock external dependencies
- Use meaningful test names

## Release Process

1. Version follows Semantic Versioning
2. Update CHANGELOG
3. Create GitHub Release
4. Deploy to production
5. Announce to users

## Additional Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)

## Questions?

- Check existing issues
- Create a discussion
- Email: dev@jklgtravel.com

---

Thank you for contributing! 🙏

**Last Updated**: October 23, 2025
