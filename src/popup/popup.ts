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

type conversionRecord = Record<string, number>;

/** 단위 변환 */
// https://stickode.tistory.com/675 참조
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
let fromInput: string = "default";
let toInput: string = "default";
let fromSelect: string = "default";
let toSelect: string = "default";
document
  .getElementById("unit-convert-selectbox")
  ?.addEventListener("mousedown", unitConvertSelectBoxToggle);
document.addEventListener("mousedown", unitConvertSearchboxOutsideClick);
document.getElementById("unit-filter")?.addEventListener("input", filterAction);
document
  .getElementById("unit-filter")
  ?.addEventListener("keydown", filterEnterAction);
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

/*
  액션

  - 왼쪽이나 오른쪽의 input 값 바꾸기
  바꾼 곳을 fromInput, 바꿀 곳을 toInput으로 하기
  바꾼 곳의 select값을 토대로 반대쪽의 select값을 가져와 공식에 적용
  (완료)

  - 왼쪽이나 오른쪽의 select 값 바꾸기
  어느 쪽을 바꾸더라도 왼쪽이 fromInput, 오른쪽이 toInput
  계산 방향 또한 왼쪽에서 오른쪽으로
  (일단 select를 할 수 있게 해야 함)
*/

// 소단위 input에 값 입력 시
function unitDetailInputAction(e: Event) {
  // 이벤트 타겟
  const target = e.target;
  if (target === null) {
    console.error("event target이 null입니다.");
    return;
  }

  // 어느 input에서 입력되었는지, 값은 무엇인지 확인
  const fromInputId: string = (target as HTMLElement).id;
  fromInput = (target as HTMLInputElement).value;
  let value: number = parseFloat(fromInput);

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

  // input값이 입력된 곳에 따라 같은 방향의 select가 from이 된다
  if (fromInputId.includes("left")) {
    fromSelect = document.getElementById("unit-convert-detail-select-left")
      ?.innerHTML as string;
    toSelect = document.getElementById("unit-convert-detail-select-right")
      ?.innerHTML as string;
  } else if (fromInputId.includes("right")) {
    fromSelect = document.getElementById("unit-convert-detail-select-right")
      ?.innerHTML as string;
    toSelect = document.getElementById("unit-convert-detail-select-left")
      ?.innerHTML as string;
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
  const currentCategory: string = unitSelectElement.innerHTML;

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

// 드롭다운 메뉴 토글
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
function filterAction(this: HTMLElement, e: Event) {
  let newUnitCategory: string[] = [];
  let searchWord: string = (e.target as HTMLInputElement)?.value;
  unitOptions.innerHTML = ""; // 기존 목록 초기화

  if (searchWord.length > 0) {
    newUnitCategory = unitConvertCategory.filter((data: string) =>
      data.startsWith(searchWord)
    );
  } else {
    newUnitCategory = unitConvertCategory;
  }

  const listItems: string = newUnitCategory
    .map((data: string) => `<li class="unit-option-item">${data}</li>`)
    .join("");
  unitOptions.innerHTML = listItems;
}

// unit-filter에서 엔터키 눌렀을 때
function filterEnterAction(e: KeyboardEvent) {
  if (e.key === "Enter") {
    const inputValue: string = (
      document.getElementById("unit-filter") as HTMLInputElement
    ).value;

    if (unitConvertCategory.includes(inputValue)) {
      changeClickedName(inputValue);
    }
  }
}

// 대단위 선택 시 처리해야 할 작업
function changeClickedName(selectedText: string) {
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
    selectUnit.innerHTML = selectedText;
  }

  // detail 초기 세팅하기
  let settingRecord: conversionRecord = lengthConversion;
  let tempRecord: string[] = temperatureConversion; // 온도는 따로 처리해야 함

  settingRecord = switchConversion(selectedText);

  if (selectedText === "온도") {
    // 온도는 따로 처리
    if (unitLeftSelect) unitLeftSelect.innerHTML = tempRecord[0];
    if (unitRightSelect) unitRightSelect.innerHTML = tempRecord[1];
    const unitLeftInput = document.getElementById(
      "unit-convert-detail-input-left"
    ) as HTMLInputElement | null;
    // if (unitLeftInput) unitLeftInput.value = "0";
  } else {
    // 기준점이 되는 단위를 찾아 왼쪽에 배치, 기준점 바로 아래쪽 항목을 오른쪽에 배치
    // 기준점 찾기
    const keys: string[] = Object.keys(settingRecord);
    const datumPoint: number = keys.findIndex(
      (key) => settingRecord[key] === 1
    );
    const index: number = datumPoint !== -1 ? datumPoint : 0; // 찾지 못하면 첫 번째 항목을 기준점으로 설정

    // 배치
    if (index + 1 !== keys.length) {
      if (unitLeftSelect) unitLeftSelect.innerHTML = keys[index];
      if (unitRightSelect) unitRightSelect.innerHTML = keys[index + 1];
    } else {
      if (unitLeftSelect) unitLeftSelect.innerHTML = keys[index];
      if (unitRightSelect) unitRightSelect.innerHTML = keys[0];
    }
    const unitLeftInput = document.getElementById(
      "unit-convert-detail-input-left"
    ) as HTMLInputElement | null;
    // if (unitLeftInput) unitLeftInput.value = "1";
  }
}

// 처음에 길이 보여주게 하기
changeClickedName("길이");

// 모든 대단위 카테고리 초기화
function allUnitCategoryShow() {
  unitOptions.innerHTML = unitConvertCategory
    .map((unit: string) => `<li class="unit-option-item">${unit}</li>`)
    .join("");
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
    changeClickedName(target.textContent || "");
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

// 선택된 두 세부단위에 따른 공식 설명
// 근삿값인지, 카테고리는 무엇인지, 어떤 연산을 해야 하는지(곱셈, 나눗셈 등), 어느 정도의 값을 연산해야 하는지
function fomulaSetting(
  approximation: boolean,
  category: string,
  calType: string,
  calValue: string
) {
  const formulaDOM: HTMLElement = document.getElementById(
    "unit-convert-formula"
  ) as HTMLElement;

  let result = "";

  // 공식 문단 작성하는 곳

  formulaDOM.innerHTML = result;
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
