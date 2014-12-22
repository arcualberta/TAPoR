

app.controller('TaporMainCtrl',['$scope', '$http', function($scope, $http){

	$scope.current_user = null;

	$scope.checkUser = function() {
		$http.get('/api/users/current')
		.success(function(data, status, headers, config){
			$scope.current_user = data;
		})
		
	}

}]);

app.controller('TaporIndexCtrl', ['$scope', function($scope) {
}]);
