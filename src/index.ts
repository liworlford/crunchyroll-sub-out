function initParent() {
  console.log(`[${location.host}] Crunchyroll SubOut started.`);

  const observer = new MutationObserver((_, observer) => {
    const wrapper = document.querySelector('.video-player-wrapper');
    if (wrapper) {
      wrapper.insertAdjacentHTML(
        'afterend',
        '<div id="crunchyroll-sub-out"></div>',
      );
      observer.disconnect();
      console.log(`[${location.host}] Observer disconnected.`);
    }
  });

  const contentEl = document.querySelector('#content');
  if (contentEl) {
    observer.observe(contentEl, {
      childList: true,
      subtree: true,
    });
  }

  window.addEventListener('message', (e) => {
    if (e.origin !== 'https://static.crunchyroll.com') return;

    if (typeof e.data === 'object' && e.data.type === 'subtitle') {
      const targetEl = document.querySelector('#crunchyroll-sub-out');
      if (targetEl) (targetEl as HTMLElement).innerText = e.data.subtitle;
    }
  });
}

function initChild() {
  console.log(`[${location.host}] Crunchyroll SubOut started.`);

  const targetEl = document.querySelector('#vilosVttJs');
  let exSubtitle = '';

  if (targetEl) {
    const observer = new MutationObserver(() => {
      if (!(targetEl as HTMLElement).innerText) return;

      if ((targetEl as HTMLElement).innerText !== exSubtitle) {
        window.parent.postMessage(
          { type: 'subtitle', subtitle: (targetEl as HTMLElement).innerText },
          'https://www.crunchyroll.com/watch/*',
        );
        exSubtitle = (targetEl as HTMLElement).innerText;
      }
    });

    observer.observe(targetEl, { childList: true, subtree: true });
  }
}

window.addEventListener('load', async () => {
  if (location.host === 'www.crunchyroll.com') initParent();
  if (location.host === 'static.crunchyroll.com') initChild();
});
