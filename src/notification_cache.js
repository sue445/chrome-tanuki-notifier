var notification_cache = (function(){
    var STORAGE_KEY = "notificationCache";

    // public methods
    function add(event) {
        var key = cacheKey(event);
        var cache = load();
        cache[key] = true;
        save(cache);
    }

    function isNotified(event) {
        var key = cacheKey(event);
        var cache = load();
        return cache[key];
    }

    function cacheKey(event) {
        var array = [
            event.project_id,
            event.target_type,
            event.target_id,
            event.action_name
        ];

        return array.join("_");
    }

    return {
        add:        add,
        isNotified: isNotified,
        cacheKey:   cacheKey
    };

    // private methods
    function load(){
        return JSON.parse(localStorage[STORAGE_KEY] || "{}");
    }

    function save(cache) {
        localStorage[STORAGE_KEY] = JSON.stringify(cache);
    }
}());
