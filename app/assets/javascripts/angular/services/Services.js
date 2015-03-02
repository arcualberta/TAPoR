app.factory('services', ['attributeTypeServices', 'toolServices', 'pageServices', 'commentServices', 'userServices', function(attributeTypeServices, toolServices, pageServices, commentServices, userServices){
	return {
		attribute_type: attributeTypeServices,
		tool: toolServices,
		page: pageServices,
		comment: commentServices,
		user: userServices
	};
}]);



	
