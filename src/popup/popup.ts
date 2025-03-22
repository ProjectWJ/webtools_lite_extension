/** 웹툴 버튼(글자 수 세기, 대소문자 변환, 단위 변환...) */
document.getElementById("character-count")?.addEventListener("click", () => {
  panelToggle("character-count-panel");
});
document
  .getElementById("capital-lower-convert")
  ?.addEventListener("click", () => {
    panelToggle("capital-lower-convert-panel");
  });
document.getElementById("unit-convert")?.addEventListener("click", () => {
  panelToggle("unit-convert-panel");
});
document.getElementById("unmeral-convert")?.addEventListener("click", () => {
  panelToggle("unmeral-convert-panel");
});
document.getElementById("kor-eng-convert")?.addEventListener("click", () => {
  panelToggle("kor-eng-convert-panel");
});
document
  .getElementById("exchange-rate-calculate")
  ?.addEventListener("click", () => {
    panelToggle("exchange-rate-calculate-panel");
  });
document.getElementById("date-calculate")?.addEventListener("click", () => {
  panelToggle("date-calculate-panel");
});
document.getElementById("address-convert")?.addEventListener("click", () => {
  panelToggle("address-convert-panel");
});

/** 돌아가기 버튼 */
document.querySelectorAll(".back-btn").forEach((button) => {
  button.addEventListener("click", () => {
    panelToggle("tab-panel");
  });
});

/** 버튼 이벤트 토글 */
const panels = document.querySelectorAll("[id$=-panel]"); // -panel로 끝나는 단어 검색 $

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
const optionsBtn = document.getElementById("options-btn");

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
  .getElementById("character-count-textarea")
  ?.addEventListener("input", characterCountAction);
function characterCountAction() {
  const textArea: HTMLTextAreaElement = document.getElementById(
    "character-count-textarea"
  ) as HTMLTextAreaElement;
  const blankInclude: HTMLElement | null =
    document.getElementById("blank-include");
  const blankIgnore: HTMLElement | null =
    document.getElementById("blank-ignore");

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

/** 대소문자 변환 */
document
  .getElementById("capital-lower-convert-textarea-input")
  ?.addEventListener("input", capitalLowerConvertAction);
document
  .getElementById("capital-lower-convert-select")
  ?.addEventListener("change", capitalLowerConvertAction);
function capitalLowerConvertAction() {
  const textAreaInput: HTMLTextAreaElement = document.getElementById(
    "capital-lower-convert-textarea-input"
  ) as HTMLTextAreaElement;
  const textAreaOutput: HTMLTextAreaElement = document.getElementById(
    "capital-lower-convert-textarea-output"
  ) as HTMLTextAreaElement;

  // 대문자, 소문자 선택
  const selectCapitalLower: HTMLElement | null = document.getElementById(
    "capital-lower-convert-select"
  );

  if ((selectCapitalLower as HTMLSelectElement)?.value === "capital") {
    textAreaOutput.innerHTML = textAreaInput.value.toUpperCase();
  } else {
    textAreaOutput.innerHTML = textAreaInput.value.toLowerCase();
  }
}

/** 단위 변환 */
