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

  const branchList = () => {
    if (!state.gitlab.branchs) {
      return m("li", m("div","------"));
    }
    return state.gitlab.branchs.filter((branch) =>{ 
      return branch;
    }).map((branch) => {
      return m("li",  m("a", {
        onclick: (e) => {
          this.branch_name = branch.name;
          e.preventDefault();
        }
      }, 
      branch.name
      ));
    });
  };
  const branchBtn = () => {
    return m("div.dropdown",[
      m('button.btn.btn-primary.btn-block.dropdown-toggle[type="button"][data-toggle="dropdown"]', [
        "branch ", m("span.caret")
      ]),
      m('ul.dropdown-menu[role="menu"]',branchList()),
    ]);
  };
  const tokenList = () => {
    if (!state.gitlab.triggers) {
      return m("li.token", m("div","------"));
    }
    return state.gitlab.triggers.filter((token) =>{ 
      return token; 
    }).map((token) => {
      return m("li.token", 
        m("a", {
          onclick: (e) => {
            this.trigger_token = token.token;
            e.preventDefault();
          }
        }, 
        token.token)
      );
    });
  };
  const tokenBtn = () => {
    return m("div.dropdown",[
      m('button.btn.btn-primary.btn-block.dropdown-toggle[type="button"][data-toggle="dropdown"]', [
        "token ", m("span.caret")
      ]),
      m("ul.dropdown-menu", tokenList() ),
    ]);
  };

  const projList = () => {
    if(!state.gitlab.projects) {
      return m("li.active", [
        m(".progress", [
          m(".progress-bar.progress-bar-striped.active[aria-valuemax='100'][aria-valuemin='0'][aria-valuenow='100'][role='progressbar']", {style: {"width": "100%"}}, [
            m("span.sr-only", "Now Loading")
          ])
        ])
      ]);
    }

    return state.gitlab.projects.filter((project) =>{
      return matchSearchKey(project);
    }).map((project) => {
      const names = [];
      var avatar = "../img/gitlab_logo_48.png";
      if(project.avatar_url) {
        avatar = project.avatar_url;
      }
      names.push(m("img.icon.img-rounded", {src: avatar}));
      names.push(
        m('button.btn[id="projName"]', {
          onclick: (e) => {
            this.project_name = project.path_with_namespace;
            state.gitlab.loadBranchs( this.project_name );
            state.gitlab.loadTriggers( this.project_name );
            e.preventDefault();
          }
        }, 
        project.path_with_namespace
        ) );
      return m("li.name", m("div",names));
    });
  };

  return m("div", [
    m("h2", [
      m("i.fa.fa-gitlab[aria-hidden='true']"),
      "GitLab CI trigger",
    ]),
    m("form.form-inline[role='form']", [
      m(".form-group.col-xs-4", [
        m(".input-group", [
          m(".input-group-addon", [
            m("span.glyphicon.glyphicon-search")
          ]),
          m("input.form-control[id='search_repository'][placeholder='Project name'][type='text']", {
            oninput: m.withAttr("value", (value) => { state.search_key = value; }),
            value: state.search_key,
          })
        ])
      ]),
      m("button.btn.btn-info", {
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
    m("div.row", [
      m("nav.col-sm-4[id=porjNav]", [
        m("ul.nav.nav-pills.nav-stacked", projList()),
      ]),
      m("nav.col-sm-6[id=porjNav]", [
        m("div.row.form-group", [
          m("nav.col-sm-3", m("button.btn.btn-primary.btn-block","project")),
          m("nav.col-sm-7", m("button.btn.btn-block", this.project_name)),
        ]),
        m("div.row.form-group", [
          m("nav.col-sm-3", m("div",tokenBtn())),
          m("nav.col-sm-7", m("button.btn.btn-block", this.trigger_token)),
        ]),
        m("div.row.form-group", [
          m("nav.col-sm-3", m("div",branchBtn())),
          m("nav.col-sm-7", m("button.btn.btn-block", this.branch_name)),
        ]),
        m("div.row.form-group", [
          m("button.btn-block.btn-primary.btn",{onclick: (e) => {
            var data = { 
              "token": this.trigger_token,
              "ref"  : this.branch_name, 
            };
            var projId = encodeURIComponent(this.project_name);
            m.request({
              url: `${this.api_path}/projects/${projId}/trigger/builds`,
              method: "POST",
              data: data,
            }).then((message) => {
              state.trigger_message = JSON.stringify(message);
            }).catch((e) => {
              alert(e);
            });
            e.preventDefault();
          }},[m("span.glyphicon.glyphicon-send"),"trigger"]),
        ]),
        m("div.row.form-group", m("span.triggerMSG", state.trigger_message)),
        m("div.row.form-group", m("span.pipeline_link", "")),
      ]),
    ]),
    m("span.status", state.status_message),
  ]);
};

try {
  module.exports = app;
} catch (e){
}
