(() => {
  const style = document.createElement('style');
  style.id = 'chatgpt-pretendard-auto-style';
  const css = `:root { --font-sans: "ChatGPTPretendardAuto", "Pretendard Variable", Pretendard, sans-serif !important; }
  html, body, body *:not(svg):not(svg *) { font-family: "ChatGPTPretendardAuto", "Pretendard Variable", Pretendard, sans-serif !important; }
  body *::before, body *::after { font-family: "ChatGPTPretendardAuto", "Pretendard Variable", Pretendard, sans-serif !important; }`;
  let enabled = true;
  function apply() {
    const next = enabled ? css : '';
    if (style.textContent !== next) style.textContent = next;
    if (!style.isConnected && document.documentElement) document.documentElement.append(style);
  }
  const observer = new MutationObserver(apply);
  observer.observe(document, {childList:true, subtree:true});
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) {enabled = changes.enabled.newValue !== false; apply();}
  });
  chrome.storage.local.get({enabled:true}).then(settings => {enabled = settings.enabled; apply();});
  apply();
  // Font bytes are loaded directly: no page-side CDN request or remote code.
  chrome.runtime.sendMessage({type:'getFont'}).then(async response => {
    if (!response?.font) throw new Error(response?.error || '글꼴을 불러올 수 없습니다.');
    const bytes = Uint8Array.from(atob(response.font), c => c.charCodeAt(0));
    const face = new FontFace('ChatGPTPretendardAuto', bytes.buffer, {weight:'100 900', style:'normal', display:'swap'});
    await face.load();
    document.fonts.add(face);
    apply();
  }).catch(error => console.warn('[ChatGPT Pretendard Auto]', error.message));
})();
