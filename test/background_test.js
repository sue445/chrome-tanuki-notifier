global.window = require("mithril/test-utils/browserMock.js")();
global.document = window.document;

const assert = require("power-assert");
const Background = require("../src/background.js");
const Config = require("../src/config.js");
const Notification = require("../src/notification.js");
const NotificationCache = require("../src/notification_cache.js");

describe("Background", () => {
  let background, config, storage, notification, notification_cache, project_ids, project, chrome;

  beforeEach(() => {
    storage = {};

    project_ids = [15];

    project = {
      avatar_url: "https://gitlab.com/uploads/project/avatar/219579/image.jpg",
      events: {
        Commit: true,
        Issue: true,
        MergeRequest: true,
        Milestone: true
      },
      name: "sue445/example"
    };

    config = new Config(storage);
    config.gitlabPath = "http://example.com/";
    config.activeProjectIds = () => {
      return project_ids;
    };
    config.getProject = (_project_id) => {
      return project;
    };

    notification_cache = new NotificationCache(storage);

    chrome = {};

    notification = new Notification({
      config: config,
      chrome: chrome,
      notification_cache: notification_cache,
    });

    background = new Background({
      config: config,
      notification: notification,
      notification_cache: notification_cache,
    });
  });

  describe("#notifyProjectEvent()", () => {
    const project_id = 15;

    let project_event, notify_count;

    beforeEach(() => {
      notify_count = 0;
    });

    context("When target_type is Commit", () => {
      beforeEach(() => {
        project_event = {
          "title": null,
          "project_id": 15,
          "action_name": "opened",
          "target_id": null,
          "target_type": null,
          "author_id": 1,
          "author": {
            "name": "Dmitriy Zaporozhets",
            "username": "root",
            "id": 1,
            "state": "active",
            "avatar_url": "http://localhost:3000/uploads/user/avatar/1/fox_avatar.png",
            "web_url": "http://localhost:3000/root"
          },
          "author_username": "john",
          "data": {
            "before": "50d4420237a9de7be1304607147aec22e4a14af7",
            "after": "c5feabde2d8cd023215af4d2ceeb7a64839fc428",
            "ref": "refs/heads/master",
            "user_id": 1,
            "user_name": "Dmitriy Zaporozhets",
            "repository": {
              "name": "gitlabhq",
              "url": "git@dev.gitlab.org:gitlab/gitlabhq.git",
              "description": "GitLab: self hosted Git management software. \r\nDistributed under the MIT License.",
              "homepage": "https://dev.gitlab.org/gitlab/gitlabhq"
            },
            "commits": [
              {
                "id": "c5feabde2d8cd023215af4d2ceeb7a64839fc428",
                "message": "Add simple search to projects in public area",
                "timestamp": "2013-05-13T18:18:08+00:00",
                "url": "https://dev.gitlab.org/gitlab/gitlabhq/commit/c5feabde2d8cd023215af4d2ceeb7a64839fc428",
                "author": {
                  "name": "Dmitriy Zaporozhets",
                  "email": "dmitriy.zaporozhets@gmail.com"
                }
              }
            ],
            "total_commits_count": 1
          },
          "target_title": null,
          "created_at": "2015-12-04T10:33:58.089Z"
        };
      });

      it("should call notification.notify", () => {
        notification.notify = (args) => {
          assert.deepEqual(args.project, project);
          assert.deepEqual(args.project_event, project_event);
          assert(args.internal.target_id == "50d442...c5feab");
          assert(args.internal.target_url == "http://example.com/sue445/example/compare/50d4420237a9de7be1304607147aec22e4a14af7...c5feabde2d8cd023215af4d2ceeb7a64839fc428");
          assert(args.message == "[master] @Dmitriy Zaporozhets 50d442...c5feab Add simple search to projects in public area (1 commits)");
          assert(args.current_time == "2015-12-04T10:33:58.089Z");
          assert(args.author_id == 1);
          notify_count ++;
        };

        background.notifyProjectEvent(project_id, project_event);
        assert(notify_count == 1);
      });
    });

    context("When target_type is Issue", () => {
      context("When API v3", () => {
        let target_id, target_url;

        beforeEach(() => {
          target_id = 1;
          target_url = `http://example.com/sue445/example/issues/${target_id}`;

          background.gitlab = {
            apiVersion: 3,
            getEventInternalId: (_args) => {
              return Promise.resolve({target_id: target_id, target_url: target_url});
            }
          };

          project_event = {
            "title": null,
            "project_id": 15,
            "action_name": "closed",
            "target_id": 830,
            "target_type": "Issue",
            "author_id": 1,
            "data": null,
            "target_title": "Public project search field",
            "author": {
              "name": "Dmitriy Zaporozhets",
              "username": "root",
              "id": 1,
              "state": "active",
              "avatar_url": "http://localhost:3000/uploads/user/avatar/1/fox_avatar.png",
              "web_url": "http://localhost:3000/root"
            },
            "author_username": "root",
            "created_at": "2015-12-04T10:33:58.089Z"
          };
        });

        it("should call notification.notify", (done) => {
          notification.notify = (args) => {
            assert.deepEqual(args.project, project);
            assert.deepEqual(args.project_event, project_event);
            assert(args.internal.target_id == 1);
            assert(args.internal.target_url == "http://example.com/sue445/example/issues/1");
            assert(args.message == "[Issue] #1 Public project search field closed");
            assert(args.current_time == "2015-12-04T10:33:58.089Z");
            assert(args.author_id == 1);
            notify_count++;
          };

          background.notifyProjectEvent(project_id, project_event).then(() => {
            assert(notify_count == 1);
            done();
          });
        });
      });
    });

    context("When target_type is Note", () => {
      context("When API v3", () => {
        let target_id, target_url;

        beforeEach(() => {
          target_id = 377;
          target_url = `http://example.com/sue445/example/issues/${target_id}`;

          background.gitlab = {
            apiVersion: 3,
            getEventInternalId: (_args) => {
              return Promise.resolve({target_id: target_id, target_url: target_url});
            }
          };

          project_event = {
            "title": null,
            "project_id": 15,
            "action_name": "commented on",
            "target_id": 1312,
            "target_type": "Note",
            "author_id": 1,
            "data": null,
            "target_title": null,
            "created_at": "2015-12-04T10:33:58.089Z",
            "note": {
              "id": 1312,
              "body": "What an awesome day!",
              "attachment": null,
              "author": {
                "name": "Dmitriy Zaporozhets",
                "username": "root",
                "id": 1,
                "state": "active",
                "avatar_url": "http://localhost:3000/uploads/user/avatar/1/fox_avatar.png",
                "web_url": "http://localhost:3000/root"
              },
              "created_at": "2015-12-04T10:33:56.698Z",
              "system": false,
              "noteable_id": 377,
              "noteable_type": "Issue"
            },
            "author": {
              "name": "Dmitriy Zaporozhets",
              "username": "root",
              "id": 1,
              "state": "active",
              "avatar_url": "http://localhost:3000/uploads/user/avatar/1/fox_avatar.png",
              "web_url": "http://localhost:3000/root"
            },
            "author_username": "root"
          };
        });

        it("should call notification.notify", (done) => {
          notification.notify = (args) => {
            assert.deepEqual(args.project, project);
            assert.deepEqual(args.project_event, project_event);
            assert(args.internal.target_id == target_id);
            assert(args.internal.target_url == "http://example.com/sue445/example/issues/377#note_1312");
            assert(args.message == "[Issue] #377 What an awesome day! commented on");
            assert(args.current_time == "2015-12-04T10:33:58.089Z");
            assert(args.author_id == 1);
            notify_count++;
          };

          background.notifyProjectEvent(project_id, project_event).then(() => {
            assert(notify_count == 1);
            done();
          });
        });
      });
    });
  });

  describe("#truncate()", () => {
    const truncate_length = 50;

    context("message <= 200 characters", () => {
      it("should return same message", () => {
        const message = "12345678901234567890123456789012345678901234567890";
        assert(background.truncate(message, truncate_length) == message);
      });
    });

    context("message > 50 characters", () => {
      it("should return truncated message", () => {
        const message = "123456789012345678901234567890123456789012345678901";
        assert(background.truncate(message, truncate_length) == "12345678901234567890123456789012345678901234567890...");
      });
    });
  });
});
