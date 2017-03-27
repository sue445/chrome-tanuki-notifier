window.onload = function() {
  m.mount(document.getElementById("app"), {
    oninit: function() {
      this.gitlab_path = config.getGitlabPath();
      this.api_path = config.getApiPath();
      this.private_token = config.getPrivateToken();
      this.polling_second = config.getPollingSecond();
      this.max_event_count = config.getMaxEventCount();
      this.max_notification_count = config.getMaxNotificationCount();
      this.new_mark_minute = config.getNewMarkMinute();
      this.config_projects = config.getProjects();
      this.search_key = "";
      this.status_message = "";
      this.gitlab = GitLab.createFromConfig();
      this.gitlab.loadProjects();
    },
    view: app.view
  });
};
