var prefs = {};

chrome.storage.local.get(
  { callback: "http://localhost:8080", key: "chrome" },
  function (o) {
    prefs = o;
  }
);

chrome.storage.onChanged.addListener(function (changes) {
  for (key in changes) {
    prefs[key] = changes[key].newValue;
  }
});

async function log(url, title, favicon) {
  var data = JSON.stringify({
    url: url,
    time: Date.now(),
    title: title,
    key: prefs.key,
    favicon: favicon,
  });
  console.log(data);

  try {
    const response = await fetch(prefs.callback, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    console.log("Data posted:", responseData);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    if (tab.status === "complete" && tab.active) {
      chrome.windows.get(tab.windowId, { populate: false }, function (window) {
        if (window.focused) {
          log(tab.url, tab.title, tab.favIconUrl || null);
        }
      });
    }
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.active) {
    chrome.windows.get(tab.windowId, { populate: false }, function (window) {
      if (window.focused) {
        log(tab.url, tab.title, tab.favIconUrl || null);
      }
    });
  }
});

chrome.windows.onFocusChanged.addListener(function (windowId) {
  if (windowId == chrome.windows.WINDOW_ID_NONE) {
    log(null, null, null);
  } else {
    chrome.windows.get(windowId, { populate: true }, function (window) {
      if (window.focused) {
        chrome.tabs.query(
          { active: true, windowId: windowId },
          function (tabs) {
            if (tabs[0].status === "complete") {
              log(tabs[0].url, tabs[0].title, tabs[0].favIconUrl || null);
            }
          }
        );
      }
    });
  }
});
