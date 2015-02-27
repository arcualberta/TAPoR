app.factory('services', ['attributeTypeServices', 'toolServices', 'pageServices', 'commentServices', function(attributeTypeServices, toolServices, pageServices, commentServices){
	return {
		attribute_type: attributeTypeServices,
		tool: toolServices,
		page: pageServices,
		comment: commentServices
	};
}]);



	
