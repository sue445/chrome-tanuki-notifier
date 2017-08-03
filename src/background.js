class Background {
  constructor(args){
    this.config = args.config;
    this.notification = args.notification;
    this.storage = args.storage;
  }

  fetch(){
    this.gitlab = GitLab.createFromConfig(this.config, this.storage);
    this.config.activeProjectIds.forEach((project_id) => {
      this.gitlab.getProjectEvents(project_id).then((project_events) => {
        // latest check
        if(project_events.length < 1){
          return;
        }

        let event_count = 0;
        project_events.forEach((project_event) => {
          if(event_count >= this.config.maxNotificationCount){
            return;
          }

          this.notifyProjectEvent(project_id, project_event);
          event_count++;
        });
      });
    });
  }

  notifyProjectEvent(project_id, project_event){
    const target_type = project_event.target_type || "Commit";

    let comment_target_type;
    if(target_type == "Note" && project_event.action_name == "commented on"){
      comment_target_type = project_event.note.noteable_type;
    }

    if(!this.isNotifyTargetEvent(project_id, target_type) && !this.isNotifyTargetEvent(project_id, comment_target_type)){
      // continue loop
      return;
    }

    const project = this.config.getProject(project_id);

    switch (target_type){
      case "Commit": {
        if(!project_event.data){
          return;
        }

        const commit_message = this.getCommitMessage(project_event);
        const display_id = this.getCommitTargetId(project_event);
        const target_url = this.getCommitTargetUrl(project_id, project_event);

        if(target_url && commit_message){
          const branch_name = project_event.data.ref.replace(/^refs\/heads\//, "");

          this.notification.notify({
            project:       project,
            project_event: project_event,
            internal: {
              target_id:  display_id,
              target_url: target_url
            },
            message:      `[${branch_name}] @${project_event.data.user_name} ${display_id} ${commit_message} (${project_event.data.total_commits_count} commits)`,
            current_time: project_event.created_at || new Date(),
            author_id:    project_event.author_id
          });
        }
        break;
      }
      case "Issue":
      case "MergeRequest": {
        // Issue, MergeRequest
        if(this.gitlab.apiVersion >= 4) {
          // API v4+
          let url;
          switch (target_type) {
            case "Issue":
              url = `${this.gitlab.gitlab_path}/${project.name}/issues/${project_event.target_iid}`;
              break;
            case "MergeRequest":
              url = `${this.gitlab.gitlab_path}/${project.name}/merge_requests/${project_event.target_iid}`;
              break;
          }

          this.notification.notify({
            project:       project,
            project_event: project_event,
            internal: {
              target_id: project_event.target_iid,
              target_url: url
            },
            message:       `[${target_type}] #${project_event.target_iid} ${project_event.target_title} ${project_event.action_name}`,
            current_time:  project_event.created_at || new Date(),
            author_id:     project_event.author_id
          });

        } else {
          // API v3
          return this.gitlab.getEventInternalId({
            project_name: project.name,
            target_type:  target_type,
            target_id:    project_event.target_id,
            project_id:   project_event.project_id,
          }).then((internal) => {
            this.notification.notify({
              project:       project,
              project_event: project_event,
              internal:      internal,
              message:       `[${target_type}] #${internal.target_id} ${project_event.target_title} ${project_event.action_name}`,
              current_time:  project_event.created_at || new Date(),
              author_id:     project_event.author_id
            });
          });
        }
        break;
      }
      case "Milestone": {
        // Milestone
        return this.gitlab.getEventInternalId({
          project_name: project.name,
          target_type:  target_type,
          target_id:    project_event.target_id,
          project_id:   project_event.project_id,
        }).then((internal) => {
          this.notification.notify({
            project:       project,
            project_event: project_event,
            internal:      internal,
            message:       `[${target_type}] #${internal.target_id} ${project_event.target_title} ${project_event.action_name}`,
            current_time:  project_event.created_at || new Date(),
            author_id:     project_event.author_id
          });
        });
        break;
      }

      case "Note": {
        // Issue, MergeRequest (Comment)
        return this.gitlab.getEventInternalId({
          project_name: project.name,
          target_type:  project_event.note.noteable_type,
          target_id:    project_event.note.noteable_id,
          project_id:   project_event.project_id,
        }).then((internal) => {
          internal.target_url = `${internal.target_url}#note_${project_event.note.id}`;

          const note_body = this.truncate(project_event.note.body, 200);
          this.notification.notify({
            project:       project,
            project_event: project_event,
            internal:      internal,
            message:       `[${project_event.note.noteable_type}] #${internal.target_id} ${note_body} ${project_event.action_name}`,
            current_time:  project_event.created_at || new Date(),
            author_id:     project_event.author_id
          });
        });
      }
    }
  }

  getCommitMessage(project_event){
    if(!project_event.data || !project_event.data.commits || project_event.data.commits.length == 0){
      return null;
    }

    // use latest commit message
    return project_event.data.commits.reverse().map((commit) => {
      const first_line = commit.message.split(/(\r\n|\r|\n)/)[0];
      return first_line;
    }).find((first_line) => {
      return first_line.length > 0;
    });
  }

  isNotifyTargetEvent(project_id, target_type){
    const project = this.config.getProject(project_id);
    return project.events[target_type] ? true : false;
  }

  getCommitTargetId(project_event){
    const after = project_event.data.after;
    const before = project_event.data.before;

    if(this.isValidCommitId(before) && this.isValidCommitId(after)){
      return before.substr(0, 6) + "..." + after.substr(0, 6);
    } else if(this.isValidCommitId(before)){
      return before.substr(0, 6);
    } else if(this.isValidCommitId(after)){
      return after.substr(0, 6);
    }
  }

  getCommitTargetUrl(project_id, project_event){
    const project = this.config.getProject(project_id);
    const after = project_event.data.after;
    const before = project_event.data.before;

    if(this.isValidCommitId(before) && this.isValidCommitId(after)){
      return `${this.config.gitlabPath}${project.name}/compare/${before}...${after}`;
    } else if(this.isValidCommitId(before)){
      return `${this.config.gitlabPath}${project.name}/commit/${before}`;
    } else if(this.isValidCommitId(after)){
      return `${this.config.gitlabPath}${project.name}/commit/${after}`;
    }
  }

  isValidCommitId(commit_id){
    // invalid commit id is "0000000000000000000000...."
    return !commit_id.match(/^0+$/);
  }

  truncate(message, truncate_length) {
    message = message || "";
    if(message.length > truncate_length) {
      return message.substring(0, truncate_length) + "...";
    }
    return message;
  }
}

try {
  module.exports = Background;
} catch (e){
}
