import "bulma/css/bulma.min.css";
import "./popup.scss";
import "./popup.css";

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
document
  .getElementById("number-system-convert")
  ?.addEventListener("click", () => {
    panelToggle("number-system-convert-panel");
  });
document
  .getElementById("hangul-alphabet-convert")
  ?.addEventListener("click", () => {
    panelToggle("hangul-alphabet-convert-panel");
  });
document.getElementById("full-juso-finder")?.addEventListener("click", () => {
  panelToggle("full-juso-finder-panel");
});
document.getElementById("color-picker")?.addEventListener("click", () => {
  panelToggle("color-picker-panel");
});

/** 개인정보처리방침 및 이용약관 */
const openInNewTab = (url: string) => {
  chrome.tabs.create({ url });
};

/** 돌아가기 버튼 */
document.querySelectorAll(".back-btn").forEach((button) => {
  button.addEventListener("click", () => {
    panelToggle("tab-panel");
  });
});

/** 버튼 이벤트 토글 */
const panels = document.querySelectorAll("[id$=-panel]"); // -panel로 끝나는 단어 검색 $
/* const termsPrivacyContainer = document.getElementById(
  "terms-privacy-container"
); */

function panelToggle(id: string) {
  panels.forEach((panel) => {
    if (panel.id === id) {
      panel.classList.remove("blind");
      // panel.className = "";
    } else {
      panel.classList.add("blind");
      // panel.className = "blind";
    }
  });
  // 패널 변경 시 실행할 자동 프로세스
  // 글자 수 세기
  if (id === "character-count-panel") {
    autoFocus(id); // 인풋창에 자동 포커스
  }
  // 대소문자 변환
  else if (id === "capital-lower-convert-panel") {
    autoFocus(id);
  }
  // 단위 변환
  else if (id === "unit-convert-panel") {
    autoFocus(id);
  }
  // 진수 변환
  else if (id === "number-system-convert-panel") {
    autoFocus(id);
  }
  // 한영타 변환
  else if (id === "hangul-alphabet-convert-panel") {
    autoFocus(id);
  }
  // 통합 주소 검색
  else if (id === "full-juso-finder-panel") {
    // fullJusoFinderAutoFocus(); // 검색창에 자동 포커스
    // body에 global-width class 제거
    if (document.body.classList.contains("global-width")) {
      document.body.classList.remove("global-width");
    }
    autoFocus(id);
  }
  // 색 추출
  else if (id === "color-picker-panel") {
  }

  // 통합 주소 검색 패널 아니면 body에 global-width class 추가
  if (
    document
      .getElementById("full-juso-finder-panel")
      ?.classList.contains("blind")
  ) {
    document.body.className = "global-width";
  }
}

/** 자동 포커스 */
function autoFocus(panelId: string) {
  // 글자 수 세기
  if (panelId === "character-count-panel") {
    const textArea: HTMLTextAreaElement = document.getElementById(
      "character-count-textarea"
    ) as HTMLTextAreaElement;
    if (textArea) {
      textArea.focus();
    }
  }
  // 대소문자 변환
  else if (panelId === "capital-lower-convert-panel") {
    const textArea: HTMLTextAreaElement = document.getElementById(
      "capital-lower-convert-textarea-input"
    ) as HTMLTextAreaElement;
    if (textArea) {
      textArea.focus();
    }
  }
  // 단위 변환
  else if (panelId === "unit-convert-panel") {
    const selectBox: HTMLElement | null = document.getElementById(
      "unit-convert-selectbox"
    );
    if (selectBox) {
      selectBox.focus();
    }
  }
  // 진수 변환
  else if (panelId === "number-system-convert-panel") {
    const input: HTMLInputElement = document.getElementById(
      "decimal-input"
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }
  // 한영타 변환
  else if (panelId === "hangul-alphabet-convert-panel") {
    const input: HTMLInputElement = document.getElementById(
      "hangul-alphabet-convert-input-kor"
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }
  // 통합 주소 검색
  else if (panelId === "full-juso-finder-panel") {
    const input: HTMLInputElement = document.getElementById(
      "full-juso-finder-input"
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }
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

/** 사용법 & 도움말 */
const helpBtn = document.getElementById("help-btn");

if (helpBtn) {
  helpBtn.addEventListener("click", () => {
    window.open(chrome.runtime.getURL("src/help/help.html"));
  });
}

/** 글자 수 세기 */
document
  .getElementById("character-count-textarea")
  ?.addEventListener("input", characterCountAction);
document
  .getElementById("character-count-reset")
  ?.addEventListener("click", characterCountReset);
/* document
  .getElementById("character-count-zoom")
  ?.addEventListener("click", characterCountZoom); */

// 초기화
function characterCountReset() {
  const textArea: HTMLTextAreaElement = document.getElementById(
    "character-count-textarea"
  ) as HTMLTextAreaElement;
  const clearMessage: HTMLSpanElement = document.getElementById(
    "character-count-reset-message"
  ) as HTMLSpanElement;

  if (textArea.value === "") return;

  textArea.value = "";
  clearMessage.innerText = "초기화되었습니다.";
  clearMessage.className = "char-count-clear-message";
  setTimeout(() => {
    clearMessage.innerText = "";
    clearMessage.classList.remove("char-count-clear-message");
  }, 2000);

  characterCountAction();
}

// 크게 보기
/* function characterCountZoom() {
  const textArea: HTMLTextAreaElement = document.getElementById(
    "character-count-textarea"
  ) as HTMLTextAreaElement;
  const modalView: HTMLDivElement = document.getElementById(
    "character-count-zoom-view"
  ) as HTMLDivElement;
  const modalSpan: HTMLSpanElement = document.getElementById(
    "character-count-zoom-modal-content"
  ) as HTMLSpanElement;
  const inputvalue: string = textArea.value;

  modalSpan.innerText = inputvalue;

  if (modalView) {
    modalView.classList.remove("blind");
  }
  console.log(inputvalue);
} */

// 글자 수 세기 액션
function characterCountAction() {
  const textArea: HTMLTextAreaElement = document.getElementById(
    "character-count-textarea"
  ) as HTMLTextAreaElement;
  const blankInclude: HTMLElement | null =
    document.getElementById("blank-include");
  const blankIncludeByte: HTMLElement | null =
    document.getElementById("blank-include-byte");
  const blankIgnore: HTMLElement | null =
    document.getElementById("blank-ignore");
  const blankIgnoreByte: HTMLElement | null =
    document.getElementById("blank-ignore-byte");

  if (
    textArea &&
    blankInclude &&
    blankIncludeByte &&
    blankIgnore &&
    blankIgnoreByte
  ) {
    const textValue: string = textArea.value;
    const textWithoutSpaces: string = textValue.replace(/\s+/g, "");

    blankInclude.innerText = textValue.length.toString();
    blankIncludeByte.innerText = ` 자 | ${byteCounter(textValue, 1)} byte`;

    blankIgnore.innerText = textWithoutSpaces.length.toString();
    blankIgnoreByte.innerText = ` 자 | ${byteCounter(
      textWithoutSpaces,
      0
    )} byte`;
  }
}

// 바이트 계산
function byteCounter(text: string, blank: number = 0) {
  let byte: number = 0;

  if (blank === 0) {
    // 공백 제외면 미리 줄바꿈과 공백을 빈칸으로 처리
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
document
  .getElementById("capital-lower-convert-btn-capital")
  ?.addEventListener("click", capitalLowerConvertSelect);
document
  .getElementById("capital-lower-convert-btn-lower")
  ?.addEventListener("click", capitalLowerConvertSelect);
document
  .getElementById("capital-lower-convert-reset")
  ?.addEventListener("click", capitalLowerConvertReset);
document
  .getElementById("capital-lower-convert-copy")
  ?.addEventListener("click", capitalLowerConvertCopy);

// 대소문자 변환 액션
function capitalLowerConvertAction() {
  const textAreaInput: HTMLTextAreaElement = document.getElementById(
    "capital-lower-convert-textarea-input"
  ) as HTMLTextAreaElement;
  const textAreaOutput: HTMLTextAreaElement = document.getElementById(
    "capital-lower-convert-textarea-output"
  ) as HTMLTextAreaElement;

  const capitalbtn: HTMLElement | null = document.getElementById(
    "capital-lower-convert-btn-capital"
  );
  const lowerbtn: HTMLElement | null = document.getElementById(
    "capital-lower-convert-btn-lower"
  );

  if (!capitalbtn || !lowerbtn) {
    return;
  }

  if (capitalbtn.classList.contains("is-active")) {
    textAreaOutput.innerText = textAreaInput.value.toUpperCase();
  } else {
    textAreaOutput.innerText = textAreaInput.value.toLowerCase();
  }
}

// 변환 선택
function capitalLowerConvertSelect(event: Event) {
  const capitalbtn: HTMLElement | null = document.getElementById(
    "capital-lower-convert-btn-capital"
  );
  const lowerbtn: HTMLElement | null = document.getElementById(
    "capital-lower-convert-btn-lower"
  );

  if (!capitalbtn || !lowerbtn) {
    return;
  }

  if (event.target === capitalbtn) {
    capitalbtn.classList.add("is-active");
    lowerbtn.classList.remove("is-active");
  } else if (event.target === lowerbtn) {
    lowerbtn.classList.add("is-active");
    capitalbtn.classList.remove("is-active");
  }

  capitalLowerConvertAction();
}

// 복사
function capitalLowerConvertCopy() {
  const textAreaOutput: HTMLTextAreaElement = document.getElementById(
    "capital-lower-convert-textarea-output"
  ) as HTMLTextAreaElement;

  if (!textAreaOutput) return;
  if (textAreaOutput.value === "") return;

  navigator.clipboard.writeText(textAreaOutput.value).then(() => {
    const copyMessage: HTMLElement | null = document.getElementById(
      "capital-lower-convert-message"
    );

    if (!copyMessage) return;

    copyMessage.innerText = "복사되었습니다.";
    copyMessage.className = "copy-message-fadeinout";

    setTimeout(() => {
      copyMessage.innerText = "";
      copyMessage.classList.remove("copy-message-fadeinout");
    }, 2000);
  });
}

// 초기화
function capitalLowerConvertReset() {
  const textAreaInput: HTMLTextAreaElement = document.getElementById(
    "capital-lower-convert-textarea-input"
  ) as HTMLTextAreaElement;
  const copyMessage: HTMLElement | null = document.getElementById(
    "capital-lower-convert-message"
  );

  if (textAreaInput.value === "") return;

  textAreaInput.value = "";
  capitalLowerConvertAction();

  if (!copyMessage) return;

  copyMessage.innerText = "초기화되었습니다.";
  copyMessage.className = "copy-message-fadeinout";

  setTimeout(() => {
    copyMessage.innerText = "";
    copyMessage.classList.remove("copy-message-fadeinout");
  }, 2000);
}

/** 단위 변환 */
type conversionRecord = Record<string, number>;

const unitConvertCategory: string[] = [
  "길이",
  "면적",
  "부피",
  "속도",
  "시간",
  "압력",
  "에너지",
  "연비",
  "온도",
  "주파수",
  "질량",
  "평면각",
  "데이터 크기",
  "데이터 전송 속도",
];
// 길이(미터 기준)
const lengthConversion: conversionRecord = {
  킬로미터: 1000,
  미터: 1,
  센티미터: 0.01,
  밀리미터: 0.001,
  마이크로미터: 0.000001,
  나노미터: 0.000000001,
  마일: 1609.34,
  야드: 0.9144,
  피트: 0.3048,
  인치: 0.0254,
  해리: 1852,
};
// 면적(제곱미터 기준)
const areaConversion: conversionRecord = {
  제곱킬로미터: 1_000_000,
  제곱미터: 1,
  제곱마일: 2_589_988.11,
  제곱야드: 0.836127,
  제곱피트: 0.092903,
  제곱인치: 0.00064516,
  헥타르: 10_000,
  에이커: 4046.86,
};
// 부피(리터 기준)
const volumeConversion: conversionRecord = {
  "미국 액량 갤런": 3.78541,
  "미국 액량 쿼트": 0.946353,
  "미국 액량 파인트": 0.473176,
  "미국 컵": 0.24,
  "미국 플루이드 온스": 0.0295735,
  "미국 테이블스푼": 0.0147868,
  "미국 티스푼": 0.00492892,
  세제곱미터: 1000,
  리터: 1,
  밀리리터: 0.001,
  "영국 갤런": 4.54609,
  "영국 쿼트": 1.13652,
  "영국 파인트": 0.568261,
  "영국 컵": 0.284131,
  "영국 플루이드 온스": 0.0284131,
  "영국 테이블스푼": 0.0177582,
  "영국 티스푼": 0.00591939,
  세제곱피트: 28.3168,
  세제곱인치: 0.0163871,
};
// 속도(미터/초 기준)
const speedConversion: conversionRecord = {
  "시간당 마일": 0.44704,
  "초당 피트": 0.3048,
  "미터 매 초": 1,
  "킬로미터 매 시": 0.277778,
  노트: 0.514444,
};
// 시간(초 기준)
const timeConversion: conversionRecord = {
  나노초: 0.000000001,
  마이크로초: 0.000001,
  밀리초: 0.001,
  초: 1,
  분: 60,
  시간: 3600,
  일: 86400,
  주: 604800,
  개월: 2_629_746, // 평균 30.44일
  역년: 31_556_952, // 평균 365.2425일
  연대: 315_569_520, // 10년
  세기: 3_155_695_200, // 100년
};
// 압력(파스칼 기준)
const pressureConversion: conversionRecord = {
  기압: 101325,
  바: 100000,
  "제곱인치 당 파운드힘": 6894.76,
  토르: 133.322,
  파스칼: 1,
};
// 에너지(줄 기준)
const energyConversion: conversionRecord = {
  줄: 1,
  킬로줄: 1000,
  그램칼로리: 4.184,
  킬로칼로리: 4184,
  와트시: 3600,
  킬로와트시: 3_600_000,
  전자볼트: 1.60218e-19,
  "영국 열 단위": 1055.06,
  섬: 1055055852.62,
  풋파운드: 1.35582,
};
// 연비
const fuelEfficiencyConversion: conversionRecord = {
  "갤런 당 마일": 0.425144,
  "영국 갤런 당 마일": 0.354006,
  "리터 당 킬로미터": 1,
  "100 킬로미터 당 리터": 100,
};
// 온도(비율 전환 불가. 따로 함수 사용해야 함)
const temperatureConversion: string[] = ["섭씨", "화씨", "켈빈"];
// 주파수(헤르츠 기준)
const frequencyConversion: conversionRecord = {
  헤르츠: 1,
  킬로헤르츠: 1000,
  메가헤르츠: 1_000_000,
  기가헤르츠: 1_000_000_000,
};
// 질량(킬로그램 기준)
const massConversion: conversionRecord = {
  "메트릭 톤": 1000,
  킬로그램: 1,
  그램: 0.001,
  밀리그램: 0.000001,
  마이크로그램: 0.000000001,
  롱톤: 1016.05,
  "미국 톤": 907.184,
  스톤: 6.35029,
  파운드: 0.453592,
  온스: 0.0283495,
};
// 평면각(라디안 기준)
const angleConversion: conversionRecord = {
  그레이드: 0.015708,
  도: Math.PI / 180,
  라디안: 1,
  밀리라디안: 0.001,
  분각: Math.PI / 10800,
  초: Math.PI / 648000,
};
// 데이터 크기(바이트 기준)
const dataSizeConversion: conversionRecord = {
  비트: 0.125,
  바이트: 1,
  킬로바이트: 1000,
  메가바이트: 1_000_000,
  기가바이트: 1_000_000_000,
  테라바이트: 1_000_000_000_000,
};
// 데이터 전송 속도(초당 비트 기준)
const dataTransferRateConversion: conversionRecord = {
  "초당 비트": 1,
  "초당 킬로비트": 1_000,
  "초당 킬로바이트": 8_000,
  "초당 키비비트": 1_024,
  "초당 메가비트": 1_000_000,
  "초당 메가바이트": 8_000_000,
  "초당 메비비트": 1_048_576, // 1024^2
  "초당 기가비트": 1_000_000_000,
  "초당 기가바이트": 8_000_000_000,
  "초당 기비비트": 1_073_741_824, // 1024^3
  "초당 테라비트": 1_000_000_000_000,
  "초당 테라바이트": 8_000_000_000_000,
  "초당 테비비트": 1_099_511_627_776, // 1024^4
};

const unitOptions: HTMLElement = document.getElementById(
  "unit-options"
) as HTMLElement;
const unitDetailOptionsLeft: HTMLElement = document.getElementById(
  "unit-detail-options-left"
) as HTMLElement;
const unitDetailOptionsRight: HTMLElement = document.getElementById(
  "unit-detail-options-right"
) as HTMLElement;
unitDetailOptionsLeft.addEventListener("click", unitDetailOptionsEvent);
unitDetailOptionsRight.addEventListener("click", unitDetailOptionsEvent);
let fromInput: string = "default";
let toInput: string = "default";
let fromSelect: string = "default";
let toSelect: string = "default";
let selectedUnit: string[] = []; // 현재 선택된 대단위의 소단위 배열
document
  .getElementById("unit-convert-selectbox")
  ?.addEventListener("mousedown", unitConvertSelectBoxToggle);
document
  .getElementById("unit-convert-selectbox")
  ?.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") unitConvertSelectBoxToggle();
  });
document.addEventListener("mousedown", unitConvertSearchboxOutsideClick);
document.addEventListener("mousedown", unitConvertDetailSearchboxOutsideClick);
document
  .getElementById("unit-filter")
  ?.addEventListener("input", unitFilterAction);
document
  .getElementById("unit-filter")
  ?.addEventListener("keydown", filterEnterAction);
document
  .getElementById("unit-detail-filter-left")
  ?.addEventListener("input", unitDetailFilterAction);
document
  .getElementById("unit-detail-filter-right")
  ?.addEventListener("input", unitDetailFilterAction);
document
  .getElementById("unit-detail-filter-left")
  ?.addEventListener("keydown", detailFilterEnterAction);
document
  .getElementById("unit-detail-filter-right")
  ?.addEventListener("keydown", detailFilterEnterAction);
document
  .getElementById("unit-convert-detail-select-leftbox")
  ?.addEventListener("mousedown", unitDetailSearchBoxToggle);
document
  .getElementById("unit-convert-detail-select-leftbox")
  ?.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") unitDetailSearchBoxToggle(e);
  });
document
  .getElementById("unit-convert-detail-select-rightbox")
  ?.addEventListener("mousedown", unitDetailSearchBoxToggle);
document
  .getElementById("unit-convert-detail-select-rightbox")
  ?.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") unitDetailSearchBoxToggle(e);
  });
