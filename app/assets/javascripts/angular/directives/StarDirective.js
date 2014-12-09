app.directive("starRating", function() {
  return {
    restrict : "A",
    template : "<ul class='rating list-inline'>" +
               "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
               "    <i class='fa fa-star'></i>" + //&#9733
               "  </li>" +
               "  <li ng-click='clear()' class='clear'>"+
               "    <i class='fa fa-times'></i>" + //&#9733
               "  </li>"+
               "</ul>",
    scope : {
      ratingValue : "=",
      max : "=",
      onRatingSelected : "&"
    },
    link : function(scope, elem, attrs) {
      var updateStars = function() {        
        scope.stars = [];        
        for ( var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled : i < scope.ratingValue
          });
        }
      };
      scope.toggle = function(index) {       
        scope.ratingValue = index + 1;
        scope.onRatingSelected({
          rating : index + 1
        });
      };
      scope.clear = function(){
        scope.ratingValue = 0;
        scope.onRatingSelected({
          rating : 0
        });
      }
      scope.$watch("ratingValue", function(oldVal, newVal) {
        updateStars();
      });
    }
  };
});