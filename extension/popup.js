const toggle = document.getElementById('enabled');
const status = document.getElementById('status');
const retry = document.getElementById('retry');
chrome.storage.local.get({enabled:true,fontBase64:null}).then(data => {
 toggle.checked = data.enabled;
 status.textContent = data.fontBase64 ? '글꼴 저장 완료 · 재시작 후 자동 적용' : '처음 한 번 글꼴 다운로드가 필요합니다.';
});
toggle.addEventListener('change', async () => {
 try {await chrome.storage.local.set({enabled:toggle.checked}); status.textContent='설정이 저장되었습니다.';}
 catch {status.textContent='저장에 실패했습니다. 다시 시도해 주세요.';}
});
retry.addEventListener('click', async () => {
 retry.disabled=true;status.textContent='글꼴을 준비하고 있습니다…';
 try {
  const result=await chrome.runtime.sendMessage({type:'getFont'});
  if(result.error) throw new Error(result.error);
  status.textContent='글꼴 저장 완료. ChatGPT / Claude를 새로고침해 주세요.';
 } catch {status.textContent='다운로드 실패. 인터넷 연결 후 다시 시도해 주세요.';}
 finally {retry.disabled=false;}
});
