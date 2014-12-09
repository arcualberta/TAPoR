

app.controller('AttributesNewCtrl', ['$scope', '$http' , function($scope, $http) {
  
	$scope.data = {};
	$scope.data.name = "";
	$scope.possible_values = [];
	$scope.possible_values.push("");
	$scope.data.possible_values = "";  
	$scope.data.is_multiple = false;
  
	$scope.addPossibleValue = function() {
		$scope.possible_values.push("");
	}

	$scope.removeValueAt = function(index) {
		$scope.possible_values.splice(index, 1);
		if ($scope.possible_values.length == 0) {
			$scope.addPossibleValue();		
		}
	}

  $scope.createAttribute = function() {
 		$scope.data.possible_values = $scope.possible_values.join(',');
		$http.post("/api/attribute_types#create", $scope.data)
		.success(function(data, status, headers, config) {
			console.log("success")
			console.log(data)
			console.log(status)
			console.log(headers)
			console.log(config)
			// after saving redirect to attribute view page
		})
		.error(function(data, status, headers, config) {
			console.log("error")
			console.log(data)
			console.log(status)
			console.log(headers)
			console.log(config)
		});

  }



}]);