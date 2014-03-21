app.config(function ($locationProvider, $compileProvider, $uiViewScrollProvider, gravatarServiceProvider, UniversalAlertServiceProvider) {

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $uiViewScrollProvider.useAnchorScroll();
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    gravatarServiceProvider.defaults = {
        size: 100,
        'default': 'mm'
    };
    UniversalAlertServiceProvider.setContainer('#alerts-container');

});