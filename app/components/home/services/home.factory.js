(function () {
    angular.module("deidentifier")
        .factory("HomeFactory", HomeFactory);

    HomeFactory.$inject = ["$http", "$q", "$window"];

    function HomeFactory($http, $q, $window) {
        var factory = {};

        factory.parse = function () {
            return $http.get('get-headers').then(function (payload) {
                return payload.data;
            });
        };

        factory.transform = function () {
            return $http.get('transform').then(function (payload) {
                return payload.data;
            });
        };

        return factory;

    }
}());