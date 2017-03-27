global.window = require("mithril/test-utils/browserMock.js")();
global.document = window.document;

const assert = require("power-assert");
const Popup = require("../src/popup.es6");

describe("Popup", () => {
  it("works", () => {
    const vnode = Popup.view({
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
        histories: [
          {
            _id: "219579_Issue_4851383_closed",
            action_name: "closed",
            author: {
              avatar_url: "https://secure.gravatar.com/avatar/fbf625a9c371d2d87fe0d4343b68dc65?s=80&d=identicon",
              id: 125864,
              name: "sue445",
              state: "active",
              username: "sue445",
              web_url: "https://gitlab.com/sue445"
            },
            author_id: 125864,
            author_username: "sue445",
            created_at: "2017-03-25T10:18:52.073Z",
            data: null,
            message: "[Issue] #3 test closed",
            notified_at: "2017-03-25T10:18:52.073Z",
            project_id: 219579,
            project_name: "sue445/example",
            target_id: 3,
            target_title: "test",
            target_type: "Issue",
            target_url: "https://gitlab.com/sue445/example/issues/3",
            title: null
          },
        ],
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
