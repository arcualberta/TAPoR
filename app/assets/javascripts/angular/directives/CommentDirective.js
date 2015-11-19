app.directive("comment", ['$sce', function($sce) {
	return {
		restrict : 'A',
		template : [
			'<a id="{{model.id}}"></a>',
			'<div class="col-md-12">',
				'<div class="media">',
					'<div class="media-left">',
						'<img src="{{model.user.image_url}}" class="img-circle user-image-url">',
					'</div>',
					'<div class="media-body">',
						'<h4 class="media-heading">{{model.user.name}}</h4>',						
						'<div ng-if="!is_editing" ng-bind-html="model.content"></div>',
						'<div ng-if="is_editing">',
							'<textarea ui-tinymce="tinymceOptions" ng-model="model.content"></textarea>',
						'</div>',
						'<div ng-if="user.is_admin">',
							'<button class="btn btn-info" ng-click="toggle_pinned()">{{pin_button_text}} <span class="glyphicon glyphicon-pushpin"></button>',
							'<button class="btn btn-primary" ng-click="toggle_editing()">{{edit_button_text}} <span class="glyphicon {{edit_button_icon_class}}"></button>',
							'<button class="btn btn-danger" ng-click="cancel_editing()" ng-if="is_editing">Cancel <span class="glyphicon glyphicon-cancel"></button>',
						'</div>',
					'</div>',
				'</div>',
			'</div>'
			].join('\n'),
		scope : {
			model : '=',
			user : '=',
			update : '='
		},
		link : function(scope, elem, attrs) {
			scope.is_editing = false;
			scope.edit_button_text = 'Edit';
			scope.pin_button_text =  scope.model.is_pinned ? 'Remove pin' : 'Pin';
			scope.edit_button_icon_class = 'glyphicon-edit';
			// scope.editable_comment = scope.model.content;
			scope.tinymceOptions = {
				menubar : false,
				height : 200,
				resize: false,
				plugins: ["autolink link anchor"],
				toolbar: "undo redo | bold italic | link",
				valid_elements : "a[href|target=_blank],strong/b,em/i,div[align],br,p"
   		};

   		scope.toggle_pinned = function() {   			

   			scope.model.is_pinned = ! scope.model.is_pinned;
   			scope.update(scope.model);
   		}

   		scope.cancel_editing = function() {
   			scope.is_editing = false;
   			set_edit_button();
   		}

   		var set_edit_button = function() {
   			scope.edit_button_text = "Edit";
				scope.edit_button_icon_class = 'glyphicon-edit';
   		}

   		var set_save_button = function() {
   			scope.edit_button_text = "Save";
				scope.edit_button_icon_class = 'glyphicon-save';
   		}

			scope.toggle_editing = function() {
				if (scope.is_editing) {
					console.log("ttt")
					console.log(scope.model.content);
					scope.update(scope.model);
					set_edit_button();

				} else {
					set_save_button();

				}

				scope.is_editing = ! scope.is_editing;

			}
		}
	};
}]);

