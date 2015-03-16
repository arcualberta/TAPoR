
app.controller('ToolsIndexController', ['$scope', 'services', function($scope, services) {

	$scope.current_page = 1;
	$scope.attribute_values = [];

	services.attribute_type.list().then(
		function(data) {
			angular.forEach(data, function(v, i){
				data[i].model = {id:"",name:"",index:""};
			});
			$scope.attributes = data;

		},
		function(errorMessage) {
			$scope.error = errorMessage
		}
	)

	var get_page = function() {
		services.tool.list_page($scope.current_page, $scope.attribute_values).then(
			function(data) {
				$scope.tools_page = data;
			},
			function(errorMessage) {
				$scope.error = errorMessage;
			}
		);	
	}

	$scope.pageChanged = function() {
		get_page();
	}

	$scope.update_attributes_filter = function() {
		$scope.attribute_values = [];
		angular.forEach($scope.attributes, function(v, i){
			if (v.model && v.model.id) {
				$scope.attribute_values.push(v.model.id)
			}
		});
		$scope.current_page = 1;
		get_page();


	}

	get_page();


}]);

app.controller('ToolsDetailController', ['$scope', '$http', '$location', '$routeParams', 'services', function($scope, $http, $location, $routeParams, services) {
	// alert($routeParams.toolId)
	
	$scope.id = $routeParams.id;
	$scope.data = {};  


	$scope.tinymceOptions = {
  	menubar : false,
  	height : 200,
		resize: false,
		plugins: ["autolink link anchor"],
		toolbar: "undo redo | bold italic | link",
		valid_elements : "a[href|target=_blank],strong/b,em/i,div[align],br,p"
  };

  services.tool.get_tool($scope.id).then(
  	function(data){
  		$scope.data.tool = data;
  		$scope.is_editable = $scope.current_user && ( $scope.current_user.is_admin || $scope.current_user.id == data.user_id);
  	},
  	function(errorMessage){
  		$scope.error = errorMessage;
  	}
  );

  services.tool.get_attributes($routeParams.id).then(
		function(data){
			$scope.data.tool_attributes = data;
		},
		function(errorMesssage) {		  			
			$scope.error = errorMesssage;
		}
	);

  services.tool.get_tags($scope.id).then(
  	function(data){
  		$scope.data.tags = data;
  	},
  	function(errorMesssage){
  		$scope.error = errorMesssage
  	}
  );

  services.tool.get_ratings($scope.id).then(
  	function(data){
  		$scope.data.ratings = data;
  	},
  	function(errorMesssage){
  		$scope.error = errorMesssage
  	}
  );


  var get_sorted_comments = function() {

  	services.tool.get_sorted_comments($scope.id, $scope.current_user).then(
	  	function(data) {
	  		$scope.data.comments = data;
	  	},
	  	function(errorMesssage) {
	  		$scope.error = errorMesssage;
	  	}
	  )	
  }

  get_sorted_comments();
  

  $scope.update_tags = function() {

  	var data = {
  		id : $scope.id,
  		tags: $scope.data.tags.user
  	}

  	services.tool.update_tags(data).then(
  		function(data){
  			$scope.data.tags = data;
  		},
  		function(errorMesssage) {
  			$scope.error = errorMesssage
  		}
  	)
  }

  $scope.update_ratings = function(stars) {
  	 var data = {
  		id : $scope.id,
  		stars: stars
  	}  	
  	services.tool.update_ratings(data).then(
  		function(data){  	
  			console.log(data)		
  			$scope.data.ratings = data;
  		},
  		function(errorMesssage) {
  			$scope.error = errorMesssage
  		}
  	)	
  }

  $scope.update_comment = function() {

  	var data = $scope.data.comments.user;
  	data.tool_id = $scope.id;
  	services.comment.save(data).then(
  		function(data){
  			// XXX Fixme to update just user comment (?)
  			get_sorted_comments();
  		},
  		function(errorMesssage){
  			$scope.error = errorMesssage
  		}
  	)
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
    valueField: 'text',
    labelField: 'text',
    searchField: 'text',
    sortField: 'text',
    delimiter: ',',
    allowEmptyOption: false,
    preload: true,
    load: tagLoad,
    hideSelected: true,
    // onInitialize: function(selectize){
    // 	console.log(selectize)
    // }
  };



	

	// 	// Attributes

	// 	attributes = [];		
	// 	angular.forEach(data.tool_attributes, function(v, i){

	// 		var need_to_add = false;
	// 		var current_attribute = {
	// 			name: v.name,
	// 			value: "",
	// 		};			
			
	// 		if (v.is_multiple) {
	// 			if (v.model && v.model.length) {
	// 				var values = [];
	// 				angular.forEach(v.model, function(att, j){
	// 					if (att) {
	// 						need_to_add = true;
	// 						values.push(v.attribute_values[j].name)
	// 					}
	// 				});
	// 				if (need_to_add) {
	// 					current_attribute.value = values.join(",");
	// 				}
	// 			}
	// 		} else {
	// 			if (v.model && v.model.length) {
	// 				current_attribute.value = v.model[0].name
	// 				need_to_add = true;
	// 			}
	// 		}

	// 		if (need_to_add) {
	// 			attributes.push(current_attribute);
	// 		}

	// 	});

	// 	$scope.data.tool_attributes = attributes;

	// 	// comments

	// 	if (data.comments && data.comments.length) {
	// 		var new_comments = {
	// 			pinned: [],
	// 			not_pinned: []
	// 		}
	// 		angular.forEach(data.comments, function(v, i){
	// 			if (v.is_pinned) {
	// 				new_comments.pinned.push(v);
	// 			} else {
	// 				new_comments.not_pinned.push(v);
	// 			}
	// 		});

	// 		// sort comments

	// 		$scope.data.comments = new_comments;



	// 	}

	// 	$http.get('/api/tools/view/' + $scope.id)
	// 	.success(function(data, status, headers, config){
	// 		$scope.data.also = data;
	// 	});


	// });

	$http.get('/api/tool_lists/related_by_tool/' + $routeParams.id + '?limit=4')
	.success(function(data, status, headers, config) {
		$scope.data.related_lists = data;
	});

	$http.get('/api/tools/' + $scope.id + "/suggested")
	.success(function(data, status, headers, config){
		$scope.data.suggested_tools = data;
	});

	// $scope.updateToolUserDetails = function() {
	// 	$http.patch('/api/tools/' + $scope.id, $scope.data)
	// 	.success(function(data, status, headers, config){
	// 		$location.path('/tools/');
	// 	});
	// }

	// $scope.addToList = function(id) {
	// 	console.log(id)
	// }

	$scope.updateToolView = function() {
  	$http.post('/api/tools/view/' + $scope.id)
  	.success(function(data, status, headers, config){
  		console.log(data)
  	})

  }



}]);

