

app.controller('AttributesEditController', ['$scope', '$location', '$routeParams', 'services' , function($scope, $location, $routeParams, services) {
  
	if (! $scope.current_user.is_admin) {
		$location.path("/");
	} else {
			$scope.data = {
			name: "",
			attribute_values : [{
				name: ""
			}],
			is_multiple : false,
			is_required : false
		};
		
		$scope.is_editing = $location.path().indexOf("edit") != -1;

		if ($scope.is_editing) {
			services.attribute_type.get($routeParams.id).then(
				function(data) {
					$scope.data = data
				},
				function(errorMessage) {
					$scope.error = errorMessage;
				}
			);
		}
	  
		$scope.addPossibleValue = function() {
			$scope.data.attribute_values.push({name:""});
		}

		$scope.removeValueAt = function(index) {
			$scope.data.attribute_values.splice(index, 1);
			if ($scope.data.attribute_values.length == 0) {
				$scope.addPossibleValue();		
			}
		}

	  $scope.saveAttribute = function() {

	  	services.attribute_type.save($scope.data).then(
	  	function(data){
	  		$location.path("/attributes")
	  	},
	  	function(errorMessage){
	  		$scope.error = errorMessage;
	  	});
	  }
	}





}]);



app.controller('AttributesIndexController', ['$scope', '$location', 'services', function($scope, $location, services){
	
	if (! $scope.current_user.is_admin) {
		$location.path("/");
	} else {
		services.attribute_type.list().then(
			function(data){
				$scope.data = data;
				console.log(data)
			},
			function(errorMessage) {
				console.log(errorMessage)
				$scope.error = errorMessage
			}
		)
	}
}]);