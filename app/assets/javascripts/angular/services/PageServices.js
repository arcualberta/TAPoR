
app.factory('pageServices', ['$http', '$q', '$sce', function($http, $q, $sce){
	return {		
		list : function(){
			var deferred = $q.defer();
			$http.get('/api/pages')
			.success(function(data){				
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occured while listing pages");
			})

			return deferred.promise;
		},

		get : function(id) {
			var deferred = $q.defer();
			$http.get('/api/pages/' + id)
			.success(function(data){
				data.clean_content = $sce.trustAsHtml(data.content);
				deferred.resolve(data)
			})
			.error(function(){
				deferred.reject("An error occured while getting page " + id);
			})

			return deferred.promise;
		},

		save : function(data) {			
			if (current_user && current_user.is_admin) {
				if (angular.isUndefined(data.name)) {
					data.name = data.title.toLowerCase().replace(' ', '_');
				}			
				var deferred = $q.defer();
				$http.patch('/api/pages/' + data.name)
				.success(function(data){
					deferred.resolve(data)
				})
				.error(function(){
					deferred.reject("An error occured while saving page " + data.name);
				});
				return data;
			}
		}

	}
}]);


	
