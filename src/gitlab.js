var gitlab= (function(){
    var per_page = 100;
    var eventPath = {
        "Issue"        : {page: "issues"        , api: "issues"},
        "MergeRequest" : {page: "merge_requests", api: "merge_request"},
        "Milestone"    : {page: "milestones"    , api: "milestones"}
    };

    // public methods
    function getProjects(projectCallback){
        var df = $.Deferred();
        getProjectsBase(projectCallback, df, 1);
        return df.promise();
    }

    function getProjectEvents(project_id){
        return $.ajax({
            url: config.getApiPath() + "projects/" + project_id + "/events",
            data: {
                per_page: per_page
            },
            type: "GET",
            dataType: "json",
            timeout: config.getPollingSecond() * 1000,
            headers: {
                "PRIVATE-TOKEN" : config.getPrivateToken()
            }
        });
    }

    function getEventInternalUrl(args, internalUrlCallback){
        getEventInternalId(args, function(res){
            internalUrlCallback(config.getGitlabPath() + args.project_name + "/" + eventPath[args.target_type].page + "/" + res.target_id);
        });
    }

    function getEventInternalId(args, callback){
        util.checkArgs(args, ["project_name", "target_type", "target_id"]);

        $.ajax({
            url: config.getApiPath() + "projects/" + encodeURIComponent(args.project_name) + "/" + eventPath[args.target_type].api + "/" + args.target_id,
            type: "GET",
            dataType: "json",
            headers: {
                "PRIVATE-TOKEN" : config.getPrivateToken()
            }
        }).then(function(res){
                var id = res.iid || res.id
                var url = config.getGitlabPath() + args.project_name + "/" + eventPath[args.target_type].page + "/" + id;
                callback({target_id: id, target_url: url});
            });
    }

    function events(){
        return [
            "Commit",   // target_type == null
            "Issue",
            "MergeRequest",
            "Milestone"
        ];
    }

    return {
        getProjects:         getProjects,
        getProjectEvents:    getProjectEvents,
        getEventInternalUrl: getEventInternalUrl,
        getEventInternalId:  getEventInternalId,
        events:              events
    };

    // private methods
    function getProjectsBase(projectCallback, df, page){
        $.ajax({
            url: config.getApiPath() + "projects",
            data: {
                page: page,
                per_page: per_page
            },
            type: "GET",
            dataType: "json",
            headers: {
                "PRIVATE-TOKEN" : config.getPrivateToken()
            }
        }).fail(function(xhr, status, e){
                alert(status + " " + e);
                df.reject();
            }).done(function(projects){
                $.each(projects, function(index, project){
                    projectCallback(project);
                });

                if(projects.length < per_page){
                    // final page
                    df.resolve();
                } else{
                    // paging
                    getProjectsBase(projectCallback, df, page + 1);
                }
            });
    }

}());