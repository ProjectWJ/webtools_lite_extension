// 페이지 로드 시 이미지 출력
window.addEventListener("DOMContentLoaded", () => {
  const url = decodeURIComponent(location.hash.substring(1));
  if (url === "") {
    chrome.runtime.sendMessage({ type: "canvas.html-is-ready" });
  } else {
    canvasAction(url);
  }
});

const imageDisplay = document.getElementById(
  "imageDisplay"
) as HTMLImageElement;

// popup.html에서 업로드받은 경우
function canvasAction(url: string) {
  if (!imageDisplay) {
    console.error("img DOM을 찾을 수 없습니다.");
    return;
  }
  imageDisplay.src = url;
  document.body.appendChild(imageDisplay);
}

// 우클릭 색 추출로 받은 경우
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "image") return;
  imageDisplay.src = message.data;
  document.body.appendChild(imageDisplay);
});
