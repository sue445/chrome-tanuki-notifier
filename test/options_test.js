global.window = require("mithril/test-utils/browserMock.js")();
global.document = window.document;

const assert = require("power-assert");
const Options = require("../src/options.js");
const projects = require("./stub/projects.json");

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
          projects: projects
        }
      }
    });

    assert(vnode.tag == "div");
    assert(vnode.children.length > 0);
  });
});
