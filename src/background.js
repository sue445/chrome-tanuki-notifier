var background = {
    notify: function(args){
        var project      = args.project;
        var project_event = args.project_event;
        var internal     = args.internal;
        var current_time  = args.current_time;
        var message      = args.message;

        util.checkArgs(args, ["project", "project_event", "internal", "current_time", "message"]);

        var notification_id =  JSON.stringify({
            target_url:   internal.target_url,
            message:      message
        });

        this.createNotification({
            notification_id: notification_id,
            title:          project.name,
            message:        message
        });

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
        var title          = args.title;
        var message        = args.message;

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
            function(notification_id){
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

(function($){
    function fetch(){
        $.each(config.getActiveProjects(), function(project_id, project){
            gitlab.getProjectEvents(project_id).done(function(project_events){
                // latest check
                if(project_events.length < 1){
                    return;
                }

                var latest = project_events[0];
                var recent_hash = config.getRecentEventHash(project_id);

                if(!recent_hash){
                    config.setRecentEvent(project_id, latest);

                    // Not show notification when first running
                    return;
                }

                if(isSameEvent(latest, recent_hash)){
                    // not changed
                   return;
                }

                config.setRecentEvent(project_id, latest);

                var event_count = 0;
                $.each(project_events, function(index, project_event){
                    if(isSameEvent(project_event, recent_hash) || event_count >= config.getMaxNotificationCount()){
                        // break loop
                        return false;
                    }

                    var target_type = project_event.target_type || "Commit";

                    if(!isNotifyTargetEvent(project_id, target_type)){
                        // continue loop
                        return;
                    }

                    var project = config.getProject(project_id);

                    if(target_type == "Commit" && project_event.data){
                        var commit_message = getCommitMessage(project_event);
                        var display_id = getCommitTargetId(project_event);
                        var target_url = getCommitTargetUrl(project_id, project_event);

                        if(target_url && commit_message){
                            var branch_name = project_event.data.ref.replace(/^refs\/heads\//, "");

                            background.notify({
                                project:      project,
                                project_event: project_event,
                                internal: {
                                    target_id:  display_id,
                                    target_url: target_url
                                },
                                message:      "[" + branch_name + "] " + "@" + project_event.data.user_name + " " + display_id + " " + commit_message + " (" + project_event.data.total_commits_count + " commits)",
                                current_time:  new Date()
                            });
                            event_count++;
                        }

                    } else if(target_type == "Issue" || target_type == "MergeRequest" || target_type == "Milestone"){
                        // Issue, MergeRequest, Milestone
                        gitlab.getEventInternalId({
                            project_name: project.name,
                            target_type:  target_type,
                            target_id:    project_event.target_id
                        }, function(internal){
                            background.notify({
                                project:      project,
                                project_event: project_event,
                                internal:     internal,
                                message:      "[" + target_type + "] #" + internal.target_id + " " + project_event.target_title +  " " + project_event.action_name,
                                current_time:  new Date()
                            });
                            event_count++;
                        });
                    }
                });
            });
        });
    }

    function getCommitMessage(project_event){
        if(!project_event.data || !project_event.data.commits || project_event.data.commits.length == 0){
            return null;
        }

        // use latest commit message
        for(var index = project_event.data.commits.length-1; index >= 0; index--){
            var commit_message = project_event.data.commits[index].message;
            var first_line =  commit_message.split(/(\r\n|\r|\n)/)[0];
            if(first_line.length > 0){
                return first_line;
            }
        }
        return null;
    }

    function isSameEvent(event, recent_hash){
        event = event || {};

        return util.calcHash(event) == recent_hash;
    }

    function isNotifyTargetEvent(project_id, target_type){
        var project = config.getProject(project_id);
        return project.events[target_type] ? true : false;
    }

    function getCommitTargetId(project_event){
        var after = project_event.data.after;
        var before = project_event.data.before;

        if(isValidCommitId(before) && isValidCommitId(after)){
            return before.substr(0, 6) + "..." + after.substr(0, 6);
        } else if(isValidCommitId(before)){
            return before.substr(0, 6);
        } else if(isValidCommitId(after)){
            return after.substr(0, 6);
        }
    }

    function getCommitTargetUrl(project_id, project_event){
        var project = config.getProject(project_id);
        var after = project_event.data.after;
        var before = project_event.data.before;

        if(isValidCommitId(before) && isValidCommitId(after)){
            return config.getGitlabPath() + project.name + "/compare/" + before + "..." + after;
        } else if(isValidCommitId(before)){
            return config.getGitlabPath() + project.name + "/commit/" + before;
        } else if(isValidCommitId(after)){
            return config.getGitlabPath() + project.name + "/commit/" + after;
        }
    }

    function isValidCommitId(commit_id){
        // invalid commit id is "0000000000000000000000...."
        return util.toInt(commit_id) != 0;
    }

    $(document).ready(function(){
        if(!chrome){
            return;
        }

        chrome.notifications.onClicked.addListener(function(notification_id){
            // close notification popup
            chrome.notifications.clear(notification_id, function(wasCleared){
                // open gitlab event page (Issue, MergeRequest, Milestone)
                var notification = JSON.parse(notification_id);
                chrome.tabs.create({url: notification.target_url});
            });
        });

        chrome.notifications.onClosed.addListener(function(notification_id, byUser){
            chrome.notifications.clear(notification_id, function(wasCleared){
                // do nothing
            });
        });

        // startup
        chrome.browserAction.setBadgeText({text: ""});
        fetch();

        setInterval(function(){
            chrome.browserAction.getBadgeText({}, function(badgeText){
                background.notification_count = util.toInt(badgeText);
                fetch();
            });
        }, config.getPollingSecond() * 1000);
    });
})(jQuery);