document
  .getElementById("unit-convert-detail-input-left")
  ?.addEventListener("input", unitDetailInputAction);
const unitLeftSelect: HTMLElement | null = document.getElementById(
  "unit-convert-detail-select-left"
);
document
  .getElementById("unit-convert-detail-input-right")
  ?.addEventListener("input", unitDetailInputAction);
const unitRightSelect: HTMLElement | null = document.getElementById(
  "unit-convert-detail-select-right"
);

// 소단위 input에 값 입력 시
function unitDetailInputAction(e: Event) {
  // 이벤트 타겟
  const target = e.target;
  if (target === null) {
    console.error("event target이 null입니다.");
    return;
  }

  let fromInputId: string = "";
  let value: number;

  // 입력 이벤트의 경우
  if (e instanceof InputEvent) {
    // 어느 input에서 입력되었는지, 값은 무엇인지 확인
    fromInputId = (target as HTMLElement).id;
    fromInput = (target as HTMLInputElement).value;
    value = parseFloat(fromInput);

    // 입력된 input값이 없거나 숫자가 아니면 그대로 반환. 개선 필요?
    if (fromInput === "" || fromInput === null) {
      const unitLeftInput = document.getElementById(
        "unit-convert-detail-input-left"
      ) as HTMLInputElement | null;
      if (unitLeftInput) {
        unitLeftInput.value = "";
      }
      const unitRightInput = document.getElementById(
        "unit-convert-detail-input-right"
      ) as HTMLInputElement | null;
      if (unitRightInput) {
        unitRightInput.value = "";
      }
      return;
    }
    if (isNaN(value)) {
      console.error("입력값이 숫자가 아닙니다.");
      return;
    }
  }
  // 소단위 select가 바뀐 경우(클릭, 키보드)
  // input에 value가 있을 때 이 함수가 실행되도록 했음
  else if (e instanceof PointerEvent || e instanceof KeyboardEvent) {
    fromInputId = "left";

    const unitLeftInput = document.getElementById(
      "unit-convert-detail-input-left"
    ) as HTMLInputElement | null;

    if (unitLeftInput) {
      fromInput = unitLeftInput.value;
    }
    value = parseFloat(fromInput);
  } else {
    console.error("지원하는 이벤트값을 벗어났습니다.");
    return;
  }

  // input값이 입력된 곳에 따라 같은 방향의 select가 from이 된다
  if (fromInputId.includes("left")) {
    fromSelect = document.getElementById("unit-convert-detail-select-left")
      ?.innerText as string;
    toSelect = document.getElementById("unit-convert-detail-select-right")
      ?.innerText as string;
  } else if (fromInputId.includes("right")) {
    fromSelect = document.getElementById("unit-convert-detail-select-right")
      ?.innerText as string;
    toSelect = document.getElementById("unit-convert-detail-select-left")
      ?.innerText as string;
  } else {
    console.error("fromInput을 판별할 수 없습니다.");
    return;
  }

  // 카테고리 판별
  const unitSelectElement = document.getElementById("unit-convert-select-unit");
  if (unitSelectElement === null) {
    console.error("unit-convert-select-unit값을 찾을 수 없습니다.");
    return;
  }
  const currentCategory: string = unitSelectElement.innerText;

  // 결과 계산
  let result;
  if (currentCategory === "온도") {
    result = convertTemperature(value, fromSelect, toSelect);
  } else {
    const conversionTables = switchConversion(currentCategory);
    result = convertUnit(value, fromSelect, toSelect, conversionTables);
  }

  // 적용
  toInput = result.toString();
  if (fromInputId.includes("left")) {
    const resultDOM = document.getElementById(
      "unit-convert-detail-input-right"
    ) as HTMLInputElement;
    resultDOM.value = toInput;
  } else {
    const resultDOM = document.getElementById(
      "unit-convert-detail-input-left"
    ) as HTMLInputElement;
    resultDOM.value = toInput;
  }
}

// 대단위 카테고리 토글
function unitConvertSelectBoxToggle() {
  const unitConvertSearchbox: HTMLElement = document.getElementById(
    "unit-convert-searchbox"
  ) as HTMLElement;

  if (unitConvertSearchbox.classList.contains("blind")) {
    unitConvertSearchbox.classList.remove("blind");
  } else {
    unitConvertSearchbox.classList.add("blind");
  }
}

