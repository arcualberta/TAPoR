app.controller('ListsUserCtrl', ['$scope', '$http', function($scope, $http) {
	// Get user lists
	// Add listener to new list
}]);

app.controller('ListsEditCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
	
	$scope.tools = [];	
	$scope.data = {
		name: "",
		description: "",
		is_public: true,
		current_list: [],
	};
	
	$scope.is_editing = $location.path().indexOf("edit") != -1;


	// draggable listeners

	$scope.toolsListener = {
		accept: function(sourceItemHandleScope, destSortableScope) {return true},
		itemMoved: function(event){},
		orderChanged: function(event){}
	}

	$scope.listListener = {
		accept: function(sourceItemHandleScope, destSortableScope) {return true},
		itemMoved: function(event){						
			$scope.tools[event.dest.index].notes = "";
		},
		orderChanged: function(event){}
	}

	$scope.createOrUpdateList = function() {
		if ($('#list_form')[0].checkValidity()) {
			if ($scope.is_editing) {

			} else {

				$http.post("/api/tool_lists#create", 	$scope.data)
				.success(function(data, status, headers, config) {
					$location.path('/lists/user');
				});
			}
		}
	}

	// calls

	// if editing get real data

	// get all tools

	$http.get("/api/tools")
	.success(function(data, status, headers, config){
		$.each(data, function(i, v){
			v.notes="";
			$scope.tools.push(v);
		})
		
	});

	

}]);