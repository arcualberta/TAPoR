

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

		var path = $location.path();
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

app.controller('TaporIndexController', ['$scope', '$http', '$sce', '$location', 'services', function($scope, $http, $sce, $location, services) {
	$scope.featured = []
	$scope.latest_comments = [];
	$scope.latest_lists = [];
	$scope.latest_tools = [];
	$scope.tools_by_analysis = {
		attribute_values: [],
		tools: []
	};
	$scope.systemTags = [];

	services.tag.list().then(
		function(data){
			$scope.systemTags = data;
		},
		function(errorMessage) {
			scope.error = errorMessage;
		}
	);


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

	services.tool.get_tools_by_analysis().then(
		function(data) {
			$scope.tools_by_analysis = data;
		},
		function(errorMessage) {
			$scope.error = errorMessage;	
		}
	);

	$scope.elementClick = function(e) {
		$location.url('/tools/'+e.tool_id);
	}

}]);
