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

      this.minScale = 0.4;
      this.maxScale = 2.5;
      this.zoomStep = 0.1;

      this.bindEvents();
      this.reset();
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

          const rect = this.stageElement.getBoundingClientRect();
          const mouseX = event.clientX - rect.left;
          const mouseY = event.clientY - rect.top;

          const oldScale = this.scale;
          const delta = event.deltaY < 0 ? this.zoomStep : -this.zoomStep;
          const newScale = Math.max(
            this.minScale,
            Math.min(this.maxScale, oldScale + delta)
          );

          if (newScale === oldScale) return;

          this.translateX =
            mouseX - ((mouseX - this.translateX) / oldScale) * newScale;
          this.translateY =
            mouseY - ((mouseY - this.translateY) / oldScale) * newScale;

          this.scale = newScale;
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

    reset() {
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.applyTransform();
    }

    fit() {
      if (!this.stageElement || !this.canvasElement) {
        this.reset();
        return;
      }

      const contentWidth = Math.max(this.canvasElement.scrollWidth, 1);
      const contentHeight = Math.max(this.canvasElement.scrollHeight, 1);
      const stageWidth = Math.max(this.stageElement.clientWidth, 1);
      const stageHeight = Math.max(this.stageElement.clientHeight, 1);

      const padding = 40;

      const scaleX = (stageWidth - padding * 2) / contentWidth;
      const scaleY = (stageHeight - padding * 2) / contentHeight;
      const fittedScale = Math.min(scaleX, scaleY, 1);

      this.scale = Math.max(this.minScale, Math.min(this.maxScale, fittedScale));

      const scaledWidth = contentWidth * this.scale;
      const scaledHeight = contentHeight * this.scale;

      this.translateX = Math.max((stageWidth - scaledWidth) / 2, 12);
      this.translateY = Math.max((stageHeight - scaledHeight) / 2, 12);

      this.applyTransform();
    }

    applyTransform() {
      if (!this.canvasElement) return;

      this.canvasElement.style.transformOrigin = "0 0";
      this.canvasElement.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
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
