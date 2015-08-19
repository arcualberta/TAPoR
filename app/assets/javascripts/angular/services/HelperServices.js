app.factory('helperServices', ['$location', '$timeout', 'attributeTypeServices', 'toolServices', function($location, $timeout, attributeTypeServices, toolServices){

	return {
		// this helper requires 
		// $scope.page = 2;
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
				var page = search['page'] ? search['page'] : 1;
				query = search['query'];
				var order = search['order'];
				var sort = search['sort'];

				var attribute_values;
				if (angular.isDefined(search['attribute_values'])) {
					attribute_values = search['attribute_values'].split(',');
				}

				$scope.query = query;

				toolServices.list_page(page, attribute_values, query, order, sort).then(
					function(data) {
						$scope.tools_page = data;
						angular.forEach($scope.tools_page.tools, function(v, i){
							v.thumb_url = v.image_url.replace(/\.png$/, "-thumb.png");
						})
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

			$scope.update_attributes_filter = function() {
				var search = $location.search();

				var attribute_values = []			
				angular.forEach($scope.attributes, function(v, i){
					if (v.model && v.model.id) {
						attribute_values.push(v.model.id)
					}
				});
				
				search['attribute_values'] = attribute_values.join(',');
				$location.search(search);

			}

			$scope.$on("$destroy", function(){
				$location.replace();
				$location.search('');
			});

			$scope.$watch(function () {return $location.absUrl()}, function(oldUrl, newUrl){
				get_page();
			})

			get_page();
		}
	}

}]);