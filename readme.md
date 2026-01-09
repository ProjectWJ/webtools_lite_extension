<!-- markdownlint-disable MD033 -->

# Webtools Lite

웹 페이지에서 유용하게 활용할 수 있는 다기능 도구 모음 확장 프로그램입니다.

<br />

<p align="center">
   <img height="670" alt="preview_1" src="https://github.com/user-attachments/assets/27ee6cfa-8d5f-46c5-8650-83d05dd34c1e">
   <img height="670" alt="preview_2" src="https://github.com/user-attachments/assets/efceddf6-f4ba-4c09-936b-38eb96d008ad">
</p>

<br />

## ✨ 주요 기능

### 📌 우클릭 메뉴

- **글자 수 세기**: 선택한 텍스트의 글자 수를 표시
- **색상 추출**: 현재 페이지를 스크린샷하여 색상 추출 탭으로 이동

<br />

### 📦 팝업 도구

- **글자 수 세기**: 입력한 텍스트의 글자 수 계산(공백 포함 / 제외)
- **대소문자 변환**: 대문자 ↔ 소문자 일괄 변환(hello ↔ HELLO)
- **단위 변환**: cm ↔ inch 등 단위 변환 지원
- **진수 변환**: 2진수 / 8진수 / 10진수 / 16진수 간 상호 변환
- **한영타 변환**: 한글 ↔ 영문 키보드 변환(한국어 ↔ gksrnrdj)
- **통합 주소 검색**: [주소기반산업지원서비스 API](https://business.juso.go.kr/addrlink/main.do?cPath=99MM)로 도로명, 지번, 영문주소와 우편번호 제공(대한민국 주소 전용)
- **색상 추출 (이미지 업로드)**: 업로드한 이미지에서 클릭한 픽셀 색상 추출

<br />

## 🌍 지원 브라우저

| 브라우저 | 지원 여부                    | 비고                           |
| -------- | ---------------------------- | ------------------------------ |
| Chrome   | <div align="center">✅</div> | 지원 중                        |
| Edge     | <div align="center">✅</div> | 지원 중                        |
| Brave    | <div align="center">✅</div> | 지원 중                        |
| Opera    | <div align="center">⚠️</div> | 미지원이나 일부 동작할 수 있음 |
| Firefox  | <div align="center">❌</div> | 지원 계획 없음                 |
| Safari   | <div align="center">❌</div> | 지원 계획 없음                 |

> ℹ️ 이 확장 프로그램은 **Manifest V3(MV3)** 기반으로 개발되었습니다.  
> 크로뮴 기반 브라우저라도 MV2 환경이거나, 오래된 버전을 사용하는 경우 정상적으로 동작하지 않을 수 있습니다.

<br />

## 📦 로컬 설치 방법

1. 이 저장소의 [Releases](https://github.com/ProjectWJ/webtools_lite_extension/releases) 링크로 이동 후 원하는 버전을 다운로드합니다.
2. 압축을 풉니다. 이 때 한 폴더 안에 assets, img, src, manifest.json이 있어야 합니다.
3. 각 브라우저별 확장 관리 페이지로 이동합니다.
   - Chrome: chrome://extensions/
   - Edge: edge://extensions/
   - Brave: brave://extensions/
4. Chrome, Brave 브라우저의 우측 상단, Edge 브라우저의 좌측 중단에 위치한 **개발자 모드를 활성화**합니다.
5. "압축 해제된 확장 프로그램을 로드"를 클릭하고 manifest.json 파일이 위치한 폴더를 선택합니다.

<br />

## 🔧 기술 스택

- **TypeScript v5.8.2**
- **Bulma v1.0.4**
- **Vite v6.2.2**
- **Cloudflare Workers & Pages**

<br />

## 📁 주 디렉토리 구조

```
docs ------------------------ 이용약관, 개인정보처리방침
 ┗ privacy.html
src
 ┣ colorpicker -------------- 색 추출 기능 전담 페이지
 ┃ ┣ colorpicker.css
 ┃ ┣ colorpicker.html
 ┃ ┗ colorpicker.ts
 ┣ help --------------------- 도움말 문서(미사용)
 ┃ ┣ help.css
 ┃ ┣ help.html
 ┃ ┗ help.ts
 ┣ popup -------------------- 팝업 페이지 기능 담당
 ┃ ┣ popup.css
 ┃ ┣ popup.html
 ┃ ┣ popup.scss
 ┃ ┗ popup.ts
 ┣ setting ------------------ 설정, 정보 페이지
 ┃ ┣ setting.css
 ┃ ┣ setting.html
 ┃ ┗ setting.ts
 ┣ background.ts ------------ 우클릭, 단축키 지원 기능 담당
 ┣ content.ts
 ┗ import-bulma.ts
```
<br />

## 🔥 트러블슈팅

<details>
<summary><strong>1. 라이브러리 없이 한영 변환 오토마타 직접 구현</strong></summary>

### 외부 라이브러리 없는 한영 변환 오토마타 구현

**1. 배경 및 문제**
> 기존의 한글 ↔ 영문 변환 라이브러리들은 기능은 강력하지만 용량이 커서 가벼워야 하는 프로그램의 성능 최적화에 걸림돌이 되었습니다.  
> 한글 변환 라이브러리 사용 시 팝업이 열릴 때마다 불필요하게 방대한 코드를 파싱하고 실행해야 하는 문제가 있었습니다.  
> 확장 프로그램 특성상 즉각적인 초기 로딩이 중요하므로 메인 스레드 부하를 최소화하기 위해 라이브러리 제거를 결정했습니다.  
> 또한, 확장 프로그램의 보안 정책(CSP) 및 모듈 시스템 제약으로 인해 외부 라이브러리 의존성을 최소화할 필요가 있었습니다.  

**2. 해결 과정: 자소 분리/결합 로직 직접 구현**
> 공개된 기본 구현 원리와 외부 라이브러리에 작성된 한영 변환 로직을 참고하여 경량화된 변환 로직을 직접 설계했습니다.

* **QWERTY 매핑:** 영문 키보드 입력값과 한글 자모(ㄱ-ㅎ, ㅏ-ㅣ)를 1:1 연결하는 테이블 정의
* **자소 분리/결합:** 입력된 문자열을 자음과 모음으로 분리하고, 초성/중성/종성 조합 규칙에 따라 유니코드 문자로 합성하는 오토마타 로직 구현
* **복합 자모 처리:** 'ㄳ', 'ㅚ'와 같은 복합 자모가 입력될 경우와 그렇지 않은 경우를 분기 처리하여 정확도 개선

**3. 결과**
> * 외부 라이브러리 의존성 없이, 500줄 가량의 코드만으로 기능을 구현하여 확장 프로그램의 경량화를 달성했습니다.
> * 단순 변환뿐만 아니라 오타 수정 로직에 대한 제어권을 확보하여, 추후 기능 확장이 용이해졌습니다.

</details>

<details>
<summary><strong>2. Cloudflare Workers로 CORS 및 보안 이슈 해결</strong></summary>

### Cloudflare Workers를 활용한 CORS 해결 및 API 보안 강화

**1. 배경 및 문제**
> '통합 주소 검색' 기능을 위해 공공데이터 API를 사용해야 했습니다. 클라이언트(브라우저)에서 직접 API를 호출할 경우 두 가지 문제가 있었습니다.
> 1.  **CORS 정책 위반:** 브라우저 보안 정책으로 인해 외부 API 서버로의 직접 요청 차단
> 2.  **API Key 노출:** 클라이언트 코드에 인증 키가 포함되어 개발자 도구 등을 통해 키가 탈취될 위험 존재

**2. 해결 과정: Serverless 프록시 서버 구축**
> 별도의 백엔드 서버 구축 비용을 절감하면서도 보안을 확보하기 위해 Cloudflare Workers를 도입했습니다.

* **API Key 은닉:** 인증 키를 소스코드가 아닌 Cloudflare의 환경 변수로 안전하게 관리
* **요청 중계 (Proxy):** 클라이언트는 Workers로 요청을 보내고, Workers가 API 키를 헤더에 담아 주소기반산업지원서비스 서버로 요청을 대리 수행
* **CORS 헤더 설정:** Workers 응답 시 `Access-Control-Allow-Origin` 헤더를 추가하여 브라우저가 응답을 정상적으로 수신하도록 처리

**3. 결과**
> * **보안 사고 예방:** API Key의 외부 노출을 원천 차단하여 보안성을 확보했습니다.
> * **안정적인 서비스:** CORS 에러 없이 모든 사용자의 브라우저 환경에서 주소 검색 기능이 정상 작동하도록 만들었습니다.

</details>

<br />

## 🌐 링크

- 📝 [업데이트 내역](https://github.com/ProjectWJ/webtools_lite_extension/blob/main/changelog.md)
- 🔒 [개인정보처리방침](https://webtools-docs.projectwj.uk/privacy)

<br />

## 🔐 개인정보 보호

- 모든 기능은 기본적으로 **로컬에서 처리**되며 서버와 통신이 발생하는 기능은 **통합 주소 검색**에 한정됩니다.
- 통합 주소 검색 기능 이용 시 사용자의 브라우저 요청에 포함된 **IP 주소**, **User-Agent**, **요청 URL** 등의 정보가 **Cloudflare Workers 서버**에서 일시적으로 수집 및 처리됩니다.
- 이 정보는 Cloudflare의 정책에 따라 그곳에 **일정 기간 저장**됩니다. 분석·마케팅에 활용되지 않으며 오직 **보안 대응 및 품질 모니터링을 위해서만 사용**됩니다.
- 일시적으로 수집된 개인정보는 **제3자에게 제공되지 않으며** **외부 위탁도 이루어지지 않습니다.**
- 자세한 내용은 하단 링크의 개인정보처리방침을 확인해주세요.

<br />

---

## 📜 라이선스

본 프로젝트는 [MIT License](./LICENSE)를 따릅니다.  
누구나 자유롭게 사용, 복사, 수정, 재배포할 수 있으며,  
수정 또는 재배포된 버전에서 발생하는 모든 문제에 대해서는 **원작자는 일절 책임지지 않습니다.**
