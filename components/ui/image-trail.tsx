"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import "./image-trail.css";

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect) {
  let clientX = 0;
  let clientY = 0;
  if ("touches" in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ("clientX" in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class ImageItem {
  DOM: { el: HTMLElement; inner: HTMLElement };
  defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
  rect: DOMRect | null = null;
  resize: () => void;

  constructor(DOM_el: HTMLElement) {
    this.DOM = {
      el: DOM_el,
      inner: DOM_el.querySelector(".image-trail__img-inner") as HTMLElement,
    };
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    this.getRect();
    window.addEventListener("resize", this.resize);
  }

  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }

  destroy() {
    window.removeEventListener("resize", this.resize);
  }
}

type Pointer = { x: number; y: number };

class ImageTrailVariant1 {
  container: HTMLElement;
  rafId: number | null = null;
  destroyed = false;
  images: ImageItem[];
  imagesTotal: number;
  imgPosition = 0;
  zIndexVal = 1;
  activeImagesCount = 0;
  isIdle = true;
  threshold = 80;
  mousePos: Pointer = { x: 0, y: 0 };
  lastMousePos: Pointer = { x: 0, y: 0 };
  cacheMousePos: Pointer = { x: 0, y: 0 };
  handlePointerMove: (ev: MouseEvent | TouchEvent) => void;
  initRender: (ev: MouseEvent | TouchEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.images = [...container.querySelectorAll<HTMLElement>(".image-trail__img")].map((img) => new ImageItem(img));
    this.imagesTotal = this.images.length;

    this.handlePointerMove = (ev) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener("mousemove", this.handlePointerMove);
    container.addEventListener("touchmove", this.handlePointerMove, { passive: true });

    this.initRender = (ev) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener("mousemove", this.initRender);
      container.removeEventListener("touchmove", this.initRender);
    };
    container.addEventListener("mousemove", this.initRender);
    container.addEventListener("touchmove", this.initRender);
  }

  render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    if (!this.imagesTotal) return;
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    const width = img.rect?.width ?? 0;
    const height = img.rect?.height ?? 0;

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - width / 2,
          y: this.cacheMousePos.y - height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          x: this.mousePos.x - width / 2,
          y: this.mousePos.y - height / 2,
        },
        0,
      )
      .to(
        img.DOM.el,
        {
          duration: 0.4,
          ease: "power3",
          opacity: 0,
          scale: 0.2,
        },
        0.4,
      );
  }

  destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.container.removeEventListener("mousemove", this.handlePointerMove);
    this.container.removeEventListener("touchmove", this.handlePointerMove);
    this.container.removeEventListener("mousemove", this.initRender);
    this.container.removeEventListener("touchmove", this.initRender);
    this.images.forEach((img) => {
      gsap.killTweensOf(img.DOM.el);
      img.destroy();
    });
  }

  onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

class ImageTrailVariant2 extends ImageTrailVariant1 {
  showNextImage() {
    if (!this.imagesTotal) return;
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    const width = img.rect?.width ?? 0;
    const height = img.rect?.height ?? 0;

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - width / 2,
          y: this.cacheMousePos.y - height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          x: this.mousePos.x - width / 2,
          y: this.mousePos.y - height / 2,
        },
        0,
      )
      .fromTo(
        img.DOM.inner,
        { scale: 2.8, filter: "brightness(250%)" },
        { duration: 0.4, ease: "power1", scale: 1, filter: "brightness(100%)" },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: "power2", opacity: 0, scale: 0.2 }, 0.45);
  }
}

class ImageTrailVariant3 extends ImageTrailVariant1 {
  showNextImage() {
    if (!this.imagesTotal) return;
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    const width = img.rect?.width ?? 0;
    const height = img.rect?.height ?? 0;

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          xPercent: 0,
          yPercent: 0,
          x: this.cacheMousePos.x - width / 2,
          y: this.cacheMousePos.y - height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          x: this.mousePos.x - width / 2,
          y: this.mousePos.y - height / 2,
        },
        0,
      )
      .fromTo(img.DOM.inner, { scale: 1.2 }, { duration: 0.4, ease: "power1", scale: 1 }, 0)
      .to(
        img.DOM.el,
        {
          duration: 0.6,
          ease: "power2",
          opacity: 0,
          scale: 0.2,
          xPercent: () => gsap.utils.random(-30, 30),
          yPercent: -200,
        },
        0.6,
      );
  }
}

class ImageTrailVariant4 extends ImageTrailVariant1 {
  render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    if (!this.imagesTotal) return;
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    const width = img.rect?.width ?? 0;
    const height = img.rect?.height ?? 0;

