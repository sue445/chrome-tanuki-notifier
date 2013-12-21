(function($){
    // Restores select box state to saved value from localStorage.
    function restoreOptions() {
        $("#gitlabPath").val(config.getGitlabPath());
        $("#apiPath").val(config.getApiPath());
        $("#privateToken").val(config.getPrivateToken());
        $("#pollingSecond").val(config.getPollingSecond());
        $("#maxEventCount").val(config.getMaxEventCount());
        $("#maxNotificationCount").val(config.getMaxNotificationCount());
        $("#newMarkMinute").val(config.getNewMarkMinute());
    }

    // Saves options to localStorage.
    function saveOptions(){
        var projects = {};
        $("#projects tr.project").each(function(){
            var project_id = parseInt($(this).attr("id"));

            var project = {name: $("#" + project_id + " td.name").text(), events: {}};
            $.each(gitlab.events(), function(index, event){
                project.events[event] = util.isChecked("#" + project_id + " td." + event + " input:checkbox");
            });
            projects[project_id] = project;
        });

        config.save({
            gitlabPath:           $("#gitlabPath").val(),
            apiPath:              $("#apiPath").val(),
            privateToken:         $("#privateToken").val(),
            pollingSecond:        $("#pollingSecond").val(),
            maxEventCount:        $("#maxEventCount").val(),
            maxNotificationCount: $("#maxNotificationCount").val(),
            newMarkMinute:        $("#newMarkMinute").val(),
            projects:             projects
        });

        showStatus("Options Saved.");
    }

    function showStatus(status){
        $("span.status").text(status);
        setTimeout(function() {
            $("span.status").text("");
        }, 750);
    }

    function refreshProjects(){
        $("#projects").empty();

        if(config.getPrivateToken().length > 0){
            gitlab.getProjects(function(project){
                var tr = $("<tr/>").attr({id: project.id}).addClass("project");

                var project_url = config.getGitlabPath() + project.path_with_namespace;

                $("<td/>").addClass("name").append(
                    $("<a/>").attr({href: project_url}).text(project.path_with_namespace)
                ).appendTo(tr);

                var project_option = config.getProject(project.id);
                var events = gitlab.events();

                for(var i = 0; i < events.length; i++){
                    var event = events[i];
                    var checked = project_option.events[event] || false;

                    var label = $("<label/>").addClass("checkbox-inline");
                    $("<input/>").attr({type: "checkbox", checked: checked}).appendTo(label);
                    util.createEventIcon(event).appendTo(label);
                    $("<span/>").text(event).appendTo(label);
                    $("<td/>").addClass(event).append(label).appendTo(tr);
                }

                tr.appendTo( $("#projects") );
            });
        }
    }

    function clearCache(){
        config.clearCache();
        showStatus("Cache cleared");
    }

    $(document).ready(function(){
        if(!chrome){
            return;
        }

        restoreOptions();
        refreshProjects();

        $("button.save").click(function(){
            saveOptions();
        });

        $("button.clear").click(function(){
            clearCache();
            refreshProjects();
        });

        $("#load_repository").click(function(){
            saveOptions();
            refreshProjects();
        });
    });
})(jQuery);
