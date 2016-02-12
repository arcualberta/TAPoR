
app.controller('ToolsIndexController', ['$scope', 'services', function($scope, services) {
  services.helper.setup_tool_pagination_faceted_browsing($scope);
}]);

app.controller('ToolsViewController', ['$scope', '$http', '$location', '$routeParams', '$anchorScroll', '$timeout', '$sce', 'services', function($scope, $http, $location, $routeParams, $anchorScroll, $timeout, $sce, services) {
	// alert($routeParams.toolId)
	
	$scope.named_id = $routeParams.named_id;
	$scope.data = {};  
  $scope.data.newComment = "";
  $scope.data.tags = {system:[]};

	$scope.tinymceOptions = {
  	menubar : false,
  	height : 200,
		resize: false,
		plugins: ["autolink link anchor"],
		toolbar: "undo redo | bold italic | link",
		valid_elements : "a[href|target=_blank],strong/b,em/i,div[align],br,p"
  };

  var processTaporMLCode = function(tool) {

    var xmlDoc = $.parseXML('<tapor>' + tool.code + '</tapor>')
    var xml = $(xmlDoc);

    var resultXmlDoc = $.parseXML('<div class="taporml-container"></div>');
    var resultXml = $(resultXmlDoc) ;
    var root = resultXml.find('.taporml-container');

    // var getTagWithClass = function(cssClass, text) {
    //   return "<div class='"+cssClass+"'>"+text+"</div>"
    // }

    xml.find("tapor").contents().each(function() {
      // $(this).html($(this).innerText);
      var tagName = $(this).prop("nodeName");
      var innerText = $(this).text();
      var toAppend = "";

      switch (tagName) {
        case 'h1':
          toAppend = "<div class='taporml-h1'>"+innerText+"</div>";
          break;
        case 'h2':
          toAppend = "<div class='taporml-h2'>"+innerText+"</div>";
          break; 
        case 'code':
          toAppend = "<div class='well taporml-code'>"+innerText+"</div>";
          break;
        default:          
          innerText = innerText.replace(/\n/g, "<br />");
          toAppend = "<div class='taporml-p'>"+innerText+"</div>";
          break;
      }

      if (toAppend !== "") {
        root.append(toAppend);
      }
    
    });

    tool.processedCode = $sce.trustAsHtml(resultXml.find('div').html());

  }

  services.tool.get_tool($scope.named_id).then(
  	function(data){
  		$scope.data.tool = data;

      $scope.aceOption = {
        mode: $scope.data.tool.language,
        useWrapMode : true
      };

  		$scope.is_editable = $scope.current_user && ( $scope.current_user.is_admin || $scope.current_user.id == data.user_id);

  		$scope.id = $scope.data.tool.id;
			services.tool.get_attributes($scope.id).then(
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

      processTaporMLCode($scope.data.tool);

			$http.get('/api/tool_lists/related_by_tool/' + $scope.id + '?limit=4')
			.success(function(data, status, headers, config) {
				$scope.data.related_lists = data;
			});

			$http.get('/api/tools/' + $scope.id + "/suggested")
			.success(function(data, status, headers, config){
				$scope.data.suggested_tools = data;
			});

			getSortedComments();
  	},
  	function(errorMessage){
  		$scope.error = errorMessage;
  	}
  );

  var getSortedComments = function() {

  	services.tool.getSortedComments($scope.id, $scope.current_user).then(
	  	function(data) {
	  		$scope.data.comments = data;        
        $timeout(function() {
          $anchorScroll();
        });       
	  	},
	  	function(errorMesssage) {
	  		$scope.error = errorMesssage;
	  	}
	  )	
  }

  
  

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
  			$scope.data.ratings = data;
  		},
  		function(errorMesssage) {
  			$scope.error = errorMesssage
  		}
  	)	
  }

  $scope.save_comment = function() {
    // services.comment.save() 
    var sending = {
      content: $scope.data.newComment,
      tool_id: $scope.id
    }
    services.comment.save(sending).then(
      function(data){
        getSortedComments();
        $scope.data.newComment = "";
      },
      function(errorMesssage){
        $scope.error = errorMesssage
      }
    )
  }

  $scope.update_comment = function(comment) {
    services.comment.update(comment).then(
      function(data){
        getSortedComments();
        $timeout(function() {
          $anchorScroll(comment.id);
        });       
      },
      function(errorMesssage){
        $scope.error = errorMesssage
      }
    )
  }

  
  var tag_load = function(query, callback) {
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
    load: tag_load,
    hideSelected: true,
    // onInitialize: function(selectize){
    // 	console.log(selectize)
    // }
  };


	$scope.updateToolView = function() {
  	$http.post('/api/tools/view/' + $scope.id)
  	.success(function(data, status, headers, config){
  		
  	})

  }



}]);

