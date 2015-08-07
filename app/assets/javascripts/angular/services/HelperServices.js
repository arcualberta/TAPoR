app.factory('helperServices', ['$location', 'attributeTypeServices', 'toolServices', function($location, attributeTypeServices, toolServices){

	return {
		// this helper requires 
		// $scope.page = 1;
		// $scope.attribute_values = [];
		// $scope.query = ""

		setup_tool_pagination_faceted_browsing : function($scope) {

			// var page;
			var query;
			$scope.data = $scope.data || {};

			attributeTypeServices.list().then(
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

				var search = $location.search();
				console.log('search')
				console.log(search)
				$scope.page = angular.isDefined(search['page']) ? search['page'] : 1;
				query = search['query'];

				console.log("inside " + $scope.page)
				var attribute_values;
				if (angular.isDefined(search['attribute_values'])) {
					attribute_values = search['attribute_values'].split(',');
				}

				$scope.query = query;
				// $scope.page = page;

				toolServices.list_page($scope.page, attribute_values, query).then(
					function(data) {
						$scope.tools_page = data;
						angular.forEach($scope.tools_page.tools, function(v, i){
							v.thumb_url = v.image_url.replace(/\.png$/, "-thumb.png");
						})
						if ($scope.on_page_change) {
							$scope.on_page_change();
						}
					},
					function(errorMessage) {
						$scope.error = errorMessage;
					}
				);	
			}

			$scope.pageChanged = function() {
				var search = $location.search();
				console.log("pageChanged " + $scope.page)
				search['page'] = $scope.page;
				$location.search(search);
				// get_page();
			}	

			$scope.update_query_filter = function() {
				var search = $location.search();
				search['query'] = $scope.query;
				$location.search(search);
				// get_page();	
			}

			$scope.update_attributes_filter = function() {
				var search = $location.search();

				var attribute_values = []			
				angular.forEach($scope.attributes, function(v, i){
					if (v.model && v.model.id) {
						attribute_values.push(v.model.id)
					}
				});
				
				// search['page'] = 1;
				search['attribute_values'] = attribute_values.join(',');
				$location.search(search);
				// get_page();


			}

			get_page();
		}
	}

}]);