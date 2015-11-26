
app.controller('PagesIndexController', ['$scope', 'services', function($scope, services){

	$scope.data = {};

	services.page.list().then(
		function(data){
			$scope.data = data;
		},
		function(errorMessage){
			$scope.error = errorMessage;
		}
	);


}]);



app.controller('PagesViewController', ['$scope', '$routeParams', '$location', 'services', function($scope, $routeParams, $location, services){
	$scope.data = {};
	services.page.get($routeParams.name).then(
		function(data){
			$scope.data = data;
		},
		function(errorMessage){
			$scope.error = errorMessage;
		}
	);

	$scope.edit_page = function() {
		$location.path('/pages/edit/' + $routeParams.name);
	};


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
		);
	}

	$scope.save = function() {
		services.page.save($scope.data).then(			
			function(data){
				$location.path("/pages/" + $scope.data.named_id);
			},
			function(errorMessage) {
				$scope.error = errorMessage;
			}
		);
	};
	


}]);