    gsap.killTweensOf(img.DOM.el);

    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }
    dx *= distance / 100;
    dy *= distance / 100;

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - width / 2,
          y: this.cacheMousePos.y - height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          x: this.mousePos.x - width / 2,
          y: this.mousePos.y - height / 2,
        },
        0,
      )
      .fromTo(
        img.DOM.inner,
        {
          scale: 2,
          filter: `brightness(${Math.max((400 * distance) / 100, 100)}%) contrast(${Math.max((400 * distance) / 100, 100)}%)`,
        },
        { duration: 0.4, ease: "power1", scale: 1, filter: "brightness(100%) contrast(100%)" },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: "power3", opacity: 0 }, 0.4)
      .to(img.DOM.el, { duration: 1.5, ease: "power4", x: `+=${dx * 110}`, y: `+=${dy * 110}` }, 0.05);
  }
}

class ImageTrailVariant5 extends ImageTrailVariant1 {
  lastAngle = 0;

  render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    if (!this.imagesTotal) return;
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (angle > 90 && angle <= 270) angle += 180;
    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    const startAngle = isMovingClockwise ? angle - 10 : angle + 10;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }
    dx *= distance / 150;
    dy *= distance / 150;

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    const width = img.rect?.width ?? 0;
    const height = img.rect?.height ?? 0;
    gsap.killTweensOf(img.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          filter: "brightness(80%)",
          scale: 0.1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - width / 2,
          y: this.cacheMousePos.y - height / 2,
          rotation: startAngle,
        },
        {
          duration: 1,
          ease: "power2",
          scale: 1,
          filter: "brightness(100%)",
          x: this.mousePos.x - width / 2 + dx * 70,
          y: this.mousePos.y - height / 2 + dy * 70,
          rotation: this.lastAngle,
        },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: "expo", opacity: 0 }, 0.5)
      .to(img.DOM.el, { duration: 1.5, ease: "power4", x: `+=${dx * 120}`, y: `+=${dy * 120}` }, 0.05);
  }
}

class ImageTrailVariant6 extends ImageTrailVariant1 {
  render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  mapSpeedToSize(speed: number, minSize: number, maxSize: number) {
    const maxSpeed = 200;
    return minSize + (maxSize - minSize) * Math.min(speed / maxSpeed, 1);
  }

  mapSpeedToBrightness(speed: number, minB: number, maxB: number) {
    const maxSpeed = 70;
    return minB + (maxB - minB) * Math.min(speed / maxSpeed, 1);
  }

  mapSpeedToBlur(speed: number, minBlur: number, maxBlur: number) {
    const maxSpeed = 90;
    return minBlur + (maxBlur - minBlur) * Math.min(speed / maxSpeed, 1);
  }

  mapSpeedToGrayscale(speed: number, minG: number, maxG: number) {
    const maxSpeed = 90;
    return minG + (maxG - minG) * Math.min(speed / maxSpeed, 1);
  }

  showNextImage() {
    if (!this.imagesTotal) return;
    const dx = this.mousePos.x - this.cacheMousePos.x;
    const dy = this.mousePos.y - this.cacheMousePos.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    const width = img.rect?.width ?? 0;
    const height = img.rect?.height ?? 0;

    const scaleFactor = this.mapSpeedToSize(speed, 0.3, 2);
    const brightnessValue = this.mapSpeedToBrightness(speed, 0, 1.3);
    const blurValue = this.mapSpeedToBlur(speed, 20, 0);
    const grayscaleValue = this.mapSpeedToGrayscale(speed, 600, 0);

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - width / 2,
          y: this.cacheMousePos.y - height / 2,
        },
        {
          duration: 0.8,
          ease: "power3",
          scale: scaleFactor,
          filter: `grayscale(${grayscaleValue * 100}%) brightness(${brightnessValue * 100}%) blur(${blurValue}px)`,
          x: this.mousePos.x - width / 2,
          y: this.mousePos.y - height / 2,
        },
        0,
      )
      .fromTo(img.DOM.inner, { scale: 2 }, { duration: 0.8, ease: "power3", scale: 1 }, 0)
      .to(img.DOM.el, { duration: 0.4, ease: "power3.in", opacity: 0, scale: 0.2 }, 0.45);
  }
}

function getNewPosition(position: number, offset: number, arr: unknown[]) {
  const realOffset = Math.abs(offset) % arr.length;
  if (position - realOffset >= 0) {
    return position - realOffset;
  }
  return arr.length - (realOffset - position);
}

