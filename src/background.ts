// 단축키나 우클릭으로 작업 실행했을 때 여기서 진행
// 결과는 알림창으로 보여주기

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "characterCount",
    title: "글자 수 세기",
    contexts: ["selection", "image"], // 사용자가 텍스트를 선택했을 때만 보이게
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  // 글자 수 세기
  if (info.menuItemId === "characterCount") {
    const selectedText = info.selectionText;
    const charCount = selectedText?.length;

    /*     // 알림 생성
    // 브라우저가 윈도우에 알림 전송하고 윈도우가 띄우는 방식이었음
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("Ticon48.png"),
      title: "글자 수 세기",
      message: `${charCount}자입니다.`,
    }); */
  }
});
