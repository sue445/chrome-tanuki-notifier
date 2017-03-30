global.window = require("mithril/test-utils/browserMock.js")();
global.document = window.document;

const assert = require("power-assert");
const Options = require("../src/options.es6");

describe("Options", () => {
  it("works", () => {
    const vnode = Options.view({
      state: {
        gitlab_path: "http://example.com",
        api_path: "http://example.com/api/v3",
        private_token: "xxxxxxxxxx",
        polling_second: 60,
        max_event_count: 100,
        max_notification_count: 10,
        new_mark_minute: 10,
        config_projects: {},
        search_key: "",
        status_message: "",
        gitlab: {
          projects: [
            {
              path_with_namespace: "diaspora/diaspora-client",
              archived: false,
              avatar_url: "http://example.com/uploads/project/avatar/4/uploads/avatar.png",
              events: {
                Commit: true,
                Issue: true,
                MergeRequest: true,
                Milestone: true
              }
            }
          ]
        }
      }
    });

    assert(vnode.tag == "div");
    assert(vnode.children.length > 0);
  });
});
