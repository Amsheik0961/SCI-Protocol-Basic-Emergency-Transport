(function () {
  const data = window.SCI_PROTOCOL_DATA;
  const engine = new window.ProtocolEngine(data);
  const treeEngine = new window.TreeEngine(engine);

  const els = {
    protocolSelect: document.getElementById("protocolSelect"),
    viewModeSelect: document.getElementById("viewModeSelect"),

    homeBtn: document.getElementById("homeBtn"),
    backBtn: document.getElementById("backBtn"),
    restartBtn: document.getElementById("restartBtn"),

    currentStepLabel: document.getElementById("currentStepLabel"),
    pathLengthLabel: document.getElementById("pathLengthLabel"),

    protocolCategoryLabel: document.getElementById("protocolCategoryLabel"),
    protocolTitle: document.getElementById("protocolTitle"),
    scenarioLabel: document.getElementById("scenarioLabel"),
    urgencyLabel: document.getElementById("urgencyLabel"),

    homeView: document.getElementById("homeView"),
    stepView: document.getElementById("stepView"),
    treeView: document.getElementById("treeView"),

    stepKicker: document.getElementById("stepKicker"),
    stepTitle: document.getElementById("stepTitle"),
    stepText: document.getElementById("stepText"),
    stepUrgency: document.getElementById("stepUrgency"),
    stepComplexity: document.getElementById("stepComplexity"),

    alertsBox: document.getElementById("alertsBox"),
    actionsBox: document.getElementById("actionsBox"),
    optionsGrid: document.getElementById("optionsGrid"),

    pearlsList: document.getElementById("pearlsList"),
    pathSummary: document.getElementById("pathSummary"),

    treeStage: document.getElementById("treeStage"),
    treeCanvas: document.getElementById("treeCanvas"),
    minimap: document.getElementById("minimap"),

    domainGrid: document.getElementById("domainGrid"),

    zoomInBtn: document.getElementById("zoomInBtn"),
    zoomOutBtn: document.getElementById("zoomOutBtn"),
    fitTreeBtn: document.getElementById("fitTreeBtn"),
    resetTreeBtn: document.getElementById("resetTreeBtn")
  };

  const canvasControls =
    els.treeStage && els.treeCanvas
      ? new window.CanvasControls(els.treeStage, els.treeCanvas)
      : null;

  const minimap = new window.Minimap(els.minimap);

  const dynamicEls = {
    protocolDescription: null,
    protocolSource: null,
    clinicalNotice: null,
    wsesCard: null
  };

  function initDynamicRegions() {
    const welcomeCard = document.querySelector(".welcome-card");
    const supportPanel = document.querySelector(".support-panel");
    const disclaimerBlock = document.querySelector(".disclaimer-block");

    if (welcomeCard) {
      const descriptionBlock = document.createElement("div");
      descriptionBlock.className = "panel-block";
      descriptionBlock.style.marginTop = "1rem";
      descriptionBlock.innerHTML = `
        <h4 style="margin:0 0 0.5rem 0; color: var(--primary);">Protocol Summary</h4>
        <p id="protocolDescription" style="color: var(--text-muted); margin-bottom: 0.75rem;">
          Select a pathway to see protocol details.
        </p>
        <div id="protocolSource" class="pill pill-neutral">Source: —</div>
      `;
      welcomeCard.appendChild(descriptionBlock);
      dynamicEls.protocolDescription =
        descriptionBlock.querySelector("#protocolDescription");
      dynamicEls.protocolSource =
        descriptionBlock.querySelector("#protocolSource");
    }

    if (disclaimerBlock && data.clinicalMeta && data.clinicalMeta.notice) {
      const notice = document.createElement("p");
      notice.id = "clinicalNotice";
      notice.style.marginTop = "0.75rem";
      notice.style.color = "var(--text-muted)";
      notice.textContent = data.clinicalMeta.notice;
      disclaimerBlock.appendChild(notice);
      dynamicEls.clinicalNotice = notice;
    }

    if (supportPanel && data.clinicalMeta && data.clinicalMeta.wsesTargets) {
      const card = document.createElement("section");
      card.className = "support-card";
      card.innerHTML = `
        <h4>WSES Targets</h4>
        <ul id="wsesList" class="support-list"></ul>
      `;
      supportPanel.appendChild(card);
      dynamicEls.wsesCard = card.querySelector("#wsesList");
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        data.appMeta.storageKey,
        JSON.stringify(engine.serialize())
      );
    } catch (error) {
      console.warn("Unable to save protocol state:", error);
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(data.appMeta.storageKey);
      if (!raw) return;
      engine.hydrate(JSON.parse(raw));
    } catch (error) {
      console.warn("Unable to restore protocol state:", error);
    }
  }

  function getUrgencyPillClass(urgency) {
    const value = String(urgency || "").toLowerCase();
    if (value.includes("urgent")) return "pill-urgent";
    if (value.includes("high")) return "pill-warning";
    return "pill-safe";
  }

  function showView(viewName) {
    els.homeView.classList.remove("active");
    els.stepView.classList.remove("active");
    els.treeView.classList.remove("active");

    if (viewName === "home") {
      els.homeView.classList.add("active");
      return;
    }

    if (viewName === "tree") {
      els.treeView.classList.add("active");
      return;
    }

    els.stepView.classList.add("active");
  }

  function populateProtocolSelect() {
    const protocols = engine.getProtocols();

    els.protocolSelect.innerHTML = protocols
      .map((protocol) => {
        return `<option value="${protocol.id}">${protocol.category} — ${protocol.title}</option>`;
      })
      .join("");
  }

  function buildCategorySummary(protocols) {
    const summary = {};

    protocols.forEach((protocol) => {
      const key = protocol.category || "Other";
      summary[key] = summary[key] || [];
      summary[key].push(protocol);
    });

    return summary;
  }

  function renderDomainGrid() {
    const protocols = engine.getProtocols();
    const grouped = buildCategorySummary(protocols);

    els.domainGrid.innerHTML = Object.keys(grouped)
      .map((category) => {
        const cards = grouped[category]
          .map((protocol) => {
            return `
              <article class="domain-card" data-protocol-id="${protocol.id}">
                <h4>${protocol.title}</h4>
                <p>${protocol.description || protocol.scenarioLabel || category}</p>
              </article>
            `;
          })
          .join("");

        return `
          <section>
            <div class="topbar-kicker" style="margin-bottom: 0.75rem;">${category}</div>
            <div class="domain-grid">${cards}</div>
          </section>
        `;
      })
      .join("");

    els.domainGrid.querySelectorAll(".domain-card").forEach((card) => {
      card.addEventListener("click", () => {
        const protocolId = card.dataset.protocolId;
        if (!protocolId) return;

        engine.setProtocol(protocolId);
        engine.setViewMode("step");
        treeEngine.invalidate();

        els.protocolSelect.value = protocolId;
        els.viewModeSelect.value = "step";

        renderAll();
        showView("step");
        saveState();
      });
    });
  }

  function renderProtocolHomeSummary() {
    const protocol = engine.getCurrentProtocol();

    if (!dynamicEls.protocolDescription || !dynamicEls.protocolSource) return;

    if (!protocol) {
      dynamicEls.protocolDescription.textContent =
        "Select a pathway to see protocol details.";
      dynamicEls.protocolSource.textContent = "Source: —";
      dynamicEls.protocolSource.className = "pill pill-neutral";
      return;
    }

    dynamicEls.protocolDescription.textContent =
      protocol.description || "No protocol description available.";

    dynamicEls.protocolSource.textContent = `Source: ${protocol.sourceLabel || "Clinical protocol"}`;
    dynamicEls.protocolSource.className = "pill pill-info";
  }

  function renderProtocolMeta() {
    const protocol = engine.getCurrentProtocol();
    const node = engine.getCurrentNode();

    if (!protocol) {
      els.protocolCategoryLabel.textContent = "Protocol";
      els.protocolTitle.textContent = "Select a protocol";
      els.scenarioLabel.textContent = "No scenario selected";
      els.urgencyLabel.textContent = "Ready";
      els.urgencyLabel.className = "pill pill-neutral";
      return;
    }

    els.protocolCategoryLabel.textContent = protocol.category || "Protocol";
    els.protocolTitle.textContent = protocol.title || "Untitled protocol";
    els.scenarioLabel.textContent = protocol.scenarioLabel || "Scenario";

    if (node && node.urgency) {
      els.urgencyLabel.textContent = node.urgency;
      els.urgencyLabel.className = `pill ${getUrgencyPillClass(node.urgency)}`;
    } else {
      els.urgencyLabel.textContent = "Ready";
      els.urgencyLabel.className = "pill pill-neutral";
    }
  }

  function renderStatus() {
    const node = engine.getCurrentNode();
    els.currentStepLabel.textContent = node ? node.title : "—";
    els.pathLengthLabel.textContent = String(engine.getPathLength());
    els.backBtn.disabled = !engine.canGoBack();
    els.restartBtn.disabled = !engine.getCurrentProtocol();
  }

  function renderStepCard() {
    const protocol = engine.getCurrentProtocol();
    const node = engine.getCurrentNode();

    if (!protocol || !node) {
      els.stepKicker.textContent = "Step";
      els.stepTitle.textContent = "Awaiting selection";
      els.stepText.textContent = "Select a protocol to begin.";
      els.stepUrgency.textContent = "—";
      els.stepUrgency.className = "pill pill-neutral";
      els.stepComplexity.textContent = "—";
      els.stepComplexity.className = "pill pill-neutral";
      els.alertsBox.innerHTML = "";
      els.actionsBox.innerHTML = "";
      els.optionsGrid.innerHTML = "";
      return;
    }

    const currentIndex =
      protocol.nodes.findIndex((protocolNode) => protocolNode.id === node.id) + 1;

    els.stepKicker.textContent = `Step ${currentIndex}`;
    els.stepTitle.textContent = node.title || "Untitled step";
    els.stepText.textContent = node.narrative || "";

    els.stepUrgency.textContent = node.urgency || "Standard";
    els.stepUrgency.className = `pill ${getUrgencyPillClass(node.urgency)}`;

    els.stepComplexity.textContent = node.complexity || "General";
    els.stepComplexity.className = "pill pill-neutral";

    els.alertsBox.innerHTML = (node.alerts || [])
      .map((alert) => `<div class="alert-item urgent">${alert}</div>`)
      .join("");

    els.actionsBox.innerHTML = (node.actions || [])
      .map((action) => `<div class="action-item">${action}</div>`)
      .join("");

    els.optionsGrid.innerHTML = "";

    (node.options || []).forEach((option) => {
      const button = document.createElement("button");
      button.className = "option-button";
      button.type = "button";

      button.innerHTML = `
        <span class="option-title">${option.label}</span>
        <span class="option-help">${option.hint || ""}</span>
      `;

      button.addEventListener("click", () => {
        engine.selectOption(option.next);
        treeEngine.invalidate();
        renderAll();
        saveState();
      });

      els.optionsGrid.appendChild(button);
    });
  }

  function renderPearls() {
    const protocol = engine.getCurrentProtocol();
    els.pearlsList.innerHTML = protocol
      ? (protocol.pearls || []).map((item) => `<li>${item}</li>`).join("")
      : "";
  }

  function renderPathSummary() {
    const historyNodes = engine.getHistoryNodes();

    els.pathSummary.innerHTML = historyNodes.length
      ? historyNodes
          .map((node, index) => `<li>${index + 1}. ${node.title}</li>`)
          .join("")
      : "<li>No active path yet.</li>";
  }

  function renderWsesTargets() {
    if (!dynamicEls.wsesCard) return;

    const targets = data.clinicalMeta && data.clinicalMeta.wsesTargets;
    const protocol = engine.getCurrentProtocol();

    if (!targets || !protocol) {
      dynamicEls.wsesCard.innerHTML =
        "<li>Select a protocol to view safety targets.</li>";
      return;
    }

    const shouldShow =
      protocol.id === "icu-general" || protocol.id === "surgery-ct";

    if (!shouldShow) {
      dynamicEls.wsesCard.innerHTML =
        "<li>WSES targets are most relevant in advanced ICU and advanced surgical pathways.</li>";
      return;
    }

    dynamicEls.wsesCard.innerHTML = [
      `MAP goal: ${targets.mapGoal}`,
      `Hb transfusion trigger: ${targets.hbTrigger}`,
      `PaO2 goal: ${targets.pao2Goal}`,
      `PaCO2 goal: ${targets.paco2Goal}`,
      `Platelets for hemorrhage: ${targets.plateletsHemorrhage}`,
      `Platelets for surgery: ${targets.plateletsSurgery}`,
      `Coagulation goal: ${targets.coagulationGoal}`,
      `Timing: ${targets.surgeryTiming}`,
      `Steroids: ${targets.corticosteroids}`,
      `DVT prophylaxis: ${targets.dvt}`
    ]
      .map((item) => `<li>${item}</li>`)
      .join("");
  }

  function renderTree(force = false) {
    const protocol = engine.getCurrentProtocol();
    minimap.render(protocol);

    if (!els.treeView.classList.contains("active") && !force) {
      return;
    }

    treeEngine.render(els.treeCanvas, force);
  }

  function renderAll(forceTree = false) {
    renderProtocolHomeSummary();
    renderProtocolMeta();
    renderStatus();
    renderStepCard();
    renderPearls();
    renderPathSummary();
    renderWsesTargets();

    const viewMode = engine.getViewMode();
    els.viewModeSelect.value = viewMode;

    if (!engine.getCurrentProtocol()) {
      showView("home");
      return;
    }

    showView(viewMode === "tree" ? "tree" : "step");

    if (viewMode === "tree") {
      renderTree(forceTree);
    } else {
      minimap.render(engine.getCurrentProtocol());
    }
  }

  function bindEvents() {
    els.protocolSelect.addEventListener("change", (event) => {
      engine.setProtocol(event.target.value);
      treeEngine.invalidate();
      renderAll(true);
      saveState();
    });

    els.viewModeSelect.addEventListener("change", (event) => {
      engine.setViewMode(event.target.value);

      if (event.target.value === "tree") {
        renderAll(true);
      } else {
        renderAll(false);
      }

      saveState();
    });

    els.homeBtn.addEventListener("click", () => {
      showView("home");
    });

    els.backBtn.addEventListener("click", () => {
      engine.goBack();
      treeEngine.invalidate();
      renderAll(false);
      saveState();
    });

    els.restartBtn.addEventListener("click", () => {
      engine.restart();
      treeEngine.invalidate();
      renderAll(false);
      saveState();
    });

    if (canvasControls) {
      els.zoomInBtn.addEventListener("click", () => {
        canvasControls.zoomIn();
      });

      els.zoomOutBtn.addEventListener("click", () => {
        canvasControls.zoomOut();
      });

      els.fitTreeBtn.addEventListener("click", () => {
        canvasControls.fit();
      });

      els.resetTreeBtn.addEventListener("click", () => {
        canvasControls.reset();
      });
    }
  }

  function init() {
    initDynamicRegions();
    populateProtocolSelect();
    renderDomainGrid();
    loadState();

    const currentProtocol = engine.getCurrentProtocol();

    if (currentProtocol) {
      els.protocolSelect.value = currentProtocol.id;
      els.viewModeSelect.value = engine.getViewMode();
    } else {
      const protocols = engine.getProtocols();
      if (protocols.length > 0) {
        els.protocolSelect.value = protocols[0].id;
      }
    }

    renderAll(true);
    bindEvents();
  }

  init();
})();