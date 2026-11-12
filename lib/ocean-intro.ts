export const OCEAN_INTRO_SESSION_KEY = "gri-ocean-intro-seen";

// Runs in the head before the first paint, so the storefront cannot flash
// before hydration. Only static, application-owned values enter this script.
export const OCEAN_INTRO_BOOTSTRAP = `(() => {
  const root = document.documentElement;
  if (location.pathname !== '/' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.dataset.oceanIntro = 'skip';
    return;
  }
  try {
    if (sessionStorage.getItem('${OCEAN_INTRO_SESSION_KEY}')) {
      root.dataset.oceanIntro = 'skip';
      return;
    }
  } catch {}
  root.dataset.oceanIntro = 'pending';
  setTimeout(() => {
    if (root.dataset.oceanIntro === 'pending') root.dataset.oceanIntro = 'expired';
  }, 5000);
})();`;
