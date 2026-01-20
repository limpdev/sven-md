<script>
  import { onMount } from "svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import MarkdownRenderer from "./components/MarkdownRenderer.svelte";

  export let initialMarkdownContent = "";

  // State
  let sidebarOpen = true;
  let currentFile = "";
  let documentOutline = [];
  let recentFiles = [];
  let markdownContent = initialMarkdownContent;

  onMount(() => {
    currentFile = window.location.href;
    
    // Restore sidebar state preference
    if (localStorage.getItem("sven-sidebar-open") !== null) {
      sidebarOpen = localStorage.getItem("sven-sidebar-open") === "true";
    }

    loadRecentFiles();
    setupStorageListener();
  });

  function setupStorageListener() {
    if (chrome && chrome.storage) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && changes.recents) {
          recentFiles = changes.recents.newValue;
        }
      });
    }
  }

  function loadRecentFiles() {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get({ recents: [] }, (result) => {
        recentFiles = result.recents;
      });
    }
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    localStorage.setItem("sven-sidebar-open", String(sidebarOpen));
  }

  function handleOutlineGenerated(event) {
    documentOutline = event.detail;
  }

  function handleFileChange(event) {
    window.location.href = event.detail;
  }
</script>

<!-- The class 'bgGradient' pulls the heavy gradient styling from style.css -->
<div class="app-container bgGradient" class:sidebar-open={sidebarOpen}>
  
  <button
    class="sidebar-toggle sven-btn-icon"
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
  /* Layout specific styles only. Visuals are in style.css */
  .app-container {
    display: flex;
    min-height: 100vh;
    position: relative;
    width: 100%;
    overflow-x: hidden;
  }

  .sidebar-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001; /* Above sidebar */
    width: 32px;
    height: 32px;
    background-color: var(--bg-block); /* Ensure visibility on top of glass */
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: all 200ms var(--ioease);
  }
  .sidebar-toggle:hover {
    transform: scale(1.1);
    transition: all 150ms var(--ioease);
  }
  .sidebar-toggle:active {
    transform: scale(1.1,0.9);
  }

  .sidebar-open .sidebar-toggle {
    left: 320px;
    transition: left 300ms var(--ioease);
  }

  .content-wrapper {
    flex: 1;
    width: 100%;
    transition: margin-left 300ms var(--ioease);
    margin-left: 0;
  }

  .sidebar-open .content-wrapper {
    margin-left: 300px;
  }
</style>