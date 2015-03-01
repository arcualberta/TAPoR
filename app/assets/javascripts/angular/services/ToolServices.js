app.factory('toolServices', ['$http', '$q', '$sce', function($http, $q, $sce){


	var process_get_comments = function(id) {
		var deferred = $q.defer();
		$http.get('/api/tools/' + id + "/comments")
		.success(function(data){

			angular.forEach(data, function(v, k){
				data[k].content = $sce.trustAsHtml(data[k].content);
			})

			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occurred while getting comments");
		})
		return deferred.promise;
	}

	return {		
		 list : function() {
			var deferred = $q.defer();
				$http.get('/api/tools')
				.success(function(data){
					angular.forEach(data, function(v, k){
						data[k].description = $sce.trustAsHtml(data[k].description);
					})
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject("An error occurred while listing tools");
				});

			return deferred.promise;
		},

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
			return process_get_comments(id)
		},

		get_sorted_comments: function(id, user_id) {
			var deferred = $q.defer();			

			process_get_comments(id).then(
				function(data){	
					var sorted_comments = {
						system: {
							pinned: [],
							chronological: []
						},
						user : {
							content: ""
						}
					}

					angular.forEach(data, function(v, k){
						if (v.is_pinned) {
							sorted_comments.system.pinned.push(v);
						} else {
							sorted_comments.system.chronological.push(v);
						}

						if (v.user.id == user_id) {
							sorted_comments.user = {
								content: v.content,
								id: v.id,
								is_hidden: v.is_hidden,
								is_pinned: v.is_pinned,
								tool: v.tool,
								user: v.user
							}
						}
					});

					deferred.resolve(sorted_comments)
				},
				function(){
					deferred.reject("An error occurred while getting sorted comments");
				}
			);
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

		get_attributes : function(id) {
			var deferred = $q.defer();

			$http.get('/api/tools/' + id + '/attributes')
			.success(function(data){
				
				angular.forEach(data, function(value_type, i){
					if (value_type.is_multiple) {
						value_type.model = [];
						angular.forEach(value_type.possible_values, function(value, j){
							var found_value = false;
							angular.forEach(value_type.selected, function(selected_value, k){
								if (!found_value && value.id == selected_value.id) {
									found_value = true;
								}
							});
							value_type.model.push(found_value);
						});
					} else {
						value_type.model = {};
						angular.forEach(value_type.possible_values, function(value, j){
							var found_value = false;
							if (!found_value && value_type.selected.id == value.id) {
								found_value = true;
								value_type.model = value;
							}
						});
					}
				});

				deferred.resolve(data)
			
			})
			.error(function(){
				deferred.reject("An error occurred while getting tool attributes")
			});

			return deferred.promise;
		}

	}
}]);