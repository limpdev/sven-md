<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  export let markdownContent = '';
  
  const dispatch = createEventDispatcher();
  let contentContainer;
  let isProcessing = true;
  let errorMessage = null;
  let renderedHtml = '';
  
  // Language to Font Awesome icon mapping
  const languageIcons = {
    javascript: "fab fa-js-square",
    js: "fab fa-js-square",
    typescript: "fab fa-js-square",
    ts: "fab fa-js-square",
    python: "fab fa-python",
    py: "fab fa-python",
    java: "fab fa-java",
    php: "fab fa-php",
    html: "fab fa-html5",
    css: "fab fa-css3-alt",
    scss: "fab fa-sass",
    sass: "fab fa-sass",
    less: "fab fa-less",
    react: "fab fa-react",
    jsx: "fab fa-react",
    vue: "fab fa-vuejs",
    angular: "fab fa-angular",
    node: "fab fa-node-js",
    nodejs: "fab fa-node-js",
    npm: "fab fa-npm",
    yarn: "fab fa-yarn",
    docker: "fab fa-docker",
    git: "fab fa-git-alt",
    github: "fab fa-github",
    gitlab: "fab fa-gitlab",
    bitbucket: "fab fa-bitbucket",
    go: "fas fa-code",
    golang: "fas fa-code",
    rust: "fas fa-cog",
    cpp: "fas fa-code",
    "c++": "fas fa-code",
    c: "fas fa-code",
    csharp: "fas fa-code",
    "c#": "fas fa-code",
    swift: "fab fa-swift",
    kotlin: "fas fa-code",
    ruby: "fas fa-gem",
    rb: "fas fa-gem",
    shell: "fas fa-terminal",
    bash: "fas fa-terminal",
    sh: "fas fa-terminal",
    powershell: "fas fa-terminal",
    sql: "fas fa-database",
    mysql: "fas fa-database",
    postgresql: "fas fa-database",
    mongodb: "fas fa-database",
    json: "fas fa-file-code",
    xml: "fas fa-code",
    yaml: "fas fa-file-code",
    yml: "fas fa-file-code",
    toml: "fas fa-file-code",
    ini: "fas fa-file-code",
    markdown: "fab fa-markdown",
    md: "fab fa-markdown",
    text: "fas fa-file-alt",
    txt: "fas fa-file-alt",
    default: "fas fa-code",
  };
  
  onMount(async () => {
    await processMarkdown();
    await discoverDirectoryFiles();
  });
  
  async function processMarkdown() {
    try {
      if (!markdownContent) {
        errorMessage = "No markdown content found";
        isProcessing = false;
        return;
      }
      
      // Load all required modules
      const modules = await loadModules();
      
      // Process markdown
      const processor = modules.unified()
        .use(modules.remarkParse)
        .use(modules.remarkGfm)
        .use(modules.remarkFrontmatter, ["yaml", "toml"])
        .use(modules.remarkGithubAdmonitionsToDirectives)
        .use(modules.remarkDirective)
        .use(modules.remarkToc, { heading: "toc|table[ -]of[ -]contents" })
        .use(modules.sectionize)
        .use(modules.remarkTextr, { plugins: [ellipses] })
        .use(modules.a11yEmoji)
        .use(modules.remarkIns)
        .use(modules.remarkSupersub)
        .use(modules.remarkRehype, { allowDangerousHtml: true })
        .use(modules.rehypeSlug)
        .use(modules.rehypeAutolinkHeadings, {
          behavior: "prepend",
          properties: { className: ["heading-anchor-link"] },
          content: { type: "text", value: "#" },
        })
        .use(modules.rehypeHighlight)
        .use(rehypeCodeLanguageIcons)
        .use(rehypeAdmonitions)
        .use(modules.rehypeStringify, { allowDangerousHtml: true });
      
      const file = await processor.process(markdownContent);
      renderedHtml = String(file);
      
      // Extract document outline
      extractDocumentOutline();
      
      dispatch('rendered', renderedHtml);
      isProcessing = false;
      
      // Wait for DOM update then add interactive features
      setTimeout(() => {
        addCodeCopyButtons();
        applyTextTransformations();
      }, 100);
      
    } catch (error) {
      console.error("Error rendering markdown:", error);
      errorMessage = error.message;
      isProcessing = false;
    }
  }
  
  async function loadModules() {
    try {
      const modules = await Promise.all([
        import("unified"),
        import("remark-parse"),
        import("remark-gfm"),
        import("remark-rehype"),
        import("rehype-highlight"),
        import("rehype-stringify"),
        import("@fec/remark-a11y-emoji"),
        import("remark-frontmatter"),
        import("remark-directive"),
        import("remark-textr"),
        import("remark-toc"),
        import("remark-sectionize"),
        import("remark-ins"),
        import("remark-supersub"),
        import("rehype-slug"),
        import("rehype-autolink-headings"),
        import("remark-github-admonitions-to-directives"),
      ]);
      
      return {
        unified: modules[0].unified,
        remarkParse: modules[1].default,
        remarkGfm: modules[2].default,
        remarkRehype: modules[3].default,
        rehypeHighlight: modules[4].default,
        rehypeStringify: modules[5].default,
        a11yEmoji: modules[6].default,
        remarkFrontmatter: modules[7].default,
        remarkDirective: modules[8].default,
        remarkTextr: modules[9].default,
        remarkToc: modules[10].default,
        sectionize: modules[11].default,
        remarkIns: modules[12].default,
        remarkSupersub: modules[13].default,
        rehypeSlug: modules[14].default,
        rehypeAutolinkHeadings: modules[15].default,
        remarkGithubAdmonitionsToDirectives: modules[16].default,
      };
    } catch (error) {
      console.error("Failed to load modules:", error);
      throw new Error("Could not load required markdown processing modules");
    }
  }
  
  // Text transformation functions
  function ellipses(input) {
    return input.replace(/\.{3}/gim, "…");
  }
  
  function addMarkTags(text) {
    const markRegex = /==(.*?)==/g;
    return text.replace(markRegex, "<mark>$1</mark>");
  }
  
  function addSuperScript(text) {
    const superRegex = /\^(.*?)\^/g;
    return text.replace(superRegex, '<sup class="suptext">$1</sup>');
  }
  
  function addSubScript(text) {
    const subRegex = /\_-(.*?)-\_/g;
    return text.replace(subRegex, '<sub class="subtext">$1</sub>');
  }
  
  function applyTextTransformations() {
    if (!contentContainer) return;
    
    const walker = document.createTreeWalker(
      contentContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (!node.textContent.trim() || 
              node.parentElement.tagName === "CODE" || 
              node.parentElement.tagName === "PRE") {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );
    
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
    
    textNodes.forEach((textNode) => {
      let content = textNode.textContent;
      const originalContent = content;
      
      content = addMarkTags(content);
      content = addSuperScript(content);
      content = addSubScript(content);
      
      if (content !== originalContent) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });
  }
  
  // Helper function to traverse AST nodes
  function visit(node, callback) {
    callback(node);
    if (node.children) {
      node.children.forEach((child) => visit(child, callback));
    }
  }
  
  // Rehype plugin for code language icons
  function rehypeCodeLanguageIcons() {
    return (tree) => {
      visit(tree, (node) => {
        if (node.type === "element" && node.tagName === "pre") {
          const codeElement = node.children.find(
            (child) => child.type === "element" && child.tagName === "code"
          );
          
          if (codeElement && codeElement.properties && codeElement.properties.className) {
            const languageClass = codeElement.properties.className.find((cls) =>
              cls.startsWith("language-")
            );
            
            if (languageClass) {
              const language = languageClass.replace("language-", "").toLowerCase();
              const iconClass = languageIcons[language] || languageIcons.default;
              
              if (!node.properties) node.properties = {};
              if (!node.properties.className) node.properties.className = [];
              node.properties.className.push("has-language");
              node.properties["data-language"] = language;
              
              const languageIcon = {
                type: "element",
                tagName: "div",
                properties: {
                  className: ["language-icon"],
                },
                children: [
                  {
                    type: "element",
                    tagName: "i",
                    properties: {
                      className: iconClass.split(" "),
                      title: language.toUpperCase(),
                    },
                    children: [],
                  },
                ],
              };
              
              node.children.unshift(languageIcon);
            }
          }
        }
      });
    };
  }
  
  // Rehype plugin for admonitions
  function rehypeAdmonitions() {
    const typeConfig = {
      note: { icon: "fa-circle-info", color: "#0969da" },
      tip: { icon: "fa-lightbulb", color: "#1a7f37" },
      important: { icon: "fa-message-exclamation", color: "#8250df" },
      warning: { icon: "fa-triangle-exclamation", color: "#9a6700" },
      caution: { icon: "fa-octagon-exclamation", color: "#cf222e" },
    };
    
    return (tree) => {
      visit(tree, (node) => {
        if (
          node.type === "element" &&
          node.tagName === "div" &&
          node.properties &&
          node.properties.dataDirectiveName
        ) {
          const directiveName = node.properties.dataDirectiveName.toLowerCase();
          const config = typeConfig[directiveName];
          
          if (config) {
            if (!node.properties.className) node.properties.className = [];
            node.properties.className.push("admonition", `admonition-${directiveName}`);
            node.properties.style = `border-left-color: ${config.color};`;
            
            const iconElement = {
              type: "element",
              tagName: "i",
              properties: {
                className: ["fas", config.icon, "admonition-icon"],
                style: `color: ${config.color};`,
              },
              children: [],
            };
            
            const titleElement = {
              type: "element",
              tagName: "div",
              properties: { className: ["admonition-title"] },
              children: [
                iconElement,
                {
                  type: "element",
                  tagName: "span",
                  properties: {},
                  children: [
                    {
                      type: "text",
                      value: directiveName.charAt(0).toUpperCase() + directiveName.slice(1),
                    },
                  ],
                },
              ],
            };
            
            const contentWrapper = {
              type: "element",
              tagName: "div",
              properties: { className: ["admonition-content"] },
              children: node.children,
            };
            
            node.children = [titleElement, contentWrapper];
          }
        }
      });
    };
  }
  
  function extractDocumentOutline() {
    setTimeout(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const outline = Array.from(headings).map(heading => ({
        id: heading.id,
        text: heading.textContent.replace('#', '').trim(),
        level: parseInt(heading.tagName.substring(1))
      }));
      
      dispatch('outlinegenerated', outline);
    }, 200);
  }
  
  async function discoverDirectoryFiles() {
    try {
      const currentPath = window.location.pathname;
      const directoryPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
      
      // In a real Chrome extension, you'd use chrome.fileSystem API or similar
      // For now, we'll simulate this with a placeholder
      // This would need to be implemented with proper file system access
      const files = [];
      
      dispatch('filesdiscovered', files);
    } catch (error) {
      console.error("Error discovering directory files:", error);
    }
  }
  
  function addCodeCopyButtons() {
    const defaultSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" id="copyicon"><path fill="currentColor" d="M17.997 4.17A3 3 0 0 1 20 7v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 2.003-2.83A4 4 0 0 0 10 8h4a4 4 0 0 0 3.98-3.597zM14 2a2 2 0 1 1 0 4h-4a2 2 0 1 1 0-4z"/></svg>';
    const successSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" id="copysuccess"><g fill="none"><path fill="currentColor" fill-opacity="0.16" d="M8 3H5.4A2.4 2.4 0 0 0 3 5.4v15.2A2.4 2.4 0 0 0 5.4 23h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3H16v1.2a.8.8 0 0 1-.8.8H8.8a.8.8 0 0 1-.8-.8z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 3h2.6A2.4 2.4 0 0 1 21 5.4v15.2a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 20.6V5.4A2.4 2.4 0 0 1 5.4 3H8m0 11l3 3l5-7M8.8 1h6.4a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-.8.8H8.8a.8.8 0 0 1-.8-.8V1.8a.8.8 0 0 1 .8-.8"/></g></svg>';
    
    const codeBlocks = document.querySelectorAll("pre");
    
    codeBlocks.forEach((block) => {
      const codeElement = block.querySelector("code");
      if (!codeElement) return;
      
      const button = document.createElement("button");
      button.className = "copy-code-button";
      button.innerHTML = defaultSVG;
      
      button.addEventListener("click", async () => {
        try {
          const codeToCopy = codeElement.innerText;
          await navigator.clipboard.writeText(codeToCopy);
          
          button.innerHTML = successSVG;
          button.classList.add("copied");
          
          setTimeout(() => {
            button.innerHTML = defaultSVG;
            button.classList.remove("copied");
          }, 2000);
        } catch (err) {
          console.error("Failed to copy code: ", err);
          button.innerHTML = '<i class="fas fa-times"></i>';
          setTimeout(() => {
            button.innerHTML = defaultSVG;
          }, 2000);
        }
      });
      
      block.insertBefore(button, block.firstChild);
    });
  }
