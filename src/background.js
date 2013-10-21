(function($){
    function fetch(){
        var projects = config.getActiveProjects();
        var ajaxProjectEvents = [];
        var recentEvents = config.getRecentEvents();
        var notificationCount = 0;

        var notifiedHistories = [];
        $.each(projects, function(projectId, project){
            var df = gitlab.getProjectEvents(projectId).done(function(projectEvents){
                // latest check
                if(projectEvents.length < 1){
                    return;
                }

                var latest = projectEvents[0];
                var recent = recentEvents[projectId];

                if(!recent){
                    recentEvents[projectId] = latest;

                    // Not show notification when first running
                    return;
                }

                if(isSameEvent(latest, recent)){
                    // not changed
                   return;
                }
                recentEvents[projectId] = latest;

                var eventCount = 0;
                $.each(projectEvents, function(index, projectEvent){
                    if(isSameEvent(projectEvent, recent)){
                        return false;
                    }
                    var configEvents = projects[projectId].events;
                    if(configEvents[projectEvent.target_type]){
                        if(eventCount >= config.getMaxEventCount()){
                            return false;
                        }
                        eventCount++;
                        var message = "[" + projectEvent.target_type + "] #" + projectEvent.target_id + " " + projectEvent.target_title +  " " + projectEvent.action_name;
                        var notificationId = gitlab.getEventUrl(projectEvent) + ";" + (new Date()).getTime();
                        projectEvent.project_name = projects[projectEvent.project_id].name;
                        projectEvent.notified_at = new Date();
                        chrome.notifications.create(
                            notificationId,
                            {
                                type:     "basic",
                                iconUrl:  "img/gitlab-icon.png",
                                title:    projectEvent.project_name,
                                message:  message,
                                priority: 0
                            },
                            function(notificationId){
//                                alert("failed notification: " + notificationId);
                            }
                        );
                        notifiedHistories.push(projectEvent);

                        notificationCount++;
                        showNotificationCount(notificationCount);
                    }
                });
            });
            ajaxProjectEvents.push(df);
        });

        $.when.apply(null, ajaxProjectEvents).then(function(){
            config.addNotifiedHistories(notifiedHistories);
            config.setRecentEvents(recentEvents);
        });
    }

    function isSameEvent(event1, event2){
        return event1.target_id == event2.target_id && event1.target_type == event2.target_type && event1.action_name == event2.action_name;
    }

    function showNotificationCount(count){
        chrome.browserAction.setBadgeText({text: String(count)});
    }

    $(document).ready(function(){
        chrome.notifications.onClicked.addListener(function(notificationId){
            var url = notificationId.split(";", 2)[0];
            chrome.tabs.create({'url': url});
        });

        chrome.browserAction.setBadgeText({text: ""});
        fetch();
        setInterval(function(){
            fetch();
        }, config.getPollingSecond() * 1000);
    });
})(jQuery);
