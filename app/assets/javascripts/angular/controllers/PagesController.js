
app.controller('PagesIndexController', ['$scope', 'services', function($scope, services){

	$scope.data = {};

	services.page.list().then(
		function(data){
			$scope.data = data;
		},
		function(errorMessage){
			$scope.error = errorMessage;
		}
	)


}]);



app.controller('PagesDetailController', ['$scope', '$routeParams', '$location', 'services', function($scope, $routeParams, $location, services){
	$scope.data = {};
	console.log($routeParams.name);
	services.page.get($routeParams.name).then(
		function(data){
			$scope.data = data;
			console.log($scope)
		},
		function(errorMessage){
			$scope.error = errorMessage;
		}
	)

	$scope.edit_page = function() {
		$location.path('/pages/edit/' + $routeParams.name);
	}


}]);



app.controller('PagesEditController', ['$scope', '$routeParams', '$location', 'services', function($scope, $routeParams, $location, services){

	$scope.tinymceOptions = {
  	menubar : false,
  	height : 330,
  	resize: false
   };

	$scope.data = {
		title: "",
		content: ""
	};

	$scope.is_rich_editing = true;

	$scope.is_editing = $location.path().indexOf("edit") != -1;

	if ($scope.is_editing) {
		services.page.get($routeParams.name).then(
			function(data){
				$scope.data = data;				
			},
			function(errorMessage){
				$scope.error = errorMessage;
			}
		)
	}

	$scope.save = function() {

		if (current_user && current_user.is_admin){
			services.pages.save($scope.data).then(
				function(data){
					$location.path("/pages/" + $scope.data.name)
				},
				function(errorMessage) {
					$scope.error = errorMessage
				}
			);
		}
		
	}

}]);