app.controller('ToolsEditController', ['$scope', '$http', '$location', '$routeParams', 'services', function($scope, $http, $location, $routeParams, services) {
  
  $scope.id = $routeParams.id;
	$scope.data = {};
  $scope.data.name = "";
  $scope.data.description = "";
  $scope.data.is_approved = false;
  $scope.data.creators_name = "";
  $scope.data.creators_email = "";
  $scope.data.creators_url = "";
  $scope.data.url = "";

	// $scope.data.tool_ratings = [{"stars" : 0}];  
  
  // $scope.data.tool_tags = {};
  // $scope.data.tool_tags.tags = "";
  $scope.data.tags = [];
  $scope.data.comments = [];

  
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
  	angular.forEach($scope.data.managed_comments.pinned, function(v, i){
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


  $scope.suggestedDragListeners = {
   	accept: function (sourceItemHandleScope, destSortableScope) {return true},
   	itemMoved: function (event) {},
  	orderChanged: function (event) {}
  }

  $scope.toolDragListeners = {
  	accept: function (sourceItemHandleScope, destSortableScope) {return true},
  	itemMoved: function (event) {},
  	orderChanged: function (event) {}
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
    valueField: 'text',
    labelField: 'text',
    searchField: 'text',
    sortField: 'text',
    delimiter: ',',
    allowEmptyOption: false,
    preload: true,
    load: tagLoad,
    hideSelected: true
  };

  $scope.tools = [];
	
	$scope.data.managed_comments = {
  	"pinned": [],
  	"not_pinned": []
  }

  $scope.data.suggested_tools = [];

  // get attribute types

  if ($scope.is_editing) {

		$http.get('/api/tools/' + $routeParams.id)
		.success(function(data, status, headers, config){			
			$scope.data= data;
			if (data.tags && data.tags.length > 0) {
			var tags = [];
			angular.forEach(data.tags, function(v, i){
				tags.push(v.value);
			});
			$scope.data.tags = tags;			
		}
			// add model to each attribute value

			// This should be moved outside


			// get suggested tools
				
				$http.get('/api/tools/' + $scope.id + '/suggested')
				.success(function(data, status, headers, config){
					console.log(data);
					$scope.data.suggested_tools = data;
				});

					// get comments
					

				

				$http.get('/api/comments/?id=' + $routeParams.id)
				.success(function(data, status, headers, config){

					angular.forEach(data, function(v, i){
						if (v.is_pinned) {
							$scope.data.managed_comments.pinned.push(v);
						} else {					
							$scope.data.managed_comments.not_pinned.push(v);
						}
					});
				});

				
				services.tool.get_attributes($routeParams.id, $scope.is_editing).then(
		  		function(data){
		  			$scope.data.tool_attributes = data;
		  		},
		  		function(errorMesssage) {		  			
		  			$scope.error = errorMesssage;
		  		}
		  	)


		});	


  } else {
  	// Get empty attributes
  	$scope.data.attribute_types = [];
	  $http.get("/api/attribute_types")
	  .success(function(data, status, headers, config){
	  	console.log(data);
	  	$scope.data.tool_attributes = data;
	  	angular.forEach($scope.data.tool_attributes, function(v, i){
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

	// get all simple tools
	
	$http.get('/api/tools')
	.success(function(data, status, headers, config){
		$scope.tools = data;
	})
	
  
	$scope.deleteTool = function(id) {
		$http.delete("/api/tools/"+id)
		.success(function(data, status, headers, config){
			$('#deleteModal').modal('hide');
			$location.path('/tools/');
		}); 
	}

  $scope.createOrUpdateTool = function() {
  	

  	if ($('#tool_form')[0].checkValidity()) {			
  		console.log("ccc")
  		console.log($scope.data);
			if ($scope.is_editing) {
				$scope.id = $routeParams.id;
				console.log($scope.data)
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


			// set suggested tools

			$http.post('/api/tools/' + $scope.id + "/suggested", {id: $scope.id, suggested: $scope.data.suggested_tools})
			.success(function(data, status, headers, config){
				console.log("saved suggested");
			});
			
		}
  }

}]);



app.controller('ToolsFeaturedController', ['$scope', '$location', 'services', '$http', function($scope, $location, services, $http) {

	$scope.current_page = 1;
	$scope.tools_page = [];
	$scope.data = {
		featured : []
	}

	var get_page = function() {
		services.tool.list_page($scope.current_page).then(
			function(data) {
				// remove items already on featured list
				angular.forEach(data.tools, function(v, i){
					angular.forEach($scope.data.featured, function(tool, index){
						if (data.tools[i]. id == tool.id) {
							data.tools.splice(i,1);
						}
					})
				});

				$scope.tools_page = data;
			},
			function(errorMessage) {
				$scope.error = errorMessage;
			}
		);	
	}

	$scope.pageChanged = function() {
		get_page();
	}


	


	services.tool.get_featured_tools().then(
		function(data){
			$scope.data.featured = data;
			get_page();
		},
		function(errorMessage){
			$scope.error = errorMessage;
		}
	);
	// $http.get("/api/tools")
	// .success(function(data, status, headers, config){
	// 	var tools = data	
	// 	$http.get("/api/tools/featured")
	// 	.success(function(data, status, headers, config){
	// 		$scope.data.featured = data		

	// 		for( var i =tools.length - 1; i>=0; i--){
	// 			for( var j=0; j<$scope.data.featured.length; j++){
	// 				if(tools[i].id === $scope.data.featured[j].id){
	// 					tools.splice(i, 1);
	// 				}
	// 			}
	// 		}

	// 		$scope.tools = tools			
	// 	});
	
	// });

	

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