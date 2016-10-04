app.directive("compressedList", function() {
	return {
		restrict : 'A',
		template : 	'<div class=\"col-md-12\">'+
					'	<div class=\"well\">'+
					'		<div class=\"row\">'+
					'			<div class=\"col-md-3\">'+
					'				<div class=\"row\">'+
					'					<div class="col-md-3">'+
					'						<img class=\"img-circle user-image-url\" src=\"{{list.user.image_url}}\">'+
					'					</div>'+
					'					<div class="col-md-9">'+
					'						<label><a href=\"/tool_lists/{{list.id}}\">{{list.name}}</a><label>'+
					'						<p><h6>Curated by {{list.user.name}}</h6></p>'+
					'					</div>'+
					'				</div>'+
					'				<p><span class="break-content">{{list.detail | htmlToPlaintext | limitTo: 100}} <a href="/tools/{{list.id}}">[...]</a></span></p>'+
					'				<p>Viewing {{list.tool_list_items.length}} of {{list.total_items}}</p>'+
					'			</div>'+
					'			<div class=\"col-md-3\" ng-repeat=\"item in list.tool_list_items\">'+
					'				<div>'+
					'					<a href=\"/tools/{{item.tool.id}}\"> <img src=\"{{item.tool.thumb_url}}\" width=\"160px\"></a>'+
					'					<p><h6>{{item.tool.name}}</h6></p>'+
					'				</div>'+
					'			</div>'+
					'		</div>'+
					'	</div>'+
					'</div>'
								,
		scope : {
			list : '='
		},
		link : function(scope, elem, attrs) {
			scope.list.total_items = scope.list.tool_list_items.length;
			if (scope.list.tool_list_items.length > 3) {
				scope.list.tool_list_items.length = 3;
			}
		}
	};
});

