
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
	
	$scope.id = $routeParams.id;

	$scope.data = {};  
  $scope.data.name = "";
  $scope.data.description = "";
  $scope.data.image_url = "";
  $scope.data.id = "";
  
  $scope.data.tool_ratings = [{"stars" : 0}];  
  
  $scope.data.tool_tags = {};
  $scope.data.tool_tags.tags = "";
  
  $scope.data.comments = {}
  $scope.data.also = [];

	var tagLoad = function(query, callback) {
  	if (query != "") {
	  	$http.get("/api/tags/search?query="+query)
	  	.success(function(data, status, headers, config){
	  		$scope.tag_options = data;
	  		callback($scope.tag_options);
	  	})	
  	}
  	
  }

  $scope.updateToolView = function() {
  	$http.post('/api/tools/view/' + $scope.id)
  	.success(function(data, status, headers, config){
  		console.log(data)
  	})

  }

  $scope.updateRateFunction = function(rating) {
    
    var data = {
    	id: $scope.id,
    	tool_ratings:[]
    }
    data.tool_ratings.push({
    	stars: rating
    });

    $http.patch('/api/tools/' + $scope.id, data)
    .success(function(data, status, headers, config) {
    	// console.log("Rating selected - " + rating);
    	// update overall rating
    });



  };

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



	$http.get('/api/tools/' + $routeParams.id)
	.success(function(data, status, headers, config){
		
		$scope.is_editable = $scope.current_user.is_admin || $scope.current_user.id == data.user_id;
		$scope.data = data;
		console.log(data)
		if (data.tags && data.tags.length > 0) {
			var tags = [];
			$.each(data.tags, function(i, v){
				tags.push(v.value);
			});
			$scope.data.tags = tags;			
		}

		// Attributes

		attributes = [];		
		$.each(data.tool_attributes, function(i, v){

			var need_to_add = false;
			var current_attribute = {
				name: v.name,
				value: "",
			};			
			
			if (v.is_multiple) {
				if (v.model && v.model.length) {
					var values = [];
					$.each(v.model, function(j, att){
						if (att) {
							need_to_add = true;
							values.push(v.attribute_values[j].name)
						}
					});
					if (need_to_add) {
						current_attribute.value = values.join(",");
					}
				}
			} else {
				if (v.model && v.model.length) {
					current_attribute.value = v.model[0].name
					need_to_add = true;
				}
			}

			if (need_to_add) {
				attributes.push(current_attribute);
			}

		});

		$scope.data.tool_attributes = attributes;

		// comments

		if (data.comments && data.comments.length) {
			var new_comments = {
				pinned: [],
				not_pinned: []
			}
			$.each(data.comments, function(i,v){
				if (v.is_pinned) {
					new_comments.pinned.push(v);
				} else {
					new_comments.not_pinned.push(v);
				}
			});

			// sort comments

			$scope.data.comments = new_comments;



		}

		$http.get('/api/tools/view/' + $scope.id)
		.success(function(data, status, headers, config){
			$scope.data.also = data;
		});


	});

	$http.get('/api/tool_lists/related/' + $routeParams.id + '?limit=4')
	.success(function(data, status, headers, config) {
		$scope.data.related_lists = data;
	});

	$scope.updateToolUserDetails = function() {
		$http.patch('/api/tools/' + $scope.id, $scope.data)
		.success(function(data, status, headers, config){
			$location.path('/tools/');
		});
	}

	$scope.addToList = function(id) {
	
		console.log(id)
	}



}]);

