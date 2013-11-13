(function($){
    // Restores select box state to saved value from localStorage.
    function restoreOptions() {
        $("#gitlabPath").val(config.getGitlabPath());
        $("#apiPath").val(config.getApiPath());
        $("#privateToken").val(config.getPrivateToken());
        $("#pollingSecond").val(config.getPollingSecond());
        $("#maxEventCount").val(config.getMaxEventCount());
        $("#newMarkMinute").val(config.getNewMarkMinute());
    }

    // Saves options to localStorage.
    function saveOptions(){
        var projects = {};
        $("#projects tr.project").each(function(){
            var projectId = parseInt($(this).attr("id"));

            var project = {name: $("#" + projectId + " td.name").text(), events: {}}
            $.each(gitlab.events(), function(index, event){
                project.events[event] = util.isChecked("#" + projectId + " td." + event + " input:checkbox");
            });
            projects[projectId] = project;
        });

        config.save({
            gitlabPath:    $("#gitlabPath").val(),
            apiPath:       $("#apiPath").val(),
            privateToken:  $("#privateToken").val(),
            pollingSecond: $("#pollingSecond").val(),
            maxEventCount: $("#maxEventCount").val(),
            newMarkMinute: $("#newMarkMinute").val(),
            projects:      projects
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
                $("<td/>").addClass("name").text(project.path_with_namespace).appendTo(tr);

                var project = config.getProject(project.id);
                var events = gitlab.events();

                for(var i = 0; i < events.length; i++){
                    var event = events[i];
                    var checked = project.events[event] || false;

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
