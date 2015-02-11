

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
		console.log(featured)
	});

	$scope.carousel_next = function() {
		$("#carousel-example-generic").carousel("next");
	}

	$scope.carousel_prev = function() {
		$("#carousel-example-generic").carousel("next");	
	}

	$http.get('/api/tags')
	.success(function(data, status, headers, config){
		$scope.system_tags = data;
	})

	$http.get('/api/comments/latest')
	.success(function(data, status, headers, config){
		$scope.latest_comments = data;
	})

	$http.get('/api/tools/latest')
	.success(function(data, status, headers, config){
		$scope.latest_tools = data;
	})

}]);
