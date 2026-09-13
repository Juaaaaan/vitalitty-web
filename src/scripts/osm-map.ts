/**
 * <osm-map> — OpenStreetMap map rendered with Leaflet, loaded lazily when the
 * element scrolls into view.
 *
 * Replaces the openstreetmap.org embed iframe, whose attribution bar ("Reportar
 * un problema", "Hacer una donación", "Términos…") cannot be styled from
 * outside. The ODbL licence still requires crediting OpenStreetMap, so a
 * minimal attribution is kept.
 *
 * Markup contract:
 *   <osm-map data-lat="40.2385" data-lng="-3.3525" data-zoom="16"
 *            data-label="Vitalitty"></osm-map>
 */
class OsmMap extends HTMLElement {
  private observer: IntersectionObserver | undefined;

  connectedCallback() {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.observer?.disconnect();
          void this.render();
        }
      },
      { rootMargin: '200px' },
    );
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  private async render() {
    // Leaflet CSS is imported statically in MapEmbed.astro: a dynamic CSS
    // import here produced a preload reference to a file Vite never emitted.
    const { default: L } = await import('leaflet');

    const lat = Number(this.dataset.lat);
    const lng = Number(this.dataset.lng);
    const zoom = Number(this.dataset.zoom ?? 16);

    const map = L.map(this, {
      center: [lat, lng],
      zoom,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control
      .attribution({ prefix: false })
      .addAttribution(
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      )
      .addTo(map);

    const icon = L.divIcon({
      className: '',
      html: '<svg width="28" height="40" viewBox="0 0 28 40" aria-hidden="true"><path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0Z" fill="#5e6e4b"/><circle cx="14" cy="14" r="5" fill="#fff"/></svg>',
      iconSize: [28, 40],
      iconAnchor: [14, 40],
    });

    L.marker([lat, lng], {
      icon,
      title: this.dataset.label,
      keyboard: false,
    }).addTo(map);
  }
}

customElements.define('osm-map', OsmMap);
