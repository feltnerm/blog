#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Mark Feltner'
SITENAME = "mark feltner's weblog"
EMAIL = 'mark@feltner.me'
SITEURL = ''
DESCRIPTION = '''Write an awesome description for your new site here. You can
edit this line in _config.yml. It will appear in your document head meta (for
Google search results) and in your feed.xml site description.
'''

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

# Blogroll
LINKS = (
    #('Pelican', 'http://getpelican.com/'),
    #('Python.org', 'http://python.org/'),
    #('Jinja2', 'http://jinja.pocoo.org/'),
    #('You can modify those links in your config file', '#'),
)

# Social widget
SOCIAL = (
    #('You can add links in your config file', '#'),
    #('Another social link', '#'),
)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
