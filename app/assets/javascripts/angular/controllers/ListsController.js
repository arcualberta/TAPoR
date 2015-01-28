app.controller('ListsContributingCtrl', ['$scope', '$http', function($scope, $http) {
	
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

app.controller('ListsEditCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
	
	$scope.tools = [];	
	$scope.data = {
		name: "",
		description: "",
		is_public: true,
		tool_list_items: [],
	};
	
	$scope.is_editing = $location.path().indexOf("edit") != -1;


	// draggable listeners

	$scope.toolsListener = {
		accept: function(sourceItemHandleScope, destSortableScope) {return true},
		itemMoved: function(event){

			// console.log(event.source.itemScope.modelValue);
			$scope.data.tool_list_items[event.dest.index] = {
				notes : "",
				tool : event.source.itemScope.modelValue
			}
		},
		orderChanged: function(event){}
	}

	$scope.listListener = {
		accept: function(sourceItemHandleScope, destSortableScope) {return true},
		itemMoved: function(event){						
			$scope.tools[event.dest.index] = event.source.itemScope.modelValue.tool


		},
		orderChanged: function(event){}
	}

	$scope.createOrUpdateList = function() {
		if ($('#list_form')[0].checkValidity()) {
			if ($scope.is_editing) {

			} else {

				$http.post("/api/tool_lists#create", 	$scope.data)
				.success(function(data, status, headers, config) {
					$location.path('/lists/contributing');
				});
			}
		}
	}

	// calls

	// if editing get real data

	if ($scope.is_editing) {
		$http.get('/api/tool_lists/'+ $routeParams.listId)
		.success(function(data, status, headers, config){
			$scope.data = data;
		})
	}

	// get all tools

	$http.get("/api/tools")
	.success(function(data, status, headers, config){
		$scope.tools = data		
	});

	

}]);