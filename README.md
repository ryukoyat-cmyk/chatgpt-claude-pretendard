# ChatGPT & Claude Pretendard Auto

ChatGPT와 Claude 웹사이트 전체에 Pretendard를 자동 적용하는 Chrome 확장 프로그램입니다.

## 기능

- 대화, 입력창, 메뉴, 코드 영역의 일반 텍스트에 Pretendard 적용
- 아이콘 전용 글꼴, SVG, 가상 요소의 원래 글꼴 보존
- 알 수 없는 사용자 지정 글꼴은 아이콘일 가능성을 고려해 유지
- 페이지 진입 시 자동 실행
- 사용 여부와 글꼴 파일을 `chrome.storage.local`에 저장하여 브라우저 재시작 후 재사용
- 켜기 / 끄기 및 글꼴 다운로드 재시도
- 처음 한 번 글꼴을 다운로드한 후 저장된 파일 재사용

## 설치

1. GitHub의 **Code → Download ZIP**을 선택하고 ZIP을 압축 해제합니다.
2. 크롬 주소창에 `chrome://extensions`를 입력합니다.
3. 기존 글꼴 변경 확장 프로그램을 비활성화합니다.
4. **개발자 모드**를 켭니다.
5. **압축해제된 확장 프로그램을 로드합니다**를 누릅니다.
6. 압축 해제한 저장소 폴더 안의 **`extension` 폴더**를 선택합니다. `manifest.json`이 바로 들어 있는 폴더입니다.
7. ChatGPT 또는 Claude 페이지를 새로고침합니다.

압축 해제한 폴더는 계속 보관해야 합니다. Chrome 114 이상을 대상으로 합니다.

## 1.0.1 업데이트

전체 요소와 가상 요소의 글꼴을 강제로 덮어쓰던 규칙을 제거했습니다. 일반 텍스트 요소만 선별하고 아이콘 글꼴을 보존합니다.

기존 설치 폴더의 `extension/content.js`와 `extension/manifest.json`을 새 파일로 교체한 뒤 `chrome://extensions`에서 확장 프로그램의 새로고침 버튼을 누르고, ChatGPT / Claude 페이지도 새로고침하세요. GitHub 파일 변경은 기존 수동 설치에 자동 반영되지 않습니다.

## 문제 해결

- **매니페스트를 로드할 수 없음:** 저장소 최상위 폴더가 아니라 `extension` 폴더를 선택했는지 확인합니다.
- **글꼴이 바뀌지 않음:** 확장 프로그램 팝업에서 **글꼴 준비 / 다시 시도**를 누른 뒤 페이지를 새로고침합니다. 처음 다운로드에는 인터넷 연결이 필요합니다.
- **다른 글꼴로 표시됨:** 다른 글꼴 변경 확장 프로그램을 비활성화합니다.
- 확장 프로그램을 제거하면 저장된 설정과 글꼴이 삭제됩니다.
- Chrome 자체의 주소창과 메뉴, 웹페이지 내 별도 iframe이나 닫힌 Shadow DOM 내부는 변경하지 않습니다.

## 개인정보 및 외부 연결

대화 내용, 이름, 이메일, 계정 정보는 수집하거나 전송하지 않습니다. 설정과 글꼴 파일만 확장 프로그램의 로컬 저장소에 보관합니다. 첫 다운로드 시 jsDelivr에 글꼴 요청이 발생하며, CDN은 통상적인 네트워크 정보(IP 주소 등)를 받을 수 있습니다.

## 검증 범위

JavaScript 문법 검사, 저장된 글꼴의 재사용, 저장된 비활성화 설정 복원, 켜기/끄기, MutationObserver의 반복 변경 방지를 모의 환경에서 검증했습니다. 1.0.1에서는 아이콘 전용 글꼴, 알 수 없는 ASCII 아이콘 글꼴, 숨김 아이콘, Private Use Area 글리프와 가상 요소 글꼴 보존 및 새 텍스트 적용을 모의 검증했습니다. 실제 ChatGPT / Claude 화면과 Chrome 종료 후 재시작 검증은 아직 수행하지 않았습니다.

## 글꼴 및 공식 자료

Pretendard 1.3.9 글꼴은 이 저장소에 포함되지 않으며 공식 npm 배포의 고정 버전을 jsDelivr에서 내려받습니다. 글꼴 라이선스는 SIL Open Font License 1.1입니다.

- [Pretendard](https://github.com/orioncactus/pretendard)
- [글꼴 라이선스](https://github.com/orioncactus/pretendard/blob/v1.3.9/LICENSE)
- [Chrome storage](https://developer.chrome.com/docs/extensions/reference/api/storage)
- [Chrome content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)
