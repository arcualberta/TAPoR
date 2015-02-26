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

		update_tags: function(data) {
			
			var deferred = $q.defer();
			$http.patch('/api/tools/'+data.id+'/tags/', data)
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occurred while updating tags");
			})

			return deferred.promise;
		},

		get_ratings: function(id) {
			var deferred = $q.defer();
			$http.get('/api/tools/' + id + "/ratings")
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occurred while getting ratings");
			})
			return deferred.promise;
		},

		update_ratings: function(data) {
			var deferred = $q.defer();
			$http.patch('/api/tools/'+data.id+'/ratings/', data)
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occurred while updating ratings");
			})
			return deferred.promise;
		},

		get_comments: function(id) {
			var deferred = $q.defer();
			$http.get('/api/tools/' + id + "/comments")
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occurred while getting comments");
			})
			return deferred.promise;
		},

		update_comments: function(data) {
			var deferred = $q.defer();
			$http.patch('/api/tools/'+data.id+'/comments/', data)
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occurred while updating comments");
			})
			return deferred.promise;
		},

		

	}
}]);



	
