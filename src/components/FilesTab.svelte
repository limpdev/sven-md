<script>
  import { createEventDispatcher } from 'svelte';
  
  export let directoryFiles = [];
  export let currentFile = '';
  
  const dispatch = createEventDispatcher();
  
  function selectFile(filepath) {
    dispatch('fileselect', filepath);
  }
  
  function getFileName(path) {
    return path.split('/').pop();
  }
  
  function isCurrentFile(filepath) {
    return filepath === currentFile || getFileName(filepath) === getFileName(currentFile);
  }
  
  function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'md' || ext === 'markdown') return 'fa-file-lines';
    if (ext === 'mdown') return 'fa-file-lines';
    return 'fa-file';
  }
</script>

<div class="files-tab">
  {#if directoryFiles.length === 0}
    <div class="empty-state">
      <i class="fas fa-folder-open"></i>
      <p>No markdown files found in this directory</p>
    </div>
  {:else}
    <div class="files-header">
      <span class="file-count">{directoryFiles.length} file{directoryFiles.length !== 1 ? 's' : ''}</span>
    </div>
    <ul class="files-list">
      {#each directoryFiles as file}
        <li class="file-item">
          <button 
            class="file-link"
            class:active={isCurrentFile(file)}
            on:click={() => selectFile(file)}
            title={getFileName(file)}
          >
            <i class="fas {getFileIcon(file)} file-icon"></i>
            <span class="file-name">{getFileName(file)}</span>
            {#if isCurrentFile(file)}
              <i class="fas fa-check current-indicator"></i>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  ::webkit-scrollbar {
    display: none;
  }

  .files-tab {
    padding: 16px;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #999;
  }
  
  .empty-state i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .empty-state p {
    margin: 0;
    font-size: 14px;
  }
  
  .files-header {
    padding: 8px 12px;
    margin-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .file-count {
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
  
  .files-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .file-item {
    margin: 0;
  }
  
  .file-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    width: 100%;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    color: #333;
    font-size: 14px;
    position: relative;
  }
  
  .file-link:hover {
    background: #f5f5f5;
  }
  
  .file-link.active {
    background: #e6f2ff;
    color: #0066cc;
    font-weight: 500;
  }
  
  .file-icon {
    flex-shrink: 0;
    width: 16px;
    color: #0066cc;
    opacity: 0.7;
  }
  
  .file-link.active .file-icon {
    opacity: 1;
  }
  
  .file-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .current-indicator {
    flex-shrink: 0;
    font-size: 12px;
    color: #0066cc;
  }
</style>