app.controller('ToolsEditCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
  
  $scope.id = $routeParams.id;
	$scope.data = {};
  $scope.data.name = "";
  $scope.data.description = "";
  $scope.data.is_approved = false;
  $scope.data.creators_name = "";
  $scope.data.creators_email = "";
  $scope.data.creators_url = "";
  $scope.data.url = "";

	$scope.data.tool_ratings = [{"stars" : 0}];  
  
  // $scope.data.tool_tags = {};
  // $scope.data.tool_tags.tags = "";
  $scope.data.tags = [];
  $scope.data.comments = [];
  $scope.data.managed_comments = {
  	"pinned": [],
  	"not_pinned": []
  }
  
  $scope.data.is_approved = false;
  // $scope.data.image = "";  
  $scope.is_editing = $location.path().indexOf("edit") != -1;
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


  // $scope.templates = {
  // 	sortable_comment: {
  // 		url: "templates/tools/commasdasent.html",
  // 		name: "sortable comment"

  // 	}
  // }

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
    valueField: 'id',
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

  if ($scope.is_editing) {
		$http.get('/api/tools/' + $routeParams.id)
		.success(function(data, status, headers, config){
			console.log(data)
			$scope.data= data;
			if (data.tags && data.tags.length > 0) {
			var tags = [];
			$.each(data.tags, function(i, v){
				tags.push(v.value);
			});
			$scope.data.tags = tags;			
		}
			// add model to each attribute value

		});	


  } else {
  	// Get empty attributes
  	$scope.data.attribute_types = [];
	  $http.get("/api/attribute_types")
	  .success(function(data, status, headers, config){
	  	console.log(data);
	  	$scope.data.tool_attributes = data;
	  	$.each($scope.data.tool_attributes, function(i, v){
	  		var len = v.is_multiple ? v.attribute_values.length : 1 ;
	  		$scope.data.tool_attributes[i].model = [];

	  		if (v.is_multiple) {
	  			for (var j=0; j< len; ++j) {
	  				$scope.data.tool_attributes[i].model.push(false)	
	  			} 
	  		} else {
	  			$scope.data.tool_attributes[i].model.push({id: "", name: ""})	
	  		}
	  	})
	  });
  }


  




 //  

 //  if ($scope.is_editing) {
 //  	// get values
	// 	$http.get('/api/tools/' + $routeParams.id)
	// 	.success(function(data, status, headers, config){
	// 		for (var i in data) {
	// 			if (data.hasOwnProperty(i)) {
	// 				$scope.data[i] = data[i];					
	// 			}
	// 		}	

	// 		// fix tags

	// 		$scope.data.tool_tags.tags = [];
	// 		$.each($scope.data.tags, function(i, v){				
	// 			$scope.data.tool_tags.tags.push(v.value)
	// 		});

	// 		// fix image
	// 		$scope.data.image = $scope.data.image_url;

	// 		// fix attributes
	// 		for (var i=0; i < data.tool_attributes.length; ++i) {
	// 			var thisToolAttribute = data.tool_attributes[i];
	// 			for (var j=0; j<$scope.data.attribute_types.length; ++j) {
	// 				var thisAttribute = $scope.data.attribute_types[j];
	// 				if (thisToolAttribute.attribute_type_id == thisAttribute.id) {
	// 					if (thisAttribute.is_multiple) {
	// 						var values = thisToolAttribute.value.split("|");
	// 						for (var p=0; p<values.length; ++p) {
	// 							for (var q=0; q<thisAttribute.possible_values.length; ++q) {	
	// 								if (values[p] == thisAttribute.possible_values[q]) {
	// 									thisAttribute.model[q] = true;
	// 									break;
	// 								}
	// 							}
	// 						}
	// 					} else {
	// 						thisAttribute.model = thisToolAttribute.value;
	// 					}
	// 					break;
	// 				}
	// 			}
	// 		}

	// 	});



	// });

		// get comments
		

		

		$http.get('/api/comments/?id=' + $routeParams.id)
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

  
	$scope.deleteTool = function(id) {
		$http.delete("/api/tools/"+id)
		.success(function(data, status, headers, config){
			$('#deleteModal').modal('hide');
			$location.path('/tools/');
		}); 
	}

  $scope.createOrUpdateTool = function() {
  	

  	if ($('#tool_form')[0].checkValidity()) {
			

  		// $.each($scope.data.tool_attributes, function(i,v){
  		// 	if (!v.is_multiple) {

  		// 	}
  		// })


			if ($scope.is_editing) {
				$scope.id = $routeParams.id;
				$http.patch('/api/tools/' + $scope.id, $scope.data)
				.success(function(data, status, headers, config){
					$location.path('/tools/' + data.id);
				});
			} else {
				$http.post("/api/tools", $scope.data)
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



app.controller('ToolsFeaturedCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

	$scope.tools = [];

	$scope.data = {
		featured : []
	}

	$http.get("/api/tools")
	.success(function(data, status, headers, config){
		var tools = data	
		$http.get("/api/tools/featured")
		.success(function(data, status, headers, config){
			$scope.data.featured = data		

			for( var i =tools.length - 1; i>=0; i--){
				for( var j=0; j<$scope.data.featured.length; j++){
					if(tools[i].id === $scope.data.featured[j].id){
						tools.splice(i, 1);
					}
				}
			}

			$scope.tools = tools			
		});
	});

	

	$scope.toolsListener = {
		accept: function(sourceItemHandleScope, destSortableScope) {return true},
		itemMoved: function(event){},
		orderChanged: function(event){}
	}

	$scope.saveFeaturedTools = function() {
		$http.post('/api/tools/featured', $scope.data)
		.success(function(data, status, headers, config){
			$location.path('/');
		});
	}

}]);