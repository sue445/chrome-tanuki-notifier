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

    function createEventIcon(targetType){
        if(targetType == "Issue"){
            return $("<i/>").addClass("icon-exclamation-sign").attr({title: "Issue"});
        } else if(targetType == "MergeRequest"){
            return $("<i/>").addClass("icon-check").attr({title: "MergeRequest"});
        } else if(targetType == "Milestone"){
            return $("<i/>").addClass("icon-calendar").attr({title: "Milestone"});
        } else if(targetType == "Commit"){
            return $("<i/>").addClass("icon-upload-alt").attr({title: "Commit"});
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

    return {
        checkArgs:       checkArgs,
        createEventIcon: createEventIcon,
        isChecked:       isChecked,
        toInt:           toInt,
        calcHash:        calcHash
    };

    // private methods
}());