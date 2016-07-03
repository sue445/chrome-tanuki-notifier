var config= (function(){
    // public methods
    function getGitlabPath(){
        return localStorage.gitlabPath || "http://example.com/";
    }

    function getApiPath(){
        return localStorage.apiPath || "http://example.com/api/v3/";
    }

    function getPrivateToken(){
        return localStorage.privateToken || "";
    }

    function getPollingSecond(){
        return localStorage.pollingSecond || 60;
    }

    function getProject(project_id){
        project_id = parseInt(project_id);
        var projects = getProjects();
        return projects[project_id] || {name: "", events: {}};
    }

    function getProjectByName(project_name){
        var result = {};
        $.each(getProjects(), function(project_id, project){
            if(project_name == project.name){
                result = project;
                // break $.each loop
                return false;
            }
        });
        return result;
    }

    function getProjects(){
        return JSON.parse(localStorage.projects || "{}");
    }

    function getActiveProjects(){
        var active_projects = {};
        $.each(getProjects(), function(project_id, project){
            if(isActive(project.events)){
                active_projects[project_id] = project;
            }
        });
        return active_projects;
    }

    function getMaxEventCount(){
        return localStorage.maxEventCount || 100;
    }

    function getMaxNotificationCount(){
        return localStorage.maxNotificationCount || 10;
    }

    function getNewMarkMinute(){
        return localStorage.newMarkMinute || 10;
    }

    function setRecentEvent(project_id, recent_event){
        var recentEventHashes = getRecentEventHashes();
        recentEventHashes[project_id] = {
            hash: util.calcHash(recent_event),
            created_at: new Date()
        };
        setRecentEventHashes(recentEventHashes);
    }

    function getRecentEventHash(project_id){
        var obj = getRecentEventHashes()[project_id];
        return obj ? obj.hash : null;
    }

    function getNotifiedHistories(){
        return JSON.parse(localStorage.notifiedHistories || "[]");
    }

    function addNotifiedHistories(newHistories){
        // newHistories = [newest ... oldest]
        // notifiedHistories = [newest ... oldest]
        var notified_histories = getNotifiedHistories();

        // add param histories
        while(newHistories.length > 0){
            notified_histories.unshift(newHistories.pop());
        }

        // remove old histories
        while(notified_histories.length > getMaxEventCount()){
            notified_histories.pop();
        }

        localStorage.notifiedHistories = JSON.stringify(notified_histories);
    }

    // remove target history with given '_id'
    function removeNotifiedHistory(_id){
        var notified_histories = getNotifiedHistories();

        // remove target history
        $.each(notified_histories, function(index, project_event){
            if(project_event._id == _id)  {
                notified_histories.splice(index, 1);
                return false; // break $.each loop
            }
        });

        // save histories
        localStorage.notifiedHistories = JSON.stringify(notified_histories);
    }

    function findNotificationHistory(_id) {
        var notified_histories = getNotifiedHistories();

        var history = null;
        $.each(notified_histories, function(index, project_event){
            if(project_event._id == _id)  {
                history = project_event;
                return false; // break $.each loop
            }
        });
        return history;
    }

    function clearCache(){
        localStorage.removeItem("notifiedHistories");
        localStorage.removeItem("recentEvents");
        localStorage.removeItem("recentEventHashes");
        localStorage.removeItem("avatarCache");
        localStorage.removeItem("notificationCache");
    }

    function save(args){
        util.checkArgs(args, ["gitlabPath", "privateToken", "privateToken", "pollingSecond", "maxEventCount", "maxNotificationCount", "newMarkMinute", "projects"]);

        localStorage.gitlabPath           = util.addTrailingSlash(args.gitlabPath);
        localStorage.apiPath              = util.addTrailingSlash(args.apiPath);
        localStorage.privateToken         = args.privateToken;
        localStorage.pollingSecond        = args.pollingSecond;
        localStorage.maxEventCount        = args.maxEventCount;
        localStorage.maxNotificationCount = args.maxNotificationCount;
        localStorage.newMarkMinute        = args.newMarkMinute;
        if (Object.keys(args.projects).length > 0) {
            localStorage.projects         = JSON.stringify(args.projects);
        }
    }

    return {
        getGitlabPath:           getGitlabPath,
        getApiPath:              getApiPath,
        getPrivateToken:         getPrivateToken,
        getPollingSecond:        getPollingSecond,
        getProject:              getProject,
        getProjectByName:        getProjectByName,
        getProjects:             getProjects,
        getActiveProjects:       getActiveProjects,
        getMaxEventCount:        getMaxEventCount,
        getMaxNotificationCount: getMaxNotificationCount,
        getNewMarkMinute:        getNewMarkMinute,
        setRecentEvent:          setRecentEvent,
        getRecentEventHash:      getRecentEventHash,
        getNotifiedHistories:    getNotifiedHistories,
        addNotifiedHistories:    addNotifiedHistories,
        removeNotifiedHistory:   removeNotifiedHistory,
        findNotificationHistory: findNotificationHistory,
        clearCache:              clearCache,
        save:                    save
    };

    // private methods
    function getRecentEventHashes(){
        return JSON.parse(localStorage.recentEventHashes || "{}");
    }

    function setRecentEventHashes(recentEventHashes){
        localStorage.recentEventHashes = JSON.stringify(recentEventHashes);
    }

    function isActive(project_events){
        var events = gitlab.events();
        for(var i = 0; i < events.length; i++){
            var event = events[i];
            if(project_events[event]){
                return true;
            }
        }
        return false;
    }
}());
