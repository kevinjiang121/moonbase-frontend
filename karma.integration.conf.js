module.exports = function (config) {
  require('./karma.conf.js')(config);
  config.set({
    files: [
      'src/integration/**/*.integration.spec.ts'
    ],
    port: 9877,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['progress']
  });
};