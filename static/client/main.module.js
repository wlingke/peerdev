var app = angular.module('peerdev', [
        'ui.router',
        'ui.bootstrap'
    ])
    .run(function (Initialize, $rootScope, $state) {
        Initialize.getCurrentUser();

        $rootScope.$on('$stateChangeError', function (e, to, toParams, from, fromParams, error) {
            if (error.type === 'redirect') {
                $state.transitionTo(error.state);
            }
        });
    });



