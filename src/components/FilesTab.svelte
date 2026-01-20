<script>
  import { createEventDispatcher } from "svelte";

  // Renamed from directoryFiles to recentFiles to reflect reality
  export let recentFiles = [];
  export let currentFile = "";

  const dispatch = createEventDispatcher();

  function selectFile(filepath) {
    dispatch("fileselect", filepath);
  }

  function clearHistory() {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ recents: [] });
    }
  }

  function getFileName(path) {
    // If we have a stored name property use it, otherwise parse path
    return path.split("/").pop() || path;
  }
</script>

<div class="files-tab">

  {#if recentFiles.length === 0}
    <div class="empty-state">
      <i class="fas fa-history"></i>
      <p>No recent files</p>
    </div>
  {:else}
    <div class="files-header">
      <span class="file-count">Recent</span>
      <button class="clear-btn" on:click={clearHistory}>Clear</button>
    </div>

    <ul class="files-list">
      {#each recentFiles as file}
        <li class="file-item">
          <button
            class="file-link"
            class:active={file.path === currentFile}
            on:click={() => selectFile(file.path)}
            title={file.path}
          >
            <i class="fas fa-file-alt file-icon"></i>
            <span class="file-name">{file.name}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .files-tab {
    padding: 16px;
  }

  .info-box {
    background: rgba(56, 139, 253, 0.1);
    border: 1px solid rgba(56, 139, 253, 0.4);
    border-radius: 6px;
    padding: 12px;
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 16px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  .files-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .file-count {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
  }

  .clear-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
  }
  .clear-btn:hover {
    color: #f85149;
  }

  .files-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .file-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    width: 100%;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    border-radius: 6px;
    color: var(--text-primary);
  }

  .file-link:hover {
    background: var(--bg-block);
  }
  .file-link.active {
    background: rgba(56, 139, 253, 0.15);
    color: var(--text-link);
  }

  .file-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 0;
    color: var(--text-secondary);
    opacity: 0.7;
  }
</style>
