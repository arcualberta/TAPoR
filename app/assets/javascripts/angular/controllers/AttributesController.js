

app.controller('AttributesNewCtrl', ['$scope', '$http' , function($scope, $http) {
  
	$scope.data = {};
	$scope.data.name = "";
	$scope.data.possible_values = [];  
	$scope.data.possible_values.push("");
	$scope.data.is_multiple = false;
  
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
 	
		// $scope.data.tool_tags.tags =  $scope.data.tool_tags.tags.split(",");
		// $.each($scope.data.tool_tags.tags, function( i, value ) {
  // 		$scope.data.tool_tags.tags[i] = value.trim()
		// });



		$http.post("/api/attributes#create", $scope.data)
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