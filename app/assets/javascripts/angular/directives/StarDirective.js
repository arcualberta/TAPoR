app.directive("starRating", function() {
  return {
    restrict : "A",
    template : "<ul class='rating list-inline'>" +
               "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
               "    <i class='fa {{star.type}}'></i>" + //&#9733
               "  </li>" +
               "  <li ng-if='isInteractive' ng-click='clear()' class='clear'>"+
               "    <i class='fa fa-times'></i>" + //&#9733
               "  </li>"+
               "</ul>",
    scope : {
      ratingValue : "=",
      max : "=",
      onRatingSelected : "=",
      isInteractive : "="
    },
    link : function(scope, elem, attrs) {     
      var updateStars = function() {        
        scope.stars = [];        
        // for ( var i = 0; i < scope.max; i++) {
        //   scope.stars.push({
        //     filled : i < scope.ratingValue,
        //     type: "fa-star"
        //   });
        // }
        var full = Math.floor(scope.ratingValue)
        var partial = scope.ratingValue - full;
        var i;

        for (i=0; i<full; ++i) {
          scope.stars.push({
            filled : true,
            type: "fa-star"
          }); 
        }

        if (partial >= 0.5) {
          ++i;
          scope.stars.push({
            filled : true,
            type: "fa-star-half-o"
          });  
        }

        for (; i<scope.max; ++i) {
          scope.stars.push({
            filled : false,
            type: "fa-star"
          }); 
        }

      };
      scope.toggle = function(index) {       
        if (scope.isInteractive){
          scope.ratingValue = index + 1;
          scope.onRatingSelected(scope.ratingValue);                 
        }
      };
      scope.clear = function(){
        if (scope.isInteractive){
          scope.ratingValue = 0;        
          scope.onRatingSelected(scope.ratingValue);          
        }
      }
      scope.$watch("ratingValue", function(oldVal, newVal) {
        updateStars();
      });
    }
  };
});