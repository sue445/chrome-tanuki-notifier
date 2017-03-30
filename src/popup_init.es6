window.onload = function() {
  // remove notification count when show popup
  // because) can not use both chrome.browserAction.onClicked and popup
  // https://developer.chrome.com/extensions/browserAction.html#event-onClicked
  chrome.browserAction.setBadgeText({text: ""});

  m.mount(document.getElementById("app"), {
    oninit: function() {
      this.projects = config.getProjects();
      this.new_milli_seconds = config.getNewMarkMinute() * 60 * 1000;
      this.histories = config.getNotifiedHistories();
      this.gitlabPath = config.getGitlabPath();

      const author_ids = this.histories.map((project_event) => {
        return project_event.author_id
      }).filter((author_id) => {
        return author_id
      });
      const unique_author_ids = Array.from(new Set(author_ids));

      this.gitlab = GitLab.createFromConfig();
      this.gitlab.loadAvatarUrls(unique_author_ids);
    },
    view: app.view
  });
};
