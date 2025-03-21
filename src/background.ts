// 단축키나 우클릭으로 작업 실행했을 때 여기서 진행

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "characterCount",
    title: "글자 수 세기",
    contexts: ["selection", "image"], // 사용자가 텍스트를 선택했을 때만 보이게
  });
});

chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => {
    if (info.menuItemId === "characterCount" && tab?.id) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => {
            const selection: Selection | null = window.getSelection();
            if (!selection || selection.rangeCount === 0) return "";

            const range: Range = selection.getRangeAt(0);
            const fragment: DocumentFragment = range.cloneContents();
            const div: HTMLDivElement = document.createElement("div");
            div.appendChild(fragment);

            // 선택된 텍스트의 끝 공백까지 포함한 정확한 값
            return div.textContent || "";
          },
        },
        (injectionResults) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }

          const accurateText: string = injectionResults?.[0]?.result || "";
          const textWithoutSpaces: string = accurateText.replace(/\s+/g, "");

          if (tab?.id) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: showModal,
              args: [accurateText, textWithoutSpaces],
            });
          }
        }
      );
    }
  }
);

// 모달을 화면에 표시하는 함수
function showModal(selectedText: string, textWithoutSpaces: string): void {
  // 모달 요소 생성
  const modal: HTMLDivElement = document.createElement("div");
  modal.style.position = "absolute";
  modal.style.backgroundColor = "#fff";
  modal.style.border = "1px solid #ccc";
  modal.style.padding = "10px";
  modal.style.borderRadius = "5px";
  modal.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  modal.style.fontSize = "14px";
  modal.style.zIndex = "9999";

  // 선택한 텍스트의 위치 찾기
  const selection: Selection | null = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range: Range = selection.getRangeAt(0);
    const rect: DOMRect = range.getBoundingClientRect();

    // 모달 위치 조정 (선택한 텍스트 바로 아래)
    modal.style.top = `${rect.bottom + window.scrollY + 5}px`;
    modal.style.left = `${rect.left + window.scrollX}px`;

    // 모달 내용 추가
    modal.innerHTML = `공백 포함 ${selectedText.length} 자 | ? Byte<br>
      공백 미포함 ${textWithoutSpaces.length} 자 | ? Byte`;

    /*       modal.textContent =
      `공백 포함 ${selectedText.length} 자 | ${byteCounter2(
        selectedText,
        1
      )} Byte<br>` +
      `공백 미포함 ${textWithoutSpaces.length} 자 | ${byteCounter2(
        textWithoutSpaces,
        0
      )} Byte`; */

    // 모달을 body에 추가
    document.body.appendChild(modal);

    // 모달 영역 외 클릭 시 모달 닫기
    const handleOutsideClick = (event: MouseEvent) => {
      const target: Node = event.target as Node;

      if (!modal.contains(target)) {
        document.body.removeChild(modal);
        document.removeEventListener("mousedown", handleOutsideClick);
      }
    };

    // 모달 영역 외 클릭 이벤트 감지
    document.addEventListener("mousedown", handleOutsideClick);
  }
}

// 중복 함수는 여기에 작성한다

// 바이트 계산기
// 출처 https://blog.naver.com/gytks4/222275082864
/* 
  function byteCounter(text: string): number {
  return new TextEncoder().encode(text).length;
} 유니코드 기준 UTF-8 인코딩 바이트 수를 구해줌
 옵션 선택형 UI로 구현할 수도 있음. 클래스 토글 구현 방법 채팅 참조
*/
/* function byteCounter2(text: string, blank: number = 0): number {
  let byte: number = 0;

  if (blank === 0) {
    // 공백이 미포함이면 미리 줄바꿈과 공백을 빈칸으로 처리
    text = text.replace(/\s+/g, "");
  }

  for (let i = 0; i < text.length; i++) {
    // 한글표현 정규식 : ㄱ-ㅎㅏ-ㅣ가-힣
    // 한자표현 정규식 : 一-龥
    // 일본어표현 정규식 : ぁ-ゔァ-ヴー々〆〤
    // 이 모든것을 /[]/ 안에 포함시켜서 연달아 써주면 "or" 처리됨
    // 한, 중, 일 언어라면, byte를 2 더해주고, 아니라면 1을 더해주고, 최종적으로 byte를 return
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣一-龥ぁ-ゔァ-ヴー々〆〤]/.test(text[i])) {
      byte = byte + 2;
    } else {
      byte++;
    }
  }
  return byte;
}
 */
