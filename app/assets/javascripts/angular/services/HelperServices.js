app.factory('helperServices', ['$location', '$timeout', '$q', 'attributeTypeServices', 'toolServices', 'tagServices', function($location, $timeout, $q, attributeTypeServices, toolServices, tagServices){

	return {
		// this helper requires 
		// $scope.page = 2;
		// $scope.attribute_values = [];
		// $scope.query = ""

		setup_tool_pagination_faceted_browsing : function($scope) {

			var query;
			$scope.data = $scope.data || {};

			var order_by = "";
			var sort_asc = false;

			var getPage = function() {

				var search = $location.search();
				var page = search['page'] ? search['page'] : 1;
				query = search['query'];
				var order = search['order'];
				var sort = search['sort'];
				var tag_values;
				var attribute_values;
				if (angular.isDefined(search['attribute_values'])) {
					attribute_values = search['attribute_values'].split(',');
					
					// set attribute values on drop downs
					// XXX can be improved
										
					angular.forEach($scope.attributes, function(attribute){
						var is_found = false;
						angular.forEach(attribute.attribute_values, function(att_val){							
							angular.forEach(attribute_values, function(att_id){
								if (att_id == att_val.id) {
									attribute.model = att_val;
									is_found = true;
									return;
								}
							});							
						});
						if (!is_found) {
							attribute.model = null
						}
					});
				}


				if (angular.isDefined(search['tag_values'])) {
					tag_values = search['tag_values'];

					// set drop down value
					if ($scope.tags) {
						var is_found = false
						angular.forEach($scope.tags.values, function(v, i){
							if (tag_values == v.id) {
								$scope.tags.model = v;
								is_found = true;
								return;
							}
						});
						if (!is_found) {
							$scope.tags.model = null;
						}
					}
				}

				$scope.query = query;

				toolServices.list_page(page, attribute_values, tag_values, query, order, sort).then(
					function(data) {
						$scope.tools_page = data;
						angular.forEach($scope.tools_page.tools, function(v, i){
							v.thumb_url = v.image_url.replace(/\.png$/, "-thumb.png");
						});
					},
					function(errorMessage) {
						$scope.error = errorMessage;
					}
				);	


				$timeout(function(){
    			$scope.page = search['page'] ? search['page'] : 1;
  			});
			}

			$scope.pageChanged = function() {				
				var search = $location.search();
				search['page'] = $scope.page;
				$location.search(search);
			}

			$scope.update_query_filter = function() {
				var search = $location.search();
				search['query'] = $scope.query;
				search['page'] = 1;
				$location.search(search);
			}

			$scope.updateAttributesFilter = function() {
				var search = $location.search();
				var attribute_values = [];
				angular.forEach($scope.attributes, function(v, i){
					if (v.model && v.model.id) {
						attribute_values.push(v.model.id)
					}
				});				
				search['attribute_values'] = attribute_values.join(',');
				$location.search(search);

			};

			$scope.updateTagsFilter = function() {
				var search = $location.search();
				if ($scope.tags.model !== null) {					
					search['tag_values'] = $scope.tags.model.id;					
				} else {
					search['tag_values'] = ""
				}
				$location.search(search);
			};

			$scope.orderTools = function(order_column) {
				if (order_by == order_column) {
					sort_asc = !sort_asc;
				} else {
					order_by = order_column;
					sort_asc = false;
				}

				var search = $location.search();
				search['order'] = order_by;
				search['sort'] = sort_asc ? 'asc' : 'desc';
				$location.search(search);
			}

			$scope.$on("$destroy", function(){
				$location.replace();
				$location.search('');
			});

			$scope.$watch(function () {return $location.absUrl()}, function(oldUrl, newUrl){
				getPage();
			});

			$q.all([
				attributeTypeServices.list(),
				tagServices.list()
			])
			.then(function(data){
				
				angular.forEach(data[0], function(v, i){
					data[0][i].model = {id:"",name:"",index:""};
				});
				$scope.attributes = data[0];
				

				data[1].sort(function(a, b) {
					return a.text.localeCompare(b.text);
				});
				$scope.tags = {
					model: {},
					values: data[1]
				};
				getPage();
			});

		}
	}

}]);