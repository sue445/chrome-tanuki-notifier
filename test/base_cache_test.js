const assert = require("power-assert");
const BaseCache = require("../src/base_cache.js");

describe("BaseCache", () => {
  let storage, cache, storage_key;

  beforeEach(() => {
    storage = {};
    storage_key = "storage_key";
    cache = new BaseCache(storage, storage_key);
  });

  describe("#save()", () => {
    it("should save as json", () => {
      const data = {key1: true, key2: true};
      cache.save(data);
      assert(storage[storage_key] == '{"key1":true,"key2":true}');
    });
  });

  describe("#load()", () => {
    context("When not exists data", () => {
      it("should load as hash", () => {
        assert.deepEqual(cache.load(), {});
      });
    });

    context("When exists cache", () => {
      beforeEach(() => {
        storage[storage_key] = '{"key1":true,"key2":true}';
      });

      it("should load as hash", () => {
        assert.deepEqual(cache.load(), {key1: true, key2: true});
      });
    });
  });
});
