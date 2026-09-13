/**
 * Background videos layered over a fallback image.
 *
 * Each `video[data-bg-video]` starts transparent so the image underneath is
 * what the visitor sees. The video only fades in once it is actually playing;
 * if it fails to load, autoplay is blocked or the user prefers reduced motion,
 * it stays hidden and the image remains as the background.
 *
 * Markup contract:
 *   <video data-bg-video autoplay muted loop playsinline preload="none"
 *          class="opacity-0 data-[ready]:opacity-100">
 *     <source src="…" type="video/mp4" />
 *   </video>
 */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const video of document.querySelectorAll<HTMLVideoElement>(
  'video[data-bg-video]',
)) {
  if (reducedMotion.matches) {
    video.pause();
    video.removeAttribute('autoplay');
    continue;
  }

  const show = () => video.toggleAttribute('data-ready', true);
  if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    show();
  } else {
    video.addEventListener('playing', show, { once: true });
  }
}
