

app.controller('TaporMainController',['$scope', '$http', '$location', function($scope, $http, $location){

	$scope.current_user = null;
	$scope.is_logged_in = false;
	$scope.query = "";

	$scope.checkUser = function() {
		$http.get('/api/users/current')
		.success(function(data, status, headers, config){	
			$scope.current_user = data;
		})
		
	}

	$scope.go_to = function(page) {
		$location.path(page)
	}

	$scope.header_search = function() {
		// console.log($scope.query)
		// console.log($location.url())
		var path = $location.path();
		console.log(path)
		if (path != '/tools') {
			$location.url('/tools/?page=1&query=' + $scope.query);
		} else {
			// $scope.update_query_filter();
			var search = $location.search();
			search['query'] = $scope.query;
			search['page'] = 1;
			$location.search(search);
		}
	

	}


}]);

app.controller('TaporIndexController', ['$scope', '$http', '$sce', 'services', function($scope, $http, $sce, services) {

	$scope.featured = []
	$scope.system_tags = {};
	$scope.latest_comments = [];
	$scope.latest_lists = [];
	$scope.latest_tools = [];

	$http.get('/api/tools/featured')
	.success(function(data, status, headers, config) {
		var featured = data;
		$scope.featured = featured;
		angular.forEach($scope.featured, function(v, i){
			$scope.featured[i].detail = $sce.trustAsHtml($scope.featured[i].detail);
			services.tool.get_ratings($scope.featured[i].id).then(
				function(data){
					$scope.featured[i].ratings = data;
				},
				function(errorMesssage){
					$scope.error = errorMesssage
				}
			);
		});
		if (featured.length == 0) {
			$http.get('/api/tools/latest')
			.success(function(data, status, headers, config) {
				$scope.featured = data;
				angular.forEach($scope.featured, function(v, i){
					$scope.featured[i].detail = $sce.trustAsHtml($scope.featured[i].detail);
					services.tool.get_ratings($scope.featured[i].id).then(
						function(data){
							$scope.featured[i].ratings = data;					
						},
						function(errorMesssage){
							$scope.error = errorMesssage
						}
					);
				});
			});
		}
		
		
	});

	$http.get('/api/tags')
	.success(function(data, status, headers, config){
		$scope.system_tags = data;
	})

	$http.get('/api/comments/latest')
	.success(function(data, status, headers, config){
		$scope.latest_comments = data.reverse();
		angular.forEach($scope.latest_comments, function(v, i){
			$scope.latest_comments[i].content = $sce.trustAsHtml($scope.latest_comments[i].content);
		});
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


	services.tool_list.get_featured_tool_lists().then(
		function(data){
			$scope.featured_tool_lists = data;

			angular.forEach($scope.featured_tool_lists, function(v, i){
				v.total_items = v.tool_list_items.length;
				if (v.tool_list_items.length > 3){
					v.tool_list_items.length = 3;
				}
			});
		},
		function(errorMessage){
			$scope.error = errorMessage;
		}
	);

}]);
