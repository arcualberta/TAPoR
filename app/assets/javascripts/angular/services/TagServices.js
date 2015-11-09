"use strict";

app.factory('tagServices', ['$http', '$q', function($http, $q){
	return {
		list : function() {
			var deferred = $q.defer();
			$http.get('/api/tags')
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occurred while listing tags");
			});
			return deferred.promise;
		}
	}
}]);