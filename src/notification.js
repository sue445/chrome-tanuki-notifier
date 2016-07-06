var notification = {
    notify: function(args){
        var project       = args.project;
        var project_event = args.project_event;
        var internal      = args.internal;
        var current_time  = args.current_time;
        var message       = args.message;
        var author_id     = args.author_id || '';

        util.checkArgs(args, ["project", "project_event", "internal", "current_time", "message"]);

        var notifiedEvent = notification_cache.isNotified(project_event);

        if (notifiedEvent){
            // Don't notify same event
            return;
        }

        notification_cache.add(project_event);
        var notification_id = notification_cache.cacheKey(project_event);

        this.createNotification({
            avatar_url:      project.avatar_url,
            notification_id: notification_id,
            title:           project.name,
            message:         message
        });

        // use hash of notification_id as unique id
        project_event._id          = notification_id;
        project_event.project_name = project.name;
        project_event.target_id    = internal.target_id;
        project_event.target_url   = internal.target_url;
        project_event.notified_at  = current_time;
        project_event.message      = message;
        project_event.author_id    = author_id;
        config.addNotifiedHistories([project_event]);

        this.incNotificationCount();
    },

    createNotification: function(args){
        var notification_id = args.notification_id;
        var title           = args.title;
        var message         = args.message;

        util.checkArgs(args, ["notification_id", "title", "message"]);

        chrome.notifications.create(
            notification_id,
            {
                type:     "basic",
                iconUrl:  args.avatar_url || "img/gitlab_logo_128.png",
                title:    title,
                message:  message,
                priority: 0
            },
            function(){
                // do nothing
            }
        );
    },

    incNotificationCount: function(){
        this.notification_count ++;
        chrome.browserAction.setBadgeText({text: String(this.notification_count)});
    },

    notification_count: 0
};
