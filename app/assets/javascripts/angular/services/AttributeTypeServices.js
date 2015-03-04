app.factory('attributeTypeServices', ['$http', '$q', function($http, $q){
	return {		
		list : function() {
			var deferred = $q.defer();
			$http.get("/api/attribute_types/")
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occured while listing attributes");
			});
			return deferred.promise;
		},
		save : function(data) {
			var deferred = $q.defer();
			var callFunction = $http.post;
			var callUrl = "/api/attribute_types";

			if (typeof data.id !== "undefined") {
				callFunction = $http.patch;
				callUrl = callUrl + "/" + data.id;
			}

			callFunction(callUrl, data)
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occured while creating attribute");
			});
			return deferred.promise;
		},
		get : function(id) {
			var deferred = $q.defer();
			$http.get("/api/attribute_types/" + id)
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occured while getting attribute");
			});
			return deferred.promise;
		}
	};
}]);



	

