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

    function getProject(projectId){
        projectId = parseInt(projectId);
        var projects = getProjects();
        return projects[projectId] || {name: "", events: {}};
    }

    function getProjects(){
        return JSON.parse(localStorage["projects"] || "{}");
    }

    function getActiveProjects(){
        var activeProjects = {};
        $.each(getProjects(), function(projectId, project){
            if(isActive(project.events)){
                activeProjects[projectId] = project;
            }
        });
        return activeProjects;
    }

    function getMaxEventCount(){
        return localStorage["maxEventCount"] || 100;
    }

    function getNewMarkMinute(){
        return localStorage["newMarkMinute"] || 10;
    }

    function getRecentEvents(){
        return JSON.parse(localStorage["recentEvents"] || "{}");
    }

    function setRecentEvents(recentEvents){
        localStorage["recentEvents"] = JSON.stringify(recentEvents);
    }

    function setRecentEvent(projectId, recentEvent){
        var recentEvents = getRecentEvents();
        recentEvents[projectId] = recentEvent;
        setRecentEvents(recentEvents);
    }

    function getRecentEvent(projectId){
        return getRecentEvents()[projectId];
    }

    function getNotifiedHistories(){
        return JSON.parse(localStorage["notifiedHistories"] || "[]");
    }

    function addNotifiedHistories(newHistories){
        // newHistories = [newest ... oldest]
        // notifiedHistories = [newest ... oldest]
        var notifiedHistories = getNotifiedHistories();

        // add param histories
        while(newHistories.length > 0){
            notifiedHistories.unshift(newHistories.pop());
        }

        // remove old histories
        while(notifiedHistories.length > getMaxEventCount()){
            notifiedHistories.pop();
        }

        localStorage["notifiedHistories"] = JSON.stringify(notifiedHistories);
    }

    function clearCache(){
        localStorage.removeItem("notifiedHistories");
        localStorage.removeItem("recentEvents");
    }

    function isChecked(element){
        return $(element).is(":checked") ? true : false;
    }

    function save(args){
        localStorage["gitlabPath"]    = args.gitlabPath;
        localStorage["apiPath"]       = args.apiPath;
        localStorage["privateToken"]  = args.privateToken;
        localStorage["pollingSecond"] = args.pollingSecond;
        localStorage["maxEventCount"] = args.maxEventCount;
        localStorage["newMarkMinute"] = args.newMarkMinute;
        localStorage["projects"]      = JSON.stringify(args.projects);
    }

    return {
        getGitlabPath:        getGitlabPath,
        getApiPath:           getApiPath,
        getPrivateToken:      getPrivateToken,
        getPollingSecond:     getPollingSecond,
        getProject:           getProject,
        getProjects:          getProjects,
        getActiveProjects:    getActiveProjects,
        getMaxEventCount:     getMaxEventCount,
        getNewMarkMinute:     getNewMarkMinute,
        getRecentEvents:      getRecentEvents,
        setRecentEvents:      setRecentEvents,
        setRecentEvent:       setRecentEvent,
        getRecentEvent:       getRecentEvent,
        getNotifiedHistories: getNotifiedHistories,
        addNotifiedHistories: addNotifiedHistories,
        clearCache:           clearCache,
        isChecked:            isChecked,
        save:                 save
    };

    // private methods
    function isActive(projectEvents){
        return projectEvents["Issue"] || projectEvents["MergeRequest"] || projectEvents["Milestone"];
    }
}());