angular.module('genericFilters', [])
	.filter('htmlToPlaintext', function() {
  	return function(input) {
    	return String(input).replace(/<[^>]+>/gm, '');
  	};
	})
	.filter('max100', function() {
		return function(input) {
			return String(input).substring(0, 100);
		}
	})

// var myAppModule = angular.module('taporApp', []);

// configure the module.
// in this example we will create a greeting filter
// myAppModule.filter('htmlToPlaintext', function() {
//  return function(name) {
//     return String(text).replace(/<[^>]+>/gm, '');
//   };
// });


// angular.module('taporApp.filters', []).
//   filter('htmlToPlaintext', function() {
//     return function(text) {
//       return String(text).replace(/<[^>]+>/gm, '');
//     };
//   }
// );