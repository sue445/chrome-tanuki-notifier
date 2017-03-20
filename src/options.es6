const app = {};

app.view = () => {
  return m("div", [
    m("h2", "GitLab Setting"),
    m(".form-horizontal[role='form']", [
      m(".form-group", [
        m("label.col-sm-3.control-label[for='gitlab_path']", "GitLab Path"),
        m(".col-sm-5", [
          m("input.form-control[id='gitlab_path'][type='text']", {
            value: this.gitlab_path,
            oninput: m.withAttr("value", (value) => { this.gitlab_path = value })
          })
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='api_path']", "GitLab API Path"),
        m(".col-sm-5", [
          m("input.form-control[id='api_path'][type='text']", {
            value: this.api_path,
            oninput: m.withAttr("value", (value) => { this.api_path = value })
          })
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='private_token']", "Private token"),
        m(".col-sm-5", [
          m("input.form-control[id='private_token'][type='password']", {
            value: this.private_token,
            oninput: m.withAttr("value", (value) => { this.private_token = value })
          })
        ])
      ])
    ]),
    m("h2", "Notification Setting"),
    m(".form-horizontal[role='form']", [
      m(".form-group", [
        m("label.col-sm-3.control-label[for='polling_second']", "Polling interval"),
        m(".col-sm-5", [
          m("input.form-control[id='polling_second'][type='text']", {
            value: this.polling_second,
            oninput: m.withAttr("value", (value) => { this.polling_second = value })
          }),
          m("span.help-block", "Polling interval, in seconds. (Need chrome to restart)")
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='max_event_count']", "Notification to show"),
        m(".col-sm-5", [
          m("input.form-control[id='max_event_count'][type='text']", {
            value: this.max_event_count,
            oninput: m.withAttr("value", (value) => { this.max_event_count = value })
          })
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='max_notification_count']", "Notification per project"),
        m(".col-sm-5", [
          m("input.form-control[id='max_notification_count'][type='text']", {
            value: this.max_notification_count,
            oninput: m.withAttr("value", (value) => { this.max_notification_count = value })
          })
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='new_mark_minute']", "Mark event as new"),
        m(".col-sm-5", [
          m("input.form-control[id='new_mark_minute'][type='text']", {
            value: this.new_mark_minute,
            oninput: m.withAttr("value", (value) => { this.new_mark_minute = value })
          }),
          m("span.help-block", [
            "The event will be set as ",
            m("b", "bold"),
            " for the given amount of minutes"
          ])
        ])
      ])
    ]),
    m("button.save.btn.btn-primary", {onclick: app.saveOptions}, [
      m("span.glyphicon.glyphicon-save"),
      "Save"
    ]),
    m("button.clear.btn.btn-danger", {onclick: app.clearCache}, [
      m("span.glyphicon.glyphicon-trash"),
      "Clear cache"
    ]),
    m("span.status", this.status_message),
    m("h2", "Repository Events"),
    m("form.form-inline[role='form']", [
      m(".form-group.col-xs-4", [
        m(".input-group", [
          m(".input-group-addon", [
            m("span.glyphicon.glyphicon-search")
          ]),
          m("input.form-control[id='search_repository'][placeholder='Project name'][type='text']", {
            oninput: m.withAttr("value", (value) => { this.search_key = value }),
            value: this.search_key,
          })
        ])
      ]),
      m("button.btn.btn-default", {
        onclick: (event) => {
          this.gitlab = GitLab.createFromConfig();
          this.gitlab.loadProjects();
          event.preventDefault();
        }
      }, [
        m("span.glyphicon.glyphicon-refresh"),
        "Refresh Repository List"
      ])
    ]),
    m("table.table.table-striped.table-hover", [
      m("thead", [
        m("tr", [
          m("th.projects-name", "Project name"),
          m("th", [
            m("a.select-all[href='#']", { onclick: (event) => { app.selectProject(event, "Commit", true) } }, "All"),
            " / ",
            m("a.select-none[href='#']", { onclick: (event) => { app.selectProject(event, "Commit", false) } }, "None")
          ]),
          m("th", [
            m("a.select-all[href='#']", { onclick: (event) => { app.selectProject(event, "Issue", true) } }, "All"),
            " / ",
            m("a.select-none[href='#']", { onclick: (event) => { app.selectProject(event, "Issue", false) } }, "None")
          ]),
          m("th", [
            m("a.select-all[href='#']", { onclick: (event) => { app.selectProject(event, "MergeRequest", true) } }, "All"),
            " / ",
            m("a.select-none[href='#']", { onclick: (event) => { app.selectProject(event, "MergeRequest", false) } }, "None")
          ]),
          m("th", [
            m("a.select-all[href='#']", { onclick: (event) => { app.selectProject(event, "Milestone", true) } }, "All"),
            " / ",
            m("a.select-none[href='#']", { onclick: (event) => { app.selectProject(event, "Milestone", false) } }, "None")
          ]),
          m("th")
        ])
      ]),
      m("tbody[id='projects']", app.projects()),
      m("tfoot", [
        m("tr", [
          m("th.projects-name", "Project name"),
          m("th", [
            m("a.select-all[href='#']", { onclick: (event) => { app.selectProject(event, "Commit", true) } }, "All"),
            " / ",
            m("a.select-none[href='#']", { onclick: (event) => { app.selectProject(event, "Commit", false) } }, "None")
          ]),
          m("th", [
            m("a.select-all[href='#']", { onclick: (event) => { app.selectProject(event, "Issue", true) } }, "All"),
            " / ",
            m("a.select-none[href='#']", { onclick: (event) => { app.selectProject(event, "Issue", false) } }, "None")
          ]),
          m("th", [
            m("a.select-all[href='#']", { onclick: (event) => { app.selectProject(event, "MergeRequest", true) } }, "All"),
            " / ",
            m("a.select-none[href='#']", { onclick: (event) => { app.selectProject(event, "MergeRequest", false) } }, "None")
          ]),
          m("th", [
            m("a.select-all[href='#']", { onclick: (event) => { app.selectProject(event, "Milestone", true) } }, "All"),
            " / ",
            m("a.select-none[href='#']", { onclick: (event) => { app.selectProject(event, "Milestone", false) } }, "None")
          ]),
          m("th")
        ])
      ])
    ]),
    m("button.save.btn.btn-primary", {onclick: app.saveOptions}, [
      m("span.glyphicon.glyphicon-save"),
      "Save"
    ]),
    m("button.clear.btn.btn-danger", {onclick: app.clearCache}, [
      m("span.glyphicon.glyphicon-trash"),
      "Clear cache"
    ]),
    m("span.status", this.status_message),
  ])
};

app.selectProject = (event, project_event, checked) => {
  if(!this.gitlab.projects) {
    event.preventDefault();
    return
  }

  this.gitlab.projects.filter((project) =>{
    return app.matchSearchKey(project)
  }).forEach((project) => {
    project.events[project_event] = checked;
  });
  event.preventDefault();
};

app.clearCache = (event) => {
  config.clearCache();
  app.showStatus("Cache cleared");
  event.preventDefault();
};

app.showStatus = (message) => {
  this.status_message = message;
  setTimeout(() => {
    this.status_message = "";
    m.redraw();
  }, 750);
};

app.projects = () => {
  if(!this.gitlab.projects) {
    return m("tr", [
      m("td[colspan='6']", [
        m(".progress", [
          m(".progress-bar.progress-bar-striped.active[aria-valuemax='100'][aria-valuemin='0'][aria-valuenow='100'][role='progressbar']", {style: {"width": "100%"}}, [
            m("span.sr-only", "Now Loading")
          ])
        ])
      ])
    ])
  }

  return this.gitlab.projects.filter((project) =>{
    return app.matchSearchKey(project)
  }).map((project) => {
    project.events = project.events || app.projectEvents(project);

    const names = [];
    if (project.archived){
      names.push(m("span.glyphicon.glyphicon-eye-close"))
    }
    if(project.avatar_url) {
      names.push(m("img.icon.img-rounded", {src: project.avatar_url}))
    } else {
      names.push(m("img.icon.img-rounded[src='../img/gitlab_logo_128.png']"))
    }
    names.push(m("a", {href: this.gitlab_path + project.path_with_namespace}, project.path_with_namespace));

    const select_events = (event, checked) => {
      project.events.Commit = checked;
      project.events.Issue = checked;
      project.events.MergeRequest = checked;
      project.events.Milestone = checked;
      event.preventDefault();
    };

    return m("tr", [
      m("td.name", names),
      m("td.Commit", [
        m("label.checkbox-inline", [
          m("input[type='checkbox']", {
            checked: project.events.Commit,
            onclick: m.withAttr("checked", (value) => { project.events.Commit = value } ),
          }),
          m("i.icon-upload-alt[title='Commit']"),
          "Commit",
        ]),
      ]),
      m("td.Issue", [
        m("label.checkbox-inline", [
          m("input[type='checkbox']", {
            checked: project.events.Issue ,
            onclick: m.withAttr("checked", (value) => { project.events.Issue = value } ),
          }),
          m("i.icon-exclamation-sign[title='Issue']"),
          "Issue",
        ]),
      ]),
      m("td.MergeRequest", [
        m("label.checkbox-inline", [
          m("input[type='checkbox']", {
            checked: project.events.MergeRequest ,
            onclick: m.withAttr("checked", (value) => { project.events.MergeRequest = value } ),
          }),
          m("i.icon-check[title='MergeRequest']"),
          "MergeRequest",
        ]),
      ]),
      m("td.Milestone", [
        m("label.checkbox-inline", [
          m("input[type='checkbox']", {
            checked: project.events.Milestone ,
            onclick: m.withAttr("checked", (value) => { project.events.Milestone = value } ),
          }),
          m("i.icon-calendar[title='Milestone']"),
          "Milestone",
        ]),
      ]),
      m("td", [
        m("a.line-select-all[href='#']", {
          onclick: (event) => { select_events(event, true )}
        }, "All"),
        " / ",
        m("a.line-select-none[href='#']", {
          onclick: (event) => { select_events(event, false )}
        }, "None"),
      ]),
    ])
  })
};

app.matchSearchKey = (project) => {
  const keys = this.search_key.split(" ");
  return keys.every((key) => {
    const r = new RegExp(key, "i");
    return project.path_with_namespace.match(r)
  })
};

app.projectEvents = (project) => {
  const project_id = parseInt(project.id);
  const config_project = config_projects[project_id] || {};
  return config_project.events || {};
};

app.saveOptions = (event) => {
  const projects = {};

  if(this.gitlab.projects){
    this.gitlab.projects.forEach((project) => {
      const project_id = parseInt(project.id);
      projects[project_id] = {
        name:       project.path_with_namespace,
        avatar_url: project.avatar_url,
        events:     project.events
      }
    });
  }

  config.save({
    gitlabPath:           this.gitlab_path,
    apiPath:              this.api_path,
    privateToken:         this.private_token,
    pollingSecond:        this.polling_second,
    maxEventCount:        this.max_event_count,
    maxNotificationCount: this.max_notification_count,
    newMarkMinute:        this.new_mark_minute,
    projects:             projects
  });

  app.showStatus("Options Saved.");
  event.preventDefault();
};

window.onload = () => {
  m.mount(document.getElementById("app"), {
    oninit: () => {
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
  })
};