class ImageTrailVariant7 extends ImageTrailVariant1 {
  visibleImagesCount = 0;
  visibleImagesTotal = 9;

  constructor(container: HTMLElement) {
    super(container);
    this.visibleImagesTotal = Math.min(this.visibleImagesTotal, Math.max(this.imagesTotal - 1, 0));
  }

  render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    if (!this.imagesTotal) return;
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    const width = img.rect?.width ?? 0;
    const height = img.rect?.height ?? 0;
    ++this.visibleImagesCount;

    gsap.killTweensOf(img.DOM.el);
    const scaleValue = gsap.utils.random(0.5, 1.6);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          scale: scaleValue - Math.max(gsap.utils.random(0.2, 0.6), 0),
          rotationZ: 0,
          opacity: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - width / 2,
          y: this.cacheMousePos.y - height / 2,
        },
        {
          duration: 0.4,
          ease: "power3",
          scale: scaleValue,
          rotationZ: gsap.utils.random(-3, 3),
          x: this.mousePos.x - width / 2,
          y: this.mousePos.y - height / 2,
        },
        0,
      );

    if (this.visibleImagesCount >= this.visibleImagesTotal) {
      const lastInQueue = getNewPosition(this.imgPosition, this.visibleImagesTotal, this.images);
      const oldImg = this.images[lastInQueue];
      gsap.to(oldImg.DOM.el, {
        duration: 0.4,
        ease: "power4",
        opacity: 0,
        scale: 1.3,
        onComplete: () => {
          if (this.activeImagesCount === 0) {
            this.isIdle = true;
          }
        },
      });
    }
  }

  onImageDeactivated() {
    this.activeImagesCount--;
  }
}

class ImageTrailVariant8 extends ImageTrailVariant1 {
  rotation = { x: 0, y: 0 };
  cachedRotation = { x: 0, y: 0 };
  zValue = 0;
  cachedZValue = 0;

  showNextImage() {
    if (!this.imagesTotal) return;
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = this.mousePos.x - centerX;
    const relY = this.mousePos.y - centerY;

    this.rotation.x = -(relY / centerY) * 30;
    this.rotation.y = (relX / centerX) * 30;
    this.cachedRotation = { ...this.rotation };

    const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const proportion = distanceFromCenter / maxDistance;
    this.zValue = proportion * 1200 - 600;
    this.cachedZValue = this.zValue;
    const normalizedZ = (this.zValue + 600) / 1200;
    const brightness = 0.2 + normalizedZ * 2.3;

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    const width = img.rect?.width ?? 0;
    const height = img.rect?.height ?? 0;
    gsap.killTweensOf(img.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .set(this.container, { perspective: 1000 }, 0)
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          z: 0,
          scale: 1 + this.cachedZValue / 1000,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - width / 2,
          y: this.cacheMousePos.y - height / 2,
          rotationX: this.cachedRotation.x,
          rotationY: this.cachedRotation.y,
          filter: `brightness(${brightness})`,
        },
        {
          duration: 1,
          ease: "expo",
          scale: 1 + this.zValue / 1000,
          x: this.mousePos.x - width / 2,
          y: this.mousePos.y - height / 2,
          rotationX: this.rotation.x,
          rotationY: this.rotation.y,
        },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: "power2", opacity: 0, z: -800 }, 0.3);
  }
}

const variantMap: Record<number, new (container: HTMLElement) => ImageTrailVariant1> = {
  1: ImageTrailVariant1,
  2: ImageTrailVariant2,
  3: ImageTrailVariant3,
  4: ImageTrailVariant4,
  5: ImageTrailVariant5,
  6: ImageTrailVariant6,
  7: ImageTrailVariant7,
  8: ImageTrailVariant8,
};

type ImageTrailProps = {
  items?: string[];
  variant?: number;
};

export function ImageTrail({ items = [], variant = 1 }: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const signature = items.join("\0");

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let instance: InstanceType<(typeof variantMap)[number]> | null = null;

    const sync = () => {
      instance?.destroy();
      instance = null;
      if (!desktop.matches || !motion.matches) return;
      const Cls = variantMap[variant] || variantMap[1];
      instance = new Cls(node);
    };

    sync();
    desktop.addEventListener("change", sync);
    motion.addEventListener("change", sync);

    return () => {
      desktop.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
      instance?.destroy();
    };
  }, [variant, signature]);

  return (
    <div className="image-trail" ref={containerRef} aria-hidden="true">
      {items.map((url, i) => (
        <div className="image-trail__img" key={i}>
          <div className="image-trail__img-inner" style={{ backgroundImage: `url(${url})` }} />
        </div>
      ))}
    </div>
  );
}
