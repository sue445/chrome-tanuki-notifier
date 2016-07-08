describe("gitlab", function() {
    beforeEach(function() {
        $.mockjaxClear();
        localStorage["gitlabPath"] = "http://example.com/";
        localStorage["apiPath"]    = "http://example.com/api/v3/";
    });

    afterEach(function() {
        localStorage.removeItem("gitlabPath");
        localStorage.removeItem("apiPath");
    });

    describe("getProjects", function() {
        var projectCallback;

        beforeEach(function() {
            projectCallback = jasmine.createSpy('projectCallback');

            $.mockjax({
                url: 'http://example.com/api/v3/projects',

                // response has 7 projects
                responseText: stub.projects
            });
        });

        it("should called value of projects", function() {
            var called = false;
            var df = gitlab.getProjects(projectCallback);
            df.then(function(){
                expect(projectCallback.callCount).toEqual(7);
                called = true;
            });

            waitsFor(function(){
                return called;
            }, "wait Deferred", 1000);

            runs(function(){
                expect(called).toEqual(true);
            });
        });
    });

    describe("getEventInternalUrl", function(){
        describe("when contains iid", function(){
            beforeEach(function() {
                $.mockjax({
                    url: 'http://example.com/api/v3/projects/12/issues/42',
                    responseText: stub.project_issue_v6
                });
            });

            it("should get internal id url", function(){
                var called = false;

                gitlab.getEventInternalUrl({project_name: "gitlab/gitlabhq", target_type: "Issue", target_id: "42", project_id: "12"}, function(url){
                    expect(url).toEqual("http://example.com/gitlab/gitlabhq/issues/3");
                    called = true;
                });

                waitsFor(function(){
                    return called;
                }, "wait getEventInternalUrl callback", 1000);

                runs(function(){
                    expect(called).toEqual(true);
                });
            });
        });

        describe("when not contains iid", function(){
            beforeEach(function() {
                $.mockjax({
                    url: 'http://example.com/api/v3/projects/12/issues/42',
                    responseText: stub.project_issue_v5
                });
            });

            it("should get global id url", function(){
                var called = false;

                gitlab.getEventInternalUrl({project_name: "gitlab/gitlabhq", target_type: "Issue", target_id: "42", project_id: "12"}, function(url){
                    expect(url).toEqual("http://example.com/gitlab/gitlabhq/issues/42");
                    called = true;
                });

                waitsFor(function(){
                    return called;
                }, "wait getEventInternalUrl callback", 1000);

                runs(function(){
                    expect(called).toEqual(true);
                });
            });
        });
    });
});
