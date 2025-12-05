# Publishing Guide

## Pre-Publishing Checklist

- [x] Removed mock data from exports
- [x] Removed demo components (OrgChartView) from exports
- [x] Cleaned up console.log statements
- [x] Updated package.json with proper metadata
- [x] Created .npmignore file
- [x] Updated README.md with documentation
- [x] Excluded unnecessary files from build
- [x] Added d3 to external dependencies in vite config
- [x] Updated version number

## Build Steps

1. **Clean previous builds:**
   ```bash
   rm -rf dist
   rm -f *.tgz
   ```

2. **Build the library:**
   ```bash
   npm run build
   ```

3. **Verify the build:**
   - Check that `dist/` folder contains:
     - `index.js` (ES module)
     - `index.cjs` (CommonJS)
     - `index.d.ts` (TypeScript definitions)
     - All component and type definition files

4. **Test the build locally:**
   ```bash
   npm pack
   # This creates a .tgz file you can test
   ```

5. **Test installation in a separate project:**
   ```bash
   npm install /path/to/react-org-chart-1.0.0.tgz
   ```

## Publishing to npm

1. **Login to npm:**
   ```bash
   npm login
   ```

2. **Publish:**
   ```bash
   npm publish
   ```

   For a scoped package (if you want to use @your-scope/react-org-chart):
   ```bash
   npm publish --access public
   ```

## Post-Publishing

- Update version number in package.json for next release
- Tag the release in git: `git tag v1.0.0`
- Push tags: `git push --tags`

## Version Bumping

- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes

Use `npm version patch|minor|major` to bump version automatically.

