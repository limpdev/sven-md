<script>
  export let documentOutline = [];
  
  function scrollToHeading(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Add a temporary highlight effect
      element.classList.add('highlight-heading');
      setTimeout(() => {
        element.classList.remove('highlight-heading');
      }, 2000);
    }
  }
  
  function getIndentClass(level) {
    return `level-${Math.min(level, 6)}`;
  }
</script>

<div class="outline-tab">
  {#if documentOutline.length === 0}
    <div class="empty-state">
      <i class="fas fa-file-alt"></i>
      <p>No headings found in this document</p>
    </div>
  {:else}
    <ul class="outline-list">
      {#each documentOutline as item}
        <li class="outline-item {getIndentClass(item.level)}">
          <button 
            class="outline-link"
            on:click={() => scrollToHeading(item.id)}
            title={item.text}
          >
            <span class="heading-marker">
              {#if item.level === 1}
                <i class="fas fa-heading"></i>
              {:else if item.level === 2}
                <i class="fas fa-minus"></i>
              {:else}
                <i class="fas fa-circle" style="font-size: 6px;"></i>
              {/if}
            </span>
            <span class="heading-text">{item.text}</span>
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
  
  .outline-tab {
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
  
  .outline-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .outline-item {
    margin: 0;
  }
  
  .outline-link {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 12px;
    width: 100%;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    color: #a0a0a0;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .outline-link:hover {
    background: #f5f5f505;
    color: #0066cc;
  }
  
  .heading-marker {
    flex-shrink: 0;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0066cc;
    opacity: 0.7;
  }
  
  .heading-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Indentation levels */
  .level-1 {
    padding-left: 0;
  }
  
  .level-2 {
    padding-left: 12px;
  }
  
  .level-3 {
    padding-left: 24px;
  }
  
  .level-4 {
    padding-left: 36px;
  }
  
  .level-5 {
    padding-left: 48px;
  }
  
  .level-6 {
    padding-left: 60px;
  }
  
  /* Global style for heading highlight effect */
  :global(.highlight-heading) {
    animation: highlightPulse 2s ease;
  }
  
  @keyframes highlightPulse {
    0%, 100% {
      background-color: transparent;
    }
    50% {
      background-color: rgba(0, 102, 204, 0.1);
    }
  }
</style>
