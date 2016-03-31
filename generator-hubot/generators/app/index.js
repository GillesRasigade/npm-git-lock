'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var npmName = require('npm-name');


var hubotStartSay = function() {
  return  '                     _____________________________  ' + "\n" +
          '                    /                             \\ ' + "\n" +
          ' '+chalk.cyan('  //\\')+'              |      Extracting input for    |' + "\n" +
          ' '+chalk.cyan(' ////\\  ')+'  '+chalk.yellow('_____')+'    |   self-replication process   |' + "\n" +
          ' '+chalk.cyan('//////\\  ')+chalk.yellow('/')+chalk.cyan('_____')+chalk.yellow('\\')+'   \\                             / ' + "\n" +
          ' '+chalk.cyan('=======') + chalk.yellow(' |')+chalk.cyan('[^_/\\_]')+chalk.yellow('|')+'   /----------------------------  ' + "\n" +
          '  '+chalk.yellow('|   | _|___')+'@@'+chalk.yellow('__|__')+'                                ' + "\n" +
          '  '+chalk.yellow('+===+/  ///     ')+chalk.cyan('\\_\\')+'                               ' + "\n" +
          '   '+chalk.cyan('| |_')+chalk.yellow('\\ /// HUBOT/')+chalk.cyan('\\\\')+'                             ' + "\n" +
          '   '+chalk.cyan('|___/')+chalk.yellow('\\//      /')+chalk.cyan('  \\\\')+'                            ' + "\n" +
          '         '+chalk.yellow('\\      /   +---+')+'                            ' + "\n" +
          '          '+chalk.yellow('\\____/    |   |')+'                            ' + "\n" +
          '           '+chalk.cyan('| //|')+'    '+chalk.yellow('+===+')+'                            ' + "\n" +
          '            '+chalk.cyan('\\//')+'      |xx|                            ' +
          "\n";

};

var hubotEndSay = function() {
  return  '                     _____________________________  ' + "\n" +
          ' _____              /                             \\ ' + "\n" +
          ' \\    \\             |   Self-replication process   |' + "\n" +
          ' |    |    '+chalk.yellow('_____')+'    |          complete...         |' + "\n" +
          ' |__'+chalk.cyan('\\\\')+'|   '+chalk.yellow('/')+chalk.cyan('_____')+chalk.yellow('\\')+'   \\     Good luck with that.    / ' + "\n" +
          '   '+chalk.cyan('|//') + chalk.yellow('+  |')+chalk.cyan('[^_/\\_]')+chalk.yellow('|')+'   /----------------------------  ' + "\n" +
          '  '+chalk.yellow('|   | _|___')+'@@'+chalk.yellow('__|__')+'                                ' + "\n" +
          '  '+chalk.yellow('+===+/  ///     ')+chalk.cyan('\\_\\')+'                               ' + "\n" +
          '   '+chalk.cyan('| |_')+chalk.yellow('\\ /// HUBOT/')+chalk.cyan('\\\\')+'                             ' + "\n" +
          '   '+chalk.cyan('|___/')+chalk.yellow('\\//      /')+chalk.cyan('  \\\\')+'                            ' + "\n" +
          '         '+chalk.yellow('\\      /   +---+')+'                            ' + "\n" +
          '          '+chalk.yellow('\\____/    |   |')+'                            ' + "\n" +
          '           '+chalk.cyan('| //|')+'    '+chalk.yellow('+===+')+'                            ' + "\n" +
          '            '+chalk.cyan('\\//')+'      |xx|                            ' +
          "\n";
};

var HubotGenerator = yeoman.generators.Base.extend({

  determineDefaultOwner: function() {
    var userName;
    var userEmail;

    if (typeof(this.user.git.name) == 'function') {
      userName = this.user.git.name()
    } else {
      userName = this.user.git.name
    }

    if (typeof(this.user.git.email) == 'function') {
      userEmail = this.user.git.email()
    } else {
      userEmail = this.user.git.email
    }

    if (userName && userEmail) {
      return userName+' <'+userEmail+'>';
    } else {
      return "User <user@example.com>";
    }
  },

  determineDefaultName: function() {
    return this._.slugify(this.appname);
  },

  defaultAdapter: 'campfire',
  defaultDescription: 'A simple helpful robot for your Company',


  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // FIXME add documentation to these
    this.option('owner', {
      desc: "Name and email of the owner of new bot (ie Example <user@example.com>)",
      type: String
    });

    this.option('name', {
      desc: "Name of new bot",
      type: String
    });

    this.option('description', {
      desc: "Description of the new bot",
      type: String
    });

    this.option('adapter', {
      desc: "Hubot adapter to use for new bot",
      type: String
    });

    this.option('defaults', {
      desc: "Accept defaults and don't prompt for user input",
      type: Boolean
    });

    if (this.options.defaults) {
      this.options.owner = this.options.owner || this.determineDefaultOwner();
      this.options.name = this.options.name || this.determineDefaultName();
      this.options.adapter = this.options.adapter || this.defaultAdapter;
      this.options.description = this.options.description || this.defaultDescription;
    }

    if (this.options.owner == true) {
      this.env.error("Missing owner. Make sure to specify it like --owner=\"<owner>\"");
    }

    if (this.options.name == true) {
      this.env.error("Missing name. Make sure to specify it like --name=\"<name>\"");
    }

    if (this.options.description == true) {
      this.env.error("Missing description. Make sure to specify it like --description=\"<description>\"");
    }

    if (this.options.adapter == true) {
      this.env.error("Missing adapter name. Make sure to specify it like --adapter=<adapter>");
    }
  },

  initializing: function () {
    this.pkg = require('../../package.json');

    this.externalScripts = [
      'hubot-diagnostics',
      'hubot-help',
      'hubot-heroku-keepalive',
      'hubot-google-images',
      'hubot-google-translate',
      'hubot-pugme',
      'hubot-maps',
      'hubot-redis-brain',
      'hubot-rules',
      'hubot-shipit'
    ];

    this.hubotScripts = [
    ];
  },

  prompting: {
    askFor: function () {
      var done = this.async();
      var botOwner = this.determineDefaultOwner();

      var prompts = [];
      if (! this.options.owner) {
        prompts.push({
          name: 'botOwner',
          message: 'Owner',
          default: botOwner
        });
      }

      this.log(hubotStartSay());
      this.prompt(prompts, function (props) {
        this.botOwner = this.options.owner || props.botOwner;

        done();
      }.bind(this));
    },

    askForBotNameAndDescription: function() {
      var done = this.async();
      var botName = this.determineDefaultName()

      var prompts = []

      if (! this.options.name) {
        prompts.push({
          name: 'botName',
          message: 'Bot name',
          default: botName
        });
      }

      if (!this.options.description) {
        prompts.push({
          name: 'botDescription',
          message: 'Description',
          default: this.defaultDescription
        });
      }

      this.prompt(prompts, function (props) {
        this.botName = this.options.name || props.botName;
        this.botDescription = this.options.description || props.botDescription;

        done();
      }.bind(this));
    },

    askForBotAdapter: function() {
      var done = this.async();

      var prompts = [];
      // FIXME validate argument like we do when prompting
      if (! this.options.adapter) {
        prompts.push({
          name: 'botAdapter',
          message: 'Bot adapter',
          default: this.defaultAdapter,
          validate: function (botAdapter) {
            var done = this.async();

            if (botAdapter == 'campfire') {
              done(true);
              return
            }

            var name = 'hubot-' + botAdapter;
            npmName(name, function (err, available) {
              console.log("got back " + available);
              if (available) {
                done("Can't find that adapter on NPM, try again?");
                return;
              }

              done(true);
            });
          }
        });
      }

      this.prompt(prompts, function (props) {
        this.botAdapter = this.options.adapter || props.botAdapter;

        done();
      }.bind(this));
    }
  },

  writing: {
    app: function () {
      this.mkdir('bin');
      this.copy('bin/hubot', 'bin/hubot');
      this.copy('bin/hubot.cmd', 'bin/hubot.cmd');

      this.template('Procfile', 'Procfile');
      this.template('README.md', 'README.md');

      this.write('external-scripts.json', JSON.stringify(this.externalScripts, undefined, 2));
      this.write('hubot-scripts.json', JSON.stringify(this.hubotScripts, undefined, 2));

      this.copy('gitignore', '.gitignore');
      this.template('_package.json', 'package.json');

      this.directory('scripts', 'scripts');
    },

    projectfiles: function () {
      this.copy('editorconfig', '.editorconfig');
    }
  },

  end: function () {
    var packages = ['hubot', 'hubot-scripts'];
    packages = packages.concat(this.externalScripts);

    if (this.botAdapter != 'campfire') {
      packages.push('hubot-' + this.botAdapter);
    }

    this.npmInstall(packages, {'save': true});

    this.log(hubotEndSay());

  }
});

module.exports = HubotGenerator;
