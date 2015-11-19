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
								'										<a href=\"/tool_lists/{{list.id}}\"><label>{{list.name}}</label></a>'+
								'										<p><h6>Curated by {{list.user.name}}</h6></p>'+
								'									</div>'+
								'								</div>'+
								'								<p>{{list.detail}}</p>'+
								'								<p>Viewing {{list.tool_list_items.length}} of {{list.total_items}}</p>'+
								'							</div>'+
								'							<div class=\"col-md-3\" ng-repeat=\"item in list.tool_list_items\">'+
								'								<div>'+
								'									<a href=\"/tools/{{item.tool.id}}\"> <img src=\"{{item.tool.thumb_url}}\" width=\"160px\"></a>'+
								'									<p><h6>{{item.tool.name}}</h6></p>'+
								'								</div>'+
								// '								<div class=\"panel panel-default\">'+
								// '									<div class=\"panel-heading\">'+
								// '										<h3 class=\"panel-title\">{{item.tool.name}}</h3>'+
								// '									</div>'+
								// '								  <div class=\"panel-body\">'+
								// '										<a href=\"/tools/{{item.tool.id}}\"> <img src=\"{{item.tool.thumb_url}}\" width=\"145px\"></a>'+
								// '									</div>'+
								// '								</div>'+
								'							</div>'+
								'						</div>'+
								'					</div>'+
								'				</div>'
								,
		scope : {
			list : '='
		}
	};
});

