app.directive("multselect", function() {
	return {
		restrict : "A",
		template : 	"<div ng-switch='isMultiple'>"+
      					"	<div ng-switch-when='true'>"+
        				"		<ul>"+
        				"			<li class='checkbox' ng-repeat='value in values track by $index'>"+
        				"				<label>"+
        				"					<input ng-model='model[$index]' name='name' value='value' type='checkbox'> {{value}}"+
        				"				</label>"+
        				"			</li>"+
        				"		</ul>"+
      					"	</div>"+
					      "	<div ng-switch-when='false'>"+
					      "		<select class='form-control' ng-model='model' ng-change='updateSelect()' ng-options='value for value in values'>"+					      
					      "			<option selected value=''></option>"+
					      "		</select>"+
					      "	</div>"+
					    	"</div>",
		scope : {
			model : "=",
			isMultiple : "=",
			name : "=",
			values : "="
		},
		link : function(scope, elem, attrs) {
			scope.updateSelect = function() {
				scope.model = $(elem).find(":selected").text();;
			}	
		}
	};
})

