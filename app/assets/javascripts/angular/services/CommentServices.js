app.factory('commentServices', ['$http', '$q', '$sce', function($http, $q, $sce){
	return {		
		save : function(comment) {
			var deferred = $q.defer();
			var callUrl = "/api/comments";
			$http.post(callUrl, comment).success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occured while saving comment")
			})

			return deferred.promise;

		},
		update : function(data) {
			var deferred = $q.defer();
			var callUrl = "/api/comments";

			$http.patch(callUrl+'/'+data.id, data)
			.success(function(data){
				// data.content = $sce.trustAsHtml(data.cleaned_content);
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject("An error occured while updating comment")
			})

			return deferred.promise;
		}
	};
}]);
