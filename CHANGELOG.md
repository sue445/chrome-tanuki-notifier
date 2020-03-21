## development
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.5.1...master)

## 2.5.1 (2020/03/21)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.5.0...2.5.1)

* Bugfix. Can't save option when immediately after installation
  * https://github.com/sue445/chrome-gitlab-notifier/pull/494
* Update dependencies

## 2.5.0 (2020/03/12)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.4.1...2.5.0)

* Ignore own events
  * https://github.com/sue445/chrome-gitlab-notifier/pull/480
  * https://github.com/sue445/chrome-gitlab-notifier/issues/152
* Update dependencies

## 2.4.1 (2019/11/04)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.4.0...2.4.1)

* Improve design options page
  * https://github.com/sue445/chrome-gitlab-notifier/pull/392

## 2.4.0 (2019/08/20)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.3.2...2.4.0)

* Add support for Review Diff Comment
  * https://github.com/sue445/chrome-gitlab-notifier/pull/351

## 2.3.2 (2019/07/17)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.3.1...2.3.2)

* Change merge request icon to code fork
  * https://github.com/sue445/chrome-gitlab-notifier/pull/329

## 2.3.1 (2018/08/14)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.3.0...2.3.1)

* Upgrade to Mithril.js v1.1.6
  * https://github.com/sue445/chrome-gitlab-notifier/pull/129
* Fixed. invalid double-slash url
  * https://github.com/sue445/chrome-gitlab-notifier/issues/177
  * https://github.com/sue445/chrome-gitlab-notifier/pull/178

## 2.3.0 (2017/12/04)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.2.0...2.3.0)

* Add ci trigger page
  * https://github.com/sue445/chrome-gitlab-notifier/pull/124
* Refactorings
  * https://github.com/sue445/chrome-gitlab-notifier/pull/125
  * https://github.com/sue445/chrome-gitlab-notifier/pull/127

## 2.2.0 (2017/09/24)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.1.2...2.2.0)

* add a button to mark all notifications as read
  * https://github.com/sue445/chrome-gitlab-notifier/pull/123

## 2.1.2 (2017/09/12)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.1.1...2.1.2)

* Fixed: missing note link with API v4
  * https://github.com/sue445/chrome-gitlab-notifier/issues/121
  * https://github.com/sue445/chrome-gitlab-notifier/pull/122

## 2.1.1 (2017/08/29)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.1.0...2.1.1)

* Tweak placeholder at option
  * https://github.com/sue445/chrome-gitlab-notifier/pull/118

## 2.1.0 (2017/08/29)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/2.0.0...2.1.0)

### Enhancements
* Support GitLab API v4
  * https://github.com/sue445/chrome-gitlab-notifier/pull/116

### Note :warning:
* If you want to use GitLab API v4, change **GitLab API Path** from `/api/v3` to `/api/v4` at option.
  * Requirement GitLab v9.5.0+

## 2.0.0 (2017/05/04)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.4.3...2.0.0)

* https://github.com/sue445/chrome-gitlab-notifier/pull/105
* https://github.com/sue445/chrome-gitlab-notifier/milestone/1?closed=1

### Enhancements
* **Rewrite all codes using ES6 :muscle:**
  * Use mithril.js instead of jquery
  * Use mocha instead of jasmine
  * Use eslint instead of jslint
  * Write test codes
* Truncate comment to 200 characters or less
  * https://github.com/sue445/chrome-gitlab-notifier/pull/108
* Add yarn
* bootstrap v3.2.0 -> v3.3.7
* jquery v2.0.3 -> v3.2.1
* font-awesome v3.1.0 -> v4.7.0

### Bugfix
* Fixed: Toggle all/none on Repository Events doesn't consider the filter
  * https://github.com/sue445/chrome-gitlab-notifier/issues/67

## 1.4.3 (2016/07/08)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.4.2...1.4.3)

* Fix API call with project_name
  * https://github.com/sue445/chrome-gitlab-notifier/pull/87

## 1.4.2 (2016/07/06)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.4.1...1.4.2)

* Fix. notify same events many times
  * https://github.com/sue445/chrome-gitlab-notifier/issues/85
  * https://github.com/sue445/chrome-gitlab-notifier/pull/86

## 1.4.1 (2016/03/31)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.4.0...1.4.1)

* Bugfix. invalid timeago format by any locale (revenge)
  * https://github.com/sue445/chrome-gitlab-notifier/issues/75
  * https://github.com/sue445/chrome-gitlab-notifier/pull/83
* Fix: don't notify same event 
  * https://github.com/sue445/chrome-gitlab-notifier/pull/80
* Syntax Error In spec 
  * https://github.com/sue445/chrome-gitlab-notifier/pull/81

## 1.4.0 (2016/01/09)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.3.0...1.4.0)

* Bugfix. invalid timeago format by any locale
  * https://github.com/sue445/chrome-gitlab-notifier/issues/75
  * https://github.com/sue445/chrome-gitlab-notifier/pull/77
