"use strict";

var path = require('path'),
    slug = require('slug'),
    yaml = require('js-yaml'),
    readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });


module.exports = function(grunt) {

    grunt.registerTask('generate_posts_json',
        'Generate a JSON file containing data on each post',

        function() {
            var src = grunt.config.get('config.src', 'templates', 'posts');
    });

    grunt.registerTask('new_post',
        'Create a new unpublished blog post from a template)',

        function() {
            var front_matter = {
                published: false,
                date_started: grunt.template.today('isoDateTime'),
                tags: [],
                title: '',
                category: 'post',
                layout: 'post.hbs',
            },
            dest = path.join(
                    grunt.config.get('CONFIG.src'),
                    'templates',
                    'posts'),
            done = this.async();

            function getTags(tags) {
                var tag_array = [];
                if (tags) {
                    if (tags.indexOf(',') === -1) {
                        tag_array[0] = tags;
                    }
                    else if (tags.split(',').length > 0) {
                        tag_array = tags.split(',');
                    }
                }
                return tag_array;
            }

            readline.question("What will be the title of this post? ",
                function(answer) {
                    front_matter.title = answer;
                    dest = path.join(dest, slug(answer)+'.hbs');
                    readline.question("Any preliminary tags (comma-delimited)? ",
                        function(answer) {
                            front_matter.tags = getTags(answer);
                            if (front_matter.title !== '') {
                                var yaml_front_matter =  yaml.safeDump(front_matter),
                                    template_str =  '---\n' +
                                                    yaml_front_matter +
                                                    '---\n';
                                grunt.file.write(dest, template_str);
                                done();
                            } else {
                                done(false);
                            }
                        });
                });
        });
};
