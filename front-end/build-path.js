module.exports = buildPath;

    var rawPaths = {
        vendors: {
            js: [
            	'jquery/dist/jquery.js',
            	'angular/angular.js',
            	'angular-animate/angular-animate.js',
            	'angular-touch/angular-touch.js',
            	'angular-ui-router/release/angular-ui-router.js',
            	'bootstrap/dist/js/bootstrap.js',
            ],
            css: [
            	'bootstrap/dist/css/*.css',
            ],
            fonts: [
            	'bootstrap/dist/fonts/*',
            ]
        },
        user: {
            js: [
                'js/**/*.js',
            ],
            css: [
                'less/**/*.less',
            ],
        }
    }

function buildPath(baseDir, alias) {
    if (!alias || !rawPaths[alias]) {
    	return null;
    }
    for (var pathkey in rawPaths[alias]) {
        if (rawPaths[alias].hasOwnProperty(pathkey) && rawPaths[alias][pathkey]) {
            rawPaths[alias][pathkey] = rawPaths[alias][pathkey].map(function (el) {
            	return baseDir + el;
            });
        }
    }
    return rawPaths[alias];
}