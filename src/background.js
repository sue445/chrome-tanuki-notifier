var background = {
    notify: function(args){
        var project      = args.project;
        var projectEvent = args.projectEvent;
        var internal     = args.internal;
        var currentTime  = args.currentTime;

        util.checkArgs(args, ["project", "projectEvent", "internal", "currentTime"]);

        var notificationId =  JSON.stringify({
            project_name: project.name,
            target_type:  projectEvent.target_type,
            target_id:    internal.target_id,
            target_url:   internal.target_url,
            notified_at:  currentTime.getTime()
        });

        this.createNotification({
            notificationId: notificationId,
            title:          project.name,
            message:        "[" + projectEvent.target_type + "] #" + internal.target_id + " " + projectEvent.target_title +  " " + projectEvent.action_name
        });

        projectEvent.project_name = project.name;
        projectEvent.target_id = internal.target_id;
        projectEvent.target_url = internal.target_url;
        projectEvent.notified_at = currentTime;
        config.addNotifiedHistories([projectEvent]);

        this.incNotificationCount();
    },

    createNotification: function(args){
        var notificationId = args.notificationId;
        var title          = args.title;
        var message        = args.message;

        util.checkArgs(args, ["notificationId", "title", "message"]);

        chrome.notifications.create(
            notificationId,
            {
                type:     "basic",
                iconUrl:  "img/gitlab-icon.png",
                title:    title,
                message:  message,
                priority: 0
            },
            function(notificationId){
                //alert("failed notification: " + notificationId);
            }
        );
    },

    incNotificationCount: function(){
        chrome.browserAction.getBadgeText({}, function(badgeText){
            var oldCount = this.toInt(badgeText);
            chrome.browserAction.setBadgeText({text: String(oldCount + 1)});
        });
    },

    toInt: function(str){
        return parseInt(str) || 0;
    }
};

(function($){
    function fetch(){
        $.each(config.getActiveProjects(), function(projectId, project){
            gitlab.getProjectEvents(projectId).done(function(projectEvents){
                // latest check
                if(projectEvents.length < 1){
                    return;
                }

                var latest = projectEvents[0];
                var recent = config.getRecentEvent(projectId)

                if(!recent){
                    config.setRecentEvent(projectId, latest);

                    // Not show notification when first running
                    return;
                }

                if(isSameEvent(latest, recent)){
                    // not changed
                   return;
                }
                config.setRecentEvent(projectId, latest);

                var eventCount = 0;
                $.each(projectEvents, function(index, projectEvent){
                    if(isSameEvent(projectEvent, recent)){
                        // break loop
                        return false;
                    }
                    var project = config.getProject(projectId);
                    if(!project.events[projectEvent.target_type]){
                        // continue loop
                        return;
                    }

                    if(eventCount >= config.getMaxEventCount()){
                        // break loop
                        return false;
                    }
                    eventCount++;

                    gitlab.getEventInternalId({
                        project_name: project.name,
                        target_type:  projectEvent.target_type,
                        target_id:    projectEvent.target_id
                    }, function(internal){
                        background.notify({
                            project:      project,
                            projectEvent: projectEvent,
                            internal:     internal,
                            currentTime:  new Date()
                        });
                    });
                });
            });
        });
    }

    function isSameEvent(event1, event2){
        return event1.target_id == event2.target_id && event1.target_type == event2.target_type && event1.action_name == event2.action_name;
    }

    $(document).ready(function(){
        chrome.notifications.onClicked.addListener(function(notificationId){
            // open event page
            var notification = JSON.parse(notificationId);
            chrome.tabs.create({url: notification.target_url});
        });

        chrome.browserAction.setBadgeText({text: ""});
        fetch();
        setInterval(function(){
            fetch();
        }, config.getPollingSecond() * 1000);
    });
})(jQuery);
