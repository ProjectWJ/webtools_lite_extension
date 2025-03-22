import { byteCounter } from "../utils/byteCounter";

/** 웹툴 버튼(글자 수 세기, 대소문자 변환, 단위 변환...) */
document.getElementById("characterCount")?.addEventListener("click", () => {
  panelToggle("characterCountPanel");
});
document
  .getElementById("capitalSmallConvert")
  ?.addEventListener("click", () => {
    panelToggle("capitalSmallConvertPanel");
  });
document.getElementById("unitConvert")?.addEventListener("click", () => {
  panelToggle("unitConvertPanel");
});
document.getElementById("unmeralConvert")?.addEventListener("click", () => {
  panelToggle("unmeralConvertPanel");
});
document.getElementById("korEngConvert")?.addEventListener("click", () => {
  panelToggle("korEngConvertPanel");
});
document
  .getElementById("exchangeRateCalculate")
  ?.addEventListener("click", () => {
    panelToggle("exchangeRateCalculatePanel");
  });
document.getElementById("dateCalculate")?.addEventListener("click", () => {
  panelToggle("dateCalculatePanel");
});
document.getElementById("addressConvert")?.addEventListener("click", () => {
  panelToggle("addressConvertPanel");
});

/** 돌아가기 버튼 */
document.querySelectorAll(".backBtn").forEach((button) => {
  button.addEventListener("click", () => {
    panelToggle("tabPanel");
  });
});

/** 버튼 이벤트 토글 */
const panels = document.querySelectorAll("[id$=Panel]"); // Panel로 끝나는 단어 검색 $

function panelToggle(id: string) {
  panels.forEach((panel) => {
    if (panel.id === id) {
      panel.classList.remove("blind");
    } else {
      panel.classList.add("blind");
    }
  });
}

/** 옵션 */
const optionsBtn = document.getElementById("optionsBtn");

if (optionsBtn) {
  optionsBtn.addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      // openOptionsPage를 지원하지 않는 경우 (구버전 호환)
      window.open(chrome.runtime.getURL("src/options/options.html"));
    }
  });
}

/** 글자 수 세기 */
document
  .getElementById("characterCountTextarea")
  ?.addEventListener("input", characterCountAction);
function characterCountAction() {
  const textArea: HTMLTextAreaElement = document.getElementById(
    "characterCountTextarea"
  ) as HTMLTextAreaElement;
  const blankInclude: HTMLElement | null =
    document.getElementById("blankInclude");
  const blankIgnore: HTMLElement | null =
    document.getElementById("blankIgnore");

  if (textArea && blankInclude && blankIgnore) {
    const textValue: string = textArea.value;
    const textWithoutSpaces: string = textValue.replace(/\s+/g, "");

    blankInclude.innerText = `공백 포함 ${textValue.length} 자 | ${byteCounter(
      textValue,
      1
    )} Byte`;
    blankIgnore.innerText = `공백 미포함 ${
      textWithoutSpaces.length
    } 자 | ${byteCounter(textWithoutSpaces, 0)} Byte`;
  }
}
