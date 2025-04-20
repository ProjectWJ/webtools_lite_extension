chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "character-count",
    title: "글자 수 세기",
    contexts: ["selection", "image"], // 사용자가 텍스트를 선택했을 때만 보이게
  });
});

chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => {
    if (info.menuItemId === "character-count" && tab?.id) {
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

    // byte 계산기. 모듈화 방안 찾아볼 것
    function byteCounter(text: string, blank: number = 0) {
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

    // 모달 내용 추가
    modal.innerText =
      `공백 포함 ${selectedText.length} 자 | ${byteCounter(
        selectedText,
        1
      )} Byte\n` +
      `공백 미포함 ${textWithoutSpaces.length} 자 | ${byteCounter(
        textWithoutSpaces,
        0
      )} Byte`;

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

/** 웹 페이지에서 색 추출하기 */
// 색 추출 우클릭 메뉴
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pick-color",
    title: "색 추출하기",
    contexts: ["all"],
  });
});

// 색 추출 이벤트 감지 및 실행
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "pick-color" && tab?.id) {
    chrome.tabs.captureVisibleTab({ format: "png" }, (dataURL) => {
      if (!dataURL) return;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id!;
        chrome.scripting.executeScript({
          target: { tabId },
          func: injectImageAndColorPicker,
          args: [dataURL],
        });
      });
    });
  }
});

// 색 추출 모드
function injectImageAndColorPicker(dataURL: string) {
  const exiting: HTMLElement | null = document.getElementById(
    "color-picker-overlay"
  );
  if (exiting) exiting.remove();

  // 스크롤바를 위한 wrapper 처리
  const wrapper: HTMLDivElement = document.createElement("div");
  wrapper.style.cssText = `
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background: white;
`;

  // 이미지, 캔버스 생성
  const overlay: HTMLDivElement = document.createElement("div");
  overlay.id = "color-picker-overlay";
  overlay.style.cssText = `
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d", {
    willReadFrequently: true,
  });
  const img: HTMLImageElement = new Image();

  img.src = dataURL;
  canvas.style.cursor = "crosshair"; // 커서 스타일 조정

  if (!ctx) {
    console.error("ctx가 null입니다.");
    return;
  }

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    // css 스타일 상에서 실제 보이는 크기도 동일하게
    canvas.style.width = `${img.width}px`;
    canvas.style.height = `${img.height}px`;

    ctx.drawImage(img, 0, 0);
  };

  // 모드 활성화
  wrapper.appendChild(canvas);
  overlay.appendChild(wrapper);
  document.body.appendChild(overlay);

  // esc 누르면 오버레이 닫기
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      overlay.remove();
      document.removeEventListener("keydown", escHandler);
    }
  };

  document.addEventListener("keydown", escHandler);

  // 색 추출 클릭 이벤트
  canvas.addEventListener("click", (e: MouseEvent) => {
    const rect: DOMRect = canvas.getBoundingClientRect();
    const x: number = Math.floor(e.clientX - rect.left);
    const y: number = Math.floor(e.clientY - rect.top);
    const pixel: Uint8ClampedArray = ctx.getImageData(x, y, 1, 1).data;
    const hex: string = `#${[pixel[0], pixel[1], pixel[2]]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")}`;

    // 모달 생성
    const modal: HTMLDivElement = document.createElement("div");
    modal.id = "color-picker-modal";
    modal.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      z-index: 1000000;
      font-family: sans-serif;
    `;

    // 라벨
    const label: HTMLSpanElement = document.createElement("span");
    label.innerText = "추출된 색상:";

    // 색상값
    const colorValue: HTMLElement = document.createElement("strong");
    colorValue.innerText = ` ${hex}`;
    colorValue.style.color = hex;
    colorValue.style.marginLeft = "6px";

    // 복사 버튼
    const copyButton: HTMLButtonElement = document.createElement("button");
    copyButton.id = "color-copy-btn";
    copyButton.innerText = "복사";
    copyButton.style.marginLeft = "12px";

    // 닫기 버튼
    const closeButton: HTMLButtonElement = document.createElement("button");
    closeButton.innerText = "✕";
    closeButton.style.cssText = `
        background: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        color: #666;
      `;
    closeButton.addEventListener("click", () => {
      modal.remove();
    });

    modal.appendChild(label);
    modal.appendChild(colorValue);
    modal.appendChild(copyButton);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);

    // 복사 이벤트
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(hex);
      copyButton.innerText = "복사됨!";
    });

    // 캔버스 제거
    overlay.remove();
    document.removeEventListener("keydown", escHandler); // 이 둘은 세트로 따라다녀야 함
  });
}

/*
  하얀 색상의 경우 글씨가 안 보이는 문제 있음
  -> 글씨는 검은색으로 표기하고, 한 쪽에 사각형을 만들어 그 안에 색상 표시
  반복적으로 색을 클릭할 경우 결과 창이 겹치는 문제 있음
  -> 포지션을 점점 위로 이동시켜야 할 것 같은데, 어떻게 해야 하는지는 찾아볼 것
  한 번의 클릭에 캔버스가 제거되는 불편함 있음
  -> 바깥 부분, x버튼, esc를 눌렀을 때 닫도록 하기
  마우스 우클릭 사용 불가한 환경에서 진입이 불가한 문제 있음
  -> 우클릭을 js 전역적으로 허용시키기, 단축키로 진입시키기 등등
*/

/*       // 토스트 표시
      const toast = document.createElement("div");
      // toast.textContent = `배경: ${bgColor} / 글자: ${textColor}`;
      Object.assign(toast.style, {
        position: "fixed",
        bottom: "20px",
        left: "20px",
        background: "#333",
        color: "#fff",
        padding: "10px",
        borderRadius: "8px",
        zIndex: "999999",
        fontSize: "14px",
      });
      document.body.appendChild(toast);

      setTimeout(() => toast.remove(), 3000); */