// 외부 클릭 시 닫기
function unitConvertSearchboxOutsideClick(event: MouseEvent) {
  const selectBox: HTMLElement | null = document.getElementById(
    "unit-convert-selectbox"
  );
  const searchBox: HTMLElement | null = document.getElementById(
    "unit-convert-searchbox"
  );

  // 클릭된 요소가 selectBox나 searchBox 내부인지 확인
  if (
    selectBox?.contains(event.target as Node) ||
    searchBox?.contains(event.target as Node)
  ) {
    // 내부 클릭은 무시하고 함수 종료
    return;
  }

  // 외부 클릭이라면 searchBox를 닫기
  if (searchBox && !searchBox.classList.contains("blind")) {
    searchBox.classList.add("blind");
  }
}

// 검색창에 입력 시 필터링
function unitFilterAction(this: HTMLElement, e: Event) {
  let newUnitCategory: string[] = [];
  let searchWord: string = (e.target as HTMLInputElement)?.value;
  unitOptions.innerText = ""; // 기존 목록 초기화

  if (searchWord.length > 0) {
    newUnitCategory = unitConvertCategory.filter((data: string) =>
      data.startsWith(searchWord)
    );
  } else {
    newUnitCategory = unitConvertCategory;
  }

  const listItems: HTMLElement[] = newUnitCategory.map(
    (data: string, index: number) => {
      const li = document.createElement("li");
      li.id = `unit-option-item-${index}`;
      li.className = "unit-option-item";
      li.innerText = data;
      return li;
    }
  );
  unitOptions.innerText = ""; // 기존 목록 초기화
  unitOptions.append(...listItems);
}

// unit-filter에서 엔터키 눌렀을 때
function filterEnterAction(e: KeyboardEvent) {
  if (e.key === "Enter") {
    const inputValue: string = (
      document.getElementById("unit-filter") as HTMLInputElement
    ).value;

    if (unitConvertCategory.includes(inputValue)) {
      unitOptionsClick(inputValue);
    }
  }
}

// 대단위 선택 시 처리해야 할 작업
function unitOptionsClick(selectedText: string) {
  // 검색창 비우기
  const unitFilter: HTMLElement | null = document.getElementById("unit-filter");
  if (unitFilter) {
    (unitFilter as HTMLInputElement).value = "";
  }
  // 카테고리 초기화 및 목록 닫기
  allUnitCategoryShow();
  unitConvertSelectBoxToggle();

  // 선택한 단위 표시하기
  const selectUnit: HTMLElement | null = document.getElementById(
    "unit-convert-select-unit"
  );
  if (selectUnit) {
    selectUnit.innerText = selectedText;
  }

  // 소단위 초기 세팅하기
  let settingRecord: conversionRecord = lengthConversion; // 처음에는 길이로
  let tempRecord: string[] = temperatureConversion; // 온도는 따로 처리해야 함

  settingRecord = switchConversion(selectedText);

  if (selectUnit && selectUnit.innerText === "온도") {
    // 온도는 따로 처리
    // 소단위 카테고리 초기화 후 배치
    allDetailCategoryShow(tempRecord);
    selectedUnit = tempRecord;

    if (unitLeftSelect) unitLeftSelect.innerText = tempRecord[0];
    if (unitRightSelect) unitRightSelect.innerText = tempRecord[1];
  } else {
    // 기준점이 되는 단위를 찾아 왼쪽에 배치, 기준점 바로 아래쪽 항목을 오른쪽에 배치
    // 기준점 찾기
    const keys: string[] = Object.keys(settingRecord);
    const datumPoint: number = keys.findIndex(
      (key) => settingRecord[key] === 1
    );
    const index: number = datumPoint !== -1 ? datumPoint : 0; // 찾지 못하면 첫 번째 항목을 기준점으로 설정

    // 소단위 카테고리 초기화
    allDetailCategoryShow(keys);
    selectedUnit = keys;

    // 배치
    if (index + 1 !== keys.length) {
      if (unitLeftSelect) unitLeftSelect.innerText = keys[index];
      if (unitRightSelect) unitRightSelect.innerText = keys[index + 1];
    } else {
      if (unitLeftSelect) unitLeftSelect.innerText = keys[index];
      if (unitRightSelect) unitRightSelect.innerText = keys[0];
    }
  }

  // 소단위 input 비우기
  const unitConvertDetailInputLeft = document.getElementById(
    "unit-convert-detail-input-left"
  ) as HTMLInputElement;
  const unitConvertDetailInputRight = document.getElementById(
    "unit-convert-detail-input-right"
  ) as HTMLInputElement;
  if (unitConvertDetailInputLeft) {
    unitConvertDetailInputLeft.value = "";
  }
  if (unitConvertDetailInputRight) {
    unitConvertDetailInputRight.value = "";
  }
}

// 처음에 길이 보여주게 하기
unitOptionsClick("길이");

// 모든 대단위 카테고리 초기화
function allUnitCategoryShow() {
  const listItems: HTMLElement[] = unitConvertCategory.map(
    (data: string, index: number) => {
      const li = document.createElement("li");
      li.id = `unit-option-item-${index}`;
      li.className = "unit-option-item";
      li.innerText = data;
      return li;
    }
  );
  unitOptions.innerText = ""; // 기존 목록 초기화
  unitOptions.append(...listItems);
}

// 처음에 모든 대단위 카테고리 초기화하기
allUnitCategoryShow();

// 이벤트 위임을 통한 클릭 이벤트 처리
unitOptions.addEventListener("click", (event) => {
  const target: HTMLElement = event.target as HTMLElement;

  // unit-option-item을 가진 li 요소만 선택되도록
  if (
    target.tagName === "LI" &&
    unitOptions.contains(target) &&
    target.classList.contains("unit-option-item")
  ) {
    unitOptionsClick(target.textContent || "");
  }
});

// 계산 실행
function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  conversionTable: Record<string, number>
): number {
  return (value * conversionTable[fromUnit]) / conversionTable[toUnit];
}

// 계산 실행(온도 변환)
function convertTemperature(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  if (fromUnit === toUnit) return value;

  if (fromUnit === "섭씨") {
    if (toUnit === "화씨") return value * 1.8 + 32;
    if (toUnit === "켈빈") return value + 273.15;
  }
  if (fromUnit === "화씨") {
    if (toUnit === "섭씨") return (value - 32) / 1.8;
    if (toUnit === "켈빈") return (value - 32) / 1.8 + 273.15;
  }
  if (fromUnit === "켈빈") {
    if (toUnit === "섭씨") return value - 273.15;
    if (toUnit === "화씨") return (value - 273.15) * 1.8 + 32;
  }
  throw new Error("지원하지 않는 변환입니다.");
}

// 선택된 두 세부단위에 따른 공식 설명(구현 보류)
function fomulaSetting(
  approximation: boolean,
  category: string,
  calType: string,
  calValue: string
) {
  // 근삿값인지, 카테고리는 무엇인지, 어떤 연산을 해야 하는지(곱셈, 나눗셈 등), 어느 정도의 값을 연산해야 하는지
  const formulaDOM: HTMLElement = document.getElementById(
    "unit-convert-formula"
  ) as HTMLElement;

  let result = "";

  // 공식 작성하는 곳

  formulaDOM.innerText = result;
}
// 변환 케이스 스위치(온도 제외)
function switchConversion(selectedText: string): conversionRecord {
  let settingRecord: conversionRecord = lengthConversion;

  switch (selectedText) {
    case "길이":
      // settingRecord = lengthConversion; 초기 세팅이 길이이므로 의미 없음
      break;
    case "면적":
      settingRecord = areaConversion;
      break;
    case "부피":
      settingRecord = volumeConversion;
      break;
    case "속도":
      settingRecord = speedConversion;
      break;
    case "시간":
      settingRecord = timeConversion;
      break;
    case "압력":
      settingRecord = pressureConversion;
      break;
    case "에너지":
      settingRecord = energyConversion;
      break;
    case "연비":
      settingRecord = fuelEfficiencyConversion;
      break;
    case "온도":
      // tempRecord = temperatureConversion; 초기 세팅이 온도이므로 의미 없음
      break;
    case "주파수":
      settingRecord = frequencyConversion;
      break;
    case "질량":
      settingRecord = massConversion;
      break;
    case "평면각":
      settingRecord = angleConversion;
      break;
    case "데이터 크기":
      settingRecord = dataSizeConversion;
      break;
    case "데이터 전송 속도":
      settingRecord = dataTransferRateConversion;
      break;
    default:
      console.error(
        "settingRecord 세팅 실패. selectedText case를 찾을 수 없습니다."
      );
  }

  return settingRecord;
}

// 모든 소단위 카테고리 초기화
function allDetailCategoryShow(keys: string[]) {
  // 왼쪽
  const leftItems = keys.map((key: string, index: number) => {
    const li = document.createElement("li");
    li.id = `unit-detail-option-left-item-${index}`;
    li.className = "unit-detail-option-left-item";
    li.className += " unit-option-item";
    li.innerText = key;
    return li;
  });
  unitDetailOptionsLeft.innerText = "";
  unitDetailOptionsLeft.append(...leftItems);

  // 오른쪽
  const rightItems = keys.map((key: string, index: number) => {
    const li = document.createElement("li");
    li.id = `unit-detail-option-right-item-${index}`;
    li.className = "unit-detail-option-right-item";
    li.className += " unit-option-item";
    li.innerText = key;
    return li;
  });
  unitDetailOptionsRight.innerText = "";
  unitDetailOptionsRight.append(...rightItems);
}

// 소단위 카테고리 토글
function unitDetailSearchBoxToggle(event: Event) {
  const target: HTMLElement = event.target as HTMLElement;
  let unitDetailSearchbox: HTMLElement;

  if (
    target.id.includes("left") ||
    target.classList.contains("unit-detail-option-left-item")
  ) {
    unitDetailSearchbox = document.getElementById(
      "unit-convert-detail-search-left"
    ) as HTMLElement;
  } else if (
    target.id.includes("right") ||
    target.classList.contains("unit-detail-option-right-item")
  ) {
    unitDetailSearchbox = document.getElementById(
      "unit-convert-detail-search-right"
    ) as HTMLElement;
  } else {
    console.error("target id를 판별할 수 없습니다.");
    console.error(target);
    return;
  }

  if (unitDetailSearchbox.classList.contains("blind")) {
    unitDetailSearchbox.classList.remove("blind");
  } else {
    unitDetailSearchbox.classList.add("blind");
  }
}

// 소단위 카테고리 외부 클릭 시 닫기
function unitConvertDetailSearchboxOutsideClick(event: Event) {
  const selectBoxLeft: HTMLElement | null = document.getElementById(
    "unit-convert-detail-select-leftbox"
  );
  const selectBoxRight: HTMLElement | null = document.getElementById(
    "unit-convert-detail-select-rightbox"
  );
  const searchBoxLeft: HTMLElement | null = document.getElementById(
    "unit-convert-detail-search-left"
  );
  const searchBoxRight: HTMLElement | null = document.getElementById(
    "unit-convert-detail-search-right"
  );

  // 내부 클릭이면 종료
  if (
    selectBoxLeft?.contains(event.target as Node) ||
    searchBoxLeft?.contains(event.target as Node)
  ) {
    return;
  }
  if (
    selectBoxRight?.contains(event.target as Node) ||
    searchBoxRight?.contains(event.target as Node)
  ) {
    return;
  }

  // 외부 클릭이면 닫기
  if (searchBoxLeft && !searchBoxLeft.classList.contains("blind")) {
    searchBoxLeft.classList.add("blind");
  }
  if (searchBoxRight && !searchBoxRight.classList.contains("blind")) {
    searchBoxRight.classList.add("blind");
  }
}

