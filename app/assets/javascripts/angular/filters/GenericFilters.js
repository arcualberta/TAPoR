angular.module('genericFilters', [])
	.filter('htmlToPlaintext', function() {
  	return function(input) {
    	return String(input).replace(/<[^>]+>/gm, '');
  	};
	})
	.filter('maxN', function() {
		return function(input, n) {
			return String(input).substring(0, n);
		}
	})
	.filter('maxWords', function() {
		return function(input, n) {
			var wordArray = input.split(" ");
			var result = wordArray.slice(0, n).join(" ");
			if (n < wordArray.length) {
				result += " ..."
			} 
			return result;
		}
	})
	.filter('cutEllipsis', function() {
		return function(input, n) {
			var result = input.substring(0, n);
			if (input.length > n) {
				result += '...';
			}

			return result;
		}
	})
