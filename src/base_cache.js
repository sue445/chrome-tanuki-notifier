class BaseCache {
  constructor(storage, storage_key) {
    this.storage = storage || {};
    this.storage_key = storage_key;
  }

  load(){
    return JSON.parse(this.storage[this.storage_key] || "{}");
  }

  save(cache) {
    this.storage[this.storage_key] = JSON.stringify(cache);
  }
}

try {
  module.exports = BaseCache;
} catch (e){
}
