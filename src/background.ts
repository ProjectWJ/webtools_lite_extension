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

    if (tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (count) => {
          alert(`${count}자입니다.`);
        },
        args: [charCount],
      });
    }
  }
});
