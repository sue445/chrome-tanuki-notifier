var notification = {
    notify: function(args){
        var project       = args.project;
        var project_event = args.project_event;
        var internal      = args.internal;
        var current_time  = args.current_time;
        var message       = args.message;

        util.checkArgs(args, ["project", "project_event", "internal", "current_time", "message"]);

        var notification_id =  JSON.stringify({
            target_url:   internal.target_url,
            message:      message
        });

        this.createNotification({
            notification_id: notification_id,
            title:           project.name,
            message:         message
        });

        // use current timestamp as project_event_id
        project_event._id          = new Date(current_time).getTime();
        project_event.project_name = project.name;
        project_event.target_id    = internal.target_id;
        project_event.target_url   = internal.target_url;
        project_event.notified_at  = current_time;
        project_event.message      = message;
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
                iconUrl:  "img/gitlab-icon.png",
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
