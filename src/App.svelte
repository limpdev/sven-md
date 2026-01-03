<script>
  import { onMount } from "svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import MarkdownRenderer from "./components/MarkdownRenderer.svelte";

  export let initialMarkdownContent = "";

  let sidebarOpen = true;
  let currentFile = "";
  let documentOutline = [];
  let recentFiles = [];

  // Use the passed content for initial render
  let markdownContent = initialMarkdownContent;

  onMount(() => {
    currentFile = window.location.href;
    loadRecentFiles();

    // Listen for storage changes to update list in realtime
    if (chrome && chrome.storage) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && changes.recents) {
          recentFiles = changes.recents.newValue;
        }
      });
    }
  });

  function loadRecentFiles() {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get({ recents: [] }, (result) => {
        recentFiles = result.recents;
      });
    }
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function handleOutlineGenerated(event) {
    documentOutline = event.detail;
  }

  function handleFileChange(event) {
    const newFile = event.detail;
    // For local files, we just change the window location
    window.location.href = newFile;
  }
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <!-- style.css is bundled into content.css by Rollup -->
</svelte:head>

<div class="app-container" class:sidebar-open={sidebarOpen}>
  <button
    class="sidebar-toggle"
    on:click={toggleSidebar}
    aria-label="Toggle sidebar"
  >
    <i class="fas {sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}"></i>
  </button>

  <Sidebar
    {sidebarOpen}
    {currentFile}
    {documentOutline}
    {recentFiles}
    on:filechange={handleFileChange}
  />

  <main class="content-wrapper">
    <MarkdownRenderer
      {markdownContent}
      on:outlinegenerated={handleOutlineGenerated}
    />
  </main>
</div>

<style>
  .app-container {
    display: flex;
    min-height: 100vh;
    position: relative;
    background: var(--bg-body);
  }

  .sidebar-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001;
    background: var(--bg-sidebar);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 200ms var(--madSmooth);
  }

  .sidebar-toggle:hover {
    color: var(--text-primary);
    background: var(--bg-block);
  }

  .sidebar-open .sidebar-toggle {
    left: 320px;
  }

  .content-wrapper {
    flex: 1;
    transition: margin-left 300ms ease-in-out;
    margin-left: 0;
    width: 100%;
  }

  .sidebar-open .content-wrapper {
    margin-left: 300px;
  }
</style>
