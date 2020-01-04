global.window = require("mithril/test-utils/browserMock.js")();
global.document = window.document;
global.requestAnimationFrame = cb => cb();

const assert = require("power-assert");
const trigger = require("../src/trigger.js");

describe("trigger", () => {
  it("works", () => {
    const vnode = trigger.view({
      state: {
        projects: {
          "219579": {
            avatar_url: "https://gitlab.com/uploads/project/avatar/219579/image.jpg",
            events: {
              Commit: true,
              Issue: true,
              MergeRequest: true,
              Milestone: true
            },
            name: "sue445/example"
          },
        },
        new_milli_seconds: 1000,
        
        gitlab_path: "http://example.com",
        gitlab: {
          avatar_urls: {
            1: "http://example.com/uploads/project/avatar/4/uploads/avatar.png",
          }
        }
      }
    });

    assert(vnode.tag == "div");
    assert(vnode.children.length > 0);
  });
});
