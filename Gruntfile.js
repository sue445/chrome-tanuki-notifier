module.exports = function(grunt) {
    var manifest = grunt.file.readJSON("manifest.json");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'chrome-extension': {
            options: {
                name: "chrome-gitlab-notifier",
                version: manifest.version,
                id: "eageapgbnjicdjjihgclpclilenjbobi",
                chrome: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                clean: true,
                buildDir: 'build',
                resources: [
                    "css/**",
                    "font-awesome/**",
                    "fonts/**",
                    "img/**",
                    "lib/**",
                    "src/**",
                    "*.html",
                    "LICENSE",
                    "manifest.json",
                    "CHANGELOG.md",
                    "README.md"
                ]
            }
        },
        gittag: {
            new_version: {
                options: {
                    tag: manifest.version,
                    message: "release v" + manifest.version
                }
            }
        },
        gitpush: {
            tag: {
                options: {
                    tags: true
                }
            },
            master: {
                options: {
                    branch: "master"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-chrome-compile');
    grunt.loadNpmTasks('grunt-git');

    grunt.registerTask('default', ["chrome-extension", "gittag:new_version", "gitpush:tag", "gitpush:master"]);
};
