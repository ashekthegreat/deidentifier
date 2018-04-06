(function () {
    angular.module("deidentifier")
        .controller("HomeController", HomeController);

    HomeController.$inject = ["$scope", "HomeFactory"];

    function HomeController($scope, HomeFactory) {
        $scope.message = "";
        $scope.data = {};

        $scope.parse = function(){
            $scope.data = {};
            $scope.message = "";

            HomeFactory.parse().then(function(data){
                $scope.data = data;
                $scope.message = "Done";
            }, function(error){
                $scope.message = "Error";
            });

        };

        $scope.transform = function(){
            $scope.data = {};
            $scope.message = "";

            HomeFactory.transform().then(function(data){
                $scope.data = data;
                $scope.message = "Done";
            }, function(error){
                $scope.message = "Error";
            });

        }
    }
}());