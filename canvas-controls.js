(function () {
  class CanvasControls {
    constructor(stageElement, canvasElement) {
      this.stageElement = stageElement;
      this.canvasElement = canvasElement;

      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;

      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;

      this.minScale = 0.5;
      this.maxScale = 2.5;
      this.zoomStep = 0.1;

      this.bindEvents();
      this.applyTransform();
    }

    bindEvents() {
      if (!this.stageElement || !this.canvasElement) return;

      this.canvasElement.addEventListener("mousedown", (event) => {
        this.isDragging = true;
        this.canvasElement.classList.add("dragging");

        this.dragStartX = event.clientX - this.translateX;
        this.dragStartY = event.clientY - this.translateY;
      });

      window.addEventListener("mousemove", (event) => {
        if (!this.isDragging) return;

        this.translateX = event.clientX - this.dragStartX;
        this.translateY = event.clientY - this.dragStartY;

        this.applyTransform();
      });

      window.addEventListener("mouseup", () => {
        this.isDragging = false;
        this.canvasElement.classList.remove("dragging");
      });

      this.stageElement.addEventListener(
        "wheel",
        (event) => {
          event.preventDefault();

          const direction = event.deltaY > 0 ? -1 : 1;
          const nextScale = this.scale + direction * this.zoomStep;

          this.scale = Math.min(this.maxScale, Math.max(this.minScale, nextScale));
          this.applyTransform();
        },
        { passive: false }
      );
    }

    zoomIn() {
      this.scale = Math.min(this.maxScale, this.scale + this.zoomStep);
      this.applyTransform();
    }

    zoomOut() {
      this.scale = Math.max(this.minScale, this.scale - this.zoomStep);
      this.applyTransform();
    }

    fit() {
      this.scale = 0.85;
      this.translateX = 24;
      this.translateY = 16;
      this.applyTransform();
    }

    reset() {
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.applyTransform();
    }

    applyTransform() {
      if (!this.canvasElement) return;

      this.canvasElement.style.transform =
        `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    }

    getState() {
      return {
        scale: this.scale,
        translateX: this.translateX,
        translateY: this.translateY
      };
    }
  }

  window.CanvasControls = CanvasControls;
})();