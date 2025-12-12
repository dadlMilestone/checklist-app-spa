// Custom webpack configuration to patch electron-webpack for webpack 5 compatibility
// This function is called by electron-webpack to extend the base config
module.exports = function(config) {
  // Remove deprecated webpack 4 options that are not supported in webpack 5
  if (config.optimization) {
    // namedModules was replaced by moduleIds: 'named' in webpack 5
    if (config.optimization.namedModules !== undefined) {
      delete config.optimization.namedModules;
      config.optimization.moduleIds = 'named';
    }
    // noEmitOnErrors was renamed to emitOnErrors (inverted) in webpack 5
    if (config.optimization.noEmitOnErrors !== undefined) {
      config.optimization.emitOnErrors = !config.optimization.noEmitOnErrors;
      delete config.optimization.noEmitOnErrors;
    }
  }

  // Fix html-loader options for webpack 5 / html-loader 2.x+
  if (config.module && config.module.rules) {
    config.module.rules.forEach(rule => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use.forEach(use => {
          if (use.loader && use.loader.includes('html-loader') && use.options) {
            // html-loader 2.x changed minimize option format
            if (use.options.minimize && typeof use.options.minimize !== 'boolean') {
              // Convert old cssnano-style minimize options to boolean
              use.options.minimize = true;
            }
          }
        });
      } else if (rule.loader && rule.loader.includes('html-loader') && rule.options) {
        if (rule.options.minimize && typeof rule.options.minimize !== 'boolean') {
          rule.options.minimize = true;
        }
      }
    });
  }

  return config;
};
