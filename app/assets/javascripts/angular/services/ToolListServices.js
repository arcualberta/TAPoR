app.factory('toolListServices', ['$http', '$q', function($http, $q){

	return {
		// get_users_lists: function(id) {
		// 	var deferred = $q.defer();			
		// 	$http.get('/api/users/'+id+'/tool_lists')
		// 	.success(function(data){
		// 		deferred.resolve(data)
		// 	})
		// 	.error(function(){
		// 		deferred.reject("An error occurred while getting user's tool lists")
		// 	})

		// 	return deferred.promise;
		// }
	}

}]);