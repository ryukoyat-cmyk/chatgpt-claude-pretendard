# ChatGPT Noto Sans KR Auto

버전 1.1.0. ChatGPT 전용 Chrome 글꼴 변경 확장 프로그램입니다.

## 변경 사항

- Claude 적용 주소를 제거했습니다. Claude에서는 실행되지 않습니다.
- 글꼴을 Noto Sans KR로 변경했습니다.
- MutationObserver, 페이지 전체 탐색, getComputedStyle, 요소 속성 변경을 제거했습니다.
- 고정 CSS를 한 번 삽입하여 새로 추가되는 텍스트에도 브라우저가 규칙을 적용합니다.
- 전 요소 및 가상 요소의 강제 글꼴 변경을 제거했습니다. SVG, 수식, 코드, 명시적인 아이콘 요소는 직접 변경 대상에서 제외합니다.
- 글꼴을 비동기로 불러오며, 준비되기 전이나 실패 시 기존 글꼴을 유지합니다.
- 설정은 chrome.storage.local에, 글꼴은 확장 프로그램 CacheStorage에 보관합니다. 재시작 시 재사용합니다. 캐시는 브라우저의 저장소 정리로 삭제될 수 있으며 이때 다시 다운로드합니다.

## 설치 / 업데이트

1. 기존 버전을 비활성화하고 ChatGPT와 Claude 페이지를 새로고침합니다.
2. ZIP을 압축 해제합니다.
3. chrome://extensions에서 개발자 모드를 켭니다.
4. '압축해제된 확장 프로그램을 로드합니다'에서 manifest.json이 바로 들어 있는 extension 폴더를 선택합니다.
5. 새 확장 프로그램만 활성화하고 ChatGPT 페이지를 새로고침합니다.

기존 설치 폴더를 사용하려면 extension 안의 파일 전체를 새 파일로 교체하고 확장 프로그램의 새로고침 버튼을 누르세요. 이전 content.js만 교체하면 Claude 주소와 기존 글꼴 로더가 남으므로 안 됩니다. GitHub 업데이트는 수동 설치에 자동 반영되지 않습니다.
압축 해제한 폴더는 계속 보관하세요. 조직 정책으로 개발자 모드가 차단되면 이 설치 방법은 사용할 수 없습니다.

## 글꼴 다운로드

처음 한 번 인터넷 연결이 필요합니다. Google Fonts 저장소의 Noto Sans KR 가변 TTF를 jsDelivr에서 내려받습니다. 첫 다운로드는 파일 크기와 네트워크 상태에 따라 지연될 수 있으며 ChatGPT 작동을 기다리게 하는 방식은 사용하지 않습니다. 팝업의 '글꼴 준비 / 다시 시도'로 다시 준비할 수 있습니다. 내려받은 글꼴은 캐시에 고정되며 원본 저장소 변경이 자동 반영되지 않습니다.

## 적용 범위와 한계

일반 화면의 기본 글꼴과 제목, 본문, 입력창, font-sans 요소에 적용합니다. 아이콘, 코드, 수식 전용 글꼴을 전체 덮어쓰지 않습니다. 별도 iframe, Shadow DOM 내부와 일부 독자적인 글꼴 지정 영역에는 적용되지 않을 수 있습니다. ChatGPT 화면 구조 변경 시 조정이 필요할 수 있습니다.

## 개인정보

이름, 이메일, 대화 내용, 계정 정보는 수집하거나 전송하지 않습니다. 외부 요청은 글꼴 다운로드이며 CDN은 IP 주소 등 통상적인 네트워크 정보를 받을 수 있습니다. 배포 파일에는 사용자 식별 정보를 넣지 않았습니다.

## 검증

JavaScript 문법, ChatGPT만 지정한 manifest, 반복 탐색/감시 제거, 저장 설정 복원, 켜기/끄기, 다운로드 실패 시 CSS 미적용, 캐시 재사용 및 ZIP 구조를 검사했습니다. 실제 로그인한 ChatGPT에서 메시지 전송/답변 생성, 로딩 시간 비교, 아이콘 표시 및 크롬 종료/재시작을 검증하지는 못했습니다. 사용자 환경의 증상 해결을 보장하지 않습니다.

## 출처 / 라이선스

Noto Sans KR: Google Fonts / SIL Open Font License 1.1. 글꼴 바이너리는 이 ZIP과 저장소에 포함되지 않습니다.
- https://github.com/google/fonts/tree/main/ofl/notosanskr
- https://github.com/google/fonts/blob/main/ofl/notosanskr/OFL.txt
- https://developer.chrome.com/docs/extensions/reference/api/storage
