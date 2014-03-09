app.factory('ConfirmModals', function($modal, $rootScope){

    /**
     * Launches an instance of the Remove Project Confirmation Modal
     *
     * @param projectModel
     * @param message
     * @param data (optional - additional data to pass onto scope)
     * @returns modalInstance
     */
    var removeProject = function(projectModel, message, data){
        if(typeof projectModel === 'undefined'){
            throw new Error('Project model must be defined');
        }
        var scope = $rootScope.$new();
        scope.project = projectModel;
        if(message){
            scope.message = message;
        }
        if(data){
            scope.data = data;
        }

        return $modal.open({
            templateUrl: '/static/client/modals/partials/confirmModal.html',
            scope: scope,
            controller: 'removeProjectController'
        });
    };

    return {
        removeProject: removeProject,
    };
});