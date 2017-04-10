"use strict";

app.directive("toolCategoryView", function() {
	return {
		restrict: 'E',
		template: '<div id="viz"></div>',
		replace: true,
		// require: ngModel,
		transclude: true,
		scope: {
			tools: "="
		},
		link: function(scope, $element, attrs, ngModel, transclude) {
			
			var toolsByAnalysis = scope.tools;
			var drawn = false;

			var drawWidget = function() {
				var radius = 7,
					itemArea = 20,
					c20 = d3.scaleOrdinal(d3.schemeCategory20),
					colorIndex = {};

				toolsByAnalysis.attribute_values.forEach(function(attribute, i){
					colorIndex[attribute.id] = i
				})

				toolsByAnalysis.tools.sort(function(a, b){
					if (! a.attribute_value_ids.length || ! b.attribute_value_ids.length) {					
						return 0
					}
					var ai = parseInt(a.attribute_value_ids[0])
					var	bi = parseInt(b.attribute_value_ids[0])
					
					if (ai > bi){
						return 1
					}
					if (ai < bi){
						return -1
					}
					return 0
				})

				var getBBoxById = function(id) {
					return document.getElementById(id).getBBox()
				}

				var getLinePoints = function(origin) {
					var start = d3.select(origin),
						halfTextWidth = getBBoxById("tool-name").width / 2,
						pointAfterCircles = getBBoxById("circle-group").height,
						linePoints = []

					linePoints.push( [start.attr("cx"), parseInt(start.attr("cy")) + itemArea / 2])
					linePoints.push( [start.attr("cx"), pointAfterCircles + 15])
					linePoints.push( [40 + halfTextWidth, pointAfterCircles + 15])
					linePoints.push( [40 + halfTextWidth, pointAfterCircles + 30])

					return linePoints
				}

				var getContainerWidth = function() {
					return $("#viz").width()
				}

				var isCenterInBBox = function(point, bBox) {
					var horizontalPadding = itemArea / 2,
						horizontalCheck = point.cx + horizontalPadding >= bBox.x && point.cx - horizontalPadding <= bBox.x + bBox.width,
						verticalCheck = point.cy >= bBox.y && point.cy <= bBox.y + bBox.height
					
					if (horizontalCheck && verticalCheck)
						return true
					return false
				}

				var getCenter = function(d, i) {
					var toolCountBBox = getBBoxById("tool-count")
					var center = {}
					while (true) {
						center = {
							cx: ((i+circleIndexPadding) % Math.floor(getContainerWidth() / itemArea)) * itemArea + radius,
							cy: Math.floor((i+circleIndexPadding)*itemArea / getContainerWidth()) * itemArea + radius
						}
						if (isCenterInBBox(center, toolCountBBox)) {
							++circleIndexPadding
						} else {
							break;
						}
					}
					return center
				}

				var lineFunction = d3.line()
					.x(function(d){return d[0]})
					.y(function(d){return d[1]})

				var svg = d3.select("#viz")
					.append("svg")
					.attr("width", "100%")
					.attr("height", 350)

				var toolCount = svg.append("text")
					.attr('text-anchor', "end")
					.attr('id', 'tool-count')
					.attr("font-size", "70px")
					.attr("fill", "white")
					.attr("stroke", "black")
					.attr("stroke-width", "1.5")
					.attr("font-weight", "bold")
					.text(toolsByAnalysis.tools.length)

				var circleGroup = svg.append("g")
					.attr("id", "circle-group")

				var circleIndexPadding = 0

				var circles = circleGroup.selectAll("circle")
					.data(toolsByAnalysis.tools, function(d){d.tool_id})
					.enter()
					.append("circle")				
					.attr("r", radius )
					.attr("fill", function(d,i){ 
						return c20(colorIndex[d.attribute_value_ids[0]])
					})
					.on("mouseover", function(d){
						d3.select(this)
							.attr("r", radius*1.5)
							.attr("stroke", "#ADADAD")
							.attr("stroke-width", 2)
							.attr("fill-opacity", 0.7)
							.attr("stroke-dasharray", ("5,3"))
						toolName.text(d.name)
						lineGraph.attr("d", lineFunction( getLinePoints(this) ))
						toolDetail.text(d.detail)
						toolImage.attr("xlink:href", d.image_url)
					})
					.on("mouseout", function(d){
						d3.select(this)
							.attr("r", radius)
							.attr("stroke", "none")
							.attr("fill-opacity", 1)
						lineGraph.attr("d", lineFunction([]))
						toolName.text("")
						toolDetail.text("")
						toolImage.attr("xlink:href", "")
					})
					.on("click", function(d) {
						console.log("clicked " + JSON.stringify(d))
					})

				var lineGraph = svg.append("path")
					.attr("d", lineFunction([]))
					.attr("stroke", "#ADADAD")
					.attr("stroke-width", 2)
					.attr("fill", "none")
					.attr("stroke-dasharray", ("5,3"))

				var toolName = svg.append("text")
					.attr('id', 'tool-name')
					.attr("font-size", "20px")
					.attr("fill", "#29ABE2")

				var toolDetail = svg.append("foreignObject")
					.attr("id", 'tool-description')

				var toolImage = svg.append("svg:image")
					.attr("width", "160px")



				var arrangeObjects = function() {
					toolCount.attr('x', getContainerWidth() - itemArea / 2)
							.attr('y', 50)
					circleIndexPadding = 0
					circles.attrs( function (d, i) {
						return getCenter(d, i)
					})
					toolName.attr('x', 40)
							.attr('y', getBBoxById("circle-group").height + 50)
					toolDetail.attr('x', 0)
							.attr('y', getBBoxById("circle-group").height + 60)
							.attr('width', getContainerWidth() - 180)
					toolImage.attr('y', getBBoxById("circle-group").height + 20)
							.attr('x', getContainerWidth() - 160)

				}

				arrangeObjects()

				$(window).on("resize", function() {
					arrangeObjects()
				})
			}

			scope.$watch('tools', function(oldVal, newVal){
				toolsByAnalysis = scope.tools;				
				console.log (toolsByAnalysis)
				if (drawn) {
					drawWidget();		
				}
				
				drawn = true;								
			});

		}
	}
})