// 페이지 로드 시 이미지 출력
window.addEventListener("DOMContentLoaded", () => {
  const url = decodeURIComponent(location.hash.substring(1));
  if (url === "") {
    chrome.runtime.sendMessage({ type: "canvas.html-is-ready" });
  } else {
    img.src = url;
  }
});

// 우클릭 색 추출로 받은 경우
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "image") return;
  img.src = message.data;
});

const displaycontainer = document.getElementById(
  "display-container"
) as HTMLDivElement;
const canvas = document.getElementById("display-image") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "";

// 이미지 확대/축소와 위치 제어 변수
let scale = 1; // 현재 확대 비율 (1 = 100%)
let offsetX = 0; // 이미지의 X축 위치 오프셋 (화면 중앙 정렬 및 드래그 이동)
let offsetY = 0; // 이미지의 Y축 위치 오프셋
let isDragging = false; // 드래그 중 여부 플래그
let startX = 0; // 드래그 시작 시 X좌표
let startY = 0; // 드래그 시작 시 Y좌표

// 이미지 로드 완료 시 초기 처리
img.onload = () => {
  // displaycontainer의 크기를 가져옴 (컨테이너 = canvas 부모 div)
  const containerWidth = displaycontainer.clientWidth;
  const containerHeight = displaycontainer.clientHeight;

  // 이미지 비율을 유지하면서 컨테이너에 맞는 초기 스케일 계산
  const scaleX = containerWidth / img.width;
  const scaleY = containerHeight / img.height;
  scale = Math.min(scaleX, scaleY); // 둘 중 작은 값으로 결정

  // canvas 크기를 컨테이너 크기에 맞게 설정
  canvas.width = containerWidth;
  canvas.height = containerHeight;

  // 이미지 위치를 캔버스 중앙에 맞춤
  centerImage();

  // 이미지 출력
  drawImage();

  // 현재 배율 표시 갱신
  updateScaleIndicator();
};

// 이미지 중앙 정렬 함수
function centerImage() {
  offsetX = (canvas.width - img.width * scale) / 2; // X축 중앙 위치 계산
  offsetY = (canvas.height - img.height * scale) / 2; // Y축 중앙 위치 계산
}

// 캔버스에 이미지 출력 함수
function drawImage() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
  ctx.save(); // 현재 캔버스 상태 저장
  ctx.translate(offsetX, offsetY); // 이미지 위치 이동
  ctx.scale(scale, scale); // 이미지 크기 비율 적용
  ctx.drawImage(img, 0, 0); // 이미지 출력 (원점 기준)
  ctx.restore(); // 저장한 상태 복원
}

// 버튼 확대/축소
/*
document.getElementById("zoom-in")?.addEventListener("click", () => {
  zoom(1.2, canvas.width / 2, canvas.height / 2); // 캔버스 중앙 기준 1.2배 확대
});
document.getElementById("zoom-out")?.addEventListener("click", () => {
  zoom(1 / 1.2, canvas.width / 2, canvas.height / 2); // 캔버스 중앙 기준 축소
});
*/

// 마우스 휠 이벤트로 확대/축소 제어
canvas.addEventListener("wheel", (e) => {
  e.preventDefault(); // 스크롤 기본 동작 방지
  const scaleAmount = e.deltaY < 0 ? 1.1 : 0.9; // 위로 스크롤(확대), 아래로 스크롤(축소)
  const rect = canvas.getBoundingClientRect(); // 캔버스의 위치 정보
  const x = e.clientX - rect.left; // 마우스 x좌표(캔버스 내)
  const y = e.clientY - rect.top; // 마우스 y좌표(캔버스 내)
  zoom(scaleAmount, x, y); // 마우스 위치를 중심으로 확대/축소
});

// 확대/축소 및 위치 재계산 함수
function zoom(scaleAmount: number, centerX: number, centerY: number) {
  const prevScale = scale; // 이전 배율 저장
  scale *= scaleAmount; // 배율 적용
  if (scale > 256) scale = 256; // 최대 256배 제한
  if (scale < 0.01) scale = 0.01; // 최소 1% 제한

  // 확대/축소 시 위치 재계산 (확대/축소 중심 유지)
  offsetX = centerX - (centerX - offsetX) * (scale / prevScale);
  offsetY = centerY - (centerY - offsetY) * (scale / prevScale);

  drawImage(); // 이미지 다시 출력
  updateScaleIndicator(); // 배율 표시 갱신
}

// 드래그 시작 (마우스 클릭)
canvas.addEventListener("mousedown", (e) => {
  isDragging = true; // 드래그 시작
  startX = e.clientX - offsetX; // 마우스 X좌표 - 현재 오프셋
  startY = e.clientY - offsetY; // 마우스 Y좌표 - 현재 오프셋
});

// 드래그 이동 (마우스 이동)
canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    // 드래그 중인 경우
    offsetX = e.clientX - startX; // 오프셋 갱신
    offsetY = e.clientY - startY;
    drawImage(); // 이미지 다시 출력
  }
});

// 드래그 종료 (마우스 클릭 해제)
canvas.addEventListener("mouseup", () => (isDragging = false));
// 마우스가 캔버스를 벗어난 경우 드래그 종료
canvas.addEventListener("mouseleave", () => (isDragging = false));

// 배율 표시를 갱신하는 함수
const scaleIndicator = document.getElementById(
  "scale-indicator"
) as HTMLSpanElement;
function updateScaleIndicator() {
  const percentage = Math.round(scale * 100); // 초기 스케일 대비 현재 배율 계산
  scaleIndicator.innerText = `${percentage}%`; // 표시
}

// 배율 표기 문제 수정해야 함
