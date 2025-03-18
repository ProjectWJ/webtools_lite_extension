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