</script>

{#if isProcessing}
  <div class="loading-container">
    <div class="loading-content">
      <i class="fas fa-spinner fa-spin"></i>
      <h2>Processing Markdown</h2>
      <p>Please wait while the document is being rendered...</p>
    </div>
  </div>
{:else if errorMessage}
  <div class="error-container">
    <div class="error-content">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>Error Rendering Markdown</h2>
      <p>There was an error processing this markdown file:</p>
      <pre>{errorMessage}</pre>
    </div>
  </div>
{:else}
  <div id="markdown-content-container" bind:this={contentContainer}>
    {@html renderedHtml}
  </div>
{/if}

<style>
  .loading-container,
  .error-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 40px;
  }
  
  .loading-content,
  .error-content {
    text-align: center;
    max-width: 600px;
  }
  
  .loading-content i {
    font-size: 48px;
    color: #0066cc;
    margin-bottom: 24px;
  }
  
  .error-content i {
    font-size: 48px;
    color: #cf222e;
    margin-bottom: 24px;
  }
  
  .loading-content h2,
  .error-content h2 {
    font-size: 24px;
    margin: 0 0 12px 0;
    color: #333;
  }
  
  .loading-content p,
  .error-content p {
    color: #666;
    margin: 0;
  }
  
  .error-content pre {
    margin-top: 20px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
    text-align: left;
    overflow-x: auto;
    white-space: pre-wrap;
    color: #cf222e;
  }
  
  #markdown-content-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  /* Copy button styles */
  :global(.copy-code-button) {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }
  
  :global(.copy-code-button:hover) {
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  :global(.copy-code-button.copied) {
    background: #d4edda;
    border-color: #28a745;
  }
  
  :global(pre) {
    position: relative;
  }
</style>
