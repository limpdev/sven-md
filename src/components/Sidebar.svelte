<script>
  import { createEventDispatcher } from 'svelte';
  import OutlineTab from './OutlineTab.svelte';
  import FilesTab from './FilesTab.svelte';
  
  export let sidebarOpen = true;
  export let currentFile = '';
  export let documentOutline = [];
  export let directoryFiles = [];
  
  let activeTab = 'outline';
  const dispatch = createEventDispatcher();
  
  function switchTab(tab) {
    activeTab = tab;
  }
  
  function handleFileSelect(event) {
    dispatch('filechange', event.detail);
  }
</script>

<aside class="sidebar" class:open={sidebarOpen}>
  <div class="sidebar-content">
    <div class="sidebar-header">
      <h2>ven</h2>
    </div>
    
    <div class="tabs">
      <button 
        class="tab-button" 
        class:active={activeTab === 'outline'}
        on:click={() => switchTab('outline')}
      >
        <i class="fas fa-list-ul"></i>
        <span></span>
      </button>
      <button 
        class="tab-button" 
        class:active={activeTab === 'files'}
        on:click={() => switchTab('files')}
      >
        <i class="fas fa-folder-open"></i>
        <span></span>
      </button>
    </div>
    
    <div class="tab-content">
      {#if activeTab === 'outline'}
        <OutlineTab {documentOutline} />
      {:else}
        <FilesTab 
          {directoryFiles} 
          {currentFile}
          on:fileselect={handleFileSelect}
        />
      {/if}
    </div>
  </div>
</aside>

<style>
  ::webkit-scrollbar {
    display: none;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: -300px;
    width: 300px;
    height: 100vh;
    background: #09090a;
    border-right: var(--borderLight);
    transition: left 0.3s ease;
    z-index: 1000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  
  .sidebar-header {
    padding: 8px;
    align-self: anchor-center;
    border-bottom: none;
    background: #fafafa00;
  }
  
  .sidebar-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  .tabs {
    display: flex;
    border-bottom: var(--borderLight);
    background: #fafafa00;
  }
  
  .tab-button {
    flex: 1;
    padding: 12px 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
    transition: all 200ms ease-in;
    position: relative;
  }
  
  .tab-button:hover {
    background: #f0f0f010;
    color: #333;
  }
  
  .tab-button.active {
    color: #0066cc;
    font-weight: 600;
  }
  
  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #0066cc;
  }
  
  .tab-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      left: -100%;
    }
    
    .sidebar.open {
      left: 0;
    }
  }
</style>
