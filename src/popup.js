(function($){
    var actionLabels = {
        "opened"   : "label-warning",
        "closed"   : "label-danger",
        "accepted" : "label-success"
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
            var li = $("<li/>");

            if(current_time.getTime() - new_milli_seconds < (new Date(project_event.notified_at)).getTime()){
                li.addClass("new");
            }

            util.createEventIcon(project_event.target_type).appendTo(li);

            var project_url = config.getGitlabPath() + project_event.project_name;

            $("<span/>").text(" ").appendTo(li);
            $("<span/>").addClass("label").addClass(actionLabels[project_event.action_name]).text(project_event.action_name).appendTo(li);
            $("<span/>").text(" ").appendTo(li);
            $("<abbr/>").addClass("timeago").attr({title: project_event.notified_at}).appendTo(li);

            $("<span/>").text(" ").appendTo(li);
            $("<a/>").attr({href: project_url, target: "_blank"}).text("["+ project_event.project_name +"]").appendTo(li);
            $("<span/>").text(" ").appendTo(li);

            var message = project_event.message;
            if(!message){
                // for previous version cache
                if(project_event.target_type == "Commit"){
                    message = project_event.target_title;
                } else{
                    message = "#" + project_event.target_id + " " + project_event.target_title;
                }
            }
            $("<a/>").attr({href: project_event.target_url, target: "_blank"}).addClass("eventLink").text(message).appendTo(li);

            li.appendTo($("#notifyHistories"));
        });

        $("abbr.timeago").timeago();

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
