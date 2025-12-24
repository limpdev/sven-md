import App from './App.svelte';
import '../style.css';

// Wait for DOM to be ready
function init() {
  console.log("Sven Extension: Initializing...");

  // Check if this is a markdown file based on extension
  const path = window.location.pathname.toLowerCase();
  const isMarkdownFile =
    path.endsWith('.md') ||
    path.endsWith('.markdown') ||
    path.endsWith('.mdown');
  
  if (!isMarkdownFile) {
    console.log('Sven Extension: Not a markdown file, skipping.');
    return;
  }

  // Prevent double-initialization
  if (document.getElementById('sven-app-root')) return;

  // Extract the markdown content BEFORE clearing the body
  let initialContent = '';
  const preElement = document.querySelector('pre');
  
  if (preElement) {
    initialContent = preElement.textContent;
  } else {
    // Fallback: chrome sometimes renders text without a pre tag for very large files or specific encodings
    initialContent = document.body.innerText;
  }
  
  if (!initialContent.trim()) {
    console.warn("Sven Extension: No content found to render.");
  }

  // Clear the body and mount Svelte app
  document.body.innerHTML = '<div id="sven-app-root"></div>';
  
  const app = new App({
    target: document.getElementById('sven-app-root'),
    props: {
      initialMarkdownContent: initialContent
    }
  });
  
  return app;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}