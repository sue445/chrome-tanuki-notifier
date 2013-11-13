(function($){
    var actionLabels = {
        "opened"   : "label-warning",
        "closed"   : "label-danger",
        "accepted" : "label-success"
    };

    $(document).ready(function(){
        var projects = config.getActiveProjects();
        var ajaxProjectEvents = [];
        var allProjectEvents = [];

        // remove notification count when show popup
        // because) can not use both chrome.browserAction.onClicked and popup
        // https://developer.chrome.com/extensions/browserAction.html#event-onClicked
        chrome.browserAction.setBadgeText({text: ""});

        var currentTime = new Date();
        var newMilliSeconds = config.getNewMarkMinute() * 60 * 1000;
        $.each(config.getNotifiedHistories(), function(index, projectEvent){
            var li = $("<li/>");

            if(currentTime.getTime() - newMilliSeconds < (new Date(projectEvent.notified_at)).getTime()){
                li.addClass("new");
            }

            util.createEventIcon(projectEvent.target_type).appendTo(li);

            var projectUrl = config.getGitlabPath() + projectEvent.project_name;

            $("<span/>").text(" ").appendTo(li);
            $("<a/>").attr({href: projectUrl, target: "_blank"}).text("["+ projectEvent.project_name +"]").appendTo(li);
            $("<span/>").text(" ").appendTo(li);
            $("<a/>").attr({href: projectEvent.target_url, target: "_blank"}).addClass("eventLink").text("#" + projectEvent.target_id + " " + projectEvent.target_title).appendTo(li);
            $("<span/>").text(" ").appendTo(li);
            $("<span/>").addClass("label").addClass(actionLabels[projectEvent.action_name]).text(projectEvent.action_name).appendTo(li);
            $("<span/>").text(" ").appendTo(li);
            $("<abbr/>").addClass("timeago").attr({title: projectEvent.notified_at}).appendTo(li);

            li.appendTo($("#notifyHistories"));
        });

        $("abbr.timeago").timeago();
    });

})(jQuery);