// 소단위 카테고리 검색 시 필터링
function unitDetailFilterAction(this: HTMLElement, e: Event) {
  let target: EventTarget = e.target as EventTarget;
  let newUnitDetailCategory: string[] = [];
  let searchWord: string = (e.target as HTMLInputElement)?.value;

  if (searchWord.length > 0) {
    newUnitDetailCategory = selectedUnit.filter((data: string) =>
      data.startsWith(searchWord)
    );
  } else {
    newUnitDetailCategory = selectedUnit;
  }

  // left right 구별
  if ((target as HTMLElement).id.includes("left")) {
    // 왼쪽의 경우
    const listItems: HTMLElement[] = newUnitDetailCategory.map(
      (data: string, index: number) => {
        const li = document.createElement("li");
        li.id = `unit-detail-option-left-item-${index}`;
        li.className = "unit-detail-option-left-item";
        li.className += " unit-option-item";
        li.innerText = data;
        return li;
      }
    );
    unitDetailOptionsLeft.innerText = ""; // 기존 목록 초기화
    unitDetailOptionsLeft.append(...listItems);
  } else {
    // 오른쪽의 경우
    const listItems: HTMLElement[] = newUnitDetailCategory.map(
      (data: string, index: number) => {
        const li = document.createElement("li");
        li.id = `unit-detail-option-right-item-${index}`;
        li.className = "unit-detail-option-right-item";
        li.className += " unit-option-item";
        li.innerText = data;
        return li;
      }
    );
    unitDetailOptionsRight.innerText = "";
    unitDetailOptionsRight.append(...listItems);
  }
}

// 소단위 카테고리 검색 엔터 이벤트
function detailFilterEnterAction(e: KeyboardEvent) {
  if (e.key === "Enter" && e.target) {
    const inputValue: string = (e.target as HTMLInputElement).value;

    if (selectedUnit.includes(inputValue)) {
      unitDetailOptionsClick(inputValue, e);
    }
  }
}

// 소단위 카테고리 이벤트
function unitDetailOptionsEvent(event: Event) {
  const target: HTMLElement = event.target as HTMLElement;

  if (
    target.tagName === "LI" &&
    unitDetailOptionsLeft.contains(target) &&
    target.classList.contains("unit-detail-option-left-item")
  ) {
    unitDetailOptionsClick(target.textContent || "", event);
  } else if (
    target.tagName === "LI" &&
    unitDetailOptionsRight.contains(target) &&
    target.classList.contains("unit-detail-option-right-item")
  ) {
    unitDetailOptionsClick(target.textContent || "", event);
  }
}

// 소단위 카테고리 클릭 시 실행
function unitDetailOptionsClick(selectedText: string, event: Event) {
  const target: EventTarget | null = event.target;
  if (target === null) {
    console.error(
      "unitDetailOptionsClick에서 event.target을 찾을 수 없습니다."
    );
    return;
  }
  let leftRight = "";

  // left right 구분하고 그 검색창 비우기
  if (
    (target as HTMLElement).id === "unit-detail-filter-left" || // <- 불필요?
    (target as HTMLElement).className.includes("unit-detail-option-left-item")
  ) {
    leftRight = "left";
    const unitDetailFilter: HTMLElement | null = document.getElementById(
      "unit-detail-filter-left"
    );
    if (unitDetailFilter) {
      (unitDetailFilter as HTMLInputElement).value = "";
    }
  } else if (
    (target as HTMLElement).id === "unit-detail-filter-right" || // <- 불필요?
    (target as HTMLElement).className.includes("unit-detail-option-right-item")
  ) {
    leftRight = "right";
    const unitDetailFilter: HTMLElement | null = document.getElementById(
      "unit-detail-filter-right"
    );
    if (unitDetailFilter) {
      (unitDetailFilter as HTMLInputElement).value = "";
    }
  } else {
    console.error("target 판별 불가능");
    console.error(target);
    return;
  }

  // 소단위 카테고리 초기화 및 목록 닫기
  allDetailCategoryShow(selectedUnit);
  unitDetailSearchBoxToggle(event);

  // 좌우의 select값 구하기
  let currentSelect: string = "";
  if (leftRight === "left") {
    currentSelect =
      document.getElementById("unit-convert-detail-select-left")?.innerText ||
      "";
  } else if (leftRight === "right") {
    currentSelect =
      document.getElementById("unit-convert-detail-select-right")?.innerText ||
      "";
  }

  // 선택한 단위 표시하기
  const selectUnitDetail: HTMLElement | null = document.getElementById(
    `unit-convert-detail-select-${leftRight}`
  );
  if (selectUnitDetail) {
    // 적용
    selectUnitDetail.innerText = selectedText;
  }

  // 좌우가 같으면 교환
  let tempLeft = document.getElementById("unit-convert-detail-select-left");
  let tempRight = document.getElementById("unit-convert-detail-select-right");

  if (tempLeft && tempRight && tempLeft.innerText === tempRight.innerText) {
    if (leftRight === "left") {
      tempRight.innerText = currentSelect;
    } else if (leftRight === "right") {
      tempLeft.innerText = currentSelect;
    }
  }

  // 두 input값이 남아있으면 계산
  const unitDetailLeftInput = document.getElementById(
    "unit-convert-detail-input-left"
  ) as HTMLInputElement | null;
  const unitDetailRightInput = document.getElementById(
    "unit-convert-detail-input-right"
  ) as HTMLInputElement | null;

  // 순서는 무조건 왼쪽 -> 오른쪽
  if (unitDetailLeftInput && unitDetailRightInput) {
    if (unitDetailLeftInput.value !== "" && unitDetailRightInput.value !== "") {
      unitDetailInputAction(event);
    }
  }
}

/** 진수 변환 */
document
  .getElementById("decimal-input")
  ?.addEventListener("input", numberSystemConvertAction);
document
  .getElementById("octal-input")
  ?.addEventListener("input", numberSystemConvertAction);
document
  .getElementById("hexadecimal-input")
  ?.addEventListener("input", numberSystemConvertAction);
document
  .getElementById("binary-input")
  ?.addEventListener("input", numberSystemConvertAction);

// 진법 변환
function numberSystemConvertAction(e: Event) {
  const decimalInput = document.getElementById(
    "decimal-input"
  ) as HTMLInputElement;
  const binaryInput = document.getElementById(
    "binary-input"
  ) as HTMLInputElement;
  const octalInput = document.getElementById("octal-input") as HTMLInputElement;
  const hexadecimalInput = document.getElementById(
    "hexadecimal-input"
  ) as HTMLInputElement;

  const id: string = (e.target as HTMLElement).id;
  let inputValue: string = (e.target as HTMLInputElement).value;
  let fromBase: number;

  switch (id) {
    case "decimal-input":
      fromBase = 10;
      break;
    case "binary-input":
      fromBase = 2;
      break;
    case "octal-input":
      fromBase = 8;
      break;
    case "hexadecimal-input":
      fromBase = 16;
      break;
    default:
      console.error("진수 판별 불가");
      return;
  }

  if (inputValue === "") {
    decimalInput.value = "";
    binaryInput.value = "";
    octalInput.value = "";
    hexadecimalInput.value = "";
    return;
  }

  // 입력값 필터
  if (!numberSystemConvertDistinction(inputValue, fromBase)) {
    return;
  }

  const isNegative: boolean = inputValue.startsWith("-");
  inputValue = isNegative ? inputValue.slice(1) : inputValue;

  const [integerPart, fractionalPart]: string[] = inputValue.split(".");

  // 정수 변환
  let decimalValue: number = parseInt(integerPart, fromBase);

  // 소수 변환
  let fractionalValue: number = 0;
  if (fractionalPart) {
    fractionalValue = fractionalPart.split("").reduce((acc, digit, index) => {
      return acc + parseInt(digit, fromBase) / Math.pow(fromBase, index + 1);
    }, 0);
  }

  let result: number = decimalValue + fractionalValue;
  if (isNaN(result)) {
    (e.target as HTMLInputElement).value = "";
    return;
  }

  // 진수 변환
  let result10: string = (isNegative ? "-" : "") + result.toString(10);
  let result2: string = (isNegative ? "-" : "") + result.toString(2);
  let result8: string = (isNegative ? "-" : "") + result.toString(8);
  let result16: string =
    (isNegative ? "-" : "") + result.toString(16).toUpperCase();

  decimalInput.value = result10;
  binaryInput.value = result2;
  octalInput.value = result8;
  hexadecimalInput.value = result16;
}
// 입력값 판별
function numberSystemConvertDistinction(
  inputValue: string,
  base: number
): boolean {
  // -가 처음에 올 수 있도록 처리
  if (inputValue.startsWith("-")) {
    inputValue = inputValue.slice(1); // -는 제거
  }

  const patterns: { [key: number]: RegExp } = {
    2: /^[01]+(\.[01]+)?$/,
    8: /^[0-7]+(\.[0-7]+)?$/,
    10: /^[0-9]+(\.[0-9]+)?$/,
    16: /^[0-9a-fA-F]+(\.[0-9a-fA-F]+)?$/,
  };

  // 정규식을 사용하여 올바른 입력인지 확인
  return patterns[base].test(inputValue);
}

/** 한영타 변환 */
document
  .getElementById("hangul-alphabet-convert-input-kor")
  ?.addEventListener("input", hangulAlphabetConvertAction);
document
  .getElementById("hangul-alphabet-convert-input-eng")
  ?.addEventListener("input", hangulAlphabetConvertAction);
document
  .getElementById("hangul-alphabet-convert-copy-btn-kor")
  ?.addEventListener("click", hangulAlphabetCopyAction);
document
  .getElementById("hangul-alphabet-convert-copy-btn-eng")
  ?.addEventListener("click", hangulAlphabetCopyAction);
document
  .getElementById("hangul-alphabet-convert-clear-btn")
  ?.addEventListener("click", hangulAlphabetClearAction);

const korEngField: Record<string, string | number> = {
  eng: "rRseEfaqQtTdwWczxvgASDFGZXCVkoiOjpuPhynbmlYUIHJKLBNM",
  kor: "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅁㄴㅇㄹㅎㅋㅌㅊㅍㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣㅛㅕㅑㅗㅓㅏㅣㅠㅜㅡ",
  korFirst: "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ", // 19개
  korSecond: "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ", // 21개
  korThird: " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ",
  korMoum: 28,
  ga: 44032, // 유니코드 한글 시작점
  hig: 55203, // 유니코드 한글 종료점
  r: 12593,
  l: 12643,
};

const connectableConsonant: Record<string, string> = {
  ㄱㅅ: "ㄳ",
  ㄴㅈ: "ㄵ",
  ㄴㅎ: "ㄶ",
  ㄹㄱ: "ㄺ",
  ㄹㅁ: "ㄻ",
  ㄹㅂ: "ㄼ",
  ㄹㅅ: "ㄽ",
  ㄹㅌ: "ㄾ",
  ㄹㅍ: "ㄿ",
  ㄹㅎ: "ㅀ",
  ㅂㅅ: "ㅄ",
};

const connectableConsonantReverse: Record<string, string> = {
  ㄳ: "ㄱㅅ",
  ㄵ: "ㄴㅈ",
  ㄶ: "ㄴㅎ",
  ㄺ: "ㄹㄱ",
  ㄻ: "ㄹㅁ",
  ㄼ: "ㄹㅂ",
  ㄽ: "ㄹㅅ",
  ㄾ: "ㄹㅌ",
  ㄿ: "ㄹㅍ",
  ㅀ: "ㄹㅎ",
  ㅄ: "ㅂㅅ",
};

const connectableVowel: Record<string, string> = {
  ㅗㅏ: "ㅘ",
  ㅗㅐ: "ㅙ",
  ㅗㅣ: "ㅚ",
  ㅜㅓ: "ㅝ",
  ㅜㅔ: "ㅞ",
  ㅜㅣ: "ㅟ",
  ㅡㅣ: "ㅢ",
};

