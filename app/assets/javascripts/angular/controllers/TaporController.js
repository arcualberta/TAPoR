

app.controller('TaporMainCtrl',['$scope', '$http', function($scope, $http){

	$scope.current_user = null;
	$scope.is_logged_in = false;

	$scope.checkUser = function() {
		$http.get('/api/users/current')
		.success(function(data, status, headers, config){	
			$scope.current_user = data;
		})
		
	}

}]);

app.controller('TaporIndexCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.featured = []

	$http.get('/api/tools/featured')
	.success(function(data, status, headers, config) {
		var featured = data;

		if (featured.length == 0) {
			// get random tools
		}

		$scope.featured = featured;
	});

}]);
