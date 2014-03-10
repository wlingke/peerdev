var app = angular.module('peerdev', [
        'ui.router',
        'ui.bootstrap',
        'ui.gravatar',
        'monospaced.elastic',
        'RVInlineValidate',
        'RVStatus',
        'RVAlerts',
        'infinite-scroll'
    ])
    .run(function (Initialize, $rootScope, $state, ModelRelations, User) {
        Initialize.getCurrentUser();
        Initialize.models();
        ModelRelations.registerModels({
            user: User.getModel()
        });

        $rootScope.$on('$stateChangeError', function (e, to, toParams, from, fromParams, error) {
            if (error.type === 'redirect') {
                $state.transitionTo(error.state);
            }
        });
    });



