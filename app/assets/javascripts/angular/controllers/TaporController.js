

app.controller('TaporMainController',['$scope', '$http', function($scope, $http){

	$scope.current_user = null;
	$scope.is_logged_in = false;

	$scope.checkUser = function() {
		$http.get('/api/users/current')
		.success(function(data, status, headers, config){	
			$scope.current_user = data;
		})
		
	}

}]);

app.controller('TaporIndexController', ['$scope', '$http', function($scope, $http) {

	$scope.carousel_next = function() {
		$("#carousel-example-generic").carousel("next");
	}

	$scope.carousel_prev = function() {
		$("#carousel-example-generic").carousel("prev");	
	}

	$scope.featured = []
	$scope.system_tags = {};
	$scope.latest_comments = [];
	$scope.latest_lists = [];
	$scope.latest_tools = [];

	$http.get('/api/tools/featured')
	.success(function(data, status, headers, config) {
		var featured = data;
		$scope.featured = featured;
		if (featured.length == 0) {
			$http.get('/api/tools/latest')
			.success(function(data, status, headers, config) {
				$scope.featured = data;
				console.log(data)
			});
		}
	});



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

	$http.get('/api/tool_lists/latest')
	.success(function(data, status, headers, config){
		$scope.latest_lists = data;

		angular.forEach(data, function(v, i){
			$scope.latest_lists[i].total_items = v.tool_list_items.length;
			$scope.latest_lists[i].tool_list_items = $scope.latest_lists[i].tool_list_items.slice(0, 3);
		});
	})

}]);
