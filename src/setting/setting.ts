import "../import-bulma";

// 새로고침 시 페이지 대응
window.addEventListener("DOMContentLoaded", () => {
  const url = window.location.hash;
  const hash = url.substring(2, url.length);
  if (url !== "") {
    panelSelectAction(`nav-${hash}`);
  }
});

document.getElementById("nav-general")?.addEventListener("click", () => {
  panelSelectAction("nav-general");
});
document.getElementById("nav-information")?.addEventListener("click", () => {
  panelSelectAction("nav-information");
});

const navList = document.querySelectorAll(".nav_item");
const innerPages = document.querySelectorAll("[id$=-panel]");

function panelSelectAction(id: string) {
  // focus 변경
  navList.forEach((nav) => {
    if (nav.id !== id && nav.classList.contains("focus"))
      nav.classList.remove("focus");
    if (nav.id === id) nav.classList.add("focus");
  });

  // inner UI 변경
  innerPages.forEach((page) => {
    if (page.id === id.substring(4, id.length) + "-panel") {
      page.classList.remove("blind");
    } else {
      page.classList.add("blind");
    }
  });
}