const connectableVowelReverse: Record<string, string> = {
  ㅘ: "ㅗㅏ",
  ㅙ: "ㅗㅐ",
  ㅚ: "ㅗㅣ",
  ㅝ: "ㅜㅓ",
  ㅞ: "ㅜㅔ",
  ㅟ: "ㅜㅣ",
  ㅢ: "ㅡㅣ",
};

const korFirst: string = korEngField.korFirst as string;
const korSecond: string = korEngField.korSecond as string;
const korThird: string = korEngField.korThird as string;

// 한영타 변환 메인 실행 함수
function hangulAlphabetConvertAction(e: Event) {
  // 한글 필드인지 영어 필드인지 구분
  let isHangul: Boolean = true;
  if ((e.target as HTMLElement).id === "hangul-alphabet-convert-input-eng") {
    isHangul = false;
  }

  // 한글 -> 영어
  if (isHangul === true) {
    const hangulValue: string = (e.target as HTMLTextAreaElement).value;
    const result: string = korEngLogic(hangulValue); // 영어가 여기에 들어감

    // 반대쪽 input에 적용
    const engDom = document.getElementById(
      "hangul-alphabet-convert-input-eng"
    ) as HTMLElement;
    (engDom as HTMLTextAreaElement).value = result;
  }

  // 영어 -> 한글
  else {
    const alphabetValue = (e.target as HTMLTextAreaElement).value;
    const result: string = engKorLogic(alphabetValue); // 조합된 한글이 여기에 들어감

    // 반대쪽 input에 적용
    const korDom = document.getElementById(
      "hangul-alphabet-convert-input-kor"
    ) as HTMLElement;
    (korDom as HTMLTextAreaElement).value = result;
  }
}

// 영어 -> 한글
function engKorLogic(input: string): string {
  const eng: string = korEngField.eng as string;
  const kor: string = korEngField.kor as string;

  // input된 값 모두 한글로 변환
  let engChangeKor: string = "";
  const arr: string[] = input.split("");

  for (let i = 0; i < arr.length; i++) {
    if (eng.indexOf(arr[i]) !== -1) {
      let where: number = eng.indexOf(arr[i]);
      engChangeKor += kor[where];
    } else {
      engChangeKor += arr[i];
    }
  }

  // 초성, 중성, 종성 나누기
  const chojungjong: string[][] | undefined = chojungjongSlice(engChangeKor);
  if (chojungjong === undefined) {
    console.error("초중종성 나누기 실패");
    return "fail";
  }
  // 한 글자라고 판단된 글자 정리 및 문장 구성
  const result: string | undefined = combineHangul(chojungjong);
  if (result === undefined) {
    console.error("한글 조합 실패");
    return "fail";
  }

  return result;
}

// 초중종성 나누기
function chojungjongSlice(input: string): string[][] | undefined {
  let inputState: string = "start"; // 입력받은 상태
  let result: string[][] = [];
  let cho = "";
  let jung = "";
  let jong = "";
  let other = "";

  for (let i = 0; i < input.length; i++) {
    // 한글 입력이 아닐 때
    if (!(korEngField.kor as string).includes(input[i])) {
      if (cho !== "" || jung !== "" || jong !== "") {
        // 초성, 중성, 종성이 있는 상태에서 다른 글자 입력 시
        result.push([cho, jung, jong]);
        cho = "";
        jung = "";
        jong = "";
      }
      other = input[i];
      inputState = "other";
    }

    // start 상태에서 가능한 입력
    if (inputState === "start") {
      // 초성 입력한 경우
      if (korFirst.includes(input[i])) {
        cho = input[i]; // 초성
        inputState = "cho";
      }

      // 중성 입력한 경우
      else if (korSecond.includes(input[i])) {
        // 이전에 종성이 있었으면 그게 초성이 됨
        if (result.length > 0 && i > 0 && result[result.length - 1][2] !== "") {
          // 복자음인 경우
          if (result[result.length - 1][2].length === 2) {
            cho = result[result.length - 1][2].substring(1, 2); // 초성
            result[result.length - 1][2] = result[
              result.length - 1
            ][2].substring(0, 1); // 종성
          }

          // 단자음인 경우
          else if (result[result.length - 1][2].length === 1) {
            cho = result[result.length - 1][2]; // 초성
            result[result.length - 1][2] = ""; // 종성 공백 설정
          }
          jung = input[i];
          inputState = "jung"; // 복모음 올 수 있음
        }

        // 초성도 종성도 없을 때
        else if (
          (cho === "" &&
            result.length > 0 &&
            i > 0 &&
            result[result.length - 1][2] === "") ||
          i === 0 // 혹은 시작부터 모음이 오면
        ) {
          // 예비 복자음의 경우
          if (input[i] === "ㅗ" || input[i] === "ㅜ" || input[i] === "ㅡ") {
            jung = input[i];
            inputState = "jung"; // 복모음 올 수 있음
          }

          // 단자음의 경우
          else if (
            input[i] !== "ㅗ" &&
            input[i] !== "ㅜ" &&
            input[i] !== "ㅡ"
          ) {
            jung = input[i];
            result.push(["", jung, ""]);
            cho = "";
            jung = "";
            jong = "";
            inputState = "start"; // 상태 초기화
          }
        }

        // 그 외
        else {
          result.push([input[i], "", ""]);
          cho = "";
          jung = "";
          jong = "";
          console.warn("start 상태에서 조건에 맞지 않는 중성 입력입니다.");
          inputState = "start";
          // return;
        }
      }

      // 초성, 중성도 아닌 경우
      else {
        result.push([input[i], "", ""]);
        cho = "";
        jung = "";
        jong = "";
        console.warn("start 상태에서 유효한 입력이 아닙니다.");
        // return;
      }
    }

    // cho 상태에서 가능한 입력
    else if (inputState === "cho") {
      // 중성 입력한 경우
      if (cho !== "" && korSecond.includes(input[i])) {
        jung = input[i];
        inputState = "jung";
      }

      // 초성 입력한 경우
      else if (
        korFirst.includes(input[i]) &&
        !connectableConsonant[cho + input[i]]
      ) {
        result.push([cho, "", ""]); // 현재 입력을 push
        cho = input[i];
        inputState = "cho"; // 다시 초성으로
      }

      // 초성(조합) = 종성
      else if (
        korFirst.includes(input[i]) &&
        connectableConsonant[cho + input[i]]
      ) {
        jong = cho + input[i]; // 종성
        cho = "";
        jung = "";
        inputState = "jong"; // 종성을 입력받은 것이니 종성으로 이동
      }

      // 중성, 초성, 초성(조합) 모두 아닌 경우
      else {
        result.push([cho, "", ""]);
        result.push([input[i], "", ""]);
        cho = "";
        jung = "";
        jong = "";
        console.warn("cho 상태에서 유효한 입력이 아닙니다.");
        inputState = "start";
        // return;
      }
    }

    // jung 상태에서 가능한 입력
    else if (inputState === "jung") {
      // 초성, 중성이 있는 상태에서 종성 입력한 경우
      if (cho !== "" && jung !== "" && korThird.includes(input[i])) {
        jong = input[i];
        inputState = "jong";
      }

      // 초성, 중성이 있는 상태에서 중성(조합) 입력한 경우
      else if (
        cho !== "" &&
        jung !== "" &&
        korSecond.includes(input[i]) &&
        connectableVowel[jung + input[i]]
      ) {
        jung += input[i];
        inputState = "jung";
      }

      // 조합이 안 되는 중성을 입력한 경우
      else if (
        korSecond.includes(input[i]) &&
        !connectableVowel[jung + input[i]]
      ) {
        result.push([cho, jung, ""]); // 현재 입력도 push
        cho = "";
        jung = input[i];
        jong = "";
        inputState = "jung"; // 상태 초기화
      }

      // 초성이 없는 상황에서 중성(조합) 입력한 경우
      else if (
        cho === "" &&
        jung !== "" &&
        korSecond.includes(input[i]) &&
        connectableVowel[jung + input[i]]
      ) {
        jung += input[i];
        result.push(["", jung, ""]);
        cho = "";
        jung = "";
        jong = "";
        inputState = "start"; // 상태 초기화
      }

      // 종성이 될 수 없는 쌍자음을 입력한 경우
      else if (cho !== "" && jung !== "" && "ㅃㅉㄸ".includes(input[i])) {
        result.push([cho, jung, ""]);
        cho = input[i];
        jung = "";
        jong = "";
        inputState = "cho";
      }

      // 유효한 입력이 아니라고 판단될 경우
      else {
        result.push([cho, jung, ""]);
        result.push([input[i], "", ""]);
        cho = "";
        jung = "";
        jong = "";
        console.warn("jung 상태에서 유효한 입력이 아닙니다.");
        inputState = "start";
        // return;
      }
    }

    // jong 상태에서 가능한 입력
    else if (inputState === "jong") {
      // 초, 중, 종성이 있는 상태에서 종성(조합) 입력한 경우
      if (
        cho !== "" &&
        jung !== "" &&
        jong !== "" &&
        korThird.includes(input[i]) &&
        connectableConsonant[jong + input[i]]
      ) {
        jong += input[i];
        inputState = "jong";
      }

      // 초, 중, 종성이 있는 상태에서 초성 입력한 경우(= 조합이 안 되는 종성 입력한 경우)
      else if (
        cho !== "" &&
        jung !== "" &&
        jong !== "" &&
        korFirst.includes(input[i]) &&
        !connectableConsonant[jong + input[i]]
      ) {
        result.push([cho, jung, jong]);
        cho = input[i];
        jung = "";
        jong = "";
        inputState = "cho";
      }

      // 초, 중, 종성이 있는 상태에서 중성 입력한 경우
      else if (
        cho !== "" &&
        jung !== "" &&
        jong !== "" &&
        jong.length === 1 && // 단자음인 경우
        korSecond.includes(input[i])
      ) {
        result.push([cho, jung, ""]); // result.push([cho, jung, " "]); 유니코드 고려하기?
        cho = jong;
        jung = input[i];
        jong = "";
        inputState = "jung";
      }

      // 초, 중 종성(복자음)이 있는 상태에서 중성 입력한 경우
      else if (
        cho !== "" &&
        jung !== "" &&
        jong !== "" &&
        jong.length === 2 && // 복자음인 경우
        korSecond.includes(input[i])
      ) {
        result.push([cho, jung, jong[0]]);
        cho = jong[1];
        jung = input[i];
        jong = "";
        inputState = "jung";
      }

      // 종성만 있는 상태(ex: ㄵ)에서 중성 입력한 경우(ex: ㄴ재)
      else if (
        cho === "" &&
        jung === "" &&
        jong !== "" &&
        jong.length === 2 &&
        korSecond.includes(input[i])
      ) {
        result.push(["", "", jong[0]]);
        cho = jong[1];
        jung = input[i];
        jong = "";
        inputState = "jung";
      }

      // 유효한 입력이 아니라고 판단될 경우
      else {
        result.push([cho, jung, jong]);
        result.push([input[i], "", ""]);
        cho = "";
        jung = "";
        jong = "";
        console.warn("jong 상태에서 유효한 입력이 아닙니다.");
        inputState = "start";
        // return;
      }
    }

    if (inputState === "other") {
      result.push([other, "", ""]);
      inputState = "start";
    }
  }

  // 반복 끝나고 마지막에 남은 초성, 중성, 종성이 있으면 추가
  if (cho !== "" || jung !== "" || jong !== "") {
    result.push([cho, jung, jong]);
  }

  // 복자음, 복모음 처리
  for (let i = 0; i < result.length; i++) {
    const [cho, jung, jong]: string[] = result[i];

    // 복자음 처리
    if (jong.length === 2) {
      const combinedJong: string = connectableConsonant[jong];
      if (combinedJong) {
        result[i][2] = combinedJong;
      }
    }

    // 복모음 처리
    if (jung.length === 2) {
      const combinedJung: string = connectableVowel[jung];
      if (combinedJung) {
        result[i][1] = combinedJung;
      }
    }
  }

  return result;
}

