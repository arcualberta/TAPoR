"use strict";

// a word cloud based directly on the tags result from TAPoR api

app.directive('wordCloud', function(services) {
	return {
		restrict: 'E',
		template: '<div><span ng-style="{fontSize: tag.size}" ng-repeat="tag in tagsMin | orderBy: \'text\' "><a href="/tools?tag_values={{tag.id}}">{{tag.text}}</a> </span></div>',
		scope: {
			maxSize: '=',
			minSize: '=',
			maxCount: '=',
			tags: '='
		},
		link: function(scope, elem, attrs) {
			scope.tagsMin = [];
			var updateTags = function() {
				scope.tagsMin = scope.tags;
			// scope.$watch("tags", function(){
				// get tags
				scope.tagsMin.sort(function(a, b){
					return b.weight - a.weight;
				});
				// cut by maxCount
				scope.tagsMin = scope.tagsMin.slice(0, scope.maxCount);

				// set size in px

				// get largest/smallest weights

				var maxWeight = -1;
				var minWeight = Number.POSITIVE_INFINITY;

				angular.forEach(scope.tagsMin, function(v, i){
					if (v.weight > maxWeight) {
						maxWeight = v.weight;
					}
					if (v.weight < minWeight) {
						minWeight = v.weight;
					}
				});

				angular.forEach(scope.tagsMin, function(v, i){
					var t = 1.0 * (v.weight - minWeight) / (maxWeight - minWeight);
					v.size = t * (scope.maxSize - scope.minSize) + scope.minSize;
				});
			}

			scope.$watch('tags', function(oldVal, newVal){
				updateTags();
			});
			// });

			
		}
	}
});