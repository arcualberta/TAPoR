
app.controller('ToolsIndexCtrl', ['$scope', '$http', function($scope, $http) {

	$http.get("/api/tools")
	.success(function(data, status, headers, config){			
		$scope.tools = data;

		// $.map($scope.tools, function(val, i){
		// 	val.thumb_url =  val.image_url ? val.image_url.replace(/.png$/, "-thumb.png") : "";
		// });
	});

}]);

app.controller('ToolsDetailCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
	// alert($routeParams.toolId)
	
	$scope.tool_id = $routeParams.toolId;

	$scope.data = {};  
  $scope.data.name = "";
  $scope.data.description = "";
  $scope.data.image_url = "";
  $scope.data.id = "";
  
  $scope.data.tool_ratings = [{"stars" : 0}];  
  
  $scope.data.tool_tags = {};
  $scope.data.tool_tags.tags = "";
  
  $scope.data.comments = {}

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



	$http.get('/api/tools/' + $routeParams.toolId)
	.success(function(data, status, headers, config){
		
		$scope.is_editable = $scope.current_user.is_admin || $scope.current_user.id == data.user_id;
		$scope.data.id = data.id;
		$scope.data.name = data.name;
		$scope.data.description = data.description
		$scope.data.image_url = data.image_url;
		$scope.data.tool_ratings = data.tool_ratings;
		$scope.data.comments = data.comments;
		

		$scope.data.tool_tags = {};
		$scope.data.tool_tags.tags = "";
		if (data.tags && data.tags.length > 0) {
			var tags = [];
			$.each(data.tags, function(i, v){
				tags.push(v.value);
			});
			$scope.data.tool_tags.tags = tags;			
		}

	});

	$scope.updateToolUserDetails = function() {

	$http.patch('/api/tools/' + $scope.tool_id, $scope.data)
	.success(function(data, status, headers, config){
		$location.path('/tools/');
	});

}



}]);

app.controller('ToolsEditCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
  
	$scope.data = {};
  
  $scope.data.name = "";
  $scope.data.description = "";
  $scope.data.is_approved = false;
  $scope.data.creators_name = "";
  $scope.data.creators_email = "";
  $scope.data.creators_url = "";

	$scope.data.tool_ratings = [{"stars" : 0}];  
   
  $scope.data.tool_tags = {};
  $scope.data.tool_tags.tags = "";
  
  // $scope.data.comments = {};
  // $scope.data.comments.pinned = [];
  // $scope.data.comments.not_pinned = [];
  $scope.data.comments = [];
  $scope.data.managed_comments = {
  	"pinned": [],
  	"not_pinned": []
  }
  
  $scope.data.is_approved = false;
  $scope.data.image = "";

  $scope.is_editing = false;
  // var form = $("#tool_form");
  // form.validate();

  $scope.updateIsPinned = function(id, is_pinned) {
  	var data = {
  		'is_pinned': is_pinned
  	}
  	$http.patch('/api/comments/' + id, data)
		.success(function(data, status, headers, config){
			console.log("success");
		});
  }

  $scope.updateIsHidden = function(id, is_hidden) {
		var data = {
  		'is_hidden': is_hidden
  	}
  	$http.patch('/api/comments/' + id, data)
		.success(function(data, status, headers, config){
			console.log("success");
		});
  }


  // comment drag manager

  var resetPinnedIndex = function() {
  	$.each($scope.data.managed_comments.pinned, function(i, v){
    	v.index = i;
    });
  }

  $scope.commentDragListeners = {
  	accept: function (sourceItemHandleScope, destSortableScope) {return true},
    itemMoved: function (event) {
			resetPinnedIndex()
    },
    orderChanged: function(event) {},
    // containment: '#board'//optional param.
  }


  $scope.commentPinnedListener = {
  	accept: function (sourceItemHandleScope, destSortableScope) {return true},
    itemMoved: function (event) {
    	resetPinnedIndex()
    },
    orderChanged: function(event) {
    	resetPinnedIndex()
    },
    // containment: '#board'//optional param.
  }


  $scope.templates = {
  	sortable_comment: {
  		url: "templates/tools/commasdasent.html",
  		name: "sortable comment"

  	}
  }

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

  $scope.is_editing = $location.path().indexOf("edit") != -1;

  if ($scope.is_editing) {
  	// get values
		$http.get('/api/tools/' + $routeParams.toolId)
		.success(function(data, status, headers, config){
			for (var i in data) {
				if (data.hasOwnProperty(i)) {
					$scope.data[i] = data[i];					
				}
			}	

			// fix tags

			$scope.data.tool_tags.tags = [];
			$.each($scope.data.tags, function(i, v){				
				$scope.data.tool_tags.tags.push(v.value)
			});

			// fix image
			$scope.data.image = $scope.data.image_url;

			// fix attributes
			for (var i=0; i < data.tool_attributes.length; ++i) {
				var thisToolAttribute = data.tool_attributes[i];
				for (var j=0; j<$scope.data.attribute_types.length; ++j) {
					var thisAttribute = $scope.data.attribute_types[j];
					if (thisToolAttribute.attribute_type_id == thisAttribute.id) {
						if (thisAttribute.is_multiple) {
							var values = thisToolAttribute.value.split("|");
							for (var p=0; p<values.length; ++p) {
								for (var q=0; q<thisAttribute.possible_values.length; ++q) {	
									if (values[p] == thisAttribute.possible_values[q]) {
										thisAttribute.model[q] = true;
										break;
									}
								}
							}
						} else {
							thisAttribute.model = thisToolAttribute.value;
						}
						break;
					}
				}
			}

		});

		// get comments
		

		

		$http.get('/api/comments/?tool_id=' + $routeParams.toolId)
		.success(function(data, status, headers, config){
			var comments = {
				"pinned" : [],
				"not_pinned" : [],
			}
			$.each(data, function(i, v){
				if (v.is_pinned) {
					$scope.data.managed_comments.pinned.push(v);
				} else {					
					$scope.data.managed_comments.not_pinned.push(v);
				}
			});
		});

  }

	});

  $scope.createorUpdateTool = function() {
  	$scope.tool_id = $routeParams.toolId;

  	if ($('#tool_form')[0].checkValidity()) {
			var fd = new FormData();

			for (var i in $scope.data) {
				if ($scope.data.hasOwnProperty(i)) {				
					fd.append(i, $scope.data[i])
				}
			}

			if ($scope.is_editing) {
				$http.patch('/api/tools/' + $scope.tool_id, $scope.data)
				.success(function(data, status, headers, config){
					$location.path('/tools/' + data.id);
				});
			} else {
				$http.post("/api/tools#create", $scope.data)
				.success(function(data, status, headers, config) {
					$location.path('/tools/' + data.id);
				})
				.error(function(data, status, headers, config) {
					console.log("error")
				});	
			}
			
		}
  }

}]);
