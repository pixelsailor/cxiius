/**
 * Progressive enhancement: `app.html` ships with `class="no-js"` on `<body>`.
 * When client JavaScript runs, drop that hook so CSS can target the JS-enabled state.
 */

/** True when DOM APIs are available (browser with JavaScript executing this code). */
export function isJavaScriptEnabled(): boolean {
  return typeof document !== 'undefined';
}

/** Removes the static `no-js` marker from `<body>` once scripts run. */
export function removeNoJsClassFromBody(): void {
  if (!isJavaScriptEnabled()) return;
  document.body.classList.remove('no-js');
}
