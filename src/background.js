var background = {
    notify: function(args){
        var project      = args.project;
        var projectEvent = args.projectEvent;
        var internal     = args.internal;
        var currentTime  = args.currentTime;
        var message      = args.message;

        util.checkArgs(args, ["project", "projectEvent", "internal", "currentTime", "message"]);

        var notificationId =  JSON.stringify({
            target_url:   internal.target_url,
            message:      message
        });

        this.createNotification({
            notificationId: notificationId,
            title:          project.name,
            message:        message
        });

        projectEvent.project_name = project.name;
        projectEvent.target_id    = internal.target_id;
        projectEvent.target_url   = internal.target_url;
        projectEvent.notified_at  = currentTime;
        projectEvent.message      = message;
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
                // do nothing
            }
        );
    },

    incNotificationCount: function(){
        this.notificationCount ++;
        chrome.browserAction.setBadgeText({text: String(this.notificationCount)});
    },

    notificationCount: 0
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

                latest.target_type = latest.target_type || "Commit";
                if(latest.target_type == "Commit"){
                    // Commit has null target_id
                    latest.target_id = getCommitTargetId(latest);
                }

                if(!recent){
                    config.setRecentEvent(projectId, latest);

                    // Not show notification when first running
                    return;
                }

                if(isSameEvent(latest, recent)){
                    // not changed
                   return;
                }

                var eventCount = 0;
                $.each(projectEvents, function(index, projectEvent){
                    projectEvent.target_type = projectEvent.target_type || "Commit";
                    if(projectEvent.target_type == "Commit"){
                        // Commit has null target_id
                        projectEvent.target_id = getCommitTargetId(projectEvent);
                    }

                    if(index == 0){
                        config.setRecentEvent(projectId, projectEvent);
                    }

                    if(isSameEvent(projectEvent, recent) || eventCount >= config.getMaxNotificationCount()){
                        // break loop
                        return false;
                    }

                    if(!isNotifyTargetEvent(projectId, projectEvent.target_type)){
                        // continue loop
                        return;
                    }

                    var project = config.getProject(projectId);

                    if(projectEvent.target_type == "Commit"){
                        var commitMessage = getCommitMessage(projectEvent);
                        var displayId = getCommitTargetId(projectEvent);
                        var targetUrl = getCommitTargetUrl(projectId, projectEvent);

                        if(targetUrl && commitMessage){
                            var branchName = projectEvent.data.ref.replace(/^refs\/heads\//, "");
                            projectEvent.target_title = commitMessage;

                            background.notify({
                                project:      project,
                                projectEvent: projectEvent,
                                internal: {
                                    target_id:  displayId,
                                    target_url: targetUrl
                                },
                                message:      "[" + branchName + "] " + "@" + projectEvent.data.user_name + " " + displayId + " " + projectEvent.target_title + " (" + projectEvent.data.total_commits_count + " commits)",
                                currentTime:  new Date()
                            });
                            eventCount++;
                        }

                    } else if(projectEvent.target_type == "Issue" || projectEvent.target_type == "MergeRequest" || projectEvent.target_type == "Milestone"){
                        // Issue, MergeRequest, Milestone
                        gitlab.getEventInternalId({
                            project_name: project.name,
                            target_type:  projectEvent.target_type,
                            target_id:    projectEvent.target_id
                        }, function(internal){
                            background.notify({
                                project:      project,
                                projectEvent: projectEvent,
                                internal:     internal,
                                message:      "[" + projectEvent.target_type + "] #" + internal.target_id + " " + projectEvent.target_title +  " " + projectEvent.action_name,
                                currentTime:  new Date()
                            });
                            eventCount++;
                        });
                    }
                });
            });
        });
    }

    function getCommitMessage(projectEvent){
        if(!projectEvent.data || !projectEvent.data.commits || projectEvent.data.commits.length == 0){
            return null;
        }

        // use latest commit message
        for(var index = projectEvent.data.commits.length-1; index >= 0; index--){
            var commitMessage = projectEvent.data.commits[index].message;
            var firstLine =  commitMessage.split(/(\r\n|\r|\n)/)[0];
            if(firstLine.length > 0){
                return firstLine;
            }
        }
        return null;
    }

    function isSameEvent(event1, event2){
        event1 = event1 || {};
        event2 = event2 || {};
        return event1.target_id == event2.target_id && event1.target_type == event2.target_type && event1.action_name == event2.action_name;
    }

    function isNotifyTargetEvent(projectId, targetType){
        var project = config.getProject(projectId);
        return project.events[targetType] ? true : false;
    }

    function getCommitTargetId(projectEvent){
        var after = projectEvent.data.after;
        var before = projectEvent.data.before;

        if(isValidCommitId(before) && isValidCommitId(after)){
            return before.substr(0, 6) + "..." + after.substr(0, 6);
        } else if(isValidCommitId(before)){
            return before.substr(0, 6);
        } else if(isValidCommitId(after)){
            return after.substr(0, 6);
        }
    }

    function getCommitTargetUrl(projectId, projectEvent){
        var project = config.getProject(projectId);
        var after = projectEvent.data.after;
        var before = projectEvent.data.before;

        if(isValidCommitId(before) && isValidCommitId(after)){
            return config.getGitlabPath() + project.name + "/compare/" + before + "..." + after;
        } else if(isValidCommitId(before)){
            return config.getGitlabPath() + project.name + "/commit/" + before;
        } else if(isValidCommitId(after)){
            return config.getGitlabPath() + project.name + "/commit/" + after;
        }
    }

    function isValidCommitId(commitId){
        // invalid commit id is "0000000000000000000000...."
        return util.toInt(commitId) != 0;
    }

    $(document).ready(function(){
        if(!chrome){
            return;
        }

        chrome.notifications.onClicked.addListener(function(notificationId){
            // close notification popup
            chrome.notifications.clear(notificationId, function(wasCleared){
                // open gitlab event page (Issue, MergeRequest, Milestone)
                var notification = JSON.parse(notificationId);
                chrome.tabs.create({url: notification.target_url});
            });
        });

        chrome.notifications.onClosed.addListener(function(notificationId, byUser){
            chrome.notifications.clear(notificationId, function(wasCleared){
                // do nothing
            });
        });

        // startup
        chrome.browserAction.setBadgeText({text: ""});
        fetch();

        setInterval(function(){
            chrome.browserAction.getBadgeText({}, function(badgeText){
                background.notificationCount = util.toInt(badgeText);
                fetch();
            });
        }, config.getPollingSecond() * 1000);
    });
})(jQuery);
