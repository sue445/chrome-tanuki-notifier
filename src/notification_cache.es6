class NotificationCache {
  constructor(storage){
    this.storage = storage || {};
    this.storage_key = "notificationCache"
  }

  add(event) {
    const key = this.cacheKey(event);
    const cache = this.load();
    cache[key] = true;
    this.save(cache);
  }

  isNotified(event) {
    const key = this.cacheKey(event);
    const cache = this.load();
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

  load(){
    return JSON.parse(this.storage[this.storage_key] || "{}");
  }

  save(cache) {
    this.storage[this.storage_key] = JSON.stringify(cache);
  }
}

try {
  module.exports = NotificationCache;
} catch (e){
}
