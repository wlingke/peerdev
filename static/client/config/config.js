app.config(function ($locationProvider, $compileProvider, $uiViewScrollProvider) {

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $uiViewScrollProvider.useAnchorScroll();
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

});