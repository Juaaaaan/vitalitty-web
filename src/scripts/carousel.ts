/**
 * <snap-carousel> — progressive enhancement over a CSS scroll-snap track.
 *
 * Without JS the slides remain a swipeable/scrollable strip. With JS it adds
 * prev/next buttons, dot navigation, and optional autoplay that pauses on
 * hover/focus and respects `prefers-reduced-motion`.
 *
 * Markup contract:
 *   <snap-carousel data-autoplay="6000">
 *     <div data-track> <div data-slide>…</div> … </div>
 *     <button data-prev>…</button> <button data-next>…</button>
 *     <div data-dots></div>
 *   </snap-carousel>
 */
class SnapCarousel extends HTMLElement {
  private track!: HTMLElement;
  private slides: HTMLElement[] = [];
  private dots: HTMLButtonElement[] = [];
  private index = 0;
  private timer: number | undefined;
  private paused = false;

  connectedCallback() {
    const track = this.querySelector<HTMLElement>('[data-track]');
    if (!track) return;
    this.track = track;
    this.slides = Array.from(
      track.querySelectorAll<HTMLElement>('[data-slide]'),
    );
    if (this.slides.length < 2) return;

    this.querySelector('[data-prev]')?.addEventListener('click', () =>
      this.go(this.index - 1),
    );
    this.querySelector('[data-next]')?.addEventListener('click', () =>
      this.go(this.index + 1),
    );
    this.buildDots();

    let scrollTimeout: number | undefined;
    this.track.addEventListener(
      'scroll',
      () => {
        window.clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => this.syncFromScroll(), 80);
      },
      { passive: true },
    );

    this.addEventListener('mouseenter', () => (this.paused = true));
    this.addEventListener('mouseleave', () => (this.paused = false));
    this.addEventListener('focusin', () => (this.paused = true));
    this.addEventListener('focusout', () => (this.paused = false));

    this.setAttribute('data-enhanced', '');
    this.update();
    this.startAutoplay();
  }

  disconnectedCallback() {
    window.clearInterval(this.timer);
  }

  private buildDots() {
    const container = this.querySelector<HTMLElement>('[data-dots]');
    if (!container) return;
    const label = this.getAttribute('data-dot-label') ?? 'Ir a la diapositiva';
    this.dots = this.slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `${label} ${i + 1}`);
      dot.addEventListener('click', () => this.go(i));
      container.appendChild(dot);
      return dot;
    });
  }

  private startAutoplay() {
    const delay = Number(this.getAttribute('data-autoplay'));
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!delay || reduced) return;
    this.timer = window.setInterval(() => {
      if (!this.paused && !document.hidden) this.go(this.index + 1);
    }, delay);
  }

  private go(i: number) {
    const count = this.slides.length;
    this.index = (i + count) % count;
    this.track.scrollTo({
      left: this.slides[this.index].offsetLeft - this.track.offsetLeft,
      behavior: 'smooth',
    });
    this.update();
  }

  private syncFromScroll() {
    const width = this.track.clientWidth || 1;
    const i = Math.round(this.track.scrollLeft / width);
    if (i !== this.index) {
      this.index = Math.max(0, Math.min(i, this.slides.length - 1));
      this.update();
    }
  }

  private update() {
    this.slides.forEach((slide, i) => {
      const active = i === this.index;
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    this.dots.forEach((dot, i) =>
      dot.setAttribute('aria-current', String(i === this.index)),
    );
  }
}

if (!customElements.get('snap-carousel')) {
  customElements.define('snap-carousel', SnapCarousel);
}