// 한글 조합하기
function combineHangul(chojungjong: string[][]): string | undefined {
  let combineResult: string = "";

  for (let i = 0; i < chojungjong.length; i++) {
    const [cho, jung, jong]: string[] = chojungjong[i];

    // 초성, 중성, 종성이 모두 있는 경우
    if (cho && jung && jong) {
      const choIndex: number = (korEngField.korFirst as string).indexOf(cho);
      const jungIndex: number = (korEngField.korSecond as string).indexOf(jung);
      const jongIndex: number = (korEngField.korThird as string).indexOf(jong);

      if (choIndex === -1 || jungIndex === -1 || jongIndex === -1) {
        console.error("초중종성 조합 실패");
        return undefined;
      }

      const codePoint: number =
        (korEngField.ga as number) +
        choIndex * 588 +
        jungIndex * 28 +
        jongIndex;
      combineResult += String.fromCharCode(codePoint);
    }

    // 초성, 중성만 있는 경우
    else if (cho && jung) {
      const choIndex: number = (korEngField.korFirst as string).indexOf(cho);
      const jungIndex: number = (korEngField.korSecond as string).indexOf(jung);

      if (choIndex === -1 || jungIndex === -1) {
        console.error("초중 조합 실패");
        return undefined;
      }

      const codePoint: number =
        (korEngField.ga as number) + choIndex * 588 + jungIndex * 28;

      combineResult += String.fromCharCode(codePoint);
    }

    // 초, 중, 종성 각각 하나씩만 있는 경우
    else if (cho) combineResult += cho;
    else if (jung) combineResult += jung;
    else if (jong) combineResult += jong;
  }

  return combineResult;
}

// 한글 -> 영어
function korEngLogic(input: string): string {
  const eng: string = korEngField.eng as string;
  const kor: string = korEngField.kor as string;

  const hangulSplitResult: string = hangulSplit(input).join("");
  const arr: string[] = hangulSplitResult.split("");
  let result: string = "";

  // 한글을 영어로 변환
  for (let i = 0; i < arr.length; i++) {
    if (kor.indexOf(arr[i]) !== -1) {
      let where: number = kor.indexOf(arr[i]);
      result += eng[where];
    } else {
      result += arr[i];
    }
  }

  return result;
}

// 한글 분리하기
function hangulSplit(input: string): string[] {
  const result: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const charCode: number = input.charCodeAt(i);
    if (
      charCode >= (korEngField.ga as number) &&
      charCode <= (korEngField.hig as number)
    ) {
      const choIndex: number = Math.floor(
        (charCode - (korEngField.ga as number)) / 588
      );
      const jungIndex: number = Math.floor(
        ((charCode - (korEngField.ga as number)) % 588) / 28
      );
      const jongIndex: number = (charCode - (korEngField.ga as number)) % 28;

      const cho: string = (korEngField.korFirst as string).charAt(choIndex);
      const jung: string = (korEngField.korSecond as string).charAt(jungIndex);
      const jong: string = (korEngField.korThird as string).charAt(jongIndex);

      // 종성이 없는 경우
      if (jong === " ") {
        result.push(cho, jung);
      } else {
        // 종성이 있는 경우
        result.push(cho, jung, jong);
      }
    } else {
      result.push(input[i]);
    }
  }

  // 복자음, 복모음 나누기
  for (let i = 0; i < result.length; i++) {
    const char: string = result[i];
    if (connectableConsonantReverse[char]) {
      const sliceConsonant: string = connectableConsonantReverse[char];
      result[i] = sliceConsonant;
    } else if (connectableVowelReverse[char]) {
      const sliceVowel: string = connectableVowelReverse[char];
      result[i] = sliceVowel;
    }
  }

  return result;
}

// 복사
function hangulAlphabetCopyAction(e: Event) {
  const target: HTMLElement = e.target as HTMLElement;
  let copyTarget = "";

  if (target.id.includes("hangul-alphabet-convert-copy-btn-kor")) {
    copyTarget = "hangul-alphabet-convert-input-kor";
  } else if (target.id.includes("hangul-alphabet-convert-copy-btn-eng")) {
    copyTarget = "hangul-alphabet-convert-input-eng";
  }

  const copyText = (document.getElementById(copyTarget) as HTMLTextAreaElement)
    .value;

  if (copyText) {
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        let targetid = target.id;
        if (targetid.includes("-img")) targetid = targetid.replace("-img", "");

        const messageTarget = document.getElementById(`${targetid}-message`);
        if (messageTarget) {
          messageTarget.innerText = "복사되었습니다.";
          messageTarget.className = "hangul-alphabet-message";
          setTimeout(() => {
            messageTarget.innerText = ""; // 2초 후에 메시지 초기화
            messageTarget.classList.remove("hangul-alphabet-message");
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("복사 실패:", err);
      });
  }
}

// 비우기
function hangulAlphabetClearAction() {
  const korInput: HTMLElement | null = document.getElementById(
    "hangul-alphabet-convert-input-kor"
  );
  const engInput: HTMLElement | null = document.getElementById(
    "hangul-alphabet-convert-input-eng"
  );
  const clearMessage: HTMLElement | null = document.getElementById(
    "hangul-alphabet-convert-clear-message"
  );

  if (korInput && engInput) {
    if (
      (korInput as HTMLTextAreaElement).value == "" &&
      (engInput as HTMLTextAreaElement).value == ""
    )
      return;

    (korInput as HTMLTextAreaElement).value = "";
    (engInput as HTMLTextAreaElement).value = "";

    if (!clearMessage) return;
    clearMessage.innerText = "초기화되었습니다.";
    clearMessage.className = "hangul-alphabet-message";
    setTimeout(() => {
      clearMessage.innerText = ""; // 2초 후에 메시지 초기화
      clearMessage.classList.remove("hangul-alphabet-message");
    }, 2000);
  } else {
    console.error("textArea를 찾을 수 없습니다.");
    return;
  }
}

/** 도로명주소 변환 */
const jusoInput: HTMLElement | null = document.getElementById(
  "full-juso-finder-input"
);
const jusoInputDetail: HTMLElement | null = document.getElementById(
  "full-juso-finder-input-detail"
);
const roadnameResultDOM: HTMLElement | null = document.getElementById(
  "full-juso-finder-result-roadname"
);
const jibunResultDOM: HTMLElement | null = document.getElementById(
  "full-juso-finder-result-jibun"
);
const roadnameengResultDOM: HTMLElement | null = document.getElementById(
  "full-juso-finder-result-roadnameeng"
);
const zipcodeResultDOM: HTMLElement | null = document.getElementById(
  "full-juso-finder-result-zipcode"
);
const jusoSearchResultMessage: HTMLElement | null = document.getElementById(
  "full-juso-finder-result-message"
);
const jusoSearchResultDiv: HTMLElement | null = document.getElementById(
  "full-juso-finder-search-result-div"
);

const jusoResultTotalCount: HTMLElement | null = document.getElementById(
  "full-juso-finder-result-totalcount"
);

const jusoBtnValue: HTMLElement | null = document.getElementById(
  "full-juso-finder-btn-value"
);

document
  .getElementById("full-juso-finder-btn")
  ?.addEventListener("click", () => roadAddressSearchAction());
// 엔터 키 입력 시 검색 실행
document
  .getElementById("full-juso-finder-input")
  ?.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      roadAddressSearchAction();
    }
  });
document
  .getElementById("full-juso-finder-input-detail")
  ?.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      roadAddressSearchAction();
    }
  });

document
  .getElementById("full-juso-finder-result-roadname-copy-btn")
  ?.addEventListener("click", roadAddressCopy);
document
  .getElementById("full-juso-finder-result-jibun-copy-btn")
  ?.addEventListener("click", roadAddressCopy);
document
  .getElementById("full-juso-finder-result-roadnameeng-copy-btn")
  ?.addEventListener("click", roadAddressCopy);
document
  .getElementById("full-juso-finder-result-zipcode-copy-btn")
  ?.addEventListener("click", roadAddressCopy);

type Common = {
  errorMessage: string; // 에러 메시지
  countPerPage: string; // 페이지당 출력할 결과 row 수
  totalCount: string; // 총 검색 데이터수
  errorCode: string; // 에러코드
  currentPage: string; // 페이지 번호
};

type Juso = {
  roadAddr: string; // 도로명주소 전체
  jibunAddr: string; // 지번주소
  zipNo: string; // 우편번호
  bdNm: string; // 건물명
  siNm: string; // 시도명
  sggNm: string; // 시군구명
  emdNm: string; // 읍면동명
  rn: string; // 도로명
  udrtYn: string; // 지하여부(0: 지상, 1: 지하)
  buldMnnm: string; // 건물본번
  buldSlno: string; // 건물부번
  detBdNmList: string; // 상세건물명
  engAddr: string; // 영문 도로명주소
  roadAddrPart1: string; // 도로명주소 1파트(도로명주소)
  roadAddrPart2: string; // 도로명주소 2파트(참고주소)
  admCd: string; // 행정구역코드
  lnbrMnnm: string; // 지역본번(번지)
  lnbrSlno: string; // 지번부번(호)
  bdKdcd: string; // 공동주택여부(1: 공동주택, 0: 비공동주택)
  rnMgtSn: string; // 도로명코드
  mtYn: string; // 산여부(0: 대지, 1: 산)
  bdMgtSn: string; // 건물관리번호
  liNm: string; // 법정리명
  emdNo: string; // 읍면동일련번호
};

type AddressApiResponse = {
  result: {
    results: {
      common: Common;
      juso: Juso[];
    };
  };
};

// 토큰 변수 및 보유기한
let clientToken = "";
// const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000;

// 토큰 로드
/* async function loadClientToken(): Promise<string> {
  try {
    const { client_token } = await chrome.storage.local.get("client_token");
    const { date } = await chrome.storage.local.get("date");

    if (!client_token || !date) {
      await chrome.storage.local.clear();
      return "";
    }

    const now = Date.now();
    const isExpired = now - date > TOKEN_EXPIRATION_MS;

    if (isExpired) {
      await chrome.storage.local.clear();
      return "";
    }

    clientToken = client_token;
    return client_token;
  } catch (error) {
    console.error("Failed to load client token:", error);
    await chrome.storage.local.clear();
    return "";
  }
} */

// 토큰 발급 함수
async function getClientToken(): Promise<string> {
  // chrome.storage.local.clear();
  return new Promise(async (resolve) => {
    const res = await fetch(`https://api.projectwj.uk/jusorequest/tkrequest`, {
      method: "GET",
      headers: {
        "X-Request-Source": "projectwj-jusorequest",
      },
      mode: "cors",
    });
    const data = await res.json();
    // const now = Date.now();

    /*     chrome.storage.local.set({ client_token: data.token }, () => {
      clientToken = data.token;
      resolve(data.token);
    }); */
    clientToken = data.token;
    resolve(data.token);
  });
}

// 통합 주소 검색 패널이 열리면 토큰 발급
const fullJusoPanel = document.getElementById(
  "full-juso-finder-panel"
) as HTMLDivElement;

// 감지할 옵션 설정
const config = {
  attributes: true,
  attributeFilter: ["class"], // class 속성만 감지
};
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      const target = mutation.target as HTMLElement;

      if (!target.classList.contains("blind")) {
        // 자동 토큰 확인 및 새 토큰 발급 실행
        (async () => {
          // const loadResult = await loadClientToken();
          await getClientToken();
          /*           if (loadResult === "") {
            await getClientToken();
          } */
        })();
      }
    }
  }
});

