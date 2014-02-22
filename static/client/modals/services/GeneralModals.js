app.factory('GeneralModals', function ($modal, $rootScope) {

    var loginModal = function () {
        var instance = $modal.open({
            templateUrl: '/static/client/modals/partials/loginModal.html'
        });

        instance.result.then(function (type) {
            if (type === 'facebook') {
                window.location.pathname = "/api/facebook";
            } else if (type === 'google') {
                window.location.pathname = "/api/google";
            }
        });
    };


    return {
        loginModal: loginModal
    };
});