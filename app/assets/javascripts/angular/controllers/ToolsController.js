
app.controller('ToolsIndexCtrl', ['$scope', function($scope) {
  $scope.greeting = 'Hola desde tools!';
}]);



app.controller('ToolsNewCtrl', ['$scope', '$http' , function($scope, $http) {
  
	$scope.data = {};
  
  $scope.data.name = "";
  $scope.data.description = "";

	$scope.data.tool_ratings = {};  
 	$scope.data.tool_ratings.stars = 0;
  
  $scope.data.tool_tags = {};
  $scope.data.tool_tags.tags = [];
  
  $scope.data.categories = {};
  $scope.data.categories.names = [];
  
  $scope.data.comments = {}
  $scope.data.comments.content = "";
  
  $scope.data.approved = false;

  

  $scope.createTool = function() {
 	
		$http.post("/api/tools#create", $scope.data)
		.success(function(data, status, headers, config) {
			console.log("success")
			console.log(data)
			console.log(status)
			console.log(headers)
			console.log(config)
			// after saving redirect to tool view page
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