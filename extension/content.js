(() => {
  const style = document.createElement('style');
  style.id = 'chatgpt-pretendard-auto-style';
  const textAttr = 'data-pretendard-auto-text';
  const iconAttr = 'data-pretendard-auto-icon';
  const beforeAttr = 'data-pretendard-auto-before';
  const afterAttr = 'data-pretendard-auto-after';
  const css = `
    [${textAttr}] { font-family: "ChatGPTPretendardAuto", "Pretendard Variable", Pretendard, sans-serif !important; }
    [${iconAttr}] { font-family: var(--pretendard-auto-original) !important; }
    [${beforeAttr}]::before { font-family: var(--pretendard-auto-before) !important; }
    [${afterAttr}]::after { font-family: var(--pretendard-auto-after) !important; }
  `;
  const originals = new WeakMap();
  let enabled = false;
  let fontLoaded = false;
  const iconFonts = /icon|symbol|glyph|awesome|phosphor|material/i;
  const textFonts = /sans|serif|arial|inter|styrene|tiempos|geist|segoe|roboto|helvetica|noto|pretendard|monospace|courier|menlo|consolas|system-ui/i;
  const iconSelector = 'svg, svg *, math, math *, [role="img"], [aria-hidden="true"], [class*="icon"], [class*="Icon"], [class*="symbol"], [class*="glyph"], [class*="material-"], [class*="fa-"], [class*="ph-"]';
  function classify(el) {
    if (el === style || el.matches('html, body, script, style, link, meta, head, noscript')) return;
    let font = originals.get(el);
    if (!font) {
      font = getComputedStyle(el).fontFamily;
      originals.set(el, font);
    }
    // Freeze pseudo-element font families before changing their parent's font.
    for (const pseudo of ['before', 'after']) {
      const attr = pseudo === 'before' ? beforeAttr : afterAttr;
      if (el.hasAttribute(attr)) continue;
      const computed = getComputedStyle(el, '::' + pseudo);
      if (computed.content && !['none', 'normal', '""', "''"].includes(computed.content)) {
        el.style.setProperty('--pretendard-auto-' + pseudo, computed.fontFamily);
        el.setAttribute(attr, '');
      }
    }
    const directText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
    const primaryFont = font.split(',')[0].replace(/["']/g, '').trim();
    const isIcon = Boolean(el.closest(iconSelector)) || iconFonts.test(font) || /[\uE000-\uF8FF\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]/u.test(directText);
    if (isIcon) {
      el.removeAttribute(textAttr);
      if (!el.hasAttribute(iconAttr)) {
        el.style.setProperty('--pretendard-auto-original', font);
        el.setAttribute(iconAttr, '');
      }
      return;
    }
    el.removeAttribute(iconAttr);
    const isInput = el.matches('input:not([type="checkbox"]):not([type="radio"]), textarea');
    // Unknown custom fonts are left intact: they may encode icons as ASCII.
    if ((directText || isInput) && textFonts.test(primaryFont)) el.setAttribute(textAttr, '');
    else el.removeAttribute(textAttr);
  }
  function scan(root) {
    if (root.nodeType === 3) { if (root.parentElement) classify(root.parentElement); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.nodeType === 1) classify(root);
    root.querySelectorAll('*').forEach(classify);
  }
  function apply() {
    const next = enabled && fontLoaded ? css : '';
    if (style.textContent !== next) style.textContent = next;
    if (!style.isConnected && document.documentElement) document.documentElement.append(style);
  }
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.target === style) continue;
      if (record.type === 'characterData') scan(record.target);
      else {
        if (record.target.nodeType === 1) classify(record.target);
        record.addedNodes.forEach(scan);
      }
    }
    apply();
  });
  observer.observe(document, {childList:true, subtree:true, characterData:true});
  scan(document);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) { enabled = changes.enabled.newValue !== false; apply(); }
  });
  chrome.storage.local.get({enabled:true}).then(settings => {enabled = settings.enabled; apply();});
  chrome.runtime.sendMessage({type:'getFont'}).then(async response => {
    if (!response?.font) throw new Error(response?.error || '글꼴을 불러올 수 없습니다.');
    const bytes = Uint8Array.from(atob(response.font), c => c.charCodeAt(0));
    const face = new FontFace('ChatGPTPretendardAuto', bytes.buffer, {weight:'100 900', style:'normal', display:'swap'});
    await face.load();
    document.fonts.add(face);
    fontLoaded = true;
    apply();
  }).catch(error => console.warn('[ChatGPT Pretendard Auto]', error.message));
})();
