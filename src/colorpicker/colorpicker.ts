// import "../import-bulma";
// bulma로 css 통일 예정

// 페이지 로드 시 이미지 출력
window.addEventListener("DOMContentLoaded", () => {
  const url = decodeURIComponent(location.hash.substring(1));
  if (url === "") {
    chrome.runtime.sendMessage({ type: "colorpicker.html-is-ready" });
  } else {
    img.src = url;
  }
});

// 우클릭 색 추출로 받은 경우
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "image") return;
  img.src = message.data;
});

// 이미지, 컨테이너 dom
const displaycontainer = document.getElementById(
  "display-container"
) as HTMLDivElement;
const img = document.getElementById("display-image") as HTMLImageElement;

// 이미지 크기를 컨테이너 너비에 맞게 조절
const resizeImage = () => {
  const { width } = displaycontainer.getBoundingClientRect();
  img.style.width = `${width}px`;
};
window.addEventListener("resize", resizeImage);
window.addEventListener("load", resizeImage);

// 확대 / 축소와 이동에 사용할 변수
let scale = 1;
let translate = { x: 0, y: 0 };

// 소수점 한 자리까지 반올림
const roundToOneDecimal = (num: number) => Math.round(num * 10) / 10;

// 최소 / 최대 범위로 값 제한
const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

// 현재 스케일, 위치를 transform 스타일로 반영
function updateTransform() {
  img.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
  img.style.transformOrigin = "center";
}

// 휠을 이용해 확대/축소
img.addEventListener("wheel", (event: WheelEvent) => {
  event.preventDefault(); // 스크롤 기본동작 방지

  // img.style.transition = "transform 0.2s ease";

  // 이미지 중심 좌표 계산
  const containerRect = img.getBoundingClientRect();
  const containerCenterX = containerRect.left + containerRect.width / 2;
  const containerCenterY = containerRect.top + containerRect.height / 2;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // 마우스 위치가 이미지 중심에서 얼마나 떨어졌는지 계산
  const offsetX = mouseX - containerCenterX;
  const offsetY = mouseY - containerCenterY;

  const prevScale = scale;

  // 위는 확대 아래는 축소
  if (event.deltaY < 0) {
    scale = roundToOneDecimal(scale * 1.1);
  } else {
    scale = roundToOneDecimal(scale / 1.1);
  }

  // 최소, 최대 범위 제한
  scale = clamp(scale, 0.001, 256);

  // 보정: center 기준으로 확대되므로, 중심과 커서 사이 거리만큼 이동
  translate.x -= offsetX * (scale / prevScale - 1);
  translate.y -= offsetY * (scale / prevScale - 1);

  updateTransform();

  // 애니메이션 동작 이후 애니메이션 효과 제거
  /*   clearTimeout((img as any)._transitionTimeout); // 다음 드래그에 영향 없게
  (img as any)._transitionTimeout = setTimeout(() => {
    img.style.transition = "none";
  }, 200); // 200ms 뒤 제거 */
});

// 드래그 이동 관련 상태 변수
let isClicking = false;
let isDragging = false;
let mouseMovingCount = 0;
let mouseSensitivity = 5; // 드래그 판단 감도. 나중에 임의로 설정할 수 있게
let start = { x: 0, y: 0 };

// 마우스 누름 시작, 드래그 시작 위치 기록
img.addEventListener("mousedown", (e: MouseEvent) => {
  isClicking = true;
  start = { x: e.clientX, y: e.clientY };

  // 드래그할 땐 즉시 반응하게 애니메이션 제거
  // img.style.transition = "none";
});

// 마우스 이동 처리
img.addEventListener("mousemove", (e: MouseEvent) => {
  // 드래그중일 때
  if (isClicking === true) {
    // 일정 감도 이하 움직임은 무시
    if (mouseMovingCount < mouseSensitivity) {
      mouseMovingCount++;
      return;
    }
    isDragging = true;
    img.style.cursor = "grabbing";
    magnifier.style.display = "none"; // 드래그 중 돋보기 숨김

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    translate.x += dx;
    translate.y += dy;

    start = { x: e.clientX, y: e.clientY }; // 다음 기준점 갱신
    updateTransform();
  }
  // 클릭하지 않은 상태에서 마우스 이동 시
  else {
    mouseCanvasUpdate(e);
  }
});

// 더블클릭 시 위치 및 배율 초기화
displaycontainer.addEventListener("dblclick", () => {
  scale = 1;
  translate = { x: 0, y: 0 };
  updateTransform();
});

// 색상정보 표기 요소들
const pickedColorDiv = document.getElementById(
  "picked-color"
) as HTMLDivElement;
const pickedColorPixel = document.getElementById(
  "picked-color-value-pixel"
) as HTMLSpanElement;
const pickedColorRGBA = document.getElementById(
  "picked-color-value-rgba"
) as HTMLSpanElement;
const pickedColorHEX = document.getElementById(
  "picked-color-value-hex"
) as HTMLSpanElement;

