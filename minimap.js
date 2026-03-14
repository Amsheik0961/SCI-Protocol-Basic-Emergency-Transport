(function () {
  class Minimap {
    constructor(containerElement) {
      this.containerElement = containerElement;
    }

    render(protocol) {
      if (!this.containerElement) return;

      if (!protocol || !Array.isArray(protocol.nodes) || protocol.nodes.length === 0) {
        this.containerElement.innerHTML = `
          <div class="minimap-track">
            <strong>No protocol selected</strong>
            <div class="minimap-item">Select a protocol to preview its structure.</div>
          </div>
        `;
        return;
      }

      const items = protocol.nodes
        .map((node, index) => {
          return `<div class="minimap-item">${index + 1}. ${node.title}</div>`;
        })
        .join("");

      this.containerElement.innerHTML = `
        <div class="minimap-track">
          <strong>${protocol.title}</strong>
          ${items}
        </div>
      `;
    }
  }

  window.Minimap = Minimap;
})();