(function () {
  class TreeEngine {
    constructor(protocolEngine) {
      this.protocolEngine = protocolEngine;
      this.maxDepth = 10;
      this.maxChildrenPerNode = 3;
      this.cachedProtocolId = null;
      this.cachedCurrentNodeId = null;
      this.cachedHTML = "";
    }

    getProtocol() {
      return this.protocolEngine.getCurrentProtocol();
    }

    getCurrentNodeId() {
      const node = this.protocolEngine.getCurrentNode();
      return node ? node.id : null;
    }

    getHistoryNodeIds() {
      return new Set(
        this.protocolEngine.getHistoryNodes().map((node) => node.id)
      );
    }

    getNodeMap(protocol) {
      const map = new Map();
      (protocol.nodes || []).forEach((node) => {
        map.set(node.id, node);
      });
      return map;
    }

    getUrgencyClass(urgency) {
      const value = String(urgency || "").toLowerCase();
      if (value.includes("urgent")) return "urgent";
      if (value.includes("high")) return "warning";
      return "safe";
    }

    getUrgencyPillClass(urgency) {
      const value = String(urgency || "").toLowerCase();
      if (value.includes("urgent")) return "pill-urgent";
      if (value.includes("high")) return "pill-warning";
      return "pill-safe";
    }

    getChildren(node) {
      if (!node || !Array.isArray(node.options)) return [];

      return node.options
        .filter((option) => option && option.next)
        .slice(0, this.maxChildrenPerNode)
        .map((option) => ({
          label: option.label || "Next",
          hint: option.hint || "",
          next: option.next
        }));
    }

    buildLevels(protocol) {
      const nodeMap = this.getNodeMap(protocol);
      const historyIds = this.getHistoryNodeIds();
      const currentId = this.getCurrentNodeId();
      const rootId = protocol.entryNodeId;

      if (!rootId || !nodeMap.has(rootId)) return [];

      const levels = [];
      const queue = [
        {
          id: rootId,
          edgeLabel: "",
          edgeHint: "",
          parentId: null,
          depth: 0
        }
      ];

      const seenByDepth = new Set();
      let pointer = 0;

      while (pointer < queue.length) {
        const item = queue[pointer];
        pointer += 1;

        if (item.depth > this.maxDepth) continue;

        const depthKey = `${item.depth}:${item.id}:${item.parentId || "root"}`;
        if (seenByDepth.has(depthKey)) continue;
        seenByDepth.add(depthKey);

        const node = nodeMap.get(item.id);
        if (!node) continue;

        if (!levels[item.depth]) levels[item.depth] = [];

        levels[item.depth].push({
          id: node.id,
          title: node.title || "Untitled step",
          narrative: node.narrative || "",
          urgency: node.urgency || "Standard",
          complexity: node.complexity || "General",
          active: historyIds.has(node.id),
          current: currentId === node.id,
          terminal:
            !node.options ||
            node.options.length === 0 ||
            node.options.every((option) => !option.next),
          edgeLabel: item.edgeLabel,
          edgeHint: item.edgeHint,
          parentId: item.parentId,
          depth: item.depth
        });

        const children = this.getChildren(node);
        for (let i = 0; i < children.length; i += 1) {
          queue.push({
            id: children[i].next,
            edgeLabel: children[i].label,
            edgeHint: children[i].hint,
            parentId: node.id,
            depth: item.depth + 1
          });
        }
      }

      return levels.filter(Boolean);
    }

    escapeHTML(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    renderEmptyState(container) {
      container.innerHTML = `
        <div class="tree-root">
          <article class="tree-node safe">
            <div class="tree-node-header">
              <div class="tree-node-step">Ready</div>
              <h4>No protocol selected</h4>
            </div>
            <p>Select a protocol to display the decision tree.</p>
            <div class="tree-node-tags">
              <span class="pill pill-neutral">Awaiting selection</span>
            </div>
          </article>
        </div>
      `;
    }

    buildHTML(protocol) {
      const levels = this.buildLevels(protocol);

      if (!levels.length) {
        return `
          <div class="tree-root">
            <article class="tree-node safe">
              <div class="tree-node-header">
                <div class="tree-node-step">Ready</div>
                <h4>No protocol selected</h4>
              </div>
              <p>Select a protocol to display the decision tree.</p>
              <div class="tree-node-tags">
                <span class="pill pill-neutral">Awaiting selection</span>
              </div>
            </article>
          </div>
        `;
      }

      let html = `<div class="tree-root">`;

      for (let i = 0; i < levels.length; i += 1) {
        html += `<div class="tree-level">`;

        for (let j = 0; j < levels[i].length; j += 1) {
          const node = levels[i][j];

          html += `<div class="tree-branch">`;

          if (node.edgeLabel) {
            html += `
              <div class="tree-connector-stack">
                <div class="tree-line tree-line-vertical"></div>
                <div class="tree-edge-label${node.active ? " active" : ""}">
                  <strong>${this.escapeHTML(node.edgeLabel)}</strong>
                  ${
                    node.edgeHint
                      ? `<span>${this.escapeHTML(node.edgeHint)}</span>`
                      : ""
                  }
                </div>
              </div>
            `;
          }

          html += `
            <article class="tree-node ${this.getUrgencyClass(node.urgency)}${
              node.active ? " active" : ""
            }${node.current ? " current" : ""}">
              <div class="tree-node-header">
                <div class="tree-node-step">${
                  node.depth === 0 ? "Start" : `Level ${node.depth}`
                }</div>
                <h4>${this.escapeHTML(node.title)}</h4>
              </div>
              <p>${this.escapeHTML(node.narrative)}</p>
              <div class="tree-node-tags">
                <span class="pill ${this.getUrgencyPillClass(node.urgency)}">${this.escapeHTML(node.urgency)}</span>
                <span class="pill pill-neutral">${this.escapeHTML(node.complexity)}</span>
                ${node.current ? `<span class="pill pill-info">Current</span>` : ""}
                ${!node.current && node.active ? `<span class="pill pill-neutral">Visited</span>` : ""}
                ${node.terminal ? `<span class="pill pill-safe">End</span>` : ""}
              </div>
            </article>
          `;

          html += `</div>`;
        }

        html += `</div>`;
      }

      html += `</div>`;
      return html;
    }

    render(container, force = false) {
      if (!container) return;

      const protocol = this.getProtocol();

      if (!protocol) {
        this.cachedProtocolId = null;
        this.cachedCurrentNodeId = null;
        this.cachedHTML = "";
        this.renderEmptyState(container);
        return;
      }

      const protocolId = protocol.id;
      const currentNodeId = this.getCurrentNodeId();

      if (
        !force &&
        this.cachedHTML &&
        this.cachedProtocolId === protocolId &&
        this.cachedCurrentNodeId === currentNodeId
      ) {
        container.innerHTML = this.cachedHTML;
        return;
      }

      const html = this.buildHTML(protocol);

      this.cachedProtocolId = protocolId;
      this.cachedCurrentNodeId = currentNodeId;
      this.cachedHTML = html;

      container.innerHTML = html;
    }

    invalidate() {
      this.cachedProtocolId = null;
      this.cachedCurrentNodeId = null;
      this.cachedHTML = "";
    }
  }

  window.TreeEngine = TreeEngine;
})();