(() => {
  const css = `
    :root { --font-sans: "ChatGPTNotoSansKR", "Noto Sans KR", sans-serif; }
    body { font-family: "ChatGPTNotoSansKR", "Noto Sans KR", sans-serif; }
    :where(p, h1, h2, h3, h4, h5, h6, label, textarea, input, #prompt-textarea, .font-sans):not(svg):not(svg *):not(math):not(math *):not(.katex):not(.katex *):not(pre *):not(code *):not([aria-hidden="true"]):not([class*="icon"]):not([class*="Icon"]):not([class*="symbol"]):not([class*="glyph"]):not([class*="material-"]):not([class*="fa-"]):not([class*="ph-"]) {
        font-family: "ChatGPTNotoSansKR", "Noto Sans KR", sans-serif !important;
    }
  `.replace(/\n\s*:not/g, ':not');
  const style = document.createElement('style');
  style.id = 'chatgpt-noto-sans-kr-auto';
  let enabled = false;
  let loaded = false;
  let pending;
  function apply() {
    const next = enabled && loaded ? css : '';
    if (style.textContent !== next) style.textContent = next;
    if (next && !style.isConnected) (document.head || document.documentElement).append(style);
  }
  async function loadFont() {
    if (loaded || !enabled) return;
    if (pending) return pending;
    pending = (async () => {
      const response = await chrome.runtime.sendMessage({type:'getNotoFont'});
      if (!response?.font) throw new Error(response?.error || '글꼴을 불러올 수 없습니다.');
      const bytes = Uint8Array.from(atob(response.font), c => c.charCodeAt(0));
      const face = new FontFace('ChatGPTNotoSansKR', bytes.buffer, {weight:'100 900', style:'normal', display:'swap'});
      await face.load();
      document.fonts.add(face);
      loaded = true;
      apply();
    })().catch(error => console.warn('[ChatGPT Noto Sans KR]', error.message)).finally(() => {pending = null;});
    return pending;
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes.enabled) return;
    enabled = changes.enabled.newValue !== false;
    apply();
    loadFont();
  });
  chrome.storage.local.get({enabled:true}).then(settings => {
    enabled = settings.enabled;
    apply();
    loadFont();
  }).catch(error => console.warn('[ChatGPT Noto Sans KR]', error.message));
})();
