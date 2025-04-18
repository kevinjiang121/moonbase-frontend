// karma.conf.js
module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-coverage'),
        require('karma-jasmine-html-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        clearContext: false
      },
      jasmineHtmlReporter: {
        suppressAll: true
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/moonbase-frontend'),
        subdir: '.',
        reporters: [{ type: 'html' }, { type: 'text-summary' }]
      },
      reporters: ['progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['ChromeHeadless'],
      singleRun: false,
      restartOnFileChange: true
    });
  };
  