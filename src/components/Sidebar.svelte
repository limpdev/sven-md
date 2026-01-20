<script>
  import { createEventDispatcher } from "svelte";
  import OutlineTab from "./OutlineTab.svelte";
  import FilesTab from "./FilesTab.svelte";

  export let sidebarOpen = true;
  export let currentFile = "";
  export let documentOutline = [];
  export let recentFiles = [];

  let activeTab = "outline";
  const dispatch = createEventDispatcher();

  function switchTab(tab) {
    activeTab = tab;
  }

  function handleFileSelect(event) {
    dispatch("filechange", event.detail);
  }
</script>

<!-- 
  Apply 'sven-glass-panel' from style.css for the frosty effect.
  We keep layout logic (open/close position) in local CSS.
-->
<aside class="sidebar bgGlass" class:open={sidebarOpen}>

  <div class="sidebar-header">
    <div class="tabs-container">
      <button
        class="tab-button sven-btn-icon"
        class:active={activeTab === "outline"}
        on:click={() => switchTab("outline")}
        title="Document Outline"
      >
        <i class="fas fa-list-ul"></i>
        <span>Outline</span>
      </button>
      <button
        class="tab-button sven-btn-icon"
        class:active={activeTab === "files"}
        on:click={() => switchTab("files")}
        title="Recent Files"
      >
        <i class="fas fa-history"></i>
        <span>Files</span>
      </button>
    </div>
  </div>

  <div class="tab-content">
    {#if activeTab === "outline"}
      <OutlineTab {documentOutline} />
    {:else}
      <FilesTab {recentFiles} {currentFile} on:fileselect={handleFileSelect} />
    {/if}
  </div>
</aside>

<style>
  /* Scrollbar hiding for cleaner UI */
  ::-webkit-scrollbar {
    display: none !important;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: -320px; /* Hide offscreen */
    width: 300px;
    height: 100vh;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    transition: left 300ms var(--ioease);
  }

  .sidebar.open {
    left: 0;
  }

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
  }

  .tabs-container {
    display: flex;
    gap: 8px;
    padding: 4px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--bdrCurve);
  }

  .tab-button {
    flex: 1;
    height: 32px;
    font-size: 13px;
    font-weight: 500;
    gap: 8px;
  }

  .tab-button span {
    font-family: var(--fontSans);
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 20px;
  }
</style>