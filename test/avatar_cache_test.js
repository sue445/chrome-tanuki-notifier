const assert = require("power-assert");
const AvatarCache = require("../src/avatar_cache.js");

describe("AvatarCache", () => {
  const one_day = 1000 * 60 * 60 * 24;
  const avatar_url = "https://secure.gravatar.com/avatar/fbf625a9c371d2d87fe0d4343b68dc65?s=80&d=identicon";

  let storage, cache;

  beforeEach(() => {
    storage = {};
    cache = new AvatarCache(storage);
  });

  describe("#get()", () => {
    context("Not found in cache", () => {
      it("should return null", () => {
        assert(cache.get("key") == null)
      })
    });

    context("cache is not expired", () => {
      beforeEach(() => {
        const avatars = {
          key: {
            expire_time: new Date().getTime() + one_day,
            data: avatar_url,
          }
        };

        cache.save(avatars);
      });

      it("should return avatar_url", () => {
        assert(cache.get("key") == avatar_url)
      })
    });

    context("cache is expired", () => {
      beforeEach(() => {
        const avatars = {
          key: {
            expire_time: new Date().getTime() - one_day,
            data: avatar_url,
          }
        };

        cache.save(avatars);
      });

      it("should return null", () => {
        assert(cache.get("key") == null)
      })
    });
  })
});
