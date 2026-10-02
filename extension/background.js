const URL_FONT = 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2';
let pending;
async function obtainFont() {
  const saved = await chrome.storage.local.get('fontBase64');
  if (saved.fontBase64) return saved.fontBase64;
  const response = await fetch(URL_FONT, {signal: AbortSignal.timeout(20000)});
  if (!response.ok) throw new Error('글꼴 다운로드 실패: ' + response.status);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > 6000000 || String.fromCharCode(...bytes.subarray(0,4)) !== 'wOF2') throw new Error('잘못된 글꼴 파일');
  let binary = '';
  for (let i=0; i<bytes.length; i+=8192) binary += String.fromCharCode(...bytes.subarray(i,i+8192));
  const fontBase64 = btoa(binary);
  await chrome.storage.local.set({fontBase64});
  return fontBase64;
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.type !== 'getFont') return;
  if (!pending) pending = obtainFont().finally(() => {pending = null;});
  pending.then(font => respond({font}), error => respond({error: error.message}));
  return true;
});
