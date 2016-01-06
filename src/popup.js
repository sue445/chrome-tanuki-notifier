(function($){
    var actionLabels = {
        "opened"   : "label-warning",
        "closed"   : "label-danger",
        "accepted" : "label-success",
        "pushed to": "label-info",
        "pushed new": "label-info"
    };

    $(document).ready(function(){
        if(!chrome){
            return;
        }

        var projects = config.getActiveProjects();

        // remove notification count when show popup
        // because) can not use both chrome.browserAction.onClicked and popup
        // https://developer.chrome.com/extensions/browserAction.html#event-onClicked
        chrome.browserAction.setBadgeText({text: ""});

        var current_time = new Date();
        var new_milli_seconds = config.getNewMarkMinute() * 60 * 1000;
        $.each(config.getNotifiedHistories(), function(index, project_event){
            var project = config.getProjectByName(project_event.project_name);
            var li = $("<li/>");

            if(current_time.getTime() - new_milli_seconds < (new Date(project_event.notified_at)).getTime()){
                li.addClass("new");
            }

            var avatar_url = project.avatar_url || "img/gitlab_logo_128.png";
            var icon = $("<img/>").addClass("icon img-rounded").attr({src: avatar_url, align: "left"});
            icon.appendTo(li);

            // Only input avatar if we found the user and the user has an
            // avatar.
            if (project_event.author_id) {
                var author_avatar = $("<img/>").addClass("icon img-circle pull-left icon-avatar").attr({src: "#"});
                author_avatar.appendTo(li);
                gitlab.getUserAvatarUrl(project_event.author_id, function(avatar_url){
                    author_avatar.attr("src", avatar_url);
                    author_avatar.on('load', function() {
                        if(!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                            // FIXME: Do something in case problem loading user avatar?
                        } else {
                            // FIXME: Do something when img is successfully loaded?
                        }
                    });
                });
            }

            util.createEventIcon(project_event.target_type).appendTo(li);

            var project_url = config.getGitlabPath() + project_event.project_name;

            $("<span/>").text(" ").appendTo(li);
            $("<span/>").addClass("label").addClass(actionLabels[project_event.action_name]).text(project_event.action_name).appendTo(li);
            $("<span/>").text(" ").appendTo(li);
            $("<abbr/>").addClass("timeago").attr({
                title: (new Date(project_event.notified_at)).toLocaleString(),
                datetime: project_event.notified_at
            }).appendTo(li);

            $("<span/>").text(" ").appendTo(li);
            $("<a/>").attr({href: project_url, target: "_blank"}).text("["+ project_event.project_name +"]").appendTo(li);
            // add 'remove' button
            $("<span/>").addClass("remove-btn pull-right glyphicon glyphicon-remove")
                .attr({
                    'data-notification-id': project_event._id,
                    'title': 'Remove this notification'
                }).appendTo(li);

            var message = project_event.message;
            if(!message){
                // for previous version cache
                if(project_event.target_type === "Commit"){
                    message = project_event.target_title;
                } else{
                    message = "#" + project_event.target_id + " " + project_event.target_title;
                }
            }
            $("<a/>").attr({href: project_event.target_url, target: "_blank"}).addClass("eventLink").text(message).appendTo(li);

            li.appendTo($("#notifyHistories"));
        });

        $("abbr.timeago").timeago();

        $("span.remove-btn").click(function(){
            var $target = $(this);
            // remove with slide animation
            $target.parent().slideUp("fast", function(){
              $(this).remove();
            });
            config.removeNotifiedHistory($target.attr('data-notification-id'));
        });

        $("button.clear").click(function(){
            config.clearCache();
            $("#notifyHistories").empty();
        });

        $("button.goto").click(function() {
            if (localStorage.gitlabPath) {
                window.open(localStorage.gitlabPath);
            }
        });
    });

})(jQuery);
