describe("gitlab", function() {
    beforeEach(function() {
        $.mockjaxClear();
        localStorage["api_path"] = "http://example.com/api/v3/";
    });

    afterEach(function() {
        localStorage.removeItem("api_path");
    });

    describe("getProjects", function() {
        var testResponse;
        var projectCallback;

        beforeEach(function() {
            projectCallback = jasmine.createSpy('projectCallback');

            $.mockjax({
                url: 'http://example.com/api/v3/projects',

                // response has 7 projects
                responseText: stub.projects,
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
});
