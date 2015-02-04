var util = (function(){
    // public methods
    function checkArgs(args, names){
        // skip argument check when release version
        return;

        args = args || {};
        names = names || [];

        $.each(names, function(index, name){
            if(!args[name]){
                console.log("[WARNING] '" + name + "' is not found in args", args);
            }
        });
    }

    function createEventIcon(target_type){
        if(!target_type || target_type === "Commit"){
            return $("<i/>").addClass("icon-upload-alt").attr({title: "Commit"});
        } else if(target_type === "Issue"){
            return $("<i/>").addClass("icon-exclamation-sign").attr({title: "Issue"});
        } else if(target_type === "MergeRequest"){
            return $("<i/>").addClass("icon-check").attr({title: "MergeRequest"});
        } else if(target_type === "Milestone"){
            return $("<i/>").addClass("icon-calendar").attr({title: "Milestone"});
        }

        return $("<span/>");
    }

    function isChecked(element){
        return $(element).is(":checked") ? true : false;
    }

    function toInt(str){
        return parseInt(str) || 0;
    }

    function calcHash(obj){
        return MD5_hexhash(JSON.stringify(obj));
    }

    function addTrailingSlash(url){
        if (typeof url !== "string") return url;
        if (url === "" || url.match(/\/$/)) return url;
        return url += '/';
    }

    return {
        checkArgs:       checkArgs,
        createEventIcon: createEventIcon,
        isChecked:       isChecked,
        toInt:           toInt,
        calcHash:        calcHash,
        addTrailingSlash: addTrailingSlash
    };

    // private methods
}());
