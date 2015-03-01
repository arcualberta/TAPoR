app.directive("renderAttributes", function() {
	return {
		restrict : "A",
		template : 	"<div>" +
								"	<ul>" +
								"		<span ng-repeat='type in model'>" +
								"			<li ng-if='type.selected.length'>" +
								"				<label>" +
								"					{{type.name}}:"+
								"				</label>" +
								"				<span>{{get_selected_names(type)}}</span>" +
								"			</li>" +
								"		<span>" +
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

