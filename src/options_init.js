window.onload = function() {
  m.mount(document.getElementById("app"), {
    oninit: function() {
      const config = new Config(localStorage);

      this.gitlab_path = config.gitlabPath;
      this.api_path = config.apiPath;
      this.private_token = config.privateToken;
      this.polling_second = config.pollingSecond;
      this.max_event_count = config.maxEventCount;
      this.max_notification_count = config.maxNotificationCount;
      this.new_mark_minute = config.newMarkMinute;
      this.ignore_own_events = config.ignoreOwnEvents;
      this.config_projects = config.projects;
      this.search_key = "";
      this.status_message = "";
      this.gitlab = GitLab.createFromConfig(config, localStorage);
      this.gitlab.loadProjects();

      this.clearConfigCache = function () {
        config.clearCache();
      };

      this.saveConfig = function (state, projects, userId) {
        config.save({
          gitlabPath:           state.gitlab_path,
          apiPath:              state.api_path,
          privateToken:         state.private_token,
          pollingSecond:        state.polling_second,
          maxEventCount:        state.max_event_count,
          maxNotificationCount: state.max_notification_count,
          newMarkMinute:        state.new_mark_minute,
          ignoreOwnEvents:      state.ignore_own_events,
          projects:             projects,
          userId:               userId
        });
      };

      this.reloadGitLabFromConfig = () => {
        this.gitlab = GitLab.createFromConfig(config, localStorage);
      };
    },
    view: app.view
  });
};