app.controller('ToolsEditController', ['$scope', '$http', '$location', '$routeParams', '$sce', 'services', function($scope, $http, $location, $routeParams, $sce, services) {
  
  $scope.id = $routeParams.id;
	$scope.data = {};
  $scope.data.name = "";
  $scope.data.detail = "";
  $scope.data.is_approved = false;
  $scope.data.creators_name = "";
  $scope.data.creators_email = "";
  $scope.data.creators_url = "";
  $scope.data.url = "";

  $scope.possible_nature = [
  	{
  		name: "Tool",
  		value: "tool",
  		id: 0,
  	},
  	{
  		name: "Code",
  		value: "code",
  		id: 1,
  	},
  ];
  $scope.data.nature = [$scope.possible_nature[0]];
  
  $scope.possible_language = [
    {      
      id: 0, 
      name: "Other", 
      mode: "plain_text", 
      value: "other" 
    },
  	{
  		id: 1,
  		name: "Python",
  		mode: "python",
  		value: "python"
  	},
  	{
  		id: 2,
  		name: "PHP",
  		mode: "php",
  		value: "php"
  	},
  	{
  		id: 3,
  		name: "R",
  		mode: "r",
  		value: "r"
  	},
  	{
  		id: 4,
  		name: "Javascript",
  		mode: "javascript",
  		value: "javascript"
  	},
  	{
  		id: 5,
  		name: "Java",
  		mode: "java",
  		value: "java"
  	},
  	{
  		id: 6,
  		name: "Mathematica",
  		mode: "plain_text",
  		value: "mathematica"
  	},
  	{
  		id: 7,
  		name: "HTML",
  		mode: "html",
  		value: "html"
  	},

  ]


  $scope.data.language = [$scope.possible_language[0]];
  
  $scope.data.code = "";
  $scope.data.repository = ""

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


  $scope.aceOption = {
    mode: "plain_text",
    useWrapMode : true,
    onLoad: function (_ace) {
 
      // HACK to have the ace instance in the scope...
      $scope.modeChanged = function () {
        _ace.getSession().setMode("ace/mode/" + $scope.data.language[0].mode);
      };
 
    }
  };
  

  $scope.updateIsPinned = function(id, is_pinned) {
  	var data = {
  		'is_pinned': is_pinned
  	}
  	$http.patch('/api/comments/' + id, data)
		.success(function(data, status, headers, config){
			
		});
  }

  $scope.updateIsHidden = function(id, is_hidden) {
		var data = {
  		'is_hidden': is_hidden
  	}
  	$http.patch('/api/comments/' + id, data)
		.success(function(data, status, headers, config){
			
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

	var tag_load = function(query, callback) {
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
    load: tag_load,
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
      
      $scope.data = data;	


      angular.forEach($scope.possible_nature, function(nature, i){        
        if (nature.value == $scope.data.nature) {
          $scope.data.nature = [$scope.possible_nature[i]];

        }
      });

      angular.forEach($scope.possible_language, function(language, i){
        if (language.value == $scope.data.language) {
          $scope.data.language = [$scope.possible_language[i]];
          $scope.aceOption.mode = $scope.data.language[0].mode;
        }
      });

      // $scope.data.nature = [{value: $scope.data.nature}];
      // $scope.data.nature = [{"name":"Code","value":"code","id":1}];
      // $scope.data.language = [{mode: $scope.data.language}];
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
					$scope.data.suggested_tools = data;
				});

					// get comments
					

				

				$http.get('/api/comments/?id=' + $routeParams.id)
				.success(function(data, status, headers, config){

					angular.forEach(data, function(v, i){
            v.content = $sce.trustAsHtml(v.content);
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
	});
	
  
	$scope.deleteTool = function(id) {        
		$http.delete("/api/tools/"+id)
		.success(function(data, status, headers, config){      
      $('#deleteModal').modal('hide');   
      $location.url('/tools/');   
		});     
	};

  var processToolAttributes = function() {
 
    angular.forEach($scope.data.tool_attributes, function(att, index) {
      if (att.is_multiple) {
        var newModel = [];
        angular.forEach(att.model, function(shouldAdd, index){        
          if (shouldAdd) {
            newModel.push(att.attribute_values[index]);
          }
        });
        att.model = newModel;
      } 
    });

  }

  $scope.createOrUpdateTool = function() {
  	

  	if ($('#tool_form')[0].checkValidity()) {  		

      processToolAttributes();

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
					
				});	
			}


			// set suggested tools

			$http.post('/api/tools/' + $scope.id + "/suggested", {id: $scope.id, suggested: $scope.data.suggested_tools})
			.success(function(data, status, headers, config){
				// console.log("saved suggested");
			});
			
		}
  }

  $scope.$watchGroup(['data.nature[0].value','data.language[0].value'], function(newValues, oldValues, scope){
    if (newValues[0] === "code" && newValues[1] === "other") {
      $('#taporml-info').popover({
        html: true,
        trigger: "focus",
         container: 'body',
        content:
          "<div>TAPoR-ML follows a tagging format. Text inside the enabled tags will be formatted accordingly. the following elements are the available tags: </div><br />"+
          "<dl>"+
          "<dt>h1</dt>"+
          "<dd>Header font</dd>"+
          "<dt>h2</dt>"+
          "<dd>Subheader font</dd>"+
          "<dt>code</dt>"+
          "<dd>White space will be respected and text will appear with monospaced font</dd>"+
          "</dl>"+
          "<div>Everything else will be treated as standard text.</div>"
          ,     

      });
    }
  });

}]);



app.controller('ToolsFeaturedController', ['$scope', '$location', 'services', '$http', '$sce', '$compile', function($scope, $location, services, $http, $sce, $compile) {

	// $scope.current_page = 1;
	// $scope.tools_page = [];
	$scope.data = {
		tool_list_items : []
	}

  $scope.addToolRemoveButtons = function() {
    var template = '<button class="btn btn-danger" ng-click="removeItem($event)"><i class="glyphicon glyphicon-remove"></i></button>';
    var comp = $compile(template)($scope);
    var elements = $('.tapor-tool-list-element');
    angular.element(elements).html(comp); 
  }

  $scope.removeItem = function($event) {  
    var id = angular.element($event.currentTarget).parent().attr('id');
    var index = id.replace("tapor-tool-list-element-", "");
    $scope.data.tool_list_items.splice(index, 1);
  }
  

  $scope.toolsListener = {
    accept: function(sourceItemHandleScope, destSortableScope) {return true},
    itemMoved: function(event){
      var index = event.dest.index;
      $scope.data.tool_list_items[index] = {
        notes : "",
        tool : event.source.itemScope.tool
      }
    },
    orderChanged: function(event){}
  }


  $scope.listListener = {
    accept: function(sourceItemHandleScope, destSortableScope) {return true},
    itemMoved: function(event){           
      // $scope.tools_page.tools[event.dest.index] = event.source.itemScope.tool;
    },
    orderChanged: function(event){
      $scope.addToolRemoveButtons();
    }
  }

  services.tool.get_featured_tools().then(
   function(data){
     $scope.data.tool_list_items = [];
     angular.forEach(data, function(v, i){
      v.detail = $sce.trustAsHtml(v.detail);
      $scope.data.tool_list_items.push({
        tool: v
      });
     });

   },
   function(errorMessage){
     $scope.error = errorMessage;
   }
  );

  services.helper.setup_tool_pagination_faceted_browsing($scope);

	$scope.saveFeaturedTools = function() {
		$http.post('/api/tools/featured', $scope.data)
		.success(function(data, status, headers, config){
			$location.path('/');
		});
	}

}]);