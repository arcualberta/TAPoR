app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="            
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        // console.log(scope.fileread)
                        scope.fileread = loadEvent.target.result;
                        // console.log(scope.fileread)
                        // scope.callback(scope.fileread);
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);