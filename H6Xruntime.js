"use strict";

/**
 * HTML-6X Runtime Engine v0.1.0
 * Deterministic, sandboxed, auditable application runtime
 * 
 * Design Principles:
 * - No eval, no Function constructor, no innerHTML injection
 * - Declarative-only markup (data cannot be code)
 * - Memory-safe operations (structuredClone for isolation)
 * - CSP-compliant (no inline event handlers)
 * - Single-file deployable
 */

// ============================================================================
// STORAGE LAYER
// ============================================================================

class Store {
  constructor() {
    this.data = Object.create(null);
    this.computed = Object.create(null);
    this.state = Object.create(null);
    this.schemas = Object.create(null);
  }

  /**
   * Load data from <h6x-data> node
   */
  load(node) {
    const name = node.getAttribute("name");
    const persist = node.getAttribute("persist");
    const schema = node.getAttribute("schema");
    const compute = node.getAttribute("compute");

    try {
      if (compute) {
        // Computed data (derived from other data)
        this.computed[name] = compute;
      } else {
        const payload = JSON.parse(node.textContent.trim());
        
        // Validate against schema if provided
        if (schema && this.schemas[schema]) {
          this.validate(payload, this.schemas[schema]);
        }

        this.data[name] = payload;

        // Persist to IndexedDB if requested
        if (persist === "indexeddb") {
          this.persistToIndexedDB(name, payload);
        }
      }
      
      node.remove(); // Clean up DOM
    } catch (err) {
      console.error(`[H6X] Failed to load data "${name}":`, err);
    }
  }

  /**
   * Load state from <h6x-state> node
   */
  loadState(node) {
    const name = node.getAttribute("name");
    const initial = node.getAttribute("initial");
    this.state[name] = initial || null;
    node.remove();
  }

  /**
   * Get data by name (returns deep clone for safety)
   */
  get(name) {
    // Check computed data first
    if (this.computed[name]) {
      return this.evalComputed(this.computed[name]);
    }
    
    if (!this.data[name]) {
      console.warn(`[H6X] Data "${name}" not found`);
      return null;
    }
    
    return structuredClone(this.data[name]);
  }

  /**
   * Get state value
   */
  getState(name) {
    return this.state[name];
  }

  /**
   * Set state value
   */
  setState(name, value) {
    this.state[name] = value;
    // Trigger re-render for components watching this state
    this.notifyStateChange(name);
  }

  /**
   * Evaluate computed data expression
   * Uses restricted expression language (no arbitrary JS)
   */
  evalComputed(expr) {
    // Simple filter expression: "users.filter(active=true)"
    const filterMatch = expr.match(/(\w+)\.filter\((\w+)=(\w+)\)/);
    if (filterMatch) {
      const [, dataName, key, value] = filterMatch;
      const data = this.data[dataName];
      if (!data) return null;
      
      return data.filter(item => {
        if (value === "true") return item[key] === true;
        if (value === "false") return item[key] === false;
        return item[key] === value;
      });
    }

    // Simple count: "users.count"
    const countMatch = expr.match(/(\w+)\.count/);
    if (countMatch) {
      const [, dataName] = countMatch;
      const data = this.data[dataName];
      return Array.isArray(data) ? data.length : 0;
    }

    return null;
  }

  /**
   * Validate data against schema (basic validation)
   */
  validate(data, schema) {
    // Basic type checking
    if (schema.type === "array" && !Array.isArray(data)) {
      throw new Error("Data must be an array");
    }
    
    if (schema.type === "object" && typeof data !== "object") {
      throw new Error("Data must be an object");
    }

    // TODO: Add more sophisticated validation
    return true;
  }

  /**
   * Persist data to IndexedDB
   */
  async persistToIndexedDB(name, data) {
    // Simple IndexedDB wrapper
    // In production, this would be more robust
    try {
      const db = await this.openDB();
      const tx = db.transaction("h6x_data", "readwrite");
      const store = tx.objectStore("h6x_data");
      await store.put({ name, data, timestamp: Date.now() });
    } catch (err) {
      console.error(`[H6X] IndexedDB persist failed:`, err);
    }
  }

  /**
   * Open IndexedDB connection
   */
  openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("h6x_runtime", 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("h6x_data")) {
          db.createObjectStore("h6x_data", { keyPath: "name" });
        }
      };
    });
  }

  /**
   * Notify components of state changes
   */
  notifyStateChange(stateName) {
    window.dispatchEvent(new CustomEvent("h6x:state-change", {
      detail: { name: stateName, value: this.state[stateName] }
    }));
  }
}

// ============================================================================
// RENDERER LAYER
// ============================================================================

class Renderer {
  constructor(store) {
    this.store = store;
  }

  /**
   * Render table atom
   */
  table(rows, options = {}) {
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "1rem";

    if (!rows || rows.length === 0) {
      table.innerHTML = "<tr><td>No data available</td></tr>";
      return table;
    }

    const cols = Object.keys(rows[0] || {});
    const headerRow = cols.map(c => `<th style="text-align:left;padding:0.5rem;border-bottom:2px solid #374151">${this.sanitize(c)}</th>`).join("");
    
    const bodyRows = rows.map((r, idx) => {
      const cells = cols.map(c => `<td style="padding:0.5rem;border-bottom:1px solid #1f2937">${this.sanitize(r[c])}</td>`).join("");
      return `<tr style="cursor:pointer" data-row-index="${idx}">${cells}</tr>`;
    }).join("");

    table.innerHTML = `
      <thead>${headerRow}</thead>
      <tbody>${bodyRows}</tbody>
    `;

    // Add event listener for row clicks if specified
    if (options.onClick) {
      table.addEventListener("click", (e) => {
        const row = e.target.closest("tr[data-row-index]");
        if (row) {
          const index = parseInt(row.dataset.rowIndex);
          options.onClick(rows[index]);
        }
      });
    }

    return table;
  }

  /**
   * Render form atom
   */
  form(schema, onSubmit) {
    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.gap = "1rem";
    form.style.maxWidth = "500px";
    form.style.marginTop = "1rem";

    schema.fields.forEach(field => {
      const wrapper = document.createElement("div");
      
      const label = document.createElement("label");
      label.textContent = field.label;
      label.style.display = "block";
      label.style.marginBottom = "0.25rem";
      label.style.fontWeight = "500";

      let input;
      
      if (field.type === "textarea") {
        input = document.createElement("textarea");
        input.rows = 4;
      } else if (field.type === "select") {
        input = document.createElement("select");
        field.options.forEach(opt => {
          const option = document.createElement("option");
          option.value = opt.value;
          option.textContent = opt.label;
          input.appendChild(option);
        });
      } else {
        input = document.createElement("input");
        input.type = field.type || "text";
      }

      input.name = field.name;
      input.required = field.required || false;
      input.style.padding = "0.5rem";
      input.style.borderRadius = "0.25rem";
      input.style.border = "1px solid #374151";
      input.style.background = "#1f2937";
      input.style.color = "#e5e7eb";
      input.style.width = "100%";
      input.style.boxSizing = "border-box";

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      form.appendChild(wrapper);
    });

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = schema.submitLabel || "Submit";
    submitBtn.style.padding = "0.5rem 1rem";
    submitBtn.style.background = "#38bdf8";
    submitBtn.style.color = "#0b1220";
    submitBtn.style.border = "none";
    submitBtn.style.borderRadius = "0.25rem";
    submitBtn.style.cursor = "pointer";
    submitBtn.style.fontWeight = "600";

    form.appendChild(submitBtn);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      if (onSubmit) onSubmit(data);
      form.reset();
    });

    return form;
  }

  /**
   * Render card atom
   */
  card(data) {
    const card = document.createElement("div");
    card.style.padding = "1.5rem";
    card.style.background = "#1f2937";
    card.style.borderRadius = "0.5rem";
    card.style.border = "1px solid #374151";

    if (data.title) {
      const title = document.createElement("h3");
      title.textContent = this.sanitize(data.title);
      title.style.margin = "0 0 0.5rem 0";
      title.style.fontSize = "1.25rem";
      title.style.fontWeight = "600";
      card.appendChild(title);
    }

    if (data.content) {
      const content = document.createElement("p");
      content.textContent = this.sanitize(data.content);
      content.style.margin = "0";
      content.style.color = "#9ca3af";
      card.appendChild(content);
    }

    return card;
  }

  /**
   * Render stat atom (for dashboards)
   */
  stat(data) {
    const stat = document.createElement("div");
    stat.style.padding = "1.5rem";
    stat.style.background = "#1f2937";
    stat.style.borderRadius = "0.5rem";
    stat.style.border = "1px solid #374151";
    stat.style.textAlign = "center";

    const value = document.createElement("div");
    value.textContent = this.sanitize(data.value);
    value.style.fontSize = "2.5rem";
    value.style.fontWeight = "700";
    value.style.color = "#38bdf8";
    value.style.margin = "0 0 0.5rem 0";

    const label = document.createElement("div");
    label.textContent = this.sanitize(data.label);
    label.style.color = "#9ca3af";
    label.style.fontSize = "0.875rem";
    label.style.textTransform = "uppercase";
    label.style.letterSpacing = "0.05em";

    stat.appendChild(value);
    stat.appendChild(label);

    return stat;
  }

  /**
   * Render list atom
   */
  list(items, options = {}) {
    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    list.style.margin = "1rem 0";

    items.forEach((item, idx) => {
      const li = document.createElement("li");
      li.style.padding = "0.75rem";
      li.style.marginBottom = "0.5rem";
      li.style.background = "#1f2937";
      li.style.borderRadius = "0.25rem";
      li.style.border = "1px solid #374151";
      li.style.cursor = options.onClick ? "pointer" : "default";
      li.dataset.index = idx;

      if (typeof item === "string") {
        li.textContent = this.sanitize(item);
      } else {
        li.textContent = this.sanitize(item[options.displayKey] || JSON.stringify(item));
      }

      if (options.onClick) {
        li.addEventListener("click", () => options.onClick(item));
      }

      list.appendChild(li);
    });

    return list;
  }

  /**
   * Sanitize user content to prevent XSS
   */
  sanitize(value) {
    if (value === null || value === undefined) return "";
    
    const str = String(value);
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
}

// ============================================================================
// LAYOUT MANAGER
// ============================================================================

class LayoutManager {
  /**
   * Create dashboard layout
   */
  dashboard(panels) {
    const layout = document.createElement("div");
    layout.style.display = "grid";
    layout.style.gridTemplateColumns = "220px 1fr";
    layout.style.height = "100vh";
    layout.style.overflow = "hidden";

    const sidebar = document.createElement("aside");
    sidebar.style.background = "#1f2937";
    sidebar.style.borderRight = "1px solid #374151";
    sidebar.style.padding = "1rem";
    sidebar.style.overflowY = "auto";

    const main = document.createElement("main");
    main.style.padding = "2rem";
    main.style.overflowY = "auto";

    layout.appendChild(sidebar);
    layout.appendChild(main);

    return { layout, sidebar, main };
  }

  /**
   * Create split layout
   */
  split(orientation = "horizontal") {
    const layout = document.createElement("div");
    layout.style.display = "grid";
    layout.style.gridTemplateColumns = orientation === "horizontal" ? "1fr 1fr" : "1fr";
    layout.style.gridTemplateRows = orientation === "vertical" ? "1fr 1fr" : "auto";
    layout.style.gap = "1rem";
    layout.style.height = "100vh";
    layout.style.padding = "1rem";

    return layout;
  }

  /**
   * Create centered layout
   */
  centered() {
    const layout = document.createElement("div");
    layout.style.display = "flex";
    layout.style.alignItems = "center";
    layout.style.justifyContent = "center";
    layout.style.minHeight = "100vh";
    layout.style.padding = "2rem";

    return layout;
  }
}

// ============================================================================
// MAIN RUNTIME
// ============================================================================

class H6XRuntime {
  constructor() {
    this.store = new Store();
    this.renderer = new Renderer(this.store);
    this.layout = new LayoutManager();
    this.apps = [];
  }

  /**
   * Boot the runtime
   */
  boot() {
    console.log("[H6X] Booting runtime...");

    // Load all data sources
    document.querySelectorAll("h6x-data").forEach(node => this.store.load(node));
    
    // Load all state
    document.querySelectorAll("h6x-state").forEach(node => this.store.loadState(node));

    // Mount all applications
    document.querySelectorAll("h6x-app").forEach(app => this.mount(app));

    console.log("[H6X] Runtime ready");
  }

