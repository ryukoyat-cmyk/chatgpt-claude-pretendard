const FONT_URL = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf';
const CACHE_NAME = 'chatgpt-noto-sans-kr-v1';
let pending;
async function obtainFont() {
  const cache = await caches.open(CACHE_NAME);
  let response = await cache.match(FONT_URL);
  if (!response) {
    response = await fetch(FONT_URL, {signal: AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error('글꼴 다운로드 실패');
    const bytes = new Uint8Array(await response.clone().arrayBuffer());
    if (bytes.length < 1000 || bytes.length > 16000000 || bytes[0] !== 0 || bytes[1] !== 1 || bytes[2] !== 0 || bytes[3] !== 0) throw new Error('잘못된 글꼴 파일');
    await cache.put(FONT_URL, response.clone());
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.type !== 'getNotoFont') return;
  if (!pending) pending = obtainFont().finally(() => {pending = null;});
  pending.then(font => respond({font}), error => respond({error: error.message}));
  return true;
});
chrome.runtime.onInstalled.addListener(() => {
  // Remove the obsolete font cache when upgrading from 1.0.x; keep settings.
  chrome.storage.local.remove('fontBase64').catch(() => {});
});
