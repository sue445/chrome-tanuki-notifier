try {
  BaseCache = require("./base_cache.es6");
} catch (e){
}

class NotificationCache extends BaseCache{
  constructor(storage){
    super(storage, "notificationCache");
  }

  add(event) {
    const key = this.cacheKey(event);
    const cache = super.load();
    cache[key] = true;
    this.save(cache);
  }

  isNotified(event) {
    const key = this.cacheKey(event);
    const cache = super.load();
    return cache[key];
  }

  cacheKey(event) {
    const array = [
      event.project_id,
      event.target_type,
      event.target_id,
      event.action_name,
      event.created_at,
    ];

    return array.join("_");
  }
}

try {
  module.exports = NotificationCache;
} catch (e){
}
