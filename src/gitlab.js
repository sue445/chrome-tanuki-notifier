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
        // Get project events
        // GET /projects/:id/events
        // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/projects.md#get-project-events
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
        util.checkArgs(args, ["project_name", "target_type", "target_id", "project_id"]);

        // Single issue
        // GET /projects/:id/issues/:issue_id
        // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/issues.md#single-issue
        //   or
        // Get single MR
        // GET /projects/:id/merge_request/:merge_request_id
        // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/merge_requests.md#get-single-mr
        //   or
        // Get single milestone
        // GET /projects/:id/milestones/:milestone_id
        // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/milestones.md#get-single-milestone
        $.ajax({
            url: config.getApiPath() + "projects/" + args.project_id + "/" + eventPath[args.target_type].api + "/" + args.target_id,
            type: "GET",
            dataType: "json",
            headers: {
                "PRIVATE-TOKEN" : config.getPrivateToken()
            }
        }).then(function(res){
                var id = res.iid || res.id;
                var url = config.getGitlabPath() + args.project_name + "/" + eventPath[args.target_type].page + "/" + id;
                callback({target_id: id, target_url: url});
            });
    }

    function getUserAvatarUrl(user_id, callback){
        var cached_avatar_url = avatar_cache.get(user_id);
        if (cached_avatar_url) {
            callback(cached_avatar_url);
            return;
        }

        // Single user
        // GET /users/:id
        // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/users.md#single-user
        $.ajax({
            url: config.getApiPath() + "users/" + user_id,
            type: "GET",
            dataType: "json",
            timeout: 1000,
            headers: {
                "PRIVATE-TOKEN" : config.getPrivateToken()
            }
        }).done(function(user) {
            avatar_cache.set(user_id, user.avatar_url);
            callback(user.avatar_url);
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
        getUserAvatarUrl:    getUserAvatarUrl,
        events:              events
    };

    // private methods
    function getProjectsBase(projectCallback, df, page){
        // List projects
        // GET /projects
        // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/projects.md#list-projects
        // NOTE: order_by and sort are supported by v7.7.0+. If no options, order_by created_at DESC
        $.ajax({
            url: config.getApiPath() + "projects",
            data: {
                page: page,
                per_page: per_page,
                order_by: "name",
                sort:     "asc"
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