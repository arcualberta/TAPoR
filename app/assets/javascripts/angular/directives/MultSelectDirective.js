app.directive("multselect", function() {
	return {
		restrict : "A",
		template : 	"<div ng-switch='isMultiple'>"+
      					"	<div ng-switch-when='true'>"+
        				"		<ul>"+
        				"			<li class='checkbox' ng-repeat='value in values track by $index'>"+
        				"				<label>"+
        				"					<input toggle-checkbox ng-model='model[$index]' name='name' value='value.id' type='checkbox' data-on='Yes' data-off='No'> {{value.name}} "+
        				"				</label>"+
        				"			</li>"+
        				"		</ul>"+
      					"	</div>"+
					      "	<div ng-switch-when='false'>"+
					      "		<select ng-required={{isRequired}} class='form-control' ng-model='model[0]' ng-options='value.name for value in values track by value.id'>"+					      
					      "			<option ng-if='addEmpty' selected name=''></option>"+
					      "		</select>"+
					      "	</div>"+
					    	"</div>",
		scope : {
			model : "=",
			isMultiple : "=",
			isRequired : "=",
			name : "=",
			values : "=",
			addEmpty: "="
		}
	};
});

