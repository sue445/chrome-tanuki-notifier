var avatar_cache = (function(){
    var STORAGE_KEY = "avatarCache";

    // 1 day
    var EXPIRATION = 1000 * 60 * 60 * 24;

    // public methods
    function get(key){
        var cache = load();

        if (!cache[key]) {
            return null;
        }

        var expire_time = cache[key].expire_time;
        var now = new Date();

        if(expire_time < now.getTime()){
            // expired
            return null;
        }

        return cache[key].data;
    }

    function set(key, data){
        var cache = load();
        var now = new Date();
        cache[key] = { expire_time: now.getTime() + EXPIRATION, data: data };
        localStorage[STORAGE_KEY] = JSON.stringify(cache);
    }

    return {
        get: get,
        set: set
    };

    // private methods
    function load(){
        return JSON.parse(localStorage[STORAGE_KEY] || "{}");
    }
}());
