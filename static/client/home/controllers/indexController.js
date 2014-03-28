app.controller('indexController', function ($scope, Project, APILazy, $state, $stateParams, coordinates) {
    var q =
        Project.find()
            .limit(10)
            .populate('owner');

    if ($stateParams.q) {
        var search = $stateParams.q.toLowerCase();
        q.search(search);
    }
    if (coordinates) {
        q.near(coordinates.longitude, coordinates.latitude, 50)
    }

    $scope.lazy = APILazy.create(q);

    $scope.data = {};
    $scope.data.search_input = $stateParams.q;
    $scope.data.search_location = $stateParams.loc;
    $scope.search = function () {
        $state.go('index', {q: $scope.data.search_input, loc: $scope.data.search_location});
    };

    $scope.inputEnter = function (event) {
        if (event.which === 13) {
            event.preventDefault();
            $scope.search();
        }
    }
});