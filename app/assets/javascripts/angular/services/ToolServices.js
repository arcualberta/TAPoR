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

		list_page : function(page, attribute_values, query) {

			if (angular.isUndefined(page)){
				page = 1;
			}

			if (angular.isUndefined(attribute_values)){
				attribute_values = [];
			}			

			if (angular.isUndefined(query)) {
				query = '';
			}

			var deferred = $q.defer();

				$http({
    			url: '/api/tools', 
    			method: "GET",
    			params: {
    				page: page,
    				attribute_values: attribute_values.join(","),
    				query: query
    			}
 				})
				.success(function(data){
					angular.forEach(data.tools, function(v, k){
						v.detail = $sce.trustAsHtml(v.detail);
					})
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject("An error occurred while listing tools");
				});

			return deferred.promise;
		},

		list : function() {
			var deferred = $q.defer();
				$http.get('/api/tools')
				.success(function(data){
					angular.forEach(data.tools, function(v, k){
						v.detail = $sce.trustAsHtml(v.detail);
					})
					deferred.resolve(data.tools);
				})
				.error(function(){
					deferred.reject("An error occurred while listing tools");
				});

			return deferred.promise;
		},

		get_tool: function(named_id) {
			var deferred = $q.defer();
			$http.get('/api/tools/' + named_id)
			.success(function(data){
				
				data.detail = $sce.trustAsHtml(data.detail);
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

		get_sorted_comments: function(id, current_user) {
			var deferred = $q.defer();			

			var user_id = null;

			if (current_user && current_user.id) {
				user_id = current_user.id;
			}

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

		get_attributes : function(id, with_model) {

			if (angular.isUndefined(with_model)) {
				with_model = false;
			}
			var deferred = $q.defer();

			$http.get('/api/tools/' + id + '/attributes')
			.success(function(data){
				if (with_model){
					angular.forEach(data, function(value_type, i){
						value_type.model = [];
						if (value_type.is_multiple) {						
							angular.forEach(value_type.attribute_values, function(value, j){
								var found_value = false;
								angular.forEach(value_type.selected, function(selected_value, k){
									if (!found_value && value.id == selected_value.id) {
										found_value = true;
									}
								});
								value_type.model.push(found_value);
							});
						} else {
							angular.forEach(value_type.attribute_values, function(value, j){
								var found_value = false;
								if (!found_value && value_type.selected[0] && value_type.selected[0].id == value.id) {
									found_value = true;
									value_type.model = [value];
								}
							});
						}
					});
				}
				deferred.resolve(data)
			
		})
		.error(function(){
			deferred.reject("An error occurred while getting tool attributes")
		});

		return deferred.promise;
	},

	get_featured_tools : function() {
		var deferred = $q.defer();
		$http.get("/api/tools/featured")
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("Error getting featured tools")
		});
		return deferred.promise;
	}

	}
}]);