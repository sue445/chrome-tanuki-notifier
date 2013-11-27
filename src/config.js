var config= (function(){
    // public methods
    function getGitlabPath(){
        return localStorage["gitlabPath"] || "http://example.com/";
    }

    function getApiPath(){
        return localStorage["apiPath"] || "http://example.com/api/v3/";
    }

    function getPrivateToken(){
        return localStorage["privateToken"] || "";
    }

    function getPollingSecond(){
        return localStorage["pollingSecond"] || 60;
    }

    function getProject(project_id){
        project_id = parseInt(project_id);
        var projects = getProjects();
        return projects[project_id] || {name: "", events: {}};
    }

    function getProjects(){
        return JSON.parse(localStorage["projects"] || "{}");
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
        return localStorage["maxEventCount"] || 100;
    }

    function getMaxNotificationCount(){
        return localStorage["maxNotificationCount"] || 10;
    }

    function getNewMarkMinute(){
        return localStorage["newMarkMinute"] || 10;
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
        return JSON.parse(localStorage["notifiedHistories"] || "[]");
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

        localStorage["notifiedHistories"] = JSON.stringify(notified_histories);
    }

    function clearCache(){
        localStorage.removeItem("notifiedHistories");
        localStorage.removeItem("recentEvents");
        localStorage.removeItem("recentEventHashes");
    }

    function save(args){
        util.checkArgs(args, ["gitlabPath", "privateToken", "privateToken", "pollingSecond", "maxEventCount", "maxNotificationCount", "newMarkMinute", "projects"]);

        localStorage["gitlabPath"]           = args.gitlabPath;
        localStorage["apiPath"]              = args.apiPath;
        localStorage["privateToken"]         = args.privateToken;
        localStorage["pollingSecond"]        = args.pollingSecond;
        localStorage["maxEventCount"]        = args.maxEventCount;
        localStorage["maxNotificationCount"] = args.maxNotificationCount;
        localStorage["newMarkMinute"]        = args.newMarkMinute;
        localStorage["projects"]             = JSON.stringify(args.projects);
    }

    return {
        getGitlabPath:           getGitlabPath,
        getApiPath:              getApiPath,
        getPrivateToken:         getPrivateToken,
        getPollingSecond:        getPollingSecond,
        getProject:              getProject,
        getProjects:             getProjects,
        getActiveProjects:       getActiveProjects,
        getMaxEventCount:        getMaxEventCount,
        getMaxNotificationCount: getMaxNotificationCount,
        getNewMarkMinute:        getNewMarkMinute,
        setRecentEvent:          setRecentEvent,
        getRecentEventHash:      getRecentEventHash,
        getNotifiedHistories:    getNotifiedHistories,
        addNotifiedHistories:    addNotifiedHistories,
        clearCache:              clearCache,
        save:                    save
    };

    // private methods
    function getRecentEventHashes(){
        return JSON.parse(localStorage["recentEventHashes"] || "{}");
    }

    function setRecentEventHashes(recentEventHashes){
        localStorage["recentEventHashes"] = JSON.stringify(recentEventHashes);
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