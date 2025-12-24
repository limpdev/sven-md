<script>
  import { onMount } from 'svelte';
  import Sidebar from './components/Sidebar.svelte';
  import MarkdownRenderer from './components/MarkdownRenderer.svelte';
  
  // Prop passed from main.js containing the original pre-rendered text
  export let initialMarkdownContent = '';

  let sidebarOpen = true;
  let currentFile = '';
  let directoryFiles = [];
  let documentOutline = [];
  // Use the passed content for initial render
  let markdownContent = initialMarkdownContent;
  let renderedHtml = '';
  
  onMount(() => {
    currentFile = window.location.pathname;
    // If content wasn't passed via props (fallback), try to extract it
    if (!markdownContent) {
      extractMarkdownContent();
    }
  });
  
  function extractMarkdownContent() {
    const preElement = document.querySelector('pre');
    if (preElement && preElement.textContent) {
      markdownContent = preElement.textContent;
    }
  }
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
  
  // FIX: Destructure detail from the event object
  function handleOutlineGenerated(event) {
    documentOutline = event.detail;
  }
  
  // FIX: Destructure detail from the event object
  function handleFilesDiscovered(event) {
    directoryFiles = event.detail;
  }
  
  function handleFileChange(event) {
    const newFile = event.detail;
    window.location.href = newFile;
  }
  
  // FIX: Destructure detail from the event object
  function handleRendered(event) {
    renderedHtml = event.detail;
  }
</script>

<svelte:head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="content.css" type="text/css" />
  <link rel="shortcut icon" href="icons/icon128.png" type="image/png" />
</svelte:head>

<div class="app-container" class:sidebar-open={sidebarOpen}>
  <button class="sidebar-toggle" on:click={toggleSidebar} aria-label="Toggle sidebar">
    <i class="fas {sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}"></i>
  </button>
  
  <Sidebar 
    {sidebarOpen}
    {currentFile}
    {documentOutline}
    {directoryFiles}
    on:filechange={handleFileChange}
  />
  
  <main class="content-wrapper">
    <MarkdownRenderer 
      {markdownContent}
      on:outlinegenerated={handleOutlineGenerated}
      on:filesdiscovered={handleFilesDiscovered}
      on:rendered={handleRendered}
    />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: var(--sans);
  }
  
  .app-container {
    display: flex;
    min-height: 100vh;
    position: relative;
  }
  
  .sidebar-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001;
    background: #09090aaa;
    border: var(--borderLight);
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .sidebar-toggle:hover {
    background: #f5f5f510;
    box-shadow: var(--premShadow);
  }
  
  .sidebar-open .sidebar-toggle {
    left: 320px;
  }
  
  .content-wrapper {
    flex: 1;
    transition: margin-left 300ms ease-in-out;
    margin-left: 0;
  }
  
  .sidebar-open .content-wrapper {
    margin-left: 300px;
  }
  
  @media (max-width: 768px) {
    .sidebar-open .sidebar-toggle {
      left: 20px;
    }
    
    .sidebar-open .content-wrapper {
      margin-left: 0;
    }
  }
</style>