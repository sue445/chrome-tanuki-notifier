var util = (function(){
    // public methods
    function checkArgs(args, names){
        // skip argument check when release version
        //return;

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
            return $("<span/>").addClass("glyphicon glyphicon-warning-sign").attr({title: "Issue"});
        } else if(targetType == "MergeRequest"){
            return $("<span/>").addClass("glyphicon glyphicon-upload").attr({title: "MergeRequest"});
        } else if(targetType == "Milestone"){
            return $("<span/>").addClass("glyphicon glyphicon-calendar").attr({title: "Milestone"});
        }

        return $("<span/>");
    }

    function isChecked(element){
        return $(element).is(":checked") ? true : false;
    }

    function toInt(str){
        return parseInt(str) || 0;
    }

    return {
        checkArgs:       checkArgs,
        createEventIcon: createEventIcon,
        isChecked:       isChecked,
        toInt:           toInt
    };

    // private methods
}());