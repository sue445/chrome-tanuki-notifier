## development
[full changelog](https://github.com/sue445/chrome-gitlab-notifier/compare/1.4.3...master)

## 1.4.3 (2016/07/08)
* Fix API call with project_name
  * https://github.com/sue445/chrome-gitlab-notifier/pull/87

## 1.4.2 (2016/07/06)
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
