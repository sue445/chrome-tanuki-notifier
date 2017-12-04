class GitLab {
  constructor(args = {}) {
    // remove end of "/"
    const api_path = args.api_path || "";
    this.api_path = api_path.replace(/\/+$/, "");

    this.gitlab_path = args.gitlab_path;
    this.private_token = args.private_token;
    this.polling_second = args.polling_second;
    this.per_page = args.per_page || 100;
    this.projects = null;
    this.avatar_cache = args.avatar_cache;
    this.cur_proj_name = null;
    this.branches = null;
    this.triggers = null;
  }

  static createFromConfig(config, storage) {
    return new GitLab({
      api_path: config.apiPath,
      gitlab_path: config.gitlabPath,
      private_token: config.privateToken,
      polling_second: config.pollingSecond,
      avatar_cache: new AvatarCache(storage),
    });
  }

  loadProjects() {
    if (this.api_path.length > 0){
      this.projects = null;
      return this.loadProjectsBase(1, []);
    } else {
      this.projects = [];
      return Promise.resolve(this.projects);
    }
  }

  loadProjectsBase(page, all_projects) {
    const data = {
      page: page,
      per_page: this.per_page,
      order_by: "name",
      sort: "asc"
    };

    if (this.apiVersion >= 4) {
      // Until v3, GET /projects returns that user is member.
      // But since v4, GET /projects returns all projects visible to current user, even if the user is not a member.
      // To get projects the user is a member of, use GET /projects?membership=true
      data.membership = true;
    }

    // List projects
    // GET /projects
    // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/projects.md#list-projects
    // NOTE: order_by and sort are supported by v7.7.0+. If no options, order_by created_at DESC
    return m.request({
      url: `${this.api_path}/projects`,
      method: "GET",
      data: data,
      headers: {
        "PRIVATE-TOKEN": this.private_token
      }
    }).then((projects) => {
      all_projects = all_projects.concat(projects);

      if (projects.length < this.per_page) {
        // final page
        this.projects = all_projects;
        return Promise.resolve(all_projects);
      } else {
        // paging
        return this.loadProjectsBase(page + 1, all_projects);
      }
    }).catch((e) => {
      if(!this.projects) {
        this.projects = [];
      }
      alert(e);
      return Promise.reject();
    });
  }

  loadTriggers(proj_name) {
    var projId = encodeURIComponent(proj_name);
    m.request({
      url: `${this.api_path}/projects/${projId}/triggers`,
      method: "GET",
      headers: {
        "PRIVATE-TOKEN": this.private_token
      }
    }).then((data) => {
      this.triggers = data;
      return Promise.resolve(data);
    }).catch((e) => {
      alert(e);
      return Promise.reject();
    });
  }
  
  loadBranches(proj_name) {
    if (this.api_path.length > 0){
      this.branches = null;
      var proj_id = encodeURIComponent(proj_name);
      return this.loadBranchesBase(proj_id, 1, []);
    } else {
      this.branches = [];
      return Promise.resolve(this.branches);
    }
  }
  loadBranchesBase(proj_id, page, all_branches) {
    const data = {
      page: page,
      per_page: this.per_page
    };
    // List repository branches 
    // GET /projects/:id/repository/branches
    // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/branches.md#list-repository-branches
    // NOTE: order_by and sort are supported by v7.7.0+. If no options, order_by created_at DESC
    return m.request({
      url: `${this.api_path}/projects/${proj_id}/repository/branches`,
      method: "GET",
      data: data,
      headers: {
        "PRIVATE-TOKEN": this.private_token
      }
    }).then((branches) => {
      all_branches = all_branches.concat(branches);

      if (branches.length < this.per_page) {
        // final page
        this.branches = all_branches;
        return Promise.resolve(all_branches);
      } else {
        // paging
        return this.loadBranchesBase(proj_id, page + 1, all_branches);
      }
    }).catch((e) => {
      if(!this.branches) {
        this.branches = [];
      }
      alert(e);
      return Promise.reject();
    });
  }

  loadAvatarUrls(user_ids) {
    this.avatar_urls = {};

    if(this.api_path.length == 0){
      return;
    }

    user_ids.forEach((user_id) => {
      const cached_avatar_url = this.avatar_cache.get(user_id);
      if (cached_avatar_url) {
        this.avatar_urls[user_id] = cached_avatar_url;
        return;
      }

      this.getUserAvatarUrl(user_id).then((user) => {
        this.avatar_cache.set(user_id, user.avatar_url);
        this.avatar_urls[user_id] = user.avatar_url;
      });
    });
  }

  getUserAvatarUrl(user_id) {
    // Single user
    // GET /users/:id
    // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/users.md#single-user
    return m.request({
      url: `${this.api_path}/users/:user_id`,
      method: "GET",
      data: {
        user_id: user_id
      },
      headers: {
        "PRIVATE-TOKEN": this.private_token
      }
    });
  }

  getProjectEvents(project_id){
    // Get project events
    // GET /projects/:id/events
    // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/projects.md#get-project-events
    return m.request({
      url: `${this.api_path}/projects/:project_id/events`,
      method: "GET",
      data: {
        project_id: project_id,
        per_page: this.per_page
      },
      headers: {
        "PRIVATE-TOKEN": this.private_token
      }
    });
  }

  getEventInternalId(args){
    // Single issue
    // GET /projects/:id/issues/:issue_id
    // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/issues.md#single-issue
    //   or
    // Get single MR
    // GET /projects/:id/merge_request/:merge_request_id
    // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/merge_requests.md#get-single-mr
    //   or
    // Get single milestone
    // GET /projects/:id/milestones/:milestone_id
    // https://github.com/gitlabhq/gitlabhq/blob/master/doc/api/milestones.md#get-single-milestone

    let api_url;
    switch(args.target_type) {
      case "Issue":
        api_url = `${this.api_path}/projects/:project_id/issues/:target_id`;
        break;
      case "MergeRequest":
        if (this.apiVersion >= 4) {
          // since v4
          api_url = `${this.api_path}/projects/:project_id/merge_requests/:target_id`;
        } else {
          // until v3
          api_url = `${this.api_path}/projects/:project_id/merge_request/:target_id`;
        }
        break;
      case "Milestone":
        api_url = `${this.api_path}/projects/:project_id/milestones/:target_id`;
        break;
    }

    return m.request({
      url: api_url,
      method: "GET",
      data: {
        project_id: args.project_id,
        target_id: args.target_id
      },
      headers: {
        "PRIVATE-TOKEN": this.private_token
      }
    }).then((res) => {
      const id = res.iid || res.id;

      let url;
      switch(args.target_type) {
        case "Issue":
          url = `${this.gitlab_path}/${args.project_name}/issues/${id}`;
          break;
        case "MergeRequest":
          url = `${this.gitlab_path}/${args.project_name}/merge_requests/${id}`;
          break;
        case "Milestone":
          url = `${this.gitlab_path}/${args.project_name}/milestones/${id}`;
          break;
      }

      return Promise.resolve({target_id: id, target_url: url});
    });
  }

  get apiVersion(){
    const ret = this.api_path.match(/\/api\/v([0-9]+)$/);
    if (ret){
      return parseInt(ret[1]);
    }
    return 0;
  }
}

try {
  module.exports = GitLab;
} catch (e){
}
