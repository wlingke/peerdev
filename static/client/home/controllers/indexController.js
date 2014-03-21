app.controller('indexController', function ($scope, Project, APILazy, $state, $stateParams) {
    var q =
        Project.find()
            .limit(10)
            .populate('owner');

    if($stateParams.q){
        var search = $stateParams.q.split(' ');
        q.$in('keywords', search);
    }

    $scope.lazy = APILazy.create(q);

    $scope.data = {};
    $scope.data.search_input = '';
    $scope.search = function(){
        $state.go('index', {q: $scope.data.search_input});
    };

    $scope.inputEnter = function(event){
        if(event.which === 13){
            event.preventDefault();
            $scope.search();
        }
    }
});