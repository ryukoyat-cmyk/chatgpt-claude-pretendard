const toggle = document.getElementById('enabled');
const status = document.getElementById('status');
const retry = document.getElementById('retry');
chrome.storage.local.get({enabled:true}).then(data => {
  toggle.checked = data.enabled; toggle.disabled = false;
  status.textContent = '설정은 크롬 재시작 후에도 유지됩니다.';
}).catch(() => {status.textContent = '설정을 읽지 못했습니다.';});
toggle.addEventListener('change', async () => {
  try {await chrome.storage.local.set({enabled:toggle.checked}); status.textContent = '설정이 저장되었습니다.';}
  catch {status.textContent = '저장 실패. 다시 시도해 주세요.';}
});
retry.addEventListener('click', async () => {
  retry.disabled = true; status.textContent = '글꼴을 준비하고 있습니다…';
  try {
    const result = await chrome.runtime.sendMessage({type:'getNotoFont'});
    if (!result?.font) throw new Error(result?.error);
    status.textContent = '글꼴 준비 완료. ChatGPT를 새로고침하세요.';
  } catch {status.textContent = '다운로드 실패. 인터넷 연결 후 다시 시도하세요.';}
  finally {retry.disabled = false;}
});
