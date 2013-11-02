(function($){
    var actionLabels = {
        "opened"   : "label-warning",
        "closed"   : "label-danger",
        "accepted" : "label-success",
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

            if(projectEvent.target_type == "Issue"){
                $("<span/>").addClass("glyphicon glyphicon-warning-sign").attr({title: "Issue"}).appendTo(li);
            } else if(projectEvent.target_type == "MergeRequest"){
                $("<span/>").addClass("glyphicon glyphicon-upload").attr({title: "MergeRequest"}).appendTo(li);
            } else if(projectEvent.target_type == "Milestone"){
                $("<span/>").addClass("glyphicon glyphicon-calendar").attr({title: "Milestone"}).appendTo(li);
            }

            var projectUrl = config.getGitlabPath() + projectEvent.project_name;

            $("<span/>").text(" ").appendTo(li);
            $("<a/>").attr({href: projectUrl, target: "_blank"}).text("["+ projectEvent.project_name +"]").appendTo(li);
            $("<span/>").text(" ").appendTo(li);
            $("<a/>").attr({
                href:                "#",
                "data-project-name": projectEvent.project_name,
                "data-target-type" : projectEvent.target_type,
                "data-target-id"   : projectEvent.target_id
            }).addClass("eventLink").text("#" + projectEvent.target_id + " " + projectEvent.target_title).appendTo(li);
            $("<span/>").text(" ").appendTo(li);
            $("<span/>").addClass("label").addClass(actionLabels[projectEvent.action_name]).text(projectEvent.action_name).appendTo(li);
            $("<span/>").text(" ").appendTo(li);
            $("<abbr/>").addClass("timeago").attr({title: projectEvent.notified_at}).appendTo(li);

            li.appendTo($("#notifyHistories"));
        });

        $("abbr.timeago").timeago();

        $("a.eventLink").click(function(){
            // open event page
            gitlab.getEventInternalUrl({
                project_name: $(this).attr("data-project-name"),
                target_type:  $(this).attr("data-target-type"),
                target_id:    $(this).attr("data-target-id")
            }, function(url){
                chrome.tabs.create({url: url});
            });
        });
    });

})(jQuery);
