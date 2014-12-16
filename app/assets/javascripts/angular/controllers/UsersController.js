app.controller('UsersIndexCtrl', ['$scope', '$http', function($scope, $http){
	
	$scope.updateIsAdmin = function(id, is_admin) {
		var data = {}
		data.is_admin = is_admin;

		$http.patch('/api/users/' + id, data)
		.success(function(data, status, headers, config){
			console.log("success");
		});
	};

	$scope.updateIsBlocked = function(id, is_blocked) {
		var data = {}
		data.is_blocked = is_blocked;

		$http.patch('/api/users/' + id, data)
		.success(function(data, status, headers, config){
			console.log("success");
		});
	};

	$http.get("/api/users")
	.success(function(data, status, headers, config){			
		$scope.users = data;
	});



}]);