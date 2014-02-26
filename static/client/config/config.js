app.config(function ($locationProvider, $compileProvider, $uiViewScrollProvider, gravatarServiceProvider) {

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $uiViewScrollProvider.useAnchorScroll();
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    gravatarServiceProvider.defaults = {
        size: 100,
        'default': 'mm'
    }

});