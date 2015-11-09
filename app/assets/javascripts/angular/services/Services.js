app.factory('services', [
	'attributeTypeServices', 
	'toolServices', 
	'pageServices', 
	'commentServices', 
	'userServices', 
	'toolListServices', 
	'helperServices',
	'tagServices',
	function(
		attributeTypeServices, 
		toolServices, 
		pageServices, 
		commentServices, 
		userServices, 
		toolListServices, 
		helperServices,
		tagServices
	){
	return {
		attribute_type: attributeTypeServices,
		tool: toolServices,
		page: pageServices,
		comment: commentServices,
		user: userServices,
		tool_list: toolListServices,
		helper: helperServices,
		tag: tagServices
	};
}]);



	
