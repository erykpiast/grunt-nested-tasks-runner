var _ = require('lodash');

module.exports = function runner(grunt) {
    var dataKind = grunt.util.kindOf(this.data);

    if(this.args.length) {
        var subtask = this.args[0],
            subtaskConfig = this.data[subtask];

        if(!subtaskConfig) {
            grunt.fail.warn('Subtask "' + subtask + '" not found.');
        } else {
            return runner.call({
                target: this.target + ':' + subtask,
                data: subtaskConfig,
                name: this.name,
                args: this.args.slice(1),
                nameArgs: this.nameArgs
            }, grunt);
        }
    } else if((dataKind === 'array') || (dataKind === 'string')) {
        return grunt.task.run(this.data);
    } else {
        var options = _.extend({
                concurrent: false,
                logConcurrentOutput: false
            }, this.data.options),
            concurrentConfig = { };

        if(options.concurrent) {
            concurrentConfig = {
                tasks: [ ],
                options: {
                    logConcurrentOutput: options.logConcurrentOutput
                }
            };
        }

        var res = _(this.data).every(function(config, name) {
            if(name === 'options') {
                return true;
            }

            var taskName = [ this.name, this.target, name ].join(':');

            if(options.concurrent) {
                return concurrentConfig.tasks.push(taskName);
            } else {
                return grunt.task.run(taskName);
            }
        }, this);

        if(options.concurrent) {
            var newConfig = { },
                configKey = this.nameArgs.replace(/\:/g, '-');
            newConfig[configKey] = concurrentConfig;

            grunt.config.set('concurrent', _.extend({ }, grunt.config.get('concurrent'), newConfig));

            return grunt.task.run('concurrent:' + configKey);
        } else {
            return res;
        }
    }
};
