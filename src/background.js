(function($){
    function fetch(){
        var projects = config.getActiveProjects();
        var notificationCount = 0;

        var notifiedHistories = [];
        $.each(projects, function(projectId, project){
            var df = gitlab.getProjectEvents(projectId).done(function(projectEvents){
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
                        return false;
                    }
                    var configEvents = projects[projectId].events;
                    if(configEvents[projectEvent.target_type]){
                        if(eventCount >= config.getMaxEventCount()){
                            return false;
                        }
                        eventCount++;

                        var project_name = projects[projectEvent.project_id].name;

                        gitlab.getEventInternalId({
                            project_name: project_name,
                            target_type:  projectEvent.target_type,
                            target_id:    projectEvent.target_id
                        }, function(res){
                            var message = "[" + projectEvent.target_type + "] #" + res.target_id + " " + projectEvent.target_title +  " " + projectEvent.action_name;

                            var notified_at = new Date();
                            var notificationId =  JSON.stringify({
                                project_name: project_name,
                                target_type:  projectEvent.target_type,
                                target_id:    res.target_id,
                                target_url:   res.target_url,
                                notified_at:  notified_at.getTime()
                            });

                            chrome.notifications.create(
                                notificationId,
                                {
                                    type:     "basic",
                                    iconUrl:  "img/gitlab-icon.png",
                                    title:    project_name,
                                    message:  message,
                                    priority: 0
                                },
                                function(notificationId){
//                                alert("failed notification: " + notificationId);
                                }
                            );
                            projectEvent.project_name = project_name;
                            projectEvent.target_id = res.target_id;
                            projectEvent.target_url = res.target_url;
                            projectEvent.notified_at = notified_at;
                            config.addNotifiedHistories([projectEvent]);

                            notificationCount++;
                            showNotificationCount(notificationCount);
                        });
                    }
                });
            });
        });
    }

    function isSameEvent(event1, event2){
        return event1.target_id == event2.target_id && event1.target_type == event2.target_type && event1.action_name == event2.action_name;
    }

    function showNotificationCount(count){
        chrome.browserAction.getBadgeText({}, function(badgeText){
            var oldCount = toInt(badgeText);
            chrome.browserAction.setBadgeText({text: String(oldCount + count)});
        });
    }

    function toInt(str){
        return parseInt(str) || 0;
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
