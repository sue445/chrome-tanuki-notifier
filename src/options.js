try {
  var m = require("mithril");
} catch (e){
}

const app = {};

app.view = function(vnode) {
  const state = vnode.state;

  const matchSearchKey = (project) => {
    const keys = state.search_key.split(" ");
    return keys.every((key) => {
      const r = new RegExp(key, "i");
      return project.path_with_namespace.match(r);
    });
  };

  const projectEvents = (project) => {
    const project_id = parseInt(project.id);
    const config_project = state.config_projects[project_id] || {};
    return config_project.events || {};
  };

  const saveOptions = (event) => {
    const projects = {};

    if(state.gitlab.projects){
      state.gitlab.projects.forEach((project) => {
        const project_id = parseInt(project.id);
        projects[project_id] = {
          name:       project.path_with_namespace,
          avatar_url: project.avatar_url,
          events:     project.events
        };
      });
    }

    // get and save user_id when API is available
    const hasAuthParams = state.api_path !== "" && state.private_token !== "";
    const userIdPromise = hasAuthParams ? state.gitlab.getCurrentUser({api_path: state.api_path, private_token: state.private_token}).then(({ id }) => id) : Promise.resolve("");

    userIdPromise.then((userId) => {
      state.saveConfig(state, projects, userId);

      showStatus("Options Saved.");
      event.preventDefault();
    });
  };

  const selectProject = (event, project_event, checked) => {
    if(!state.gitlab.projects) {
      event.preventDefault();
      return;
    }

    state.gitlab.projects.filter((project) =>{
      return matchSearchKey(project);
    }).forEach((project) => {
      project.events[project_event] = checked;
    });
    event.preventDefault();
  };

  const clearCache = (event) => {
    state.clearConfigCache();
    showStatus("Cache cleared");
    event.preventDefault();
  };

  const showStatus = (message) => {
    state.status_message = message;
    setTimeout(() => {
      state.status_message = "";
      m.redraw();
    }, 750);
  };

  const projects = () => {
    if(!state.gitlab.projects) {
      return m("tr", [
        m("td[colspan='6']", [
          m(".progress", [
            m(".progress-bar.progress-bar-striped.active[aria-valuemax='100'][aria-valuemin='0'][aria-valuenow='100'][role='progressbar']", {style: {"width": "100%"}}, [
              m("span.sr-only", "Now Loading")
            ])
          ])
        ])
      ]);
    }

    return state.gitlab.projects.filter((project) =>{
      return matchSearchKey(project);
    }).map((project) => {
      project.events = project.events || projectEvents(project);

      const names = [];
      if (project.archived){
        names.push(m("span.glyphicon.glyphicon-eye-close"));
      }
      if(project.avatar_url) {
        names.push(m("img.icon.img-rounded", {src: project.avatar_url}));
      } else {
        names.push(m("img.icon.img-rounded[src='../img/logo_128.png']"));
      }
      names.push(m("a", {href: state.gitlab_path + project.path_with_namespace}, project.path_with_namespace));

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
          m("input[type='checkbox']", {
            checked: project.events.Commit,
            onclick: (e) => { project.events.Commit = e.target.checked; },
          })
        ]),
        m("td.Issue", [
          m("input[type='checkbox']", {
            checked: project.events.Issue ,
            onclick: (e) => { project.events.Issue = e.target.checked; },
          })
        ]),
        m("td.MergeRequest", [
          m("input[type='checkbox']", {
            checked: project.events.MergeRequest ,
            onclick: (e) => { project.events.MergeRequest = e.target.checked; },
          })
        ]),
        m("td.Milestone", [
          m("input[type='checkbox']", {
            checked: project.events.Milestone ,
            onclick: (e) => { project.events.Milestone = e.target.checked; },
          })
        ]),
        m("td", [
          m("a.line-select-all[href='#']", {
            onclick: (event) => { select_events(event, true );}
          }, "+"),
          " / ",
          m("a.line-select-none[href='#']", {
            onclick: (event) => { select_events(event, false );}
          }, "-"),
        ]),
      ]);
    });
  };
  const tHeaderProjects = () => {
    return m("tr", [
      m("th.projects-name", "Project name"),
      m("th", [m("i.fa.fa-upload[title='Commit' aria-hidden='true']"), "Commit"]),
      m("th", [m("i.fa.fa-exclamation-circle[title='Issue' aria-hidden='true']"), "Issue",]),
      m("th", [m("i.fa.fa-code-fork[title='MergeRequest' aria-hidden='true']"), "MergeRequest",]),
      m("th", [m("i.fa.fa-calendar[title='Milestone' aria-hidden='true']"), "Milestone"])
    ]);
  };
  const quickSelectCol = (column) => {
    return [
      m("a.select-all[href='#']", { onclick: (event) => { selectProject(event, column, true); } }, "+"),
      " / ",
      m("a.select-none[href='#']", { onclick: (event) => { selectProject(event, column, false); } }, "-")
    ];
  };
  const quickSelect = () => {
    return m("tr", [
      m("th.projects-name", ""),
      m("th.quickSelectCol", quickSelectCol("Commit")),
      m("th.quickSelectCol", quickSelectCol("Issue")),
      m("th.quickSelectCol", quickSelectCol("MergeRequest")),
      m("th.quickSelectCol", quickSelectCol("Milestone")),
      m("th.quickSelectCol")
    ]);
  };

  return m("div", [
    m("h2", [
      m("i.fa.fa-gitlab[aria-hidden='true']"),
      "GitLab Setting",
    ]),
    m(".form-horizontal[role='form']", [
      m(".form-group", [
        m("label.col-sm-3.control-label[for='gitlab_path']", "GitLab Path"),
        m(".col-sm-5", [
          m("input.form-control[id='gitlab_path'][placeholder='http://example.com/'][type='text']", {
            value: state.gitlab_path,
            oninput: (e) => { state.gitlab_path = e.target.value; }
          })
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='api_path']", "GitLab API Path"),
        m(".col-sm-5", [
          m("input.form-control[id='api_path'][placeholder='http://example.com/api/v4/'][type='text']", {
            value: state.api_path,
            oninput: (e) => { state.api_path = e.target.value; }
          })
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='private_token']", "Private token"),
        m(".col-sm-5", [
          m("input.form-control[id='private_token'][type='password']", {
            value: state.private_token,
            oninput: (e) => { state.private_token = e.target.value; }
          })
        ])
      ])
    ]),
    m("h2", [
      m("i.fa.fa-bell[aria-hidden='true']"),
      "Notification Setting"]
    ),
    m(".form-horizontal[role='form']", [
      m(".form-group", [
        m("label.col-sm-3.control-label[for='polling_second']", "Polling interval"),
        m(".col-sm-5", [
          m("input.form-control[id='polling_second'][type='text']", {
            value: state.polling_second,
            oninput: (e) => { state.polling_second = e.target.value; }
          }),
          m("span.help-block", "Polling interval, in seconds. (Need chrome to restart)")
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='max_event_count']", "Notification to show"),
        m(".col-sm-5", [
          m("input.form-control[id='max_event_count'][type='text']", {
            value: state.max_event_count,
            oninput: (e) => { state.max_event_count = e.target.value; }
          })
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='max_notification_count']", "Notification per project"),
        m(".col-sm-5", [
          m("input.form-control[id='max_notification_count'][type='text']", {
            value: state.max_notification_count,
            oninput: (e) => { state.max_notification_count = e.target.value; }
          })
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.control-label[for='new_mark_minute']", "Mark event as new"),
        m(".col-sm-5", [
          m("input.form-control[id='new_mark_minute'][type='text']", {
            value: state.new_mark_minute,
            oninput: (e) => { state.new_mark_minute = e.target.value; }
          }),
          m("span.help-block", [
            "The event will be set as ",
            m("b", "bold"),
            " for the given amount of minutes"
          ])
        ])
      ]),
      m(".form-group", [
        m("label.col-sm-3.text-right[for='ignore_own_events']", "Ignore own events"),
        m(".col-sm-5", [
          m("input[id='ignore_own_events'][type='checkbox']", {
            checked: state.ignore_own_events,
            onclick: (e) => { state.ignore_own_events = e.target.checked; },
          })
        ])
      ])
    ]),
    m("div.buttons",
      m("a.btn-info.btn[href='./trigger.html'][role='button']", [
        m("span.glyphicon.glyphicon-send"),
        "Trigger"
      ])
    ),
    m("div.buttons", [
      m("button.clear.btn.btn-danger", {onclick: clearCache}, [
        m("span.glyphicon.glyphicon-trash"),
        "Clear cache"
      ]),
      m("button.save.btn.btn-primary", {onclick: saveOptions}, [
        m("span.glyphicon.glyphicon-save"),
        "Save"
      ]),
    ]),
    m("span.status", state.status_message),
    m("h2", [
      m("i.fa.fa-envelope[aria-hidden='true']"),
      "Repository Events"]),
    m("form.form-inline[role='form'].form-custom", [
      m(".form-group.col-xs-4", [
        m(".input-group", [
          m(".input-group-addon", [
            m("span.glyphicon.glyphicon-search")
          ]),
          m("input.form-control[id='search_repository'][placeholder='Project name'][type='text']", {
            oninput: (e) => { state.search_key = e.target.value; },
            value: state.search_key,
          })
        ])
      ]),
      m("button.btn.btn-default", {
        onclick: (event) => {
          state.reloadGitLabFromConfig();
          state.gitlab.loadProjects();
          event.preventDefault();
        }
      }, [
        m("span.glyphicon.glyphicon-refresh"),
        "Refresh Repository List"
      ])
    ]),
    m("table.table.table-striped.table-hover", [
      m("thead", tHeaderProjects() ),
      m("tbody[id='projects']", projects()),
      m("tfoot", quickSelect() )
    ]),
    m("div.buttons", [
      m("button.clear.btn.btn-danger", {onclick: clearCache}, [
        m("span.glyphicon.glyphicon-trash"),
        "Clear cache"
      ]),
      m("button.save.btn.btn-primary", {onclick: saveOptions}, [
        m("span.glyphicon.glyphicon-save"),
        "Save"
      ])
    ]),
    m("span.status", state.status_message),
  ]);
};

try {
  module.exports = app;
} catch (e){
}
