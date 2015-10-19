;app.controller('UsersIndexController', ['$scope', '$http', 'services', function($scope, $http, services){
	// $scope.checkUser();
	
	$scope.current_page = 1;

	var get_page = function() {
		services.user.list_page($scope.current_page).then(
			function(data) {
				$scope.users_page = data;
			},
			function(errorMessage) {
				$scope.error = errorMessage;
			}
		);	
	}

	//////////

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
	
	$scope.pageChanged = function() {
		get_page();
	}
	
	get_page();
	

}]);

app.controller("UsersViewController", ['$scope', '$location', '$routeParams','services', function($scope, $location, $routeParams, services){
	$scope.is_editable = $routeParams.id == $scope.current_user.id;
	// $scope.current_user = $scope.current_user;

	services.user.get_user($routeParams.id).then(
		function(data) {
			$scope.profile_user = data;
				if ($scope.profile_user.position == null) {
					$scope.profile_user.position = "";
				}
				if ($scope.profile_user.affiliation == null) {
					$scope.profile_user.affiliation = "";
				}

				$scope.profile_user.position_affiliation = $scope.profile_user.position;
				if ($scope.profile_user.position_affiliation != "" && $scope.profile_user.affiliation != "") {
					$scope.profile_user.position_affiliation += ", " + $scope.profile_user.affiliation	
				}
		},
		function(errorMessage) {
			$scope.error = errorMessage;
		}
	);



	services.user.get_tool_lists($routeParams.id).then(
		function(data){
		    $scope.tool_lists = data;
		},
		function(errorMessage) {
			$scope.error = errorMessage;
		}
	);

	
}]);

app.controller("UsersEditController", ['$scope', '$http', '$location', function($scope, $http, $location){
	
	$scope.data = $scope.current_user;

	$scope.saveProfile = function() {
		$http.patch('/api/users/' + $scope.data.id, $scope.data)
		.success(function(data, status, headers, config){
			$location.path('/')
		});
	}

}]);