  /**
   * Mount an application
   */
  mount(appNode) {
    const name = appNode.getAttribute("name");
    const mode = appNode.getAttribute("mode");

    console.log(`[H6X] Mounting app: ${name}`);

    const layoutNode = appNode.querySelector("h6x-layout");
    if (!layoutNode) {
      console.error("[H6X] No layout found in app");
      return;
    }

    const layoutType = layoutNode.getAttribute("type");
    const layoutConfig = this.layout[layoutType]();

    // Handle different layout types
    if (layoutType === "dashboard") {
      this.mountDashboard(appNode, layoutConfig);
    } else if (layoutType === "split") {
      this.mountSplit(appNode, layoutConfig);
    } else if (layoutType === "centered") {
      this.mountCentered(appNode, layoutConfig);
    }

    appNode.replaceWith(layoutConfig.layout || layoutConfig);
  }

  /**
   * Mount dashboard layout
   */
  mountDashboard(appNode, { layout, sidebar, main }) {
    const panels = appNode.querySelectorAll("h6x-panel");

    panels.forEach(panel => {
      const slot = panel.getAttribute("slot");

      if (slot === "sidebar") {
        this.renderSidebar(panel, sidebar);
      } else if (slot === "main") {
        this.renderPanel(panel, main);
      }
    });
  }

  /**
   * Mount split layout
   */
  mountSplit(appNode, layout) {
    const panels = appNode.querySelectorAll("h6x-panel");
    panels.forEach(panel => {
      const section = document.createElement("section");
      this.renderPanel(panel, section);
      layout.appendChild(section);
    });
  }

  /**
   * Mount centered layout
   */
  mountCentered(appNode, layout) {
    const panel = appNode.querySelector("h6x-panel");
    if (panel) {
      const container = document.createElement("div");
      container.style.width = "100%";
      container.style.maxWidth = "600px";
      this.renderPanel(panel, container);
      layout.appendChild(container);
    }
  }

  /**
   * Render sidebar navigation
   */
  renderSidebar(panel, sidebar) {
    const items = panel.textContent
      .split("\n")
      .map(i => i.trim())
      .filter(Boolean);

    items.forEach(item => {
      const btn = document.createElement("button");
      btn.textContent = item;
      btn.style.display = "block";
      btn.style.width = "100%";
      btn.style.padding = "0.75rem";
      btn.style.marginBottom = "0.5rem";
      btn.style.background = "transparent";
      btn.style.border = "1px solid transparent";
      btn.style.borderRadius = "0.25rem";
      btn.style.color = "#e5e7eb";
      btn.style.textAlign = "left";
      btn.style.cursor = "pointer";
      btn.style.transition = "all 0.2s";

      btn.addEventListener("mouseenter", () => {
        btn.style.background = "#374151";
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.background = "transparent";
      });

      btn.addEventListener("click", () => {
        console.log(`[H6X] Navigation: ${item}`);
        // TODO: Implement navigation
      });

      sidebar.appendChild(btn);
    });
  }

  /**
   * Render panel content
   */
  renderPanel(panel, container) {
    const atoms = panel.querySelectorAll("h6x-atom");

    atoms.forEach(atom => {
      const type = atom.getAttribute("type");
      const source = atom.getAttribute("source");
      const compute = atom.getAttribute("compute");

      let element;

      switch (type) {
        case "table":
          const data = source ? this.store.get(source) : [];
          element = this.renderer.table(data);
          break;

        case "form":
          const schema = JSON.parse(atom.textContent.trim());
          element = this.renderer.form(schema, (data) => {
            console.log("[H6X] Form submitted:", data);
            // TODO: Handle form submission
          });
          break;

        case "card":
          const cardData = JSON.parse(atom.textContent.trim());
          element = this.renderer.card(cardData);
          break;

        case "stat":
          let statData;
          if (compute) {
            const value = this.store.evalComputed(compute);
            statData = {
              value: value,
              label: atom.getAttribute("label") || "Stat"
            };
          } else {
            statData = JSON.parse(atom.textContent.trim());
          }
          element = this.renderer.stat(statData);
          break;

        case "list":
          const listData = source ? this.store.get(source) : [];
          element = this.renderer.list(listData);
          break;

        default:
          console.warn(`[H6X] Unknown atom type: ${type}`);
          return;
      }

      if (element) {
        container.appendChild(element);
      }
    });
  }
}

// ============================================================================
// AUTO-BOOT
// ============================================================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.h6x = new H6XRuntime();
    window.h6x.boot();
  });
} else {
  window.h6x = new H6XRuntime();
  window.h6x.boot();
}
