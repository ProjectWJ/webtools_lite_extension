// 비정상 접근 차단
if (window.location.protocol !== "chrome-extension:") {
  document.body.innerHTML = "Unauthorized access";
  throw new Error("Unauthorized access");
}

// 페이지 로드 시 이미지 출력
window.addEventListener("DOMContentLoaded", canvasAction);

// 이미지 작성
function canvasAction() {
  const url = decodeURIComponent(location.hash.substring(1));
  if (url) {
    const img = document.getElementById("imageDisplay") as HTMLImageElement;
    if (!img) {
      console.error("img DOM을 찾을 수 없습니다.");
      return;
    }
    img.src = url;
    img.style.objectFit = "contain";
    document.body.style.margin = "0";
    document.body.appendChild(img);
  }
}
