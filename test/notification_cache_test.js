const assert = require("power-assert");
const NotificationCache = require("../src/notification_cache.js");

describe("NotificationCache", () => {
  let storage, cache;

  beforeEach(() => {
    storage = {};
    cache = new NotificationCache(storage);
  });

  describe("#cacheKey()", () => {
    it("should return generated key", () => {
      const event = {
        project_id: 219579,
        target_type: "Issue",
        target_id: 4851383,
        action_name: "opened",
        created_at: "2013-09-30T13:46:02Z",
      };
      assert(cache.cacheKey(event) == "219579_Issue_4851383_opened_2013-09-30T13:46:02Z");
    });
  });

  describe("#add()", () => {
    it("should return generated key", () => {
      const event = {
        project_id: 219579,
        target_type: "Issue",
        target_id: 4851383,
        action_name: "opened",
        created_at: "2013-09-30T13:46:02Z",
      };
      cache.add(event);

      assert(storage["notificationCache"] == '{"219579_Issue_4851383_opened_2013-09-30T13:46:02Z":true}');
    });
  });

  describe("#isNotified()", () => {
    const event = {
      project_id: 219579,
      target_type: "Issue",
      target_id: 4851383,
      action_name: "opened",
      created_at: "2013-09-30T13:46:02Z",
    };

    context("When exists key in cache", () => {
      beforeEach(() => {
        cache.add(event);
      });

      it("should return true", () => {
        assert(cache.isNotified(event));
      });
    });

    context("When not exists key in cache", () => {
      it("should return false", () => {
        assert(!cache.isNotified(event));
      });
    });
  });
});
