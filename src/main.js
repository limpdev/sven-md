import App from './App.svelte'
import './fontawe.css'
import './style.css'

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

    // Cross-browser storage API support
    // Firefox uses 'browser' (Promises), Chrome/Edge uses 'chrome' (Callbacks/Promises in MV3)
    const storageApi = (typeof browser !== 'undefined' ? browser : chrome).storage

    if (storageApi && storageApi.local) {
      const resultOrPromise = storageApi.local.get({ recents: [] })

      if (resultOrPromise && typeof resultOrPromise.then === 'function') {
        // Promise-based (Firefox / Chrome MV3)
        resultOrPromise.then(result => {
          handleRecents(result, currentFile, storageApi)
        }).catch(e => {
          console.error('Sven: Failed to get recent files', e)
        })
      } else {
        // Callback-based (Chrome fallback)
        // Note: In some contexts 'chrome' API might return undefined for the promise if callback is expected,
        // though MV3 supports both.
        storageApi.local.get({ recents: [] }, (result) => {
          if (chrome.runtime.lastError) {
             console.error('Sven: Storage error', chrome.runtime.lastError)
             return
          }
          handleRecents(result, currentFile, storageApi)
        })
      }
    }
  } catch (e) {
    console.error('Sven: Failed to update recent files', e)
  }
}

function handleRecents (result, currentFile, api) {
  if (!result || !api) return
  
  let recents = result.recents || []

  // Remove if exists (to move to top)
  recents = recents.filter(f => f.path !== currentFile.path)

  // Add to top
  recents.unshift(currentFile)

  // Keep max 20
  recents = recents.slice(0, 20)

  api.local.set({ recents: recents })
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
