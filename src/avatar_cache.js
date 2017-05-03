try {
  BaseCache = require("./base_cache.js");
} catch (e){
}

class AvatarCache extends BaseCache{
  constructor(storage){
    super(storage, "avatarCache");

    // 1 day
    this.expiration = 1000 * 60 * 60 * 24;
  }

  get(key) {
    const cache = super.load();

    if (!cache[key]) {
      return null;
    }

    const expire_time = cache[key].expire_time;
    const now = new Date();

    if(expire_time < now.getTime()){
      // expired
      return null;
    }

    return cache[key].data;
  }

  set(key, data){
    const cache = super.load();
    const now = new Date();
    cache[key] = { expire_time: now.getTime() + this.expiration, data: data };
    super.save(cache);
  }
}

try {
  module.exports = AvatarCache;
} catch (e){
}
