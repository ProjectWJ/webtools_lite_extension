<!-- markdownlint-disable MD033 -->

# Webtools Lite

웹 페이지에서 유용하게 활용할 수 있는 다기능 도구 모음 확장 프로그램입니다.

## ✨ 주요 기능

### 📌 우클릭 메뉴

- **글자 수 세기**: 선택한 텍스트의 글자 수를 표시
- **색상 추출**: 현재 페이지를 스크린샷하여 색상 추출 탭으로 이동

<br />

### 📦 팝업 도구

- **글자 수 세기**: 입력한 텍스트의 글자 수 계산(공백 포함 / 제외)
- **대소문자 변환**: 대문자 ↔ 소문자 일괄 변환
- **단위 변환**: cm ↔ inch 등 단위 변환 지원
- **진수 변환**: 2진수 / 8진수 / 10진수 / 16진수 간 상호 변환
- **한영타 변환**: 한글 ↔ 영문 키보드 변환(QWERTY 전용)
- **통합 주소 검색**: Cloudflare Workers 기반 API로 주소 검색(대한민국 주소 전용)
- **색상 추출 (이미지 업로드)**: 업로드한 이미지에서 클릭한 픽셀 색상 추출

<br />

## 🔐 개인정보 보호

- 모든 기능은 기본적으로 **로컬에서 처리**되며 서버와 통신이 발생하는 기능은 **통합 주소 검색**에 한정됩니다.
- 통합 주소 검색 기능 이용 시 사용자의 브라우저 요청에 포함된 **IP 주소**, **User-Agent**, **요청 URL** 등의 정보가 **Cloudflare Workers 서버**에서 일시적으로 수집 및 처리됩니다.
- 이 정보는 Cloudflare의 정책에 따라 그곳에 **일정 기간 저장**됩니다. 분석·마케팅에 활용되지 않으며 오직 **보안 대응 및 품질 모니터링을 위해서만 사용**됩니다.
- 일시적으로 수집된 개인정보는 **제3자에게 제공되지 않으며** **외부 위탁도 이루어지지 않습니다.**
- 자세한 내용은 하단 링크의 개인정보처리방침을 확인해주세요.

<br />

## 🔧 기술 스택

- **TypeScript v5.8.2**
- **Bulma v1.0.4**
- **Vite v6.2.2**
- **Cloudflare Workers & Pages**

<br />

## 🌍 지원 브라우저

| 브라우저 | 지원 여부                    | 최소 지원 버전                   |
| -------- | ---------------------------- | -------------------------------- |
| Chrome   | <div align="center">✅</div> | v88 이상                         |
| Edge     | <div align="center">✅</div> | v88 이상                         |
| Brave    | <div align="center">✅</div> | v1.20 이상                       |
| Opera    | <div align="center">⚠️</div> | 공식 미지원(일부 동작할 수 있음) |
| Firefox  | <div align="center">❌</div> | 미지원                           |
| Safari   | <div align="center">❌</div> | 미지원                           |

> ℹ️ 이 확장 프로그램은 **Manifest V3(MV3)** 기반으로 개발되었습니다.  
> 크로뮴 기반 브라우저라도 **MV2 환경에서는 정상적으로 동작하지 않을 수 있습니다.**

<br />

## 🧩 스토어 설치 방법(현재 불가능)

1. [Webtools Lite Extension](https://chromewebstore.google.com/?hl=ko) 스토어 링크로 이동합니다.
2. 페이지 우측의 다운로드(확장 추가) 버튼을 클릭합니다.

<br />

## 📦 로컬 설치 방법

1. 이 저장소의 [Releases](https://github.com/ProjectWJ/webtools_lite_extension) 링크로 이동 후 원하는 버전을 다운로드합니다.
2. 각 브라우저별 확장 관리 페이지로 이동합니다.
   - Chrome: chrome://extensions/
   - Edge: edge://extensions/
   - Brave: brave://extensions/
3. Chrome, Brave 브라우저의 우측 상단, Edge 브라우저의 좌측 중단에 위치한 **개발자 모드를 활성화**합니다.
4. "압축 해제된 확장 프로그램을 로드"를 클릭하고 다운받은 폴더를 선택합니다.

<br />

## 🌐 링크

- 📝 [업데이트 내역](https://github.com/ProjectWJ/webtools_lite_extension/blob/main/changelog.md)
- 🔒 [개인정보처리방침](https://webtools-docs.projectwj.uk/privacy)

---

## 📜 라이선스

본 프로젝트는 [MIT License](./LICENSE)를 따릅니다.  
누구나 자유롭게 사용, 복사, 수정, 재배포할 수 있으며,  
수정 또는 재배포된 버전에서 발생하는 모든 문제에 대해서는 **원작자는 일절 책임지지 않습니다.**
