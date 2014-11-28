#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from pygit2 import Repository
import shlex
from subprocess import Popen, PIPE, check_output
from pelican import signals, contents
from datetime import datetime
from time import mktime, altzone
from pelican.utils import  strftime

try:
    repo = Repository(os.path.abspath('.'))
except InvalidGitRepositoryError as e:
    repo = None

ROOT = os.getcwd()

head = lambda x: Popen(["head", "-n", "1"], stdin=x.stdout, stdout=PIPE)
tail = lambda x: Popen(["tail", "-n", "1"], stdin=x.stdout, stdout=PIPE)
echo = lambda x: Popen(["echo"], stdin=x.stdout, stdout=PIPE)

def git_add_date(content):
    if isinstance(content, contents.Static) or repo is None:
        return
    path = os.path.relpath(content.source_path, ROOT)
    print(path)
    cmd = shlex.split("git log --follow --pretty=%cd -- " + path)
    git_func = Popen(cmd, cwd=ROOT, shell=True, stdin=PIPE, stdout=PIPE)
    (out, err) = git_func.communicate()
    print(out)
    content.git_add_date = out

#def git_edit_date(content):
#    if isinstance(content, contents.Static) or repo is None:
#        return
#    path = os.path.relpath(ROOT, content.source_path)
#    cmd = shlex.split("git log --follow --pretty='%cd' -- " + path + " | head -n 1")
#    print(cmd);
#    git_func = Popen(cmd, cwd=ROOT, shell=True, stdin=PIPE, stdout=PIPE)
#    out, err = git_func.communicate()
#    content.git_edit_date = out
#
#def git_add_sha(content):
#    if isinstance(content, contents.Static) or repo is None:
#        return
#    path = os.path.relpath(ROOT, content.source_path)
#    cmd = shlex.split("git log --follow --pretty='%h' -- " + path + " | tail -n 1")
#    git_func = Popen(cmd, cwd=ROOT, shell=True, stdin=PIPE, stdout=PIPE)
#    (out, err) = git_func.communicate()
#    content.git_add_sha = out
#
#def git_edit_sha(content):
#    if isinstance(content, contents.Static) or repo is None:
#        return
#    path = os.path.relpath(ROOT, content.source_path)
#    cmd = shlex.split("git log --follow --pretty='%h' -- " + path + " | head -n 1")
#    git_func = Popen(cmd, cwd=ROOT, shell=True, stdin=PIPE, stdout=PIPE)
#    (out, err) = git_func.communicate()
#    content.git_edit_sha = out

def filetime_from_git(content):
    if isinstance(content, contents.Static) or repo is None:
        return
    gittime = content.metadata.get('gittime', 'yes').lower()
    gittime = gittime.replace("false", "no").replace("off", "no")
    if gittime == "no":
        return
    # 1. file is not managed by git
    #    date: fs time
    # 2. file is staged, but has no commits
    #    date: fs time
    # 3. file is managed, and clean
    #    date: first commit time, update: last commit time or None
    # 4. file is managed, but dirty
    #    date: first commit time, update: fs time
    path = content.source_path
    status, stdout, stderr = git.execute(['git', 'ls-files', path, '--error-unmatch'],
            with_extended_output=True, with_exceptions=False)
    if status != 0:
        # file is not managed by git
        content.date = datetime.fromtimestamp(os.stat(path).st_ctime)
    else:
        # file is managed by git
        commits = repo.commits(path=path)
        if len(commits) == 0:
            # never commited, but staged
            content.date = datetime.fromtimestamp(os.stat(path).st_ctime)
        else:
            # has commited
            content.date = datetime.fromtimestamp(mktime(commits[-1].committed_date) - altzone)

            status, stdout, stderr = git.execute(['git', 'diff', '--quiet', 'HEAD', path],
                    with_extended_output=True, with_exceptions=False)
            if status != 0:
                # file has changed
                content.modified = datetime.fromtimestamp(os.stat(path).st_ctime)
            else:
                # file is not changed
                if len(commits) > 1:
                    content.modified = datetime.fromtimestamp(mktime(commits[0].committed_date) - altzone)
    if not hasattr(content, 'modified'):
        content.modified = content.date
    if hasattr(content, 'date'):
        content.locale_date = strftime(content.date, content.date_format)
    if hasattr(content, 'modified'):
        content.locale_modified = strftime(content.modified, content.date_format)

def register():
    #signals.content_object_init.connect(git_add_date)
    #signals.content_object_init.connect(git_edit_date)
    #signals.content_object_init.connect(git_add_sha)
    #signals.content_object_init.connect(git_edit_sha)
    #signals.content_object_init.connect(filetime_from_git)
