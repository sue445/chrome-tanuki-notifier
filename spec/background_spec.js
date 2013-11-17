describe("background", function() {
    describe("#notify", function() {
        var project;
        var projectEvent;
        var internal;
        var currentTime;
        var message;

        beforeEach(function() {
            // setup
            spyOn(background, "incNotificationCount");
            spyOn(background, "createNotification");

            project = {
                name: "MyProject"
            };

            projectEvent = {
                target_type:  "Issue",
                target_title: "MyIssue",
                action_name:  "opened"
            };

            internal = {
                target_id: 1,
                target_url: "http://example.com/gitlab/gitlabhq/issues/1"
            };

            currentTime = new Date();
            message = "some message";

            // exercise
            background.notify({
                project:      project,
                projectEvent: projectEvent,
                internal:     internal,
                currentTime:  currentTime,
                message:      message
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
                message:      message
            };

            var actual = config.getNotifiedHistories()[0];

            // exclude notified_at
            delete actual["notified_at"];

            expect(actual).toEqual(expected);
        });

        it("should called createNotification", function() {
            var notificationId = JSON.stringify({
                target_url: internal.target_url,
                message:    message
            });

            var params = {
                notificationId: notificationId,
                title:          project.name,
                message:        message
            };
            expect(background.createNotification).toHaveBeenCalledWith(params);
        });
    });
});
