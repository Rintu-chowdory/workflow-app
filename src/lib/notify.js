/* Minimal floating toast — no dependencies. */
let lastToast = 0

export function toast(message, isError = true) {
  const el = document.createElement('div')
  el.className = 'wf-toast' + (isError ? ' wf-toast-error' : '')
  el.textContent = message
  document.body.appendChild(el)
  requestAnimationFrame(() => el.classList.add('wf-toast-show'))
  const stamp = Date.now()
  lastToast = stamp
  setTimeout(() => {
    if (lastToast !== stamp) return
    el.classList.remove('wf-toast-show')
    setTimeout(() => el.remove(), 350)
  }, 4200)
}
