"use strict";

app.directive("toolCategoryView", ['$location', function($location) {
	return {
		restrict: 'E',
		template: '<div id="viz"></div>',
		replace: true,
		// require: ngModel,
		// transclude: true,
		scope: {
			tools: "="
		},
		link: function(scope, $element, attrs, ngModel) {
			
			var toolsByAnalysis = scope.tools;
			var drawn = false;

			var drawWidget = function() {
				var radius = 7,
					increaseRatio = 1.5,
					itemArea = 20, // does not work with 22
					c20 = d3.scaleOrdinal(d3.schemeCategory20),
					attributeDataIndex = {},
					initialTimer,
					intervalTimer;

				
				// map attributeIds to c20 colours
				toolsByAnalysis.attribute_values.forEach(function(attribute, i){
					attributeDataIndex[attribute.id] = {
						color: i,
						toolInstances: 0
					}
				})

				// toolInstances of item categories is needed to colour least common
				toolsByAnalysis.tools.forEach(function(tool){
					tool.attribute_value_ids.forEach(function(attributeId){						
						attributeDataIndex[attributeId].toolInstances++
					})
				})

				// define least common category for each tool

				var getLeastCommonCategory = function(tool) {
					var least = Number.POSITIVE_INFINITY 
					var resultId = 0;
					tool.attribute_value_ids.forEach(function(attributeId){						
						if (attributeDataIndex[attributeId].toolInstances < least) {
							least = attributeDataIndex[attributeId].toolInstances
							resultId = attributeId
						}
					})
					return parseInt(resultId)
				}

				toolsByAnalysis.tools.forEach(function(tool){
					tool.leastCommonCategory = getLeastCommonCategory(tool)
				})


				toolsByAnalysis.tools.sort(function(a, b){
					var ai = a.leastCommonCategory
					var	bi = b.leastCommonCategory					
					
					if (ai > bi) {
						return 1
					} 
					if (ai < bi) {
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
					linePoints.push( [60 + halfTextWidth, pointAfterCircles + 15])
					linePoints.push( [60 + halfTextWidth, pointAfterCircles + 30])

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
					var circlesHorizontally = Math.floor(getContainerWidth() / itemArea)

					while (true) {
						var index = i + circleIndexPadding;
						center = {
							cx: parseInt(index % circlesHorizontally) * itemArea + radius*increaseRatio,
							cy: Math.floor(index / circlesHorizontally) * itemArea + radius*increaseRatio
							
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
						return c20( attributeDataIndex[d.leastCommonCategory].color )
					})
					.on("mouseover", function(d, i){
						window.clearTimeout(initialTimer)
						window.clearTimeout(intervalTimer)
						highlightTool(i)
					})
					.on("mouseout", function(d){
						restartTimer()
					})
					.on("click", function(d) {						
						scope.$apply(function(){
							$location.path( "/tools/" + d.tool_id);	
						})
					})

				var getStars = function(starAverage) {
					
					var result = [0,0,0,0,0]
					for (var i =0; i<5; i++) {
						if (starAverage > 0 && starAverage <= 1){
							result[i] = starAverage
						} else if (starAverage > 1){
							result[i] = 1
						} 
						--starAverage
					}

					return result;					

				}
				
				var starGroup = svg.append("g")
					.attr("id", "star-group")

				var starsData = getStars(0)
								
				

				var starPath = 'M 332.256 385.519 L 217.943 325.583 L 103.763 385.773 L 125.441 258.534 L 32.9138 168.542 L 160.625 149.839 L 217.619 34.0317 L 274.871 149.713 L 402.623 168.131 L 310.296 258.328 L 332.256 385.519 Z'
				var selection = starGroup.selectAll("path")
								.data(starsData)

				selection.enter().append("path")
						.attr("fill", "#808080")
						.attr("d", starPath)
						.attr("transform", function(d, i) {
							return "translate ("+i*25+",0) scale(0.06)"
						})				
				selection.enter()						
					.append("clipPath")
						.attr("id", function(d, i){return "clip" + i})
					.append("path")
						.attr("d", starPath)
						.attr("transform", function(d, i) {
							return "translate ("+i*25+",0) scale(0.06)"
						})
				selection.enter()
					.append("rect")
						.attr("x", function(d,i){ return i*25})
						.attr("y", 0)
						.attr("width", function(d,i){ return d*25})
						.attr("height", 25)
						.attr("clip-path", function(d, i){return "url(#clip"+i+")"})
						.attr("fill", "#29ABE2") 

				selection.exit()
					.remove()
			
				var updateStars = function(stars) {
					starsData= getStars(stars)
					starGroup.selectAll("rect").attr("width", function(d,i){return starsData[i]*25})	
				}
					
				var clearToolHighlight = function() {
					circles.transition().duration(50)
						.attr("r", radius)
						.attr("stroke", "none")
						.attr("fill-opacity", 1)
				}				

				var prevCircle;
				var highlightTool = function(index){
					clearToolHighlight()
					var d = circles.data()[index];
					prevCircle = circles.nodes()[index]

					
					d3.select(prevCircle)
						.transition()
						.duration(50)
						.attr("r", radius*increaseRatio)
						.attr("stroke", "#ADADAD")
						.attr("stroke-width", 2)
						.attr("fill-opacity", 0.7)
						.attr("stroke-dasharray", ("5,3"))
					toolName.text(d.name)
					arrageStarGroup()
					lineGraph.attr("d", lineFunction( getLinePoints(prevCircle) ))
					// toolDetail.text(d.detail)
					setToolDetailText(d.detail)
					toolImage.attr("xlink:href", d.image_url)
					updateStars(d.star_average)

				}

				var setToolDetailText = function(text) {
					var width = toolDetail.attr("width")
					var height = 130//toolImage.attr("height")					
					var wordSpace = 220;
					var maxCharacters = (width*height) / wordSpace;
					var textDisplay = text;
					if (text.length > maxCharacters) {
						textDisplay = text.substring(0, Math.floor(maxCharacters)) + "..."
					}

					toolDetail.text(textDisplay)
				}
				

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
					.attr("id", 'tool-image')
					.attr("width", "160px")

				var arrageStarGroup = function() {
					starGroup.attr('transform', "translate("+
						(getBBoxById('tool-name').x + 
							getBBoxById('tool-name').width / 2 - getBBoxById('star-group').width/2)
						+","+
						(getBBoxById("circle-group").height + 55)
						+")")
				}

				var arangeObjects = function() {
					toolCount.attr('x', getContainerWidth() - itemArea / 2)
							.attr('y', 50)
					circleIndexPadding = 0
					circles.attrs( function (d, i) {
						return getCenter(d, i)
					})
					toolName.attr('x', 60)
							.attr('y', getBBoxById("circle-group").height + 50)
					toolDetail.attr('x', 0)
							.attr('y', getBBoxById("circle-group").height + 80)
							.attr('width', getContainerWidth() - 180)
					toolImage.attr('y', getBBoxById("circle-group").height + 20)
							.attr('x', getContainerWidth() - 160)

					// give space for circles, image and padding
					svg.attr("height", getBBoxById("circle-group").height + 170)

					arrageStarGroup()

				}

				var highlightRandomTool = function() {
					highlightTool(Math.floor((Math.random() * toolsByAnalysis.tools.length)))
				}

				var restartTimer = function() {
					window.clearTimeout(initialTimer)
					initialTimer = window.setTimeout(function(){					
						intervalTimer = window.setInterval(highlightRandomTool, 4000)
					}, 3000)	
				}

				arangeObjects()
				highlightRandomTool()
				restartTimer()

				$(window).on("resize", function() {
					arangeObjects()
					lineGraph.attr("d", lineFunction( getLinePoints(prevCircle) ))
				})


			}

			scope.$watch('tools', function(oldVal, newVal){
				toolsByAnalysis = scope.tools;				
				if (drawn) {
					drawWidget();		
				}
				drawn = true;								
			});

		}
	}
}])