import App from './App.svelte'
import './style.css'
import './fontawe.css'

// Wait for DOM to be ready
function init () {
  console.log('Sven Extension: Initializing...')

  // Check if this is a markdown file based on extension
  const path = window.location.pathname.toLowerCase()
  const isMarkdownFile =
    path.endsWith('.md') ||
    path.endsWith('.markdown') ||
    path.endsWith('.mdown')

  if (!isMarkdownFile) {
    console.log('Sven Extension: Not a markdown file, skipping.')
    return
  }

  // Prevent double-initialization
  if (document.getElementById('sven-app-root')) return

  // Extract the markdown content BEFORE clearing the body
  let initialContent = ''
  const preElement = document.querySelector('pre')
  if (preElement) {
    initialContent = preElement.textContent
  } else {
    // Fallback: chrome sometimes renders text without a pre tag
    initialContent = document.body.innerText
  }

  if (!initialContent.trim()) {
    console.warn('Sven Extension: No content found to render.')
  }

  // Update Recent Files in Chrome Storage
  updateRecentFiles()

  // Clear the body and mount Svelte app
  document.body.innerHTML = '<div id="sven-app-root"></div>'
  const app = new App({
    target: document.getElementById('sven-app-root'),
    props: {
      initialMarkdownContent: initialContent
    }
  })

  return app
}

function updateRecentFiles () {
  try {
    const currentFile = {
      path: window.location.href,
      name: decodeURIComponent(window.location.pathname.split('/').pop()),
      lastVisited: Date.now()
    }

    // Use local storage to persist recent files
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get({ recents: [] }, result => {
        let recents = result.recents

        // Remove if exists (to move to top)
        recents = recents.filter(f => f.path !== currentFile.path)

        // Add to top
        recents.unshift(currentFile)

        // Keep max 20
        recents = recents.slice(0, 20)

        chrome.storage.local.set({ recents: recents })
      })
    }
  } catch (e) {
    console.error('Sven: Failed to update recent files', e)
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
