<script>
  import { createEventDispatcher } from "svelte";
  import OutlineTab from "./OutlineTab.svelte";
  import FilesTab from "./FilesTab.svelte";

  export let sidebarOpen = true;
  export let currentFile = "";
  export let documentOutline = [];
  export let recentFiles = []; // Prop renamed to match App.svelte

  let activeTab = "outline";
  const dispatch = createEventDispatcher();

  function switchTab(tab) {
    activeTab = tab;
  }

  function handleFileSelect(event) {
    dispatch("filechange", event.detail);
  }
</script>

<aside class="sidebar" class:open={sidebarOpen}>
  <div class="sidebar-header">
    <h2></h2>
  </div>

  <div class="tabs">
    <button
      class="tab-button"
      class:active={activeTab === "outline"}
      on:click={() => switchTab("outline")}
      title="Outline"
    >
      <i class="fas fa-list-ul"></i>
    </button>
    <button
      class="tab-button"
      class:active={activeTab === "files"}
      on:click={() => switchTab("files")}
      title="Recent Files"
    >
      <i class="fas fa-history"></i>
    </button>
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
  .sidebar {
    position: fixed;
    top: 0;
    left: -300px;
    width: 300px;
    height: 100vh;
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border-color);
    transition: left 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }

  .sidebar.open {
    left: 0;
  }

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
  }

  .sidebar-header h2 {
    margin: 0;
    font-size: 18px;
    color: var(--text-primary);
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
  }

  .tab-button {
    flex: 1;
    padding: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    transition: 0.2s;
    border-bottom: 2px solid transparent;
  }

  .tab-button:hover {
    color: var(--text-primary);
  }

  .tab-button.active {
    color: var(--text-link);
    border-bottom-color: var(--text-link);
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
  }
</style>
