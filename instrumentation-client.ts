import posthog from 'posthog-js';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogUiHost = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST;

declare global {
  interface Window {
    __posthogButtonTrackingInitialized?: boolean;
  }
}

function getButtonLabel(button: HTMLElement): string {
  const ariaLabel = button.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  const text = button.textContent?.trim();
  if (text) {
    return text;
  }

  return 'unlabeled_button';
}

if (posthogKey && posthogHost) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    ui_host: posthogUiHost ?? 'https://us.posthog.com',
    defaults: '2026-01-30',
  });

  if (typeof window !== 'undefined' && !window.__posthogButtonTrackingInitialized) {
    window.__posthogButtonTrackingInitialized = true;

    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest('button, [role="button"]');
      if (!(button instanceof HTMLElement)) {
        return;
      }

      if (button.dataset.posthogTrack === 'false') {
        return;
      }

      posthog.capture('button_clicked', {
        button_label: getButtonLabel(button),
        path: window.location.pathname,
      });
    });
  }
}
