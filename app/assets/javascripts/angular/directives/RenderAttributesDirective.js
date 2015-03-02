app.directive("renderAttributes", function() {
	return {
		restrict : "A",
		template : 	"<div>" +
								"	<ul>" +								
								"		<li ng-repeat='type in model' ng-if='type.selected.length'>" +
								"			<label>" +
								"				{{type.name}}:"+
								"			</label>" +
								"			<span>{{get_selected_names(type)}}</span>" +
								"		</li>" +								
								"	</ul>" +
								"</div>",
		scope : {
			model : "=",
		},
		link : function(scope, elem, attrs) {     
			scope.get_selected_names = function(type) {
				var result = [];
				angular.forEach(type.selected, function(v, i){
					angular.forEach(type.possible_values, function(val, j){
						if (val.id == v.id) {
							result.push(val.name)
						}
						
					})
					
				});
				return result.join(", ");
			}
		}
	};
})