// 마우스 클릭 시 색상 추출
img.addEventListener("mouseup", (e: MouseEvent) => {
  img.style.cursor = "crosshair";

  // 드래그 후 마우스 뗀 경우는 추출 x
  if (isDragging === true) {
    isDragging = false;
    isClicking = false;
    mouseMovingCount = 0;
    return;
  }
  isClicking = false;

  const rect = img.getBoundingClientRect();
  const scaleX = img.naturalWidth / rect.width;
  const scaleY = img.naturalHeight / rect.height;

  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  const color = getPixelColorFromImage(img, x, y);
  if (color) {
    pickedColorDiv.style.backgroundColor = color.rgba;
    pickedColorPixel.innerText = `Clicked pixel: (${x}, ${y})\n`;
    pickedColorRGBA.innerText = `RGBA: ${color.rgba}\n`;
    pickedColorHEX.innerText = `HEX: ${color.hex}`;
  }
});

// 색상값 추출
function getPixelColorFromImage(
  img: HTMLImageElement,
  x: number,
  y: number
): { rgba: string; hex: string } | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b, a] = pixel;
  const rgba = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  const hex = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return { rgba, hex };
}

// 돋보기 설정
const magnifier = document.getElementById("magnifier") as HTMLCanvasElement;
const magnifierCtx = magnifier.getContext("2d")!;
const gridSize = 12;
const pixelSize = 12;

magnifier.width = gridSize * pixelSize;
magnifier.height = gridSize * pixelSize;
magnifier.style.borderRadius = "50%";
magnifier.style.border = "solid";
magnifier.style.display = "none";

// 돋보기 내부에서 쓸 캔버스
const mouseCanvas = document.createElement("canvas");
const mouseCanvasCtx = mouseCanvas.getContext("2d", {
  willReadFrequently: true,
})!;

// 마우스 위치에 따라 돋보기에 확대된 이미지 렌더링
function mouseCanvasUpdate(e: MouseEvent) {
  const rect = img.getBoundingClientRect();
  const scaleX = img.naturalWidth / rect.width;
  const scaleY = img.naturalHeight / rect.height;

  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  // 캔버스 초기화
  mouseCanvas.width = img.naturalWidth;
  mouseCanvas.height = img.naturalHeight;
  mouseCanvasCtx.drawImage(img, 0, 0);

  const centerX = x;
  const centerY = y;

  const zoomHalf = Math.floor(gridSize / 2);

  // 확대된 픽셀 영역 가져오기
  const imageData = mouseCanvasCtx.getImageData(
    centerX - zoomHalf,
    centerY - zoomHalf,
    gridSize,
    gridSize
  );

  magnifierCtx.clearRect(0, 0, magnifier.width, magnifier.height);

  // 각 픽셀 영역 확대해서 그리기
  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      const index = (j * gridSize + i) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const a = imageData.data[index + 3] / 255;

      magnifierCtx.fillStyle = `rgba(${r},${g},${b},${a})`;
      magnifierCtx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);

      // 각 픽셀 경계선
      magnifierCtx.strokeStyle = "black";
      magnifierCtx.lineWidth = 0.2;
      magnifierCtx.strokeRect(
        i * pixelSize,
        j * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  }

  // 중심 픽셀 강조
  magnifierCtx.strokeStyle = "red";
  magnifierCtx.lineWidth = 1;
  magnifierCtx.strokeRect(
    zoomHalf * pixelSize,
    zoomHalf * pixelSize,
    pixelSize,
    pixelSize
  );

  // 돋보기 위치
  magnifier.style.left = `${e.pageX + 20}px`;
  magnifier.style.top = `${e.pageY + 20}px`;
  magnifier.style.display = "block";
  magnifier.style.position = "absolute";
  magnifier.style.zIndex = "999";
}

// 이미지에서 나가면 돋보기 숨기기
img.addEventListener("mouseleave", () => {
  magnifier.style.display = "none";
});

// 복사기능 관련
const rgbaCopyBtn = document.getElementById(
  "rgba-copy-btn"
) as HTMLButtonElement;
const rgbaCopyImage = document.getElementById(
  "rgba-copy-image"
) as HTMLImageElement;
const hexCopyBtn = document.getElementById("hex-copy-btn") as HTMLButtonElement;
const hexCopyImage = document.getElementById(
  "hex-copy-image"
) as HTMLImageElement;

rgbaCopyBtn.addEventListener("click", copyAction);
rgbaCopyImage.addEventListener("click", copyAction);
hexCopyBtn.addEventListener("click", copyAction);
hexCopyImage.addEventListener("click", copyAction);

function copyAction(e: MouseEvent) {
  e.stopPropagation(); // 이벤트버블링 방지
  const target = e.target as HTMLElement;
  if (!target) return;

  if (target.id.includes("rgba")) {
    if (pickedColorRGBA.innerText === "RGBA:") return;
    const copyValue = pickedColorRGBA.innerText.substring(6);
    navigator.clipboard.writeText(copyValue).then(() => {
      rgbaCopyImage.src = "/img/check.png";

      setTimeout(() => {
        rgbaCopyImage.src = "/img/copy.png";
      }, 2000);
    });
  } else {
    if (pickedColorHEX.innerText === "HEX:") return;
    const copyValue = pickedColorHEX.innerText.substring(5);
    navigator.clipboard.writeText(copyValue).then(() => {
      hexCopyImage.src = "/img/check.png";

      setTimeout(() => {
        hexCopyImage.src = "/img/copy.png";
      }, 2000);
    });
  }
}
