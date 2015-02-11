app.controller('ListsContributingCtrl', ['$scope', '$http', function($scope, $http) {
	
	$scope.data = {
			tool_lists: []
	}
	
	$scope.set_contributing = function() {
		$http.get('/api/tool_lists?is_editor=true')
		.success(function(data, status, headers, config){
			console.log(data)
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
					$location.path('/tool_lists/contributing');
				});
				
			} else {
				
				$http.post("/api/tool_lists", 	$scope.data)
				.success(function(data, status, headers, config) {
					$location.path('/tool_lists/contributing');
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

	$http.get("/api/tools")
	.success(function(data, status, headers, config){
		$scope.tools = data		
	});

	

}]);


app.controller('ListsDetailCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	var list_id = $routeParams.id;

	$scope.data = {};
	$scope.can_edit = false;


	$http.get('/api/tool_lists/' + list_id)
	.success(function(data, status, headers, config){
		$scope.data = data;
		console.log(data);
		$scope.can_edit = $scope.current_user.is_admin;

		if (! $scope.can_edit) {
			var roles = data.tool_list_user_roles;

			$.each(roles, function(i,v){
				if ($scope.current_user.id == v.user_id) {
					$scope.can_edit = v.is_editor;
					return false;
				}
			});
		}
		

	});


}]);	