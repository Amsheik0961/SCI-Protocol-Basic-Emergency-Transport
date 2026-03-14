(function () {
  class ProtocolEngine {
    constructor(data) {
      this.data = data;

      this.state = {
        protocolId: null,
        currentNodeId: null,
        history: [],
        viewMode: "step"
      };
    }

    getProtocols() {
      return this.data.protocols || [];
    }

    getProtocolById(protocolId) {
      return this.getProtocols().find((protocol) => protocol.id === protocolId) || null;
    }

    getCurrentProtocol() {
      if (!this.state.protocolId) return null;
      return this.getProtocolById(this.state.protocolId);
    }

    getNode(protocolId, nodeId) {
      const protocol = this.getProtocolById(protocolId);
      if (!protocol) return null;

      return protocol.nodes.find((node) => node.id === nodeId) || null;
    }

    getCurrentNode() {
      const protocol = this.getCurrentProtocol();
      if (!protocol || !this.state.currentNodeId) return null;

      return this.getNode(protocol.id, this.state.currentNodeId);
    }

    setProtocol(protocolId) {
      const protocol = this.getProtocolById(protocolId);
      if (!protocol) return null;

      this.state.protocolId = protocol.id;
      this.state.currentNodeId = protocol.entryNodeId;
      this.state.history = [protocol.entryNodeId];

      return this.getCurrentNode();
    }

    selectOption(nextNodeId) {
      if (!nextNodeId) {
        return this.getCurrentNode();
      }

      const protocol = this.getCurrentProtocol();
      if (!protocol) return null;

      const nextNode = this.getNode(protocol.id, nextNodeId);
      if (!nextNode) return this.getCurrentNode();

      this.state.currentNodeId = nextNodeId;
      this.state.history.push(nextNodeId);

      return nextNode;
    }

    canGoBack() {
      return this.state.history.length > 1;
    }

    goBack() {
      if (!this.canGoBack()) {
        return this.getCurrentNode();
      }

      this.state.history.pop();
      this.state.currentNodeId = this.state.history[this.state.history.length - 1];

      return this.getCurrentNode();
    }

    restart() {
      const protocol = this.getCurrentProtocol();
      if (!protocol) return null;

      this.state.currentNodeId = protocol.entryNodeId;
      this.state.history = [protocol.entryNodeId];

      return this.getCurrentNode();
    }

    clear() {
      this.state.protocolId = null;
      this.state.currentNodeId = null;
      this.state.history = [];
      this.state.viewMode = "step";
    }

    setViewMode(mode) {
      if (mode === "step" || mode === "tree") {
        this.state.viewMode = mode;
      }
    }

    getViewMode() {
      return this.state.viewMode;
    }

    getHistoryNodes() {
      const protocol = this.getCurrentProtocol();
      if (!protocol) return [];

      return this.state.history
        .map((nodeId) => this.getNode(protocol.id, nodeId))
        .filter(Boolean);
    }

    getPathLength() {
      return this.state.history.length;
    }

    serialize() {
      return {
        protocolId: this.state.protocolId,
        currentNodeId: this.state.currentNodeId,
        history: [...this.state.history],
        viewMode: this.state.viewMode
      };
    }

    hydrate(savedState) {
      if (!savedState || typeof savedState !== "object") return;

      this.state.protocolId = savedState.protocolId || null;
      this.state.currentNodeId = savedState.currentNodeId || null;
      this.state.history = Array.isArray(savedState.history) ? savedState.history : [];
      this.state.viewMode = savedState.viewMode === "tree" ? "tree" : "step";

      const protocol = this.getCurrentProtocol();
      if (!protocol) {
        this.clear();
        return;
      }

      const validNodeIds = new Set(protocol.nodes.map((node) => node.id));

      this.state.history = this.state.history.filter((nodeId) => validNodeIds.has(nodeId));

      if (!validNodeIds.has(this.state.currentNodeId)) {
        this.state.currentNodeId = protocol.entryNodeId;
      }

      if (this.state.history.length === 0) {
        this.state.history = [this.state.currentNodeId];
      }

      if (!this.state.history.includes(this.state.currentNodeId)) {
        this.state.history.push(this.state.currentNodeId);
      }
    }
  }

  window.ProtocolEngine = ProtocolEngine;
})();