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

            var project = {
                name:       $("#" + project_id + " td.name").text(),
                avatar_url: $("#" + project_id).attr("data_avatar_url"),
                events:     {}
            };
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
        $("#progress_bar").show();
        $("#projects").empty();

        if(config.getPrivateToken().length > 0){
            gitlab.getProjects(function(project){
                var tr = $("<tr/>").attr({id: project.id, data_avatar_url: project.avatar_url}).addClass("project");

                var project_url = config.getGitlabPath() + project.path_with_namespace;

                var span = $("<span/>");
                if(project.archived){
                    $("<span/>").addClass("glyphicon glyphicon-eye-close").appendTo(span);
                }
                $("<a/>").attr({href: project_url}).text(project.path_with_namespace).appendTo(span);
                $("<td/>").addClass("name").append(span).appendTo(tr);

                var project_option = config.getProject(project.id);
                var events = gitlab.events();

                for(var i = 0; i < events.length; i++){
                    var event = events[i];
                    var checked = project_option.events[event] || false;

                    var label = $("<label/>").addClass("checkbox-inline");
                    $("<input/>").attr({type: "checkbox", checked: checked}).appendTo(label);
                    util.createEventIcon(event).appendTo(label);
                    $("<span/>").text(' ' + event).appendTo(label);
                    $("<td/>").addClass(event).append(label).appendTo(tr);
                }

                var lineSelectAll = $('<a/>').attr({href:'#', class:'line-select-all'}).text('All').click(function (event) {
                    $(event.target).closest('tr').find('input[type="checkbox"]').prop('checked', true);
                    event.preventDefault();
                });
                var lineSelectNone = $('<a/>').attr({href:'#', class:'line-select-none'}).text('None').click(function (event) {
                    $(event.target).closest('tr').find('input[type="checkbox"]').prop('checked', false);
                    event.preventDefault();
                });
                $('<td>').text(' / ').prepend(lineSelectAll).append(lineSelectNone).appendTo(tr);

                tr.appendTo( $("#projects") );
                $("#progress_bar").hide();
            });
        }
    }

    function searchProjects(searchKey){
        var trList = $('tr', '#projects');
        var keys = searchKey.split(' ');
        $.each(trList, function () {
            $(this).show();
            var projectName = $('td:first-child', $(this)).text();
            for (var i = 0, l = keys.length; i < l; i++) {
                var r = new RegExp(keys[i], 'i');
                if (!projectName.match(r)) {
                    $(this).hide();
                }
            }
        });
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

        $(".select-all").click(function (event) {
            var index = $(event.target).closest('th').prevAll().length;
            $('.project').each(function () {
                $(this).children().eq(index).find('input[type="checkbox"]').prop('checked', true);
            });
            event.preventDefault();
        });
        $(".select-none").click(function (event) {
            var index = $(event.target).closest('th').prevAll().length;
            $('.project').each(function () {
                $(this).children().eq(index).find('input[type="checkbox"]').prop('checked', false);
            });
            event.preventDefault();
        });

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

        $('#search_repository').keyup(function () {
            var searchKey = this.value.replace(/\s+$/g, '');
            searchProjects(searchKey);
        });
    });
})(jQuery);
