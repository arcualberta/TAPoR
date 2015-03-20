app.factory('toolListServices', ['$http', '$q', function($http, $q){

	return {
		get_tool_list_page : function(page) {
			var deferred = $q.defer();
			// $http.get('/api/tool_lists')
			$http({
				url: '/api/tool_lists',
				method: "GET",
				params: {
					page: page
				}
			})
			.success(function(data, status, headers, config){
				deferred.resolve(data)
			})
			.error(function(){
				deferred.reject("An error occurred while getting tool list page");
			});	
			return deferred.promise;
		},
	}

}]);