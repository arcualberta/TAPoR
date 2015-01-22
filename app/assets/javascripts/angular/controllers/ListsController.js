app.controller('ListsUserCtrl', ['$scope', '$http', function($scope, $http) {
	// Get user lists
	// Add listener to new list
}]);

app.controller('ListsEditCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
	
	$scope.tools = [];
	$scope.data = {
		list_name: "Unamed list",
		list_description: "",
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
		itemMoved: function(event){},
		orderChanged: function(event){}
	}

	$scope.saveList = function() {

	}

	// calls

	// if editing get real data

	// get all tools

	$http.get("/api/tools")
	.success(function(data, status, headers, config){
		$scope.tools = data;
	});

	

}]);