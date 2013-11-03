var stub = {
    projects: [
        {"id": 3, "description": null, "default_branch": "ubuntu_script", "public": true, "ssh_url_to_repo": "git@demo.gitlab.com:gitlab/gitlabhq.git", "http_url_to_repo": "http://demo.gitlab.com/gitlab/gitlabhq.git", "web_url": "http://demo.gitlab.com/gitlab/gitlabhq", "owner": {"id": 1, "username": "root", "email": "m@gitlabhq.com", "name": "Administrator", "state": "active", "created_at": "2012-12-21T12:40:41Z"}, "name": "gitlabhq", "name_with_namespace": "GitLab / gitlabhq", "path": "gitlabhq", "path_with_namespace": "gitlab/gitlabhq", "issues_enabled": true, "merge_requests_enabled": true, "wall_enabled": true, "wiki_enabled": true, "snippets_enabled": true, "created_at": "2012-12-21T13:06:34Z", "last_activity_at": "2013-09-24T09:16:04Z", "namespace": {"created_at": "2012-12-21T13:03:05Z", "description": "Self hosted Git management software", "id": 4, "name": "GitLab", "owner_id": 1, "path": "gitlab", "updated_at": "2013-03-20T13:29:13Z"}},
        {"id": 4, "description": "", "default_branch": "gh-pages", "public": false, "ssh_url_to_repo": "git@demo.gitlab.com:gitlab/gitlab-ci.git", "http_url_to_repo": "http://demo.gitlab.com/gitlab/gitlab-ci.git", "web_url": "http://demo.gitlab.com/gitlab/gitlab-ci", "owner": {"id": 1, "username": "root", "email": "m@gitlabhq.com", "name": "Administrator", "state": "active", "created_at": "2012-12-21T12:40:41Z"}, "name": "gitlab-ci", "name_with_namespace": "GitLab / gitlab-ci", "path": "gitlab-ci", "path_with_namespace": "gitlab/gitlab-ci", "issues_enabled": true, "merge_requests_enabled": true, "wall_enabled": true, "wiki_enabled": true, "snippets_enabled": true, "created_at": "2012-12-21T13:06:50Z", "last_activity_at": "2013-09-20T19:42:55Z", "namespace": {"created_at": "2012-12-21T13:03:05Z", "description": "Self hosted Git management software", "id": 4, "name": "GitLab", "owner_id": 1, "path": "gitlab", "updated_at": "2013-03-20T13:29:13Z"}},
        {"id": 5, "description": "", "default_branch": "master", "public": true, "ssh_url_to_repo": "git@demo.gitlab.com:gitlab/gitlab-recipes.git", "http_url_to_repo": "http://demo.gitlab.com/gitlab/gitlab-recipes.git", "web_url": "http://demo.gitlab.com/gitlab/gitlab-recipes", "owner": {"id": 1, "username": "root", "email": "m@gitlabhq.com", "name": "Administrator", "state": "active", "created_at": "2012-12-21T12:40:41Z"}, "name": "gitlab-recipes", "name_with_namespace": "GitLab / gitlab-recipes", "path": "gitlab-recipes", "path_with_namespace": "gitlab/gitlab-recipes", "issues_enabled": true, "merge_requests_enabled": true, "wall_enabled": true, "wiki_enabled": true, "snippets_enabled": true, "created_at": "2012-12-21T13:07:02Z", "last_activity_at": "2013-09-22T00:15:19Z", "namespace": {"created_at": "2012-12-21T13:03:05Z", "description": "Self hosted Git management software", "id": 4, "name": "GitLab", "owner_id": 1, "path": "gitlab", "updated_at": "2013-03-20T13:29:13Z"}},
        {"id": 8, "description": "ssh access and repository management app for GitLab", "default_branch": "master", "public": false, "ssh_url_to_repo": "git@demo.gitlab.com:gitlab/gitlab-shell.git", "http_url_to_repo": "http://demo.gitlab.com/gitlab/gitlab-shell.git", "web_url": "http://demo.gitlab.com/gitlab/gitlab-shell", "owner": {"id": 1, "username": "root", "email": "m@gitlabhq.com", "name": "Administrator", "state": "active", "created_at": "2012-12-21T12:40:41Z"}, "name": "gitlab-shell", "name_with_namespace": "GitLab / gitlab-shell", "path": "gitlab-shell", "path_with_namespace": "gitlab/gitlab-shell", "issues_enabled": true, "merge_requests_enabled": true, "wall_enabled": false, "wiki_enabled": true, "snippets_enabled": false, "created_at": "2013-03-20T13:28:53Z", "last_activity_at": "2013-09-24T13:18:12Z", "namespace": {"created_at": "2012-12-21T13:03:05Z", "description": "Self hosted Git management software", "id": 4, "name": "GitLab", "owner_id": 1, "path": "gitlab", "updated_at": "2013-03-20T13:29:13Z"}},
        {"id": 9, "description": null, "default_branch": "master", "public": false, "ssh_url_to_repo": "git@demo.gitlab.com:gitlab/gitlab_git.git", "http_url_to_repo": "http://demo.gitlab.com/gitlab/gitlab_git.git", "web_url": "http://demo.gitlab.com/gitlab/gitlab_git", "owner": {"id": 1, "username": "root", "email": "m@gitlabhq.com", "name": "Administrator", "state": "active", "created_at": "2012-12-21T12:40:41Z"}, "name": "gitlab_git", "name_with_namespace": "GitLab / gitlab_git", "path": "gitlab_git", "path_with_namespace": "gitlab/gitlab_git", "issues_enabled": true, "merge_requests_enabled": true, "wall_enabled": false, "wiki_enabled": true, "snippets_enabled": false, "created_at": "2013-04-28T19:15:08Z", "last_activity_at": "2013-08-29T13:27:29Z", "namespace": {"created_at": "2012-12-21T13:03:05Z", "description": "Self hosted Git management software", "id": 4, "name": "GitLab", "owner_id": 1, "path": "gitlab", "updated_at": "2013-03-20T13:29:13Z"}},
        {"id": 10, "description": "ultra lite authorization library http://randx.github.com/six/\r\n ", "default_branch": "master", "public": true, "ssh_url_to_repo": "git@demo.gitlab.com:sandbox/six.git", "http_url_to_repo": "http://demo.gitlab.com/sandbox/six.git", "web_url": "http://demo.gitlab.com/sandbox/six", "owner": {"id": 1, "username": "root", "email": "m@gitlabhq.com", "name": "Administrator", "state": "active", "created_at": "2012-12-21T12:40:41Z"}, "name": "Six", "name_with_namespace": "Sandbox / Six", "path": "six", "path_with_namespace": "sandbox/six", "issues_enabled": true, "merge_requests_enabled": true, "wall_enabled": false, "wiki_enabled": true, "snippets_enabled": false, "created_at": "2013-08-01T16:45:02Z", "last_activity_at": "2013-09-19T21:12:17Z", "namespace": {"created_at": "2013-08-01T16:44:17Z", "description": "", "id": 8, "name": "Sandbox", "owner_id": 1, "path": "sandbox", "updated_at": "2013-08-01T16:44:17Z"}},
        {"id": 11, "description": "Simple HTML5 Charts using the <canvas> tag ", "default_branch": "master", "public": false, "ssh_url_to_repo": "git@demo.gitlab.com:sandbox/charts-js.git", "http_url_to_repo": "http://demo.gitlab.com/sandbox/charts-js.git", "web_url": "http://demo.gitlab.com/sandbox/charts-js", "owner": {"id": 1, "username": "root", "email": "m@gitlabhq.com", "name": "Administrator", "state": "active", "created_at": "2012-12-21T12:40:41Z"}, "name": "Charts.js", "name_with_namespace": "Sandbox / Charts.js", "path": "charts-js", "path_with_namespace": "sandbox/charts-js", "issues_enabled": true, "merge_requests_enabled": true, "wall_enabled": false, "wiki_enabled": true, "snippets_enabled": false, "created_at": "2013-08-01T16:47:29Z", "last_activity_at": "2013-09-24T10:05:05Z", "namespace": {"created_at": "2013-08-01T16:44:17Z", "description": "", "id": 8, "name": "Sandbox", "owner_id": 1, "path": "sandbox", "updated_at": "2013-08-01T16:44:17Z"}}
    ],

    project_issue_v6: {
        "id": 42,
        "iid": 3,
        "project_id": 3,
        "title": "Add user settings",
        "description": "",
        "labels": [
            "feature"
        ],
        "milestone": {
            "id": 1,
            "title": "v1.0",
            "description": "",
            "due_date": "2012-07-20",
            "state": "closed",
            "updated_at": "2012-07-04T13:42:48Z",
            "created_at": "2012-07-04T13:42:48Z"
        },
        "assignee": {
            "id": 2,
            "username": "jack_smith",
            "email": "jack@example.com",
            "name": "Jack Smith",
            "state": "active",
            "created_at": "2012-05-23T08:01:01Z"
        },
        "author": {
            "id": 1,
            "username": "john_smith",
            "email": "john@example.com",
            "name": "John Smith",
            "state": "active",
            "created_at": "2012-05-23T08:00:58Z"
        },
        "state": "opened",
        "updated_at": "2012-07-12T13:43:19Z",
        "created_at": "2012-06-28T12:58:06Z"
    },

    project_issue_v5: {
        "id": 42,
//        "iid": 3, // v5 API do not have iid
        "project_id": 3,
        "title": "Add user settings",
        "description": "",
        "labels": [
            "feature"
        ],
        "milestone": {
            "id": 1,
            "title": "v1.0",
            "description": "",
            "due_date": "2012-07-20",
            "state": "closed",
            "updated_at": "2012-07-04T13:42:48Z",
            "created_at": "2012-07-04T13:42:48Z"
        },
        "assignee": {
            "id": 2,
            "username": "jack_smith",
            "email": "jack@example.com",
            "name": "Jack Smith",
            "state": "active",
            "created_at": "2012-05-23T08:01:01Z"
        },
        "author": {
            "id": 1,
            "username": "john_smith",
            "email": "john@example.com",
            "name": "John Smith",
            "state": "active",
            "created_at": "2012-05-23T08:00:58Z"
        },
        "state": "opened",
        "updated_at": "2012-07-12T13:43:19Z",
        "created_at": "2012-06-28T12:58:06Z"
    }
}
