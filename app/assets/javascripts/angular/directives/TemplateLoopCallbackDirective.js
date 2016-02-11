app.directive('templateLoopCallback', function () {
	return function (scope, element, attrs) {
		if (scope.$last) {
			scope.$eval(attrs.templateLoopCallback)
		}
	};
});