observer.observe(fullJusoPanel, config);

// 검색 버튼 내용 토글
function roadAddressSearchBtnToggle(request: boolean) {
  if (!jusoBtnValue) return;
  // request가 true면 진행 요청, false면 진행 종료

  // bulma의 button 페이지에 Loading 부문 있었음
  // 그러나 지금도 문제없이 동작하므로 굳이 수정 x
  if (request === false) {
    jusoBtnValue.classList.remove("bulma-loader-mixin");
    (jusoBtnValue as HTMLSpanElement).innerText = "검색";
  } else {
    (jusoBtnValue as HTMLSpanElement).innerText = "";
    jusoBtnValue.classList.add("bulma-loader-mixin");
  }
}

// 더보기 버튼 내용 토글
function roadAddressNextBtnToggle(request: boolean) {
  // 초기에 존재하는 dom이 아니라 여기서 호출
  const nextBtn: HTMLElement | null = document.getElementById(
    "full-juso-finder-next-btn-value"
  );
  if (!nextBtn) return;

  if (request === false) {
    nextBtn.classList.remove("bulma-loader-mixin");
    (nextBtn as HTMLSpanElement).innerText = "더보기";
  } else {
    (nextBtn as HTMLSpanElement).innerText = "";
    nextBtn.classList.add("bulma-loader-mixin");
  }
}

// 복사 버튼
function roadAddressCopy(e: Event) {
  if (!e.target) return;
  const targetId = (e.target as HTMLElement).id;
  let whoRequest = "";

  if (targetId.includes("full-juso-finder-result-roadname-copy-btn")) {
    whoRequest = "roadname";
  } else if (targetId.includes("full-juso-finder-result-jibun-copy-btn")) {
    whoRequest = "jibun";
  } else if (
    targetId.includes("full-juso-finder-result-roadnameeng-copy-btn")
  ) {
    whoRequest = "roadnameeng";
  } else if (targetId.includes("full-juso-finder-result-zipcode-copy-btn")) {
    whoRequest = "zipcode";
  }

  if (whoRequest === "") {
    console.error("복사하려는 target의 id를 찾을 수 없습니다.");
    return;
  }

  const copyInputValue = (
    document.getElementById(
      "full-juso-finder-result-" + whoRequest
    ) as HTMLInputElement
  ).value;

  if (copyInputValue !== "") {
    navigator.clipboard
      .writeText(copyInputValue)
      .then(() => {
        // 복사 완료
        const copyImg = document.getElementById(
          `full-juso-finder-result-${whoRequest}-copy-btn-img`
        ) as HTMLImageElement;
        if (!copyImg) return;

        // 2초간 체크 이미지 보이기
        copyImg.src = "/check.png";

        setTimeout(() => {
          copyImg.src = "/copy.png";
        }, 3000);
      })
      .catch((err) => {
        console.error("복사 실패:", err);
      });
  }
}

// 검색 작업
let roadAddressSearchActionErrorCount: number = 0;
async function roadAddressSearchAction(nextPageNum: number = 1) {
  const jusoInputValue: string = (jusoInput as HTMLInputElement).value;

  // 입력값 검증
  if (jusoInputValue === "") {
    roadAddressSearchBtnToggle(false);
    return;
  }

  // 50자 넘어가면 거부
  if (jusoInputValue.length > 50) {
    jusoSearchResultMessage
      ? (jusoSearchResultMessage.innerText = "입력이 너무 많습니다.")
      : alert("입력이 너무 많습니다.");
    roadAddressSearchBtnToggle(false);
    return;
  }

  // 1자 이하면 거부
  if (jusoInputValue.length < 2) {
    jusoSearchResultMessage
      ? (jusoSearchResultMessage.innerText =
          "검색어는 두 글자 이상이어야 합니다.")
      : alert("검색어는 두 글자 이상이어야 합니다.");
    roadAddressSearchBtnToggle(false);
    return;
  }

  // 한글과 숫자, -만 입력 가능
  /*   const jusoInputPattern: RegExp = /^[가-힣0-9\s-]+$/;
  if (!jusoInputPattern.test(jusoInputValue)) {
    jusoSearchResultMessage
      ? (jusoSearchResultMessage.innerText = "한글, 숫자, -만 입력 가능합니다.")
      : alert("한글, 숫자, -만 입력 가능합니다.");
        roadAddressSearchBtnToggle();
    return;
  } */

  // 익스텐션 id와 토큰
  const extensionId: string = chrome.runtime.id;
  if (clientToken === "") await getClientToken();
  // API 호출
  try {
    roadAddressSearchBtnToggle(true);
    const response: Response = await fetch(
      `https://api.projectwj.uk/jusorequest?q=${jusoInputValue}&page=${nextPageNum}`,
      {
        method: "GET",
        headers: {
          "X-Extension-Id": extensionId,
          "X-Client-Token": clientToken,
          "X-Request-Source": "projectwj-jusorequest",
        },
        mode: "cors",
        // credentials: "include", // 쿠키 포함 여부 설정
      }
    );
    console.log(response);

    // response로 온 모든 데이터
    const responseData: AddressApiResponse = await response.json();
    roadAddressSearchBtnToggle(false);
    roadAddressSearchActionErrorCount = 0;

    // 검색 결과 1차 처리 및 리스트에 보여줄 dom 요소
    const searchedFieldDOM = await jusoDataField(responseData);
  } catch (error) {
    // 요청 실패 시 3번까지 재시도
    roadAddressSearchActionErrorCount++;

    if (roadAddressSearchActionErrorCount < 3) {
      console.warn(error);
      console.warn("재시도중...");
      setTimeout(() => {
        // 1.5초 뒤 재실행
        roadAddressSearchAction();
      }, 1500);
    } else {
      jusoSearchResultMessage
        ? (jusoSearchResultMessage.innerText = "API 요청 실패")
        : alert("API 요청 실패");
      console.error("API 요청 실패:", error);
      roadAddressSearchBtnToggle(false);
      return;
    }
  }
}

// 받은 json에서 필요한 데이터 추출
function jusoDataField(responseData: AddressApiResponse) {
  return new Promise((resolve, error) => {
    const { common, juso }: { common: Common; juso: Juso[] } =
      responseData.result.results;

    // 정상
    if (common.errorCode === "0") {
      const totalCount: string = common.totalCount; // 총 검색 데이터수
      const currentPage: string = common.currentPage; // 페이지 번호
      const countPerPage: string = common.countPerPage; // 페이지당 출력할 결과 row 수

      if (jusoResultTotalCount) {
        jusoResultTotalCount.innerText = `검색 결과 ${totalCount}건`;

        // 검색 결과가 없는 경우
        if (totalCount === "0") {
          jusoSearchResultMessage
            ? (jusoSearchResultMessage.innerText = "검색 결과가 없습니다.")
            : alert("검색 결과가 없습니다.");
        }
      }

      // 매번 재생성할지 말지 확인해야 하므로 여기서 선언
      const jusoSearchResultField: HTMLElement | null = document.getElementById(
        "full-juso-finder-search-result-field"
      );

      // 결과 dom 초기화 및 생성
      if (jusoSearchResultField) {
        // dom 초기화 및 틀 재생성
        if (currentPage === "1") {
          jusoSearchResultField.remove();
          const newField = document.createElement("ol");
          newField.id = `full-juso-finder-search-result-field`;
          jusoSearchResultDiv
            ? jusoSearchResultDiv.appendChild(newField)
            : console.error("jusoSearchResultDiv 요소를 찾을 수 없습니다.");
        }

        let index = (parseInt(currentPage) - 1) * 15; // 더보기 클릭 시에 index 번호 충돌 방지

        // 더보기 버튼 있으면 제거
        document.getElementById("full-juso-finder-next-btn")?.remove();

        // 상세 데이터 요소 구성 및 배치
        juso.forEach((jusoElement: Juso) => {
          const li: HTMLLIElement = document.createElement("li");
          const roadAddrSpan: HTMLSpanElement = document.createElement("span");
          const jibunAddrSpan: HTMLSpanElement = document.createElement("span");
          const zipcodeSpan: HTMLSpanElement = document.createElement("span");

          li.id = `full-juso-finder-result-li-${index}`;
          li.style = "list-style-type: none; border-radius: 6px;";
          li.className = "px-2 py-1 full-juso-li-hover";
          roadAddrSpan.id = `full-juso-finder-result-road-${index}`;
          jibunAddrSpan.id = `full-juso-finder-result-jibun-${index}`;
          zipcodeSpan.id = `full-juso-finder-result-zipcode-${index}`;

          roadAddrSpan.innerText = jusoElement.roadAddrPart1 + "\n"; // 스타일 적용 전 임시로 공백 추가
          jibunAddrSpan.innerText = jusoElement.jibunAddr + "\n"; // 스타일 적용 전 임시로 공백 추가
          zipcodeSpan.innerText = jusoElement.zipNo;

          document
            .getElementById("full-juso-finder-search-result-field")
            ?.appendChild(li);
          li.appendChild(roadAddrSpan);
          li.appendChild(jibunAddrSpan);
          li.appendChild(zipcodeSpan);

          // 도로명, 지번주소 클릭하면 발동하도록 수정하기
          const liElement: HTMLElement | null = document.getElementById(li.id);
          liElement
            ? liElement.addEventListener("mousedown", (event) => {
                jusoElementClick(event, responseData);
              })
            : "";

          // 인덱스 ++
          index++;
        });

        // 결과가 남았으면 더보기 버튼
        if (index < parseInt(totalCount)) {
          const nextPage = parseInt(currentPage) + 1; // 다음 페이지 번호
          const nextButton = document.createElement("button"); // 더보기 검색버튼
          nextButton.id = `full-juso-finder-next-btn`; // id
          nextButton.value = nextPage.toString(); // 더보기 검색 value
          nextButton.type = "button"; // 타입
          nextButton.className = "my-2 button is-dark full-juso-next-btn";

          jusoSearchResultDiv?.appendChild(nextButton);

          // 버튼 내용
          const span = document.createElement("span");
          span.id = "full-juso-finder-next-btn-value";
          span.innerText = "더보기";

          nextButton.appendChild(span);

          const nextButtonElement = document.getElementById(
            "full-juso-finder-next-btn"
          );
          if (nextButtonElement)
            nextButtonElement.addEventListener("click", () => {
              roadAddressSearchAction(nextPage);
              roadAddressNextBtnToggle(true);
            });
        }
      }

      // 정상 처리
      return resolve;
    } else {
      errorCodeTask(common.errorCode);
      return error;
    }
  });
}

