var app = angular.module('app', ['ngTouch', 'ui.grid']);



app.factory('dataFactory',function(){


})

app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    var today = new Date();
    $scope.gridOptions = {
        enableFiltering: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
        },
        columnDefs: [
            { field: 'name' },
            { field: 'gender', cellFilter: 'mapGender' },
            { field: 'company' },
            { field: 'email' },
            { field: 'phone' },
            { field: 'age' },
            { field: 'mixedDate' }
        ]
    };

    $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
        .then(function (response) {
            var data = response.data;

            $scope.gridOptions.data = data;
        

            data.forEach(function addDates(row, index) {
                row.mixedDate = new Date();
                row.mixedDate.setDate(today.getDate() + (index % 14));
                row.gender = row.gender === 'male' ? '1' : '2';
            });
        });

    $scope.filter = function () {
        $scope.gridApi.grid.refresh();
    };

    $scope.singleFilter = function (renderableRows) {
        var matcher = new RegExp($scope.filterValue);
        renderableRows.forEach(function (row) {
            console.log(row);
            var match = false;
            ['name','company','email'].forEach(function (field) {
                if (row.entity[field].match(matcher)) {
                    match = true;
                }
            });
            if (!match) {
                row.visible = false;
            }
        });
        return renderableRows;
    };
}])
    .filter('mapGender', function () {
        var genderHash = {
            1: 'male',
            2: 'female'
        };

        return function (input) {
            if (!input) {
                return '';
            } else {
                return genderHash[input];
            }
        };
    });