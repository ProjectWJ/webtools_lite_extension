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
