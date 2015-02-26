app.factory('toolServices', ['$http', '$q', '$sce', function($http, $q, $sce){
	return {		
		get_tool: function(id) {
			var deferred = $q.defer();
			$http.get('/api/tools/' + id)
			.success(function(data){
				
				data.description = $sce.trustAsHtml(data.description);
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occurred while getting tool");
			});

			return deferred.promise;
		},

		get_tags: function(id){
			var deferred = $q.defer();
			$http.get('/api/tools/' + id + "/tags")
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occurred while getting tags");
			})

			return deferred.promise;
		},

		update_tags: function(id, data) {
			console.log(data)
			var deferred = $q.defer();
			$http.patch('/api/tools/'+id+'/tags/', data)
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occurred while updating tags");
			})

			return deferred.promise;
		}
	}
}]);



	
