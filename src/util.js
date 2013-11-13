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

    return {
        checkArgs: checkArgs
    };

    // private methods
}());