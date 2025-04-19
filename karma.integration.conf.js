// karma.integration.conf.js
module.exports = function(config) {
    const baseConfig = require('./karma.conf.js');
    config.set({
      // inherit everything from your base Karma config
      ...baseConfig,
  
      // only run files in src/integration/
      files: [
        'src/integration/**/*.integration.spec.ts'
      ],
  
      // avoid collision with your unit‐test server
      port: 9877,
  
      // headless Chrome is usually best for CI
      browsers: ['ChromeHeadless'],
  
      // integration suite should exit when done
      singleRun: true,
  
      // simpler output
      reporters: ['progress']
    });
  };
  