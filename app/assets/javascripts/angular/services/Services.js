app.factory('services', ['attributeTypeServices', 'toolServices', 'pageServices', function(attributeTypeServices, toolServices, pageServices){
	return {
		attribute_type: attributeTypeServices,
		tool: toolServices,
		page: pageServices
	};
}]);



	
