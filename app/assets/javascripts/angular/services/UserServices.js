
app.factory('userServices', ['$http', '$q', function($http, $q){
	return {		
		list_page : function(page){

			if (angular.isUndefined(page)){
				page = 1;
			}

			var deferred = $q.defer();
			$http.get('/api/users?page='+ page)
			.success(function(data){				
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occured while listing users");
			})

			return deferred.promise;
		},
		get_tool_lists: function(id) {
			var deferred = $q.defer();			
			$http.get('/api/users/'+id+'/tool_lists')
			.success(function(data){
				deferred.resolve(data)
			})
			.error(function(){
				deferred.reject("An error occurred while getting user's tool lists")
			})

			return deferred.promise;
		}

	}
}]);


	
