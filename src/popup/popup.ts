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
// 길이
const lengthCategory: string[] = [
  "킬로미터",
  "미터",
  "센티미터",
  "밀리미터",
  "마이크로미터",
  "나노미터",
  "마일",
  "야드",
  "피트",
  "인치",
  "해리",
];
// 면적
const areaCategory: string[] = [
  "제곱킬로미터",
  "제곱미터",
  "제곱마일",
  "제곱야드",
  "제곱피트",
  "제곱인치",
  "헥타르",
  "에이커",
];
// 부피
const volumeCategory: string[] = [
  "미국 액량 갤런",
  "미국 액량 쿼트",
  "미국 액량 파인트",
  "미국 컵",
  "미국 플루이드 온스",
  "미국 테이블스푼",
  "미국 티스푼",
  "세제곱미터",
  "리터",
  "밀리리터",
  "영국 갤런",
  "영국 쿼트",
  "영국 파인트",
  "영국 컵",
  "영국 플루이드 온스",
  "영국 테이블스푼",
  "영국 티",
  "세제곱피트",
  "세제곱인치",
];
// 속도
const speedCategory: string[] = [
  "시간당 마일",
  "초당 피트",
  "미터 매 초",
  "킬로미터 매 시",
  "노트",
];
// 시간
const timeCategory: string[] = [
  "나노초",
  "마이크로초",
  "밀리초",
  "초",
  "분",
  "시간",
  "일",
  "주",
  "개월",
  "역년",
  "연대",
  "세기",
];
// 압력
const pressureCategory: string[] = [
  "기압",
  "바",
  "제곱인치 당 파운드힘",
  "토르",
  "파스칼",
];
// 에너지
const energyCategory: string[] = [
  "줄",
  "킬로줄",
  "그램칼로리",
  "킬로칼로리",
  "와트시",
  "킬로와트시",
  "전자볼트",
  "영국 열 단위",
  "섬",
  "풋파운드",
];
// 연비
const fuelEfficiencyCategory: string[] = [
  "갤런 당 마일",
  "영국 갤런 당 마일",
  "리터 당 킬로미터",
  "100 킬로미터 당 리터",
];
// 온도
const temperatureCategory: string[] = ["섭씨", "화씨", "켈빈"];
// 주파수
const frequencyCategory: string[] = [
  "헤르츠",
  "킬로헤르츠",
  "메가헤르츠",
  "기가헤르츠",
];
// 질량
const massCategory: string[] = [
  "메트릭 톤",
  "킬로그램",
  "그램",
  "밀리그램",
  "마이크로그램",
  "롱톤",
  "미국 톤",
  "스톤",
  "파운드",
  "온스",
];
// 평면각
const angleCategory: string[] = [
  "그레이드",
  "도",
  "라디안",
  "밀리라디안",
  "분각",
  "초",
];
// 데이터 크기
const dataSizeCategory: string[] = [
  "비트",
  "킬로비트",
  "키비미트",
  "메가비트",
  "메비비트",
  "기가비트",
  "기비비트",
  "테라비트",
  "테비비트",
  "페타비트",
  "페비비트",
  "바이트",
  "킬로바이트",
  "키비바이트",
  "메가바이트",
  "메비바이트",
  "기가바이트",
  "기비바이트",
  "테라바이트",
  "테비바이트",
  "페타바이트",
  "페비바이트",
];
// 데이터 전송 속도
const dataTransferRateCategory: string[] = [
  "초당 비트",
  "초당 킬로비트",
  "초당 킬로바이트",
  "초당 키비비트",
  "초당 메가비트",
  "초당 메가바이트",
  "초당 메비비트",
  "초당 기가비트",
  "초당 기가바이트",
  "초당 기비비트",
  "초당 테라비트",
  "초당 테라바이트",
  "초당 테비비트",
];

const unitOptions: HTMLElement = document.getElementById(
  "unit-options"
) as HTMLElement;
const unitDetailOptionsLeft: HTMLElement = document.getElementById(
  "unit-detail-options-left"
) as HTMLElement;
const unitDetailOptionsRight: HTMLElement = document.getElementById(
  "unit-detail-options-right"
) as HTMLElement;
document
  .getElementById("unit-convert-selectbox")
  ?.addEventListener("mousedown", unitConvertSelectBoxToggle);
document.addEventListener("mousedown", unitConvertSearchboxOutsideClick);
document.getElementById("unit-filter")?.addEventListener("input", filterAction);
const unitLeftInput: HTMLElement | null = document.getElementById(
  "unit-convert-detail-input-left"
);
const unitLeftSelect: HTMLElement | null = document.getElementById(
  "unit-convert-detail-select-left"
);
const unitRightInput: HTMLElement | null = document.getElementById(
  "unit-convert-detail-input-right"
);
const unitRightSelect: HTMLElement | null = document.getElementById(
  "unit-convert-detail-select-right"
);

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

// 단위 선택 시 처리해야 할 작업
function changeClickedName(selectedText: string) {
  // 검색창 비우기
  const unitFilter: HTMLElement | null = document.getElementById("unit-filter");
  if (unitFilter) {
    (unitFilter as HTMLInputElement).value = "";
  }
  // 목록 닫기
  unitConvertSelectBoxToggle();

  // 선택한 단위 표시하기
  const selectUnit: HTMLElement | null = document.getElementById(
    "unit-convert-select-unit"
  );
  if (selectUnit) {
    selectUnit.innerHTML = selectedText;
  }

  // detail 초기 세팅하기
  let settingArr: string[];

  switch (selectedText) {
    case "길이":
      settingArr = lengthCategory;
      break;
    case "면적":
      settingArr = areaCategory;
      break;
    case "부피":
      settingArr = volumeCategory;
      break;
    case "속도":
      settingArr = speedCategory;
      break;
    case "시간":
      settingArr = timeCategory;
      break;
    case "압력":
      settingArr = pressureCategory;
      break;
    case "에너지":
      settingArr = energyCategory;
      break;
    case "연비":
      settingArr = fuelEfficiencyCategory;
      break;
    case "온도":
      settingArr = temperatureCategory;
      break;
    case "주파수":
      settingArr = frequencyCategory;
      break;
    case "질량":
      settingArr = massCategory;
      break;
    case "평면각":
      settingArr = angleCategory;
      break;
    case "데이터 크기":
      settingArr = dataSizeCategory;
      break;
    case "데이터 전송 속도":
      settingArr = dataTransferRateCategory;
      break;
    default:
      console.error(
        "settingArr 세팅 실패. selectedText case를 찾을 수 없습니다."
      );
      return;
  }

  if (unitLeftSelect) unitLeftSelect.innerHTML = settingArr[0];
  if (unitRightSelect) unitRightSelect.innerHTML = settingArr[1];
  const unitLeftInput = document.getElementById(
    "unit-convert-detail-input-left"
  ) as HTMLInputElement | null;
  if (unitLeftInput) unitLeftInput.value = "1";
}

// 모든 카테고리 보여주기
function allUnitCategoryShow() {
  unitOptions.innerHTML = unitConvertCategory
    .map((unit: string) => `<li class="unit-option-item">${unit}</li>`)
    .join("");
}

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
allUnitCategoryShow();

// 계산 과정

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
