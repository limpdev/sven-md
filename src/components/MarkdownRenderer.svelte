<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let markdownContent = "";

  const dispatch = createEventDispatcher();
  let contentContainer;
  let isProcessing = true;
  let errorMessage = null;
  let renderedHtml = "";

  // Language mapping for icons
  const languageIcons = {
    js: "fab fa-js-square",
    javascript: "fab fa-js-square",
    ts: "fab fa-js-square",
    typescript: "fab fa-js-square",
    py: "fab fa-python",
    python: "fab fa-python",
    html: "fab fa-html5",
    css: "fab fa-css3-alt",
    java: "fab fa-java",
    go: "fab fa-golang",
    rust: "fas fa-gear",
    c: "fas fa-copyright",
    cpp: "fas fa-copyright",
    shell: "fas fa-terminal",
    bash: "fas fa-terminal",
    json: "fas fa-code",
    xml: "fas fa-code",
    yaml: "fas fa-file-code",
    md: "fab fa-markdown",
    markdown: "fab fa-markdown",
  };

  onMount(async () => {
    await processMarkdown();
  });

  async function processMarkdown() {
    try {
      if (!markdownContent) {
        errorMessage = "No markdown content found";
        isProcessing = false;
        return;
      }

      const modules = await loadModules();

      const processor = modules
        .unified()
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
        .use(modules.rehypeAutolinkHeadings, { behavior: "prepend" })
        .use(modules.rehypeHighlight, { ignoreMissing: true })
        .use(rehypeCodeLanguageIcons)
        .use(rehypeAdmonitions)
        .use(modules.rehypeSanitize)
        .use(modules.rehypeStringify, { allowDangerousHtml: true });

      const file = await processor.process(markdownContent);
      renderedHtml = String(file);

      extractDocumentOutline();
      isProcessing = false;

      // Post-render DOM manipulations
      setTimeout(() => {
        addCodeCopyButtons();
      }, 100);
    } catch (error) {
      console.error("Error rendering markdown:", error);
      errorMessage = error.message;
      isProcessing = false;
    }
  }

  async function loadModules() {
    // Dynamic imports to keep bundle chunks optimal
    const [
      unified,
      remarkParse,
      remarkGfm,
      remarkRehype,
      rehypeHighlight,
      rehypeStringify,
      a11yEmoji,
      remarkFrontmatter,
      remarkDirective,
      remarkTextr,
      remarkToc,
      remarkSectionize,
      remarkIns,
      remarkSupersub,
      rehypeSlug,
      rehypeAutolinkHeadings,
      remarkGithubAdmonitionsToDirectives,
      rehypeSanitize,
    ] = await Promise.all([
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
      import("rehype-sanitize"),
    ]);

    return {
      unified: unified.unified,
      remarkParse: remarkParse.default,
      remarkGfm: remarkGfm.default,
      remarkRehype: remarkRehype.default,
      rehypeHighlight: rehypeHighlight.default,
      rehypeStringify: rehypeStringify.default,
      a11yEmoji: a11yEmoji.default,
      remarkFrontmatter: remarkFrontmatter.default,
      remarkDirective: remarkDirective.default,
      remarkTextr: remarkTextr.default,
      remarkToc: remarkToc.default,
      sectionize: remarkSectionize.default,
      remarkIns: remarkIns.default,
      remarkSupersub: remarkSupersub.default,
      rehypeSlug: rehypeSlug.default,
      rehypeAutolinkHeadings: rehypeAutolinkHeadings.default,
      remarkGithubAdmonitionsToDirectives:
        remarkGithubAdmonitionsToDirectives.default,
      rehypeSanitize: rehypeSanitize.default,
    };
  }

  // --- AST Utilities ---
  function visit(node, callback) {
    callback(node);
    if (node.children) node.children.forEach((c) => visit(c, callback));
  }

  function ellipses(input) {
    return input.replace(/\.{3}/gim, "…");
  }

  function rehypeCodeLanguageIcons() {
    return (tree) => {
      visit(tree, (node) => {
        if (node.type === "element" && node.tagName === "pre") {
          const codeElement = node.children.find((c) => c.tagName === "code");
          if (codeElement?.properties?.className) {
            const langClass = codeElement.properties.className.find((c) =>
              c.startsWith("language-"),
            );
            if (langClass) {
              const lang = langClass.replace("language-", "").toLowerCase();
              const iconClass = languageIcons[lang] || "fas fa-code";

              node.properties.className = [
                ...(node.properties.className || []),
                "has-language",
              ];

              node.children.unshift({
                type: "element",
                tagName: "div",
                properties: { className: ["language-icon"] },
                children: [
                  {
                    type: "element",
                    tagName: "i",
                    properties: { className: iconClass.split(" ") },
                    children: [],
                  },
                  { type: "text", value: " " + lang },
                ],
              });
            }
          }
        }
      });
    };
  }

  function rehypeAdmonitions() {
    return (tree) => {
      visit(tree, (node) => {
        if (
          node.type === "element" &&
          node.tagName === "div" &&
          node.properties.dataDirectiveName
        ) {
          const name = node.properties.dataDirectiveName.toLowerCase();
          const valid = ["note", "tip", "important", "warning", "caution"];
          if (valid.includes(name)) {
            node.properties.className = [
              ...(node.properties.className || []),
              "admonition",
              `admonition-${name}`,
            ];
            // Simple title construction
            const title = {
              type: "element",
              tagName: "div",
              properties: { className: ["admonition-title"] },
              children: [{ type: "text", value: name.toUpperCase() }],
            };
            node.children = [
              title,
              {
                type: "element",
                tagName: "div",
                properties: { className: ["admonition-content"] },
                children: node.children,
              },
            ];
          }
        }
      });
    };
  }

  function extractDocumentOutline() {
    setTimeout(() => {
      const headings = document.querySelectorAll(
        "#markdown-content-container h1, h2, h3",
      );
      const outline = Array.from(headings).map((h) => ({
        id: h.id,
        text: h.textContent.replace(/^#+\s/, "").trim(),
        level: parseInt(h.tagName.substring(1)),
      }));
      dispatch("outlinegenerated", outline);
    }, 200);
  }

  function addCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll(
      "#markdown-content-container pre",
    );
    codeBlocks.forEach((block) => {
      if (!block.querySelector("code")) return;

      const btn = document.createElement("button");
      btn.className = "copy-code-button";
      btn.innerHTML = '<i class="far fa-copy"></i>';

      btn.addEventListener("click", () => {
        const text = block.querySelector("code").innerText;
        navigator.clipboard.writeText(text);
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.add("copied");
        setTimeout(() => {
          btn.innerHTML = '<i class="far fa-copy"></i>';
          btn.classList.remove("copied");
        }, 2000);
      });

      block.appendChild(btn);
    });
  }
  /**
   * Enhances <details> elements by wrapping their content for animation
   * and adding smooth open/close listeners.
   */
  function enhanceDetailsElements() {
    const detailsElements = document.querySelectorAll(
      "#markdown-content-container details",
    );

    detailsElements.forEach((details) => {
      // 1. Structure Check: Ensure there is a content wrapper
      if (details.querySelector(".sven-details-content")) return; // Already processed

      const summary = details.querySelector("summary");
      if (!summary) return;

      // Create wrapper div
      const contentWrapper = document.createElement("div");
      contentWrapper.className = "sven-details-content";

      // Move all nodes after summary into wrapper
      let nextSibling = summary.nextSibling;
      while (nextSibling) {
        const nodeToMove = nextSibling;
        nextSibling = nextSibling.nextSibling;
        contentWrapper.appendChild(nodeToMove);
      }
      details.appendChild(contentWrapper);

      // 2. Animation Logic
      summary.addEventListener("click", (e) => {
        e.preventDefault(); // Stop default instant toggle

        if (details.hasAttribute("open")) {
          // CLOSING ANIMATION
          // Lock current height
          const startHeight = contentWrapper.offsetHeight;
          contentWrapper.style.height = `${startHeight}px`;
          contentWrapper.style.opacity = "1";

          // Force reflow
          void contentWrapper.offsetHeight;

          // Animate to 0
          requestAnimationFrame(() => {
            contentWrapper.style.height = "0px";
            contentWrapper.style.opacity = "0";
          });

          // Cleanup after transition
          contentWrapper.addEventListener(
            "transitionend",
            function onEnd() {
              details.removeAttribute("open");
              contentWrapper.style.height = null;
              contentWrapper.style.opacity = null;
              contentWrapper.removeEventListener("transitionend", onEnd);
            },
            { once: true },
          );
        } else {
          // OPENING ANIMATION
          details.setAttribute("open", "");

          // Determine target height
          const targetHeight = contentWrapper.scrollHeight;

          // Start from 0
          contentWrapper.style.height = "0px";
          contentWrapper.style.opacity = "0";

          // Force reflow
          void contentWrapper.offsetHeight;

          // Animate to target
          requestAnimationFrame(() => {
            contentWrapper.style.height = `${targetHeight}px`;
            contentWrapper.style.opacity = "1";
          });

          // Cleanup
          contentWrapper.addEventListener(
            "transitionend",
            function onEnd() {
              contentWrapper.style.height = null; // Release to auto
              contentWrapper.removeEventListener("transitionend", onEnd);
            },
            { once: true },
          );
        }
      });
    });
  }
</script>

{#if isProcessing}
  <div class="center-msg">
    <i class="fas fa-spinner fa-spin"></i>
    <p>Rendering...</p>
  </div>
{:else if errorMessage}
  <div class="center-msg error">
    <i class="fas fa-exclamation-triangle"></i>
    <p>{errorMessage}</p>
  </div>
{:else}
  <div id="markdown-content-container" bind:this={contentContainer}>
    {@html renderedHtml}
  </div>
{/if}

<style>
  .center-msg {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    color: var(--text-secondary);
  }
  .center-msg i {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .error {
    color: #f85149;
  }
</style>
