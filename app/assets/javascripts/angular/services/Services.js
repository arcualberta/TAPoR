app.factory('services', ['attributeTypeServices', 'toolServices', 'pageServices', 'commentServices', 'userServices', 'toolListServices', function(attributeTypeServices, toolServices, pageServices, commentServices, userServices, toolListServices){
	return {
		attribute_type: attributeTypeServices,
		tool: toolServices,
		page: pageServices,
		comment: commentServices,
		user: userServices,
		tool_list: toolListServices
	};
}]);



	
