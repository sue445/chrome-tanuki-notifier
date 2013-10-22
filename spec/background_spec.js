describe("background", function() {
    describe("#notify", function() {
        var project = {
            name: "MyProject"
        };

        var projectEvent = {
            target_type:  "Issue",
            target_title: "MyIssue",
            action_name:  "opened"
        };

        var internal = {
            target_id: 1,
            target_url: "http://example.com/gitlab/gitlabhq/issues/1"
        };

        var currentTime = new Date();

        beforeEach(function() {
            // setup
            spyOn(background, "incNotificationCount");
            spyOn(background, "createNotification");

            // exercise
            background.notify({
                project:      project,
                projectEvent: projectEvent,
                internal:     internal,
                currentTime:  currentTime
            });
        });

        afterEach(function() {
            localStorage.removeItem("notifiedHistories");
        });

        it("should called incNotificationCount", function() {
            expect(background.incNotificationCount).toHaveBeenCalled();
        });

        it("should saved 1 notified history", function() {
            expect(config.getNotifiedHistories().length).toEqual(1);

            var expected = {
                target_type:  projectEvent.target_type,
                target_title: projectEvent.target_title,
                action_name:  projectEvent.action_name,
                project_name: project.name,
                target_id:    internal.target_id,
                target_url:   internal.target_url,
            };

            var actual = config.getNotifiedHistories()[0];

            // exclude notified_at
            delete actual["notified_at"];

            expect(actual).toEqual(expected);
        });

        it("should called createNotification", function() {
            var notificationId = JSON.stringify({
                project_name: project.name,
                target_type:  projectEvent.target_type,
                target_id:    internal.target_id,
                target_url:   internal.target_url,
                notified_at:  currentTime.getTime()
            });

            var params = {
                notificationId: notificationId,
                title:   project.name,
                message: "[" + projectEvent.target_type + "] #" + internal.target_id + " " + projectEvent.target_title +  " " + projectEvent.action_name
            };
            expect(background.createNotification).toHaveBeenCalledWith(params);
        });
    });
});