* Support comment notification of issue and MR (**requirement GitLab v8.3.0+**)
  * https://github.com/sue445/chrome-gitlab-notifier/pull/78
  * https://github.com/sue445/chrome-gitlab-notifier/issues/74

## 1.3.0 (2015/11/18)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.2.1...1.3.0)

* Display event user avatar in popup (thx. @asbjorn)
  * https://github.com/sue445/chrome-gitlab-notifier/issues/68
  * https://github.com/sue445/chrome-gitlab-notifier/pull/69
* Add the right label color for 'pushed new' (thx. @brunosabot)
  * https://github.com/sue445/chrome-gitlab-notifier/pull/70
* Design improvements for the popup (thx. @brunosabot)
  * https://github.com/sue445/chrome-gitlab-notifier/pull/71

## 1.2.1 (2015/08/06)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.2.0...1.2.1)

* old icon -> new icon
  * https://github.com/sue445/chrome-gitlab-notifier/pull/66

## 1.2.0 (2015/03/31)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.1.3...1.2.0)

* Tweak projects list at option page
  * https://github.com/sue445/chrome-gitlab-notifier/pull/55
  * Sort by project name (for GitLab v7.7.0+)
  * Add project archived icon
* Support project avatar (for GitLab v7.9.0+)
  * https://github.com/sue445/chrome-gitlab-notifier/pull/53

## 1.1.3 (2015/03/01)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.1.2...1.1.3)

* Add the 'pushed to' label to the popup window (thx. @brunosabot)
  * https://github.com/sue445/chrome-gitlab-notifier/pull/52

## 1.1.2 (2015/02/04)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.1.1...1.1.2)

* Add trailing slash to gitlabPath and apiPath on save settings (thx. @da0shi)
  * https://github.com/sue445/chrome-gitlab-notifier/pull/51

## 1.1.1 (2014/10/29)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.1.0...1.1.1)

* Use event timestamp when GitLab 6.8.0+
  * https://github.com/sue445/chrome-gitlab-notifier/issues/42
* Add feature to remove certain notification 
  * https://github.com/sue445/chrome-gitlab-notifier/pull/45 (thx. @edwardwang1105)
* strict capitalization: Gitlab -> GitLab
  * https://github.com/sue445/chrome-gitlab-notifier/issues/46 (thx. @bbodenmiller)

## 1.1.0 (2014/07/19)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.0.8...1.1.0)

* Rename app name for [Branding Guidelines](https://developer.chrome.com/webstore/branding)

## 1.0.8 (2014/07/16)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.0.7...1.0.8)

* Upgrade Twitter bootstrap: 3.0.0 -> 3.0.2
* Show progress bar when option projects loading
  * https://github.com/sue445/chrome-gitlab-notifier/pull/39

## 1.0.7 (2014/07/08)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.0.6...1.0.7)

* Improve option page rendering
  * https://github.com/sue445/chrome-gitlab-notifier/pull/34 (thx. @brunosabot)
* Add incremental repository search
  * https://github.com/sue445/chrome-gitlab-notifier/pull/35 (thx. @yaeda)

## 1.0.6 (2014/06/07)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.0.5...1.0.6)

### enhancements
* Select All/none repository events on the options
  * https://github.com/sue445/chrome-gitlab-notifier/pull/31 (thx. @brunosabot)

## 1.0.5 (2014/05/01)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.0.4...1.0.5)

### enhancements
* Add cache clear button on popup
  * https://github.com/sue445/chrome-gitlab-notifier/pull/30

## 1.0.4 (2014/03/08)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.0.3...1.0.4)

### enhancements
* Select All/none repository events on the options
  * https://github.com/sue445/chrome-gitlab-notifier/pull/26 (thx. @brunosabot)

## 1.0.3 (2014/03/05)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.0.2...1.0.3)

### enhancements
* Update popup styles to have make lines more readable
  * https://github.com/sue445/chrome-gitlab-notifier/pull/24 (thx. @brunosabot)

## 1.0.2 (2013/11/26)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.0.1...1.0.2)

### bugfixes
* Close notify box on-click
  * https://github.com/sue445/chrome-gitlab-notifier/issues/19

### enhancements
* Notify commit
  * https://github.com/sue445/chrome-gitlab-notifier/issues/5
* use GitLab like icon
  * https://github.com/sue445/chrome-gitlab-notifier/issues/17
  * [Font Awesome](http://gregoryloucas.github.io/Fontstrap/)

## 1.0.1 (2013/11/05)
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.0.0...1.0.1)

### bugfixes
* gitlab6: Wrong issue|merge request numbers in links
  * https://github.com/sue445/chrome-gitlab-notifier/issues/8
* wrong unread count on badge
  * https://github.com/sue445/chrome-gitlab-notifier/issues/11

### enhancements
* Not show notification when first running
  * https://github.com/sue445/chrome-gitlab-notifier/issues/1

## 1.0.0 (2013/10/23)
* first release
