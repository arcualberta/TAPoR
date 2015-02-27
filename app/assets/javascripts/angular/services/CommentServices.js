app.factory('commentServices', ['$http', '$q', '$sce', function($http, $q, $sce){
	return {		

		save : function(data) {
			var deferred = $q.defer();
			
			var callFunction = $http.post;
			var callUrl = "/api/comments";

			if (typeof data.id !== "undefined") {
				callFunction = $http.patch;
				callUrl = callUrl + "/" + data.id;
			}

			callFunction(callUrl, data)
			.success(function(data){
				// data.content = $sce.trustAsHtml(data.cleaned_content);
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occured while saving comment")
			})

			return deferred.promise;
		}
	};
}]);
