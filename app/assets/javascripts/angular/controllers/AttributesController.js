

app.controller('AttributesNewController', ['$scope', '$location', 'services' , function($scope, $location, services) {
  
	$scope.data = {};
	$scope.data.name = "";	
	$scope.data.possible_values = [];  
	$scope.data.possible_values.push("");
	$scope.data.is_multiple = false;
	$scope.data.is_required = false;
  
	$scope.addPossibleValue = function() {
		$scope.data.possible_values.push("");
	}

	$scope.removeValueAt = function(index) {
		$scope.data.possible_values.splice(index, 1);
		if ($scope.data.possible_values.length == 0) {
			$scope.addPossibleValue();		
		}
	}

  $scope.createAttribute = function() {

  	services.attribute_type.create($scope.data).then(
  	function(data){
  		$location.path("/")
  	},
  	function(errorMessage){
  		$scope.error = errorMessage;
  	});
  }



}]);