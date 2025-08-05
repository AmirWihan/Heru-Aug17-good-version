// src/lib/registerServiceWorker.ts
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          // Registration successful
          // console.log('ServiceWorker registration successful:', registration);
        })
        .catch(error => {
          // Registration failed
          // console.error('ServiceWorker registration failed:', error);
        });
    });
  }
}
