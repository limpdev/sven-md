# Markdown Renderer with Interactive Sidebar

A modern Chrome extension built with Svelte that renders local markdown files with an interactive sidebar for navigation and file browsing.

## Features

### 🎯 Interactive Sidebar

- **Document Outline Tab**: Automatically generates a table of contents from heading structure (H1-H6)
- **Files Tab**: Browse and switch between markdown files in the same directory
- **Collapsible**: Toggle sidebar visibility with a floating button
- **Smooth Navigation**: Click headings to scroll smoothly to sections

### 📝 Advanced Markdown Rendering

- Full GitHub Flavored Markdown (GFM) support
- Syntax highlighting for code blocks with language icons
- Admonitions (Note, Tip, Important, Warning, Caution)
- Task lists with checkboxes
- Tables with styling
- Custom text transformations:
  - ==Highlighted== text: `==Highlighted==`
  - Super^script^: `^script^`
  - Sub_-script-_: `_-script-_`
- Front matter support (YAML, TOML)
- Auto-linked headings
- Emoji support
- And much more!

### 🎨 Professional Design

- Clean, modern interface
- Responsive layout
- Smooth animations and transitions
- Copy-to-clipboard buttons on code blocks
- Language-specific icons for code blocks

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Chrome browser

### Development Setup

1. **Clone or download the extension files**
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Build the extension**

   ```bash
   npm run build
   ```

   For development with auto-rebuild:

   ```bash
   npm run dev
   ```
4. **Load the extension in Chrome**

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the extension directory (where `manifest.json` is located)
5. **Enable file access**

   - In `chrome://extensions/`, find the loaded extension
   - Click "Details"
   - Enable "Allow access to file URLs"

## Usage

1. **Open a local markdown file** in Chrome using `file://` protocol

   - Example: `file:///Users/username/Documents/README.md`
2. **The extension will automatically**:

   - Render the markdown with full styling
   - Generate a document outline in the sidebar
   - Discover other markdown files in the same directory (when supported)
3. **Navigate with the sidebar**:

   - Click the toggle button (top-left) to show/hide sidebar
   - Switch between "Outline" and "Files" tabs
   - Click any heading in the outline to jump to that section
   - Click any file to open it

## Project Structure

```
markdown-renderer-svelte/
├── components/
│   ├── Sidebar.svelte          # Main sidebar container
│   ├── OutlineTab.svelte        # Document outline tab
│   ├── FilesTab.svelte          # File browser tab
│   └── MarkdownRenderer.svelte  # Core markdown processing
├── App.svelte                   # Root Svelte component
├── main.js                      # Entry point
├── manifest.json                # Chrome extension manifest
├── package.json                 # Dependencies and scripts
├── rollup.config.js             # Svelte build configuration
├── style.css                    # Global styles
└── README.md                    # This file
```

## Development

### Scripts

- `npm run build` - Build for production
- `npm run dev` - Build and watch for changes
- `npm run validate` - Run Svelte type checking

### Key Technologies

- **Svelte 4**: Reactive UI framework
- **Rollup**: Module bundler
- **Unified/Remark/Rehype**: Markdown processing pipeline
- **rehype-highlight**: Syntax highlighting
- **remark-gfm**: GitHub Flavored Markdown

### Customization

#### Styling

Edit `style.css` to customize the appearance of rendered markdown.

#### Markdown Processing

Modify `components/MarkdownRenderer.svelte` to add or remove remark/rehype plugins.

#### Sidebar Behavior

Customize `components/Sidebar.svelte`, `OutlineTab.svelte`, or `FilesTab.svelte` for different layouts or features.

## Browser Compatibility

- **Chrome**: Fully supported (primary target)
- **Edge**: Should work (Chromium-based)
- **Other browsers**: Not tested, may require manifest adjustments

## Known Limitations

1. **File Discovery**: The "Files" tab currently has limited functionality due to browser security restrictions on local file access. Full directory browsing would require additional permissions or a native messaging host.
2. **File Protocol**: The extension only works with `file://` URLs. It won't activate on `http://` or `https://` URLs.
3. **Large Files**: Very large markdown files may take a moment to process.

## Future Enhancements

- [ ] Implement full directory file discovery (may require native messaging)
- [ ] Add search functionality within documents
- [ ] Export rendered HTML
- [ ] Dark mode support
- [ ] Customizable themes
- [ ] Bookmark/favorites system
- [ ] Recent files history

## Contributing

Contributions are welcome! Some areas for improvement:

- Enhanced file system integration
- Additional markdown plugins
- Performance optimizations
- UI/UX improvements
- Documentation

## License

This project is provided as-is for educational and personal use.

## Credits

Built with:

- [Svelte](https://svelte.dev/)
- [Unified](https://unifiedjs.com/)
- [Highlight.js](https://highlightjs.org/)
- [Font Awesome](https://fontawesome.com/)

---

**Note**: This is a rewrite of the original JavaScript-based extension, now using Svelte for better component architecture and maintainability.
