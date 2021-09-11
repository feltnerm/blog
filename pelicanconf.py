#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Mark Feltner'
SITENAME = "Mark Feltner's Weblog"
SITENAME_SHORT = "Mark Feltner's Weblog"
EMAIL = 'mark@feltner.me'
SITEURL = ''
DESCRIPTION = "The thoughts and writings of Mark James Feltner."

THEME = 'theme/feltnerm-pelican-theme'
DEVELOP = True

PATH = 'content'

TIMEZONE = 'America/Chicago'
READERS = {
    'html': None
}

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

STATIC_PATHS = [
    'static/CNAME',
    'static/robots.txt',
    'static/hackers.txt',
    'static/humans.txt'
]

EXTRA_PATH_METADATA = {
    'static/CNAME': { 'path': 'CNAME' },
    'static/robots.txt': { 'path': 'robots.txt' },
    'static/hackers.txt': { 'path': 'hackers.txt' },
    'static/humans.txt': { 'path': 'humans.txt' }
}

REPO_HOME = 'https://github.com/feltnerm/blog'

TWITTER_USERNAME = 'feltnermj'
GITHUB_USERNAME = 'feltnerm'
LASTFM_USERNAME = 'plugitin'
FACEBOOK_USERNAME = 'feltnerm'

ANALYTICS = {
    'GOOGLE': 'UA-45806952-1'
}

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

ARTICLE_URL = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
ARTICLE_URL = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'
ARCHIVES_SAVE_AS = 'posts/index.html'
YEAR_ARCHIVE_SAVE_AS='posts/{date:%Y}/index.html'
MONTH_ARCHIVE_SAVE_AS='posts/{date:%Y}/{date:%m}/index.html'
DAY_ARCHIVE_SAVE_AS='posts/{date:%Y}/{date:%m}/{date:%d}/index.html'
AUTHORS_SAVE_AS=''
CATEGORY_SAVE_AS = ''
CATEGORIES_SAVE_AS = ''

MARKDOWN = [
    'codehilite(css_class=highlight)',
    'extra',
    'headerid',
    'smarty'
]
