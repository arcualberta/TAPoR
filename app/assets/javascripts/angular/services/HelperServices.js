app.factory('helperServices', ['attributeTypeServices', 'toolServices', function(attributeTypeServices, toolServices){

	return {
		// this helper requires 
		// $scope.current_page = 1;
		// $scope.attribute_values = [];

		setup_tool_pagination_faceted_browsing : function($scope) {

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
				toolServices.list_page($scope.current_page, $scope.attribute_values).then(
					function(data) {
						$scope.tools_page = data;
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
				get_page();
			}

			$scope.update_attributes_filter = function() {
				$scope.attribute_values.length = 0
				angular.forEach($scope.attributes, function(v, i){
					if (v.model && v.model.id) {
						$scope.attribute_values.push(v.model.id)
					}
				});
				$scope.current_page = 1;
				get_page();


			}
			get_page();
		}
	}

}]);