class Notification {
  constructor(args){
    this.config = args.config;
    this.chrome = args.chrome;
    this.notification_cache = args.notification_cache;
    this.notification_count = 0;
  }

  notify(args){
    const project        = args.project;
    const project_event  = args.project_event;
    const internal       = args.internal;
    const current_time   = args.current_time;
    const message        = args.message;
    const author_id      = args.author_id || "";
    const is_self_action = args.is_self_action;

    const notifiedEvent = this.notification_cache.isNotified(project_event);

    if (notifiedEvent){
      // Don't notify same event
      return false;
    }

    if (this.config.ignoreOwnEvents && is_self_action) {
      return;
    }

    this.notification_cache.add(project_event);
    const notification_id = this.notification_cache.cacheKey(project_event);

    this.createNotification({
      target_url:      internal.target_url,
      avatar_url:      project.avatar_url,
      notification_id: notification_id,
      title:           project.name,
      message:         message
    });

    // use hash of notification_id as unique id
    project_event._id          = notification_id;
    project_event.project_name = project.name;
    project_event.target_id    = internal.target_id;
    project_event.target_url   = internal.target_url;
    project_event.notified_at  = current_time;
    project_event.message      = message;
    project_event.author_id    = author_id;
    this.config.addNotifiedHistories([project_event]);

    this.incNotificationCount();
    return true;
  }

  createNotification(args){
    const notification_id = args.notification_id;
    const title           = args.title;
    const message         = args.message;
    const target_url      = this.sanitizeUrl(args.target_url);

    this.chrome.notifications.create(
      JSON.stringify({notification_id: notification_id, target_url: target_url}),
      {
        type:     "basic",
        iconUrl:  args.avatar_url || "img/gitlab_logo_128.png",
        title:    title,
        message:  message,
        priority: 0
      },
      () => {
        // do nothing
      }
    );
  }

  incNotificationCount(){
    this.notification_count ++;
    this.chrome.browserAction.setBadgeText({text: String(this.notification_count)});
  }

  sanitizeUrl(url){
    if(!url){
      return url;
    }
    // e.g. https://example.com//namespace/repo -> https://example.com/namespace/repo
    return url.replace(/(https?):\/\/(.+?)\/\//, (match, p1, p2) => {
      return `${p1}://${p2}/`;
    });
  }

  set badgeText(value){
    value = parseInt(value) || 0;
    this.notification_count = value;
  }
}

try {
  module.exports = Notification;
} catch (e){
}
