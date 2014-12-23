
app.controller('ToolsIndexCtrl', ['$scope', '$http', function($scope, $http) {

	$http.get("/api/tools")
	.success(function(data, status, headers, config){			
		$scope.tools = data;

		$.map($scope.tools, function(val, i){
			val.thumb_url =  val.image_url ? val.image_url.replace(/.png$/, "-thumb.png") : "";
		});
	});

}]);

app.controller('ToolsDetailCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	// alert($routeParams.toolId)
	
	$scope.tool_id = $routeParams.toolId;

	$scope.data = {};  
  $scope.data.name = "";
  $scope.data.description = "";
  $scope.data.image_url = "";
  // $scope.data.creators_name = "";
  // $scope.data.creators_email = "";
  // $scope.data.creators_url = "";
  
  $scope.data.tool_ratings = {};  
 	$scope.data.tool_ratings.stars = 0;
  
  $scope.data.tool_tags = {};
  $scope.data.tool_tags.tags = "";
  
  $scope.data.comments = {}
  $scope.data.comments.content = "";


	var tagLoad = function(query, callback) {
  	if (query != "") {
	  	$http.get("/api/tags/search?query="+query)
	  	.success(function(data, status, headers, config){
	  		$scope.tag_options = data;
	  		callback($scope.tag_options);
	  	})	
  	}
  	
  }

	$scope.tag_options = [];
  $scope.tag_config = {
    create: true,
    valueField: 'value',
    labelField: 'value',
    searchField: 'value',
    sortField: 'value',
    delimiter: ',',
    allowEmptyOption: false,
    preload: true,
    load: tagLoad,
    hideSelected: true
  };





  // $scope.tagLoad = function(query, callback) {
  // 	alert("test")
  // }

	$http.get('/api/tools/' + $routeParams.toolId)
	.success(function(data, status, headers, config){
		
		$scope.is_editable = $scope.current_user.is_admin || $scope.current_user.id == data.user_id;
		console.log($scope.is_editable)
		$scope.data.name = data.name;
		$scope.data.description = data.description
		$scope.data.image_url = data.image_url;
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
				tags.push(v.value);
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

app.controller('ToolsNewCtrl', ['$scope', '$http', '$location' , function($scope, $http, $location) {
  
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


	var tagLoad = function(query, callback) {
  	if (query != "") {
	  	$http.get("/api/tags/search?query="+query)
	  	.success(function(data, status, headers, config){
	  		$scope.tag_options = data;
	  		callback($scope.tag_options);
	  	})	
  	}
  	
  }

	$scope.tag_options = [];
  $scope.tag_config = {
    create: true,
    valueField: 'value',
    labelField: 'value',
    searchField: 'value',
    sortField: 'value',
    delimiter: ',',
    allowEmptyOption: false,
    preload: true,
    load: tagLoad,
    hideSelected: true
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

		var fd = new FormData();

		for (var i in $scope.data) {
			if ($scope.data.hasOwnProperty(i)) {				
				fd.append(i, $scope.data[i])
			}
		}

		$http.post("/api/tools#create", $scope.data)
		.success(function(data, status, headers, config) {
			// console.log("success redirecting")
			// console.log(data)
			// console.log(status)
			// console.log(headers)
			// console.log(config)
			// after saving redirect to tool view page
			$location.path('/tools/' + data.id);
		})
		.error(function(data, status, headers, config) {
			// console.log("error")
			// console.log(data)
			// console.log(status)
			// console.log(headers)
			// console.log(config)
		});

  }



}]);