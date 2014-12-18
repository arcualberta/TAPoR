
app.controller('ToolsIndexCtrl', ['$scope', '$http', function($scope, $http) {

	$http.get("/api/tools")
	.success(function(data, status, headers, config){			
		$scope.tools = data;
	});

}]);

app.controller('ToolsDetailCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	// alert($routeParams.toolId)
	
	$scope.tool_id = $routeParams.toolId;

	$scope.data = {};  
  $scope.data.name = "";
  $scope.data.description = "";
  // $scope.data.creators_name = "";
  // $scope.data.creators_email = "";
  // $scope.data.creators_url = "";
  
  $scope.data.tool_ratings = {};  
 	$scope.data.tool_ratings.stars = 0;
  
  $scope.data.tool_tags = {};
  $scope.data.tool_tags.tags = "";
  
  $scope.data.comments = {}
  $scope.data.comments.content = "";


	$scope.tag_options = [];
  $scope.tag_config = {
    create: true,
    valueField: 'id',
    labelField: 'value',
    searchField: 'value',
    sortField: 'id',
    delimiter: ',',
    // placeholder: 'Pick at least 1..',
    preload: true,
    // required: true,
    // hideSelected: false
    // maxItems: 1
  };

	$http.get('/api/tools/' + $routeParams.toolId)
	.success(function(data, status, headers, config){
		console.log(data);
		$scope.data.name = data.name;
		$scope.data.description = data.description

		$scope.data.tool_ratings = {};		
		$scope.data.tool_ratings.stars = 0;
		if (data.tool_ratings && data.tool_ratings.length > 0) {
			$scope.data.tool_ratings.stars = data.tool_ratings[0].stars;
		}
		

		$scope.data.tool_tags = {};
		$scope.data.tool_tags.tags = "";
		if (data.tags && data.tags.length > 0) {
			var tags = [];
			$.each(data.tags, function(i, v){
				tags.push(v.tag);
			});
			// $scope.data.tool_tags.tags = tags.join(", ");
			$scope.data.tool_tags.tags = tags;
		}

		$scope.data.comments = {};
		$scope.data.comments.content = "";
		if (data.comments && data.comments.length > 0) {
			$scope.data.comments.content = data.comments[0].content;
		}

	});

		$scope.updateToolUserDetails = function() {
		// clean up tags
		// $scope.data.tool_tags.tags =  $scope.data.tool_tags.tags.split(",");
		// $.each($scope.data.tool_tags.tags, function( i, v ) {
  // 		$scope.data.tool_tags.tags[i] = v.trim()
		// });
		$http.patch('/api/tools/' + $scope.tool_id, $scope.data)
		.success(function(data, status, headers, config){
			console.log("success updating")
		});

	}


}]);

app.controller('ToolsNewCtrl', ['$scope', '$http' , function($scope, $http) {
  
	$scope.data = {};
  
  $scope.data.name = "";
  $scope.data.description = "";
  $scope.data.is_approved = false;
  $scope.data.creators_name = "";
  $scope.data.creators_email = "";
  $scope.data.creators_url = "";

	$scope.data.tool_ratings = {};  
 	$scope.data.tool_ratings.stars = 0;
  
  $scope.data.tool_tags = {};
  $scope.data.tool_tags.tags = "";
  
  $scope.data.comments = {}
  $scope.data.comments.content = "";
  
  $scope.data.approved = false;
  $scope.data.image = "";


  $scope.tag_options = [];
  $scope.tag_config = {
    create: true,
    valueField: 'id',
    labelField: 'value',
    searchField: 'value',
    sortField: 'id',
    delimiter: ',',
    // placeholder: 'Pick at least 1..',
    preload: true,
    // required: true,
    // hideSelected: false
    // maxItems: 1
  };

  // get attribute types

  $scope.data.attribute_types = [];

	$http.get("/api/attribute_types")
	.success(function(data, status, headers, config){
		$.each(data, function(i,val){
			val.possible_values = val.possible_values.split('|');			
			if (val.is_multiple) {
				val.model = [];
				$.each(val.possible_values, function(i, v){
					val.model.push(false);
				})
				
			} else {
				val.model = null;
			}
			
			
			$scope.data.attribute_types.push(val);
		});

	});

  $scope.createTool = function() {
 		
 		// clean up tags
		$scope.data.tool_tags.tags =  $scope.data.tool_tags.tags.split(",");
		$.each($scope.data.tool_tags.tags, function( i, v ) {
  		$scope.data.tool_tags.tags[i] = v.trim()
		});

		var fd = new FormData();

		for (var i in $scope.data) {
			if ($scope.data.hasOwnProperty(i)) {
				console.log("appending " + i)
				fd.append(i, $scope.data[i])
			}
		}

		// var xhr=new XMLHttpRequest();
		// xhr.open("POST", "/api/tools#create", true);
		// xhr.send(fd);

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