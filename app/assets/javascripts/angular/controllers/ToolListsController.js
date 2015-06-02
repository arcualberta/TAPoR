app.controller('ListsContributingController', ['$scope', '$http', function($scope, $http) {
	
	$scope.data = {
			tool_lists: []
	}
	
	$scope.set_contributing = function() {
		$http.get('/api/tool_lists?is_editor=true')
		.success(function(data, status, headers, config){
			$scope.data.tool_lists = data;		
		});	
	}

	$scope.set_following = function() {		
		$http.get('/api/tool_lists?is_follower=true')
		.success(function(data, status, headers, config){
			$scope.data.tool_lists = data;		
		});	
	}

	$scope.set_all = function() {		
		$http.get('/api/tool_lists')
		.success(function(data, status, headers, config){
			$scope.data.tool_lists = data;		
		});	
	}

	$scope.set_contributing();


}]);

app.controller('ListsEditController', ['$scope', '$http', '$location', '$routeParams', 'services', function($scope, $http, $location, $routeParams, services) {
	
	

	$scope.tools_page = {};	
	$scope.data = {
		name: "",
		detail: "",
		is_public: true,
		tool_list_items: [],
	};
	
	$scope.is_editing = $location.path().indexOf("edit") != -1;

	// pagination and faceting

	$scope.on_page_change = function() {
		for (var i=0; i<$scope.tools_page.tools.length; ++i) {
			for (var j=0; j<$scope.data.tool_list_items.length; ++j) {
				var tool = $scope.tools_page.tools[i];
				var item = $scope.data.tool_list_items[j];

				if (tool && tool.id == item.tool.id) {
					$scope.tools_page.tools.splice(i--,1);
				}
			}
		}
	}

	$scope.current_page = 1;
	$scope.attribute_values = [];
	services.helper.setup_tool_pagination_faceted_browsing($scope);



	// draggable listeners

	$scope.toolsListener = {
		accept: function(sourceItemHandleScope, destSortableScope) {return true},
		itemMoved: function(event){
			$scope.data.tool_list_items[event.dest.index] = {
				notes : "",
				tool : event.source.itemScope.tool
			}
			$scope.on_page_change();
		},
		orderChanged: function(event){}
	}

	$scope.listListener = {
		accept: function(sourceItemHandleScope, destSortableScope) {return true},
		itemMoved: function(event){						
			$scope.tools_page.tools[event.dest.index] = event.source.itemScope.tool
		},
		orderChanged: function(event){}
	}

	$scope.deleteToolList = function(id) {
		$http.delete("/api/tool_lists/"+id)
		.success(function(data, status, headers, config){
			$('#deleteModal').modal('hide');
			$location.path('/tool_lists/contributing');
		}); 
	}

	$scope.createOrUpdateList = function() {
		if ($('#list_form')[0].checkValidity()) {
			if ($scope.is_editing) {
				$http.patch("/api/tool_lists/" + $scope.data.id, 	$scope.data)
				.success(function(data, status, headers, config) {
					$location.path('/tool_lists');
				});
				
			} else {
				
				$http.post("/api/tool_lists", 	$scope.data)
				.success(function(data, status, headers, config) {
					$location.path('/tool_lists');
				});
			}
		}
	}

	// calls

	// if editing get real data

	if ($scope.is_editing) {
		$http.get('/api/tool_lists/'+ $routeParams.id)
		.success(function(data, status, headers, config){
			$scope.data = data;
		})
	}

	// get all tools

	// $http.get("/api/tools")
	// .success(function(data, status, headers, config){
	// 	$scope.tools = data		
	// });
	// services.tool.list().then(
	// 	function(data){
	// 		$scope.tools = data;
	// 	},
	// 	function(errorMessage){
	// 		$scope.error = errorMessage
	// 	}
	// )
	

}]);


app.controller('ListsViewController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	var list_id = $routeParams.id;

	$scope.data = {};
	$scope.can_edit = false;


	$http.get('/api/tool_lists/' + list_id)
	.success(function(data, status, headers, config){
		$scope.data = data;
		$scope.can_edit = $scope.current_user.is_admin;

		if (! $scope.can_edit) {
			var roles = data.tool_list_user_roles;

			angular.forEach(roles, function(v, i){
				if ($scope.current_user.id == v.user.id) {
					$scope.can_edit = v.is_editor;
					return false;
				}
			});
		}
		
		$http.get('/api/tool_lists/by_curator/' + $scope.data.user.id + "?exclude=" + $scope.data.id)
		.success(function(data, status, headers, config){
			$scope.by_curator = data;
		});
		
		$http.get('/api/tool_lists/related_by_list/' + $scope.data.id)
		.success(function(data, status, headers, config){
			$scope.related_lists = data;
		});


	});




}]);	

app.controller('ListsIndexController', ['$scope', 'services', function($scope, services){

	$scope.current_page = 1;

	$scope.pageChanged = function() {
		services.tool_list.get_tool_list_page($scope.current_page).then(
			function(data){
				// $scope.tool_lists = data.tool_lists;
				// $scope.tool_lists_count = data.meta.count;
				$scope.tool_lists_page = data;
			},
			function(errorMessage){
				$scope.error = errorMessage;
			}
		);
	}

	$scope.pageChanged();	

}]);

