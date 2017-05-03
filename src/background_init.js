window.onload = function() {
  chrome.notifications.onClicked.addListener((notification_id) => {
    // close notification popup
    chrome.notifications.clear(notification_id, () => {
      // open gitlab event page (Issue, MergeRequest, Milestone)
      const notification = JSON.parse(notification_id);
      chrome.tabs.create({url: notification.target_url});
    });
  });

  chrome.notifications.onClosed.addListener((notification_id) => {
    chrome.notifications.clear(notification_id, () => {
      // do nothing
    });
  });

  // startup
  chrome.browserAction.setBadgeText({text: ""});

  const notification_cache = new NotificationCache(localStorage);

  const config = new Config(localStorage);
  const notification = new Notification({
    config: config,
    chrome: chrome,
    notification_cache: notification_cache,
  });

  const background = new Background({
    config: config,
    notification: notification,
    storage: localStorage,
  });
  background.fetch();

  setInterval(() => {
    chrome.browserAction.getBadgeText({}, (badgeText) => {
      notification.badgeText = badgeText;
      background.fetch();
    });
  }, config.pollingSecond * 1000);
};