// 주소 선택 시
function jusoElementClick(event: Event, responseData: AddressApiResponse) {
  const target: EventTarget | null = event.target;
  if (!target) {
    console.error("target을 찾을 수 없습니다.");
    return;
  }

  // 클릭한 dom
  const elementId: string = (target as HTMLElement).id;
  const index: string = elementId.split("-")[5];

  // 클릭한 dom의 id의 value 모두를 찾기
  let clkedRoad: string | undefined = document.getElementById(
    "full-juso-finder-result-road-" + index
  )?.innerText;
  let clkedJibun: string | undefined = document.getElementById(
    "full-juso-finder-result-jibun-" + index
  )?.innerText;
  let clkedZipcode: string | undefined = document.getElementById(
    "full-juso-finder-result-zipcode-" + index
  )?.innerText;

  // 맨 마지막에 줄바꿈 문자 U+000A가 있으므로 trim처리
  clkedRoad = clkedRoad?.trim();
  clkedJibun = clkedJibun?.trim();
  clkedZipcode = clkedZipcode?.trim();

  // 세 value와 정확히 일치하는 요소를 results에서 찾기
  const jusoArray: Juso[] = responseData.result.results.juso;

  for (let i = 0; i < jusoArray.length; i++) {
    // 그 요소의 인덱스를 찾아 결과창 dom에 적용
    if (
      jusoArray[i].roadAddrPart1 === clkedRoad &&
      jusoArray[i].jibunAddr === clkedJibun &&
      jusoArray[i].zipNo === clkedZipcode
    ) {
      if (!roadnameResultDOM) return;
      (roadnameResultDOM as HTMLInputElement).value =
        jusoArray[i].roadAddrPart1;

      if (!roadnameengResultDOM) return;
      (roadnameengResultDOM as HTMLInputElement).value =
        roadnameengResultDOM.innerText = jusoArray[i].engAddr;

      if (!jibunResultDOM) return;
      (jibunResultDOM as HTMLInputElement).value = jibunResultDOM.innerText =
        jusoArray[i].jibunAddr;

      if (!zipcodeResultDOM) return;
      (zipcodeResultDOM as HTMLInputElement).value =
        zipcodeResultDOM.innerText = jusoArray[i].zipNo;

      break;
    }
  }

  // 스크롤 맨 위로
  window.scrollTo(0, 0);
}

// 에러코드 처리
function errorCodeTask(errorCode: string) {
  if (!jusoSearchResultMessage) {
    console.error("jusoSearchResultMessage가 null입니다.");
    alert("jusoSearchResultMessage가 null입니다.");
    return;
  }
  if (errorCode === "-999") {
    jusoSearchResultMessage.innerText =
      "-999	시스템에러 도로명주소 도움센터로 문의하시기 바랍니다.";
  } else if (errorCode === "E0001") {
    jusoSearchResultMessage.innerText =
      "E0001	승인되지 않은 KEY입니다.	정확한 승인키를 입력하세요. (팝업API 승인키 사용불가)";
  } else if (errorCode === "E0005") {
    jusoSearchResultMessage.innerText =
      "E0005	검색어가 입력되지 않았습니다.	검색어를 입력해주세요.";
  } else if (errorCode === "E0006") {
    jusoSearchResultMessage.innerText =
      "E0006	주소를 상세히 입력해 주시기 바랍니다.	시도명으로는 검색이 불가합니다.";
  } else if (errorCode === "E0008") {
    jusoSearchResultMessage.innerText =
      "E0008	검색어는 두 글자 이상 입력되어야 합니다.	한 글자만으로는 검색이 불가합니다.";
  } else if (errorCode === "E0009") {
    jusoSearchResultMessage.innerText =
      "E0009  숫자만으로는 검색이 불가합니다.";
  } else if (errorCode === "E0010") {
    jusoSearchResultMessage.innerText =
      "E0010	검색어가 너무 깁니다. (한글 40자, 영문 / 숫자 80자 이하)	80자를 초과한 검색어는 검색이 불가합니다.";
  } else if (errorCode === "E0011") {
    jusoSearchResultMessage.innerText =
      "E0011	검색어에 너무 긴 숫자가 포함되어 있습니다. (숫자 10자 이하)	10자를 초과하는 숫자가 포함된 검색어는 검색이 불가합니다.";
  } else if (errorCode === "E0012") {
    jusoSearchResultMessage.innerText =
      "E0012	특수문자 + 숫자만으로는 검색이 불가합니다.";
  } else if (errorCode === "E0013") {
    jusoSearchResultMessage.innerText =
      "E0013	SQL 예약어 또는 특수문자( %,=,>,<,[,] )는 검색이 불가합니다.	SQL예약어 또는 특수문자를 제거 후 검색하시기 바랍니다..";
  } else if (errorCode === "E0014") {
    jusoSearchResultMessage.innerText =
      "E0014	개발 승인키 기간이 만료되어 서비스를 이용하실 수 없습니다.	개발 승인키를 다시 발급받아 API서비스를 호출하시기 바랍니다.";
  } else if (errorCode === "E0015") {
    jusoSearchResultMessage.innerText =
      "검색 범위를 초과하였습니다. 결과 수가 9000건을 초과하는 검색은 불가합니다.";
  } else {
    jusoSearchResultMessage.innerText = "알 수 없는 에러입니다.";
  }
}

/** 첨부된 사진에서 색 추출 */
const colorPickerImage: HTMLElement | null = document.getElementById(
  "color-picker-choose-image"
);
const colorPickerPreviewDiv: HTMLElement | null = document.getElementById(
  "color-picker-preview-div"
);
// 이미지가 첨부되면 실행
colorPickerImage?.addEventListener("change", (e) => {
  colorPickerImageShow(e);
});
const colorPickerValueSpan: HTMLElement | null = document.getElementById(
  "color-picker-click-value"
);

// 색 추출 panel의 blind 상태에 따른 preview blind 토글
const colorPickerPanel: HTMLElement | null =
  document.getElementById("color-picker-panel");

// panel의 class 추적
if (colorPickerPanel) {
  const obsesrver: MutationObserver = new MutationObserver(() => {
    // panel이 blind면 같이 blind하기
    if (colorPickerPanel.classList.contains("blind")) {
      colorPickerPreviewDiv?.classList.add("blind");
    } else {
      colorPickerPreviewDiv?.classList.remove("blind");
    }
  });

  obsesrver.observe(colorPickerPanel, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

// 이미지를 업로드받아 새 탭을 열고 이미지 전송
function colorPickerImageShow(e: Event) {
  const target = e.target as HTMLInputElement | null;
  if (!target || !target.files || target.files.length === 0) {
    alert("이미지 파일을 선택해주세요.");
    return;
  }
  const file = target.files[0];
  if (file) {
    const blob = new Blob([file], { type: file.type });
    const blobUrl = URL.createObjectURL(blob);
    chrome.tabs.create({
      url: chrome.runtime.getURL(
        `src/colorpicker/colorpicker.html#${encodeURIComponent(blobUrl)}`
      ),
    });
  }
}

/*
// 이전에 선택한 파일을 저장해둘 변수
// 파일 선택 취소 시 사용됨
let isFileExist: boolean = false;
 // 사진을 popup.html에서 보여주기
function colorPickerImageShow(e: Event) {
  const target: EventTarget | null = e.target;
  if (!target) {
    console.error("colorPickerImageShow target이 null입니다.");
    return;
  }

  // 파일 읽기 준비
  const fileList: FileList | null = (target as HTMLInputElement).files;
  let fileToRead: File | null = null;

  // 새 파일이 선택된 경우
  if (fileList && fileList[0]) {
    fileToRead = fileList[0];
    isFileExist = true;
  } else if (isFileExist) {
    // 이전에 선택했던 파일이 있는 경우
    // fileToRead = previousFile;
    // 굳이 재구성할 필요 없이 그냥 return하면 됨
    return;
  } else {
    console.warn("fileToRead 변수가 null인 것 같습니다.");
    return;
  }

  const reader: FileReader = new FileReader();

  reader.onload = (e) => {
    const img: HTMLImageElement = new Image();
    //   canvas.style.cssText = `
    //   max-width: 90%;
    //   max-height: 90%;
    //   border: 2px solid white;
    // `;
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d", {
      willReadFrequently: true,
    }); // { willReadFrequently: true }로 자주 읽어올 것이라 브라우저에 고지하면 최적화 가능
    // 동일 객체를 활용할 경우 첫 호출 때 한 번만 하면 됨. 두 번째 고지는 불필요

    img.onload = () => {
      // canvas.width = img.width;
      // canvas.height = img.height;
      canvas.classList = "zoomin";
      canvas.width = 400;
      canvas.height = 300;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    if (e.target?.result) {
      img.src = e.target.result as string;
    } else {
      console.error("FileReader의 result가 null이거나 undefined입니다.");
      return;
    }

    // 기존 프리뷰 삭제
    const exiting: HTMLElement | null = document.getElementById(
      "color-picker-preview-overlay"
    );
    if (exiting) exiting.remove();

    // 새 프리뷰 생성
    const preview: HTMLDivElement = document.createElement("div");
    preview.id = "color-picker-preview-overlay";
    preview.style.cssText = `
    `;

    // dom에 추가
    preview.appendChild(canvas);
    colorPickerPreviewDiv?.appendChild(preview);

    // 이벤트리스너 추가
    canvas.addEventListener("click", (e: MouseEvent) => {
      // colorPickShow(e);
      const imgsrc: string = img.src;
      fullImageShow(imgsrc);
    });
  };

  // 읽기 실행
  reader.readAsDataURL(fileToRead);
}

// 전체 이미지 보여주기
function fullImageShow(imgsrc: string) {
  // 스크롤바를 위한 wrapper 처리
  const wrapper: HTMLDivElement = document.createElement("div");
  wrapper.classList = "color-picker-scroll"; // 스크롤 적용
  wrapper.style.cssText = `
  max-width: 90vw;
  max-height: 85vh;
  overflow: auto;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background: white;
`;

  // 이미지, 캔버스 생성
  const overlay: HTMLDivElement = document.createElement("div");
  overlay.id = "color-picker-full-image";
  overlay.style.cssText = `
  position: fixed;
  padding-top: 10%;
  padding-bottom: 10%;
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

  img.src = imgsrc;
  canvas.style.cursor = "crosshair"; // 커서 스타일 조정
  canvas.style.cssText = `
  `;

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

  // height, width 조절
  document.body.classList.remove("global-width");
  document.body.style.width = img.width.toString() + "px";
  document.body.style.height = img.height.toString() + "px";

  // 모드 활성화
  wrapper.appendChild(canvas);
  overlay.appendChild(wrapper);
  document.body.appendChild(overlay);

  // x키 누르면 오버레이 닫기
  // 나중에 ui에 설명 추가하기
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === "x" || e.key === "X") {
      overlay.remove();
      document.removeEventListener("keydown", escHandler);
    }
  };

  // 닫기 버튼
  const closeButton: HTMLButtonElement = document.createElement("button");
  closeButton.innerText = "✕";
  closeButton.style.cssText = `
      background: transparent;
      position: fixed;
      top: 3%;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: #ffffff;
    `;
  const xButtonHandler = () => {
    overlay.remove();
    document.body.classList.add("global-width");
    document.body.style = "";
    document.removeEventListener("click", xButtonHandler);
  };

  overlay.appendChild(closeButton);
  closeButton.addEventListener("click", xButtonHandler);

  document.addEventListener("keydown", escHandler);
  document.addEventListener("click", colorPickShow);
}

// 이미지에서 클릭한 곳 색상 보여주기
function colorPickShow(e: MouseEvent) {
  const canvas: HTMLCanvasElement | null = e.target as HTMLCanvasElement;
  // e.target이 상위 함수의 canvas와 동일한 객체
  if (!(canvas instanceof HTMLCanvasElement)) return; // 이미지 바깥부분 클릭하면 getContext에서 error나는 거 방지
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d")!; // 두 번째 고지
  // 여기서 ctx로 getImageData 호출 때 경고가 나온다면 두 canvas 변수가 가리키는 대상이 동일하지 않을 가능성 있음

  const rect: DOMRect = canvas.getBoundingClientRect();
  const x: number = Math.floor(e.clientX - rect.left);
  const y: number = Math.floor(e.clientY - rect.top);
  const pixel: Uint8ClampedArray = ctx.getImageData(x, y, 1, 1).data;
  const hex: string = `#${[pixel[0], pixel[1], pixel[2]]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;

  // 선택한 색상 hex값 표기
  if (!colorPickerValueSpan) {
    console.error("colorPickerValueSpan가 dom 요소가 없습니다.");
    return;
  }
  colorPickerValueSpan.innerText = hex;

  // 일단 최대 5개까지만?
}
 */
