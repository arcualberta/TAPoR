app.directive("renderAttributes", [function() {
	return {
		restrict : "A",
		template : 	"<div>" +
								"	<ul>" +								
								"		<li ng-repeat='type in model' ng-if='type.selected.length'>" +
								"			<label>" +
								"				{{type.name}}:"+
								"			</label>" +
								"				<span ng-repeat='att in type.selected'>" +
								"				<a href='http://localhost:3000/tools?attribute_values={{att.id}}'>{{get_selected_name(att.id, type.attribute_values)}}</a>"+
								"				</span>" +
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
					angular.forEach(type.attribute_values, function(val, j){
						if (val.id == v.id) {
							result.push(val.name)
						}
						
					})
					
				});
				return result.join(", ");
			}

			scope.get_selected_name = function(id, values) {
				var result = ""
				angular.forEach(values, function(val, j){
					if (val.id == id) {
						result = val.name;
						return ;
					}

				});
				return result;
				
			}

		}
	};
}]);

