try {
  var m = require("mithril");
  var timeago = require("../lib/timeago");
} catch (e){
}

const app = {};

app.sanitizeUrl = function(url){
  if(!url){
    return url;
  }
  // e.g. https://example.com//namespace/repo -> https://example.com/namespace/repo
  return url.replace(/(https?):\/\/(.+?)\/\//, (match, p1, p2) => {
    return `${p1}://${p2}/`;
  });
};

app.view = function(vnode) {
  const state = vnode.state;

  const current_time = new Date();
  const action_labels = {
    "opened": "label-warning",
    "closed": "label-danger",
    "accepted": "label-success",
    "pushed to": "label-info",
    "pushed new": "label-info",
    "commented on": "label-info"
  };

  const getProjectByName = (project_name) => {
    return Object.entries(state.projects).map((element) => {
      return element[1];
    }).find((project) => {
      return project_name == project.name;
    });
  };

  const eventIcon = (target_type) => {
    target_type = target_type || "Commit";

    switch (target_type) {
      case "Commit":
        return m("i.fa.fa-upload", {title: target_type});
      case "Issue":
        return m("i.fa.fa-exclamation-circle", {title: target_type});
      case "MergeRequest":
        return m("i.fa.fa-code-fork", {title: target_type});
      case "Milestone":
        return m("i.fa.fa-calendar", {title: target_type});
      case "Note":
        return m("i.fa.fa-comment", {title: target_type});
      default:
        return m("span");
    }
  };

  return m("div", [
    m("nav.navbar.navbar-default[role='navigation']", [
      m(".navbar-header", [
        m("button.clear.btn.btn-danger", {
          onclick: () => {
            state.histories = [];
            state.clearConfigCache();
          }
        }, [
          m("span.glyphicon.glyphicon-trash"),
          "Clear cache"
        ]),
        m("button.goto.btn.btn-primary", {
          onclick: () => {
            if(state.gitlabPath){
              window.open(state.gitlabPath);
            }
          }
        }, [
          m("i.fa.fa-gitlab[aria-hidden='true']"),
          "Go to GitLab"
        ]),
        m("button.goto.btn.btn-success", {
          onclick: () => {
            state.markAllAsRead();
          }
        }, [
          m("i.fa.fa-check[aria-hidden='true']"),
          "Mark all as read"
        ]),
        m("button.ciTrigger.btn.btn-info", {
          onclick: () => {
            window.open("trigger.html");
          }
        }, [
          m("i.fa.fa-send[aria-hidden='true']"),
          "ci trigger"
        ])
      ]),
    ]),
    m("ul[id='notifyHistories']", state.histories.map((project_event) => {
      const project = getProjectByName(project_event.project_name);
      const avatar_url = project.avatar_url || "img/gitlab_logo_128.png";
      const project_url = state.gitlabPath + project_event.project_name;

      let li_class = null;
      if (current_time.getTime() - state.new_milli_seconds < (new Date(project_event.notified_at)).getTime()) {
        li_class = "new";
      }

      let message = project_event.message;
      if (!message) {
        // for previous version cache
        if (project_event.target_type === "Commit") {
          message = project_event.target_title;
        } else {
          message = `#${project_event.target_id} ${project_event.target_title}`;
        }
      }

      let author_avatar;
      if(project_event.author_id){
        author_avatar = m("img.icon.img-circle.pull-left.icon-avatar", {
          src: state.gitlab.avatar_urls[project_event.author_id],
        });
      }

      return m("li", {class: li_class}, [
        m("img.icon.img-rounded", {src: avatar_url, align: "left"}),
        author_avatar,
        eventIcon(project_event.target_type),
        m("span", " "),
        m("span.label", {class: action_labels[project_event.action_name]}, project_event.action_name),
        m("span", " "),
        m("span.timeago",
          {title: project_event.notified_at},
          new timeago().format(project_event.notified_at)
        ),
        m("span", " "),
        m("a", {href: project_url, target: "_blank"}, `[${project_event.project_name}]`),
        m("span.remove-btn.pull-right.glyphicon.glyphicon-remove", {
          title: "Remove this notification",
          onclick: (_event) => {
            state.histories = state.histories.filter((project_event2) => {
              return project_event._id != project_event2._id;
            });
            state.saveNotifiedHistories(state.histories);
          }
        }),
        m("a.eventLink", {href: app.sanitizeUrl(project_event.target_url), target: "_blank"}, message),
      ]);
    }))
  ]);
};

try {
  module.exports = app;
} catch (e){
}
