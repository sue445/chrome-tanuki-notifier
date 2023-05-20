class Config {
  constructor(storage){
    this.storage = storage || {};
  }

  get gitlabPath(){
    return this.storage.gitlabPath;
  }

  set gitlabPath(value){
    this.storage.gitlabPath = value;
  }

  get apiPath(){
    return this.storage.apiPath;
  }

  set apiPath(value){
    this.storage.apiPath = value;
  }

  get privateToken(){
    return this.storage.privateToken || "";
  }

  set privateToken(value){
    this.storage.privateToken = value;
  }

  get pollingSecond(){
    return this.storage.pollingSecond || 60;
  }

  set pollingSecond(value){
    this.storage.pollingSecond = value;
  }

  get projects(){
    return JSON.parse(this.storage.projects || "{}");
  }

  set projects(value){
    this.storage.projects = JSON.stringify(value);
  }

  get activeProjectIds(){
    return Object.entries(this.projects).filter((element) => {
      const project = element[1];
      return project.events.Commit || project.events.Issue || project.events.MergeRequest || project.events.Milestone;
    }).map((element) => {
      return element[0];
    });
  }

  getProject(project_id){
    project_id = parseInt(project_id);
    return this.projects[project_id] || {name: "", events: {}};
  }

  get maxEventCount(){
    return this.storage.maxEventCount || 100;
  }

  set maxEventCount(value){
    this.storage.maxEventCount = value;
  }

  get maxNotificationCount(){
    return this.storage.maxNotificationCount || 10;
  }

  set maxNotificationCount(value){
    this.storage.maxNotificationCount = value;
  }

  get newMarkMinute(){
    return this.storage.newMarkMinute || 10;
  }

  set newMarkMinute(value){
    this.storage.newMarkMinute = value;
  }

  get ignoreOwnEvents(){
    return JSON.parse(this.storage.ignoreOwnEvents || false);
  }

  set ignoreOwnEvents(value){
    this.storage.ignoreOwnEvents = value;
  }

  get notifiedHistories(){
    return JSON.parse(this.storage.notifiedHistories || "[]");
  }

  set notifiedHistories(histories){
    histories = histories || [];
    this.storage.notifiedHistories = JSON.stringify(histories);
  }

  set userId(value){
    this.storage.userId = value;
  }

  get userId(){
    return +this.storage.userId;
  }

  set gitlabVersion(value) {
    this.storage.gitlabVersion = value;
  }

  get gitlabVersion() {
    return this.storage.gitlabVersion;
  }

  // Whether GitLab 16.0+
  isGitLab16_0() {
    return parseFloat(this.gitlabVersion) >= 16.0;
  }

  addNotifiedHistories(newHistories){
    // newHistories = [newest ... oldest]
    // notifiedHistories = [newest ... oldest]
    const notified_histories = this.notifiedHistories;

    // add param histories
    while(newHistories.length > 0){
      notified_histories.unshift(newHistories.pop());
    }

    // remove old histories
    while(notified_histories.length > this.maxEventCount){
      notified_histories.pop();
    }

    this.notifiedHistories = notified_histories;
  }

  // remove target history with given '_id'
  removeNotifiedHistory(_id){
    let notified_histories = this.notifiedHistories;

    // remove target history
    notified_histories = notified_histories.filter((project_event) => {
      return project_event._id != _id;
    });

    // save histories
    this.notifiedHistories = notified_histories;
  }

  findNotificationHistory(_id) {
    return this.notifiedHistories.find((project_event) => {
      return project_event._id == _id;
    });
  }

  clearCache(){
    this.storage.removeItem("notifiedHistories");
    this.storage.removeItem("recentEvents");
    this.storage.removeItem("recentEventHashes");
    this.storage.removeItem("avatarCache");
    this.storage.removeItem("notificationCache");
  }

  save(args){
    this.gitlabPath           = args.gitlabPath;
    this.apiPath              = args.apiPath;
    this.privateToken         = args.privateToken;
    this.pollingSecond        = args.pollingSecond;
    this.maxEventCount        = args.maxEventCount;
    this.maxNotificationCount = args.maxNotificationCount;
    this.newMarkMinute        = args.newMarkMinute;
    this.ignoreOwnEvents      = args.ignoreOwnEvents;
    this.userId               = args.userId;

    if (Object.keys(args.projects).length > 0) {
      this.projects = args.projects;
    }
  }
}

try {
  module.exports = Config;
} catch (e){
}
