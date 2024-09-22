window.addEventListener("load", async () => {
  if (location.host === 'www.crunchyroll.com') {
    console.log(`[${location.host}] Crunchyroll-subtitle started.`)

    const observer = new MutationObserver((mutationList, observer) => {
      const wrapper = document.querySelector('.video-player-wrapper')
      if (wrapper) {
        wrapper.insertAdjacentHTML('afterend', '<div id="crunchyroll-subtitle"></div>')
        observer.disconnect()
        console.log(`[${location.host}] Observer disconnected.`)
      } 
    });
    
    observer.observe(document.querySelector('#content'), { childList: true, subtree: true });

    window.addEventListener("message", (e) => {
      if (e.origin !== 'https://static.crunchyroll.com') return

      if (typeof e.data === 'object' && e.data.type === 'subtitle') {
        document.querySelector('#crunchyroll-subtitle').innerText = e.data.subtitle
      }
    });
  }

  if (location.host === 'static.crunchyroll.com') {
    console.log(`[${location.host}] Crunchyroll-subtitle started.`)

    const target = document.querySelector('#vilosVttJs');
    let exSubtitle = ''

    const observer = new MutationObserver((mutationList, observer) => {
      if (!target.innerText) return 

      if (target.innerText !== exSubtitle) {
        window.parent.postMessage({type: 'subtitle', subtitle: target.innerText}, 'https://www.crunchyroll.com/watch/*')
        exSubtitle = target.innerText
      }
    });
    
    observer.observe(target, { childList: true, subtree: true });
  }
});

