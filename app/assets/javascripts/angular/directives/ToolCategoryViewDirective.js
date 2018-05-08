"use strict";

app.directive("toolCategoryView", ['$location', function($location) {
	return {
		restrict: 'E',
		template: '<div id="viz"></div>',
		replace: true,
		scope: {
			tools: "="
		},
		link: function(scope, $element, attrs, ngModel) {
			
			var toolsByAnalysis = scope.tools;
			var drawn = false;
			

			var drawWidget = function() {
				var radius = 7,
					increaseRatio = 1.5,
					itemArea = 20, 
					c20 = d3.scaleOrdinal(d3.schemeCategory20),
					attributeDataIndex = {},
					highlitableTools = toolsByAnalysis.tools.map(function(tool, i){ return i;})

				var initialTimer = d3.timeout(restartIntervalTimer , 2000);
				var intervalTimer = d3.interval( highlightRandomTool, 4000);
				intervalTimer.stop();
				
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
					return $("#viz").width();
				}

				var getMainContainerWidth = function() {
					return getContainerWidth() - 200;
				}

				var isCenterInBBox = function(point, bBox) {
					var horizontalPadding = itemArea / 2,
						horizontalCheck = point.cx + horizontalPadding >= bBox.x && point.cx - horizontalPadding <= bBox.x + bBox.width,
						verticalCheck = point.cy >= bBox.y && point.cy <= bBox.y + bBox.height
					
					if (horizontalCheck && verticalCheck) {
						return true
					}
					return false
				}

				var getCenter = function(d, i) {
					var toolCountBBox = getBBoxById("tool-count")
					var center = {}
					var circlesHorizontally = Math.floor(getMainContainerWidth() / itemArea)

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
						if (highlitableTools.indexOf(i) !== -1) {
							initialTimer.stop();
							intervalTimer.stop();
							highlightTool(i)
						}
					})
					.on("mouseout", function(d){
						restartTimer()
					})
					.on("click", function(d) {						
						scope.$apply(function(){
							$location.path( "/tools/" + d.tool_id);	
						})
					})

				var categoryGroup = svg.append("g")
					.attr("id", "category-group")				
				// var categoryTitle = categoryGroup.append("text")
				// 	.text("Categories")
				// 	.attr('x', getMainContainerWidth() + 5)
				// 	.attr('y', 30)


				var categoryTitle = svg.append("text")
					.text("Categories")
					.attr('x', getMainContainerWidth() + 10)
					.attr('y', 15)
					.attr("fill", "#29ABE2")


				// Needed to highlight all categories by using negative id
				toolsByAnalysis.attribute_values.unshift({id: -1, name:"All"})

				var categories = categoryGroup.selectAll("text")
					.data(toolsByAnalysis.attribute_values, function(d){d.id})
					.enter()
					.append("text")
					.text(function(d){return d.name})
					.attr('x', getMainContainerWidth() + 20)
					.attr('y', function(d, i){ return i * 18 + 35;})
					.attr("class", "clickable")
					.on('click', function(d, i) {
						highlitableTools = [];
						highlightCirclesByCategory(d)
						highlightCategory(this, i)
						highlightRandomTool()
					})
				
				var highlightCategory = function(element) {
					drawCategoryHighlightingObject(element)
				}		

				var getCategoryHighlightPoints = function(element) {
					var points = [];
					var bBox = element.getBBox()
					points.push([bBox.x - 12, bBox.y + bBox.height/2.0]);
					points.push([bBox.x - 2, bBox.y + bBox.height/2.0]);

					return points;
				}

				var highlightCategoryPath = svg.append("path")
					.attr("d", lineFunction([]))
					.attr("stroke", "#ADADAD")
					.attr("stroke-width", 2)
					.attr("fill", "none")

				var drawCategoryHighlightingObject = function(element) {
					highlightCategoryPath.attr("d", lineFunction(getCategoryHighlightPoints(element)))
						.attr("stroke", "#ADADAD")
						.attr("stroke-width", 2)
						.attr("fill", "none")
				}				

				var highlightCirclesByCategory = function(category) {
					circles
					.attr("fill-opacity", function(d, i){
					
						var opacity = 0.07;

						if (category.id === -1) {
							highlitableTools.push(i)
							opacity = 1;
						} else {
							d.attribute_value_ids.forEach(function(attributeId) {
								if (attributeId == category.id) {
									opacity = 1;
									return;
								}
							})	
						}

						if (opacity === 1) {
							highlitableTools.push(i)
						}

						return opacity
					})					
				}				

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
					circles.attr("r", radius)
						.attr("stroke", "none")
						
				}				

				var prevCircle;
				var highlightTool = function(index){
					clearToolHighlight()
					var d = circles.data()[index];
					prevCircle = circles.nodes()[index]

					console.log(d)
					d3.select(prevCircle)
						// .transition()
						// .duration(50)
						.attr("r", radius*increaseRatio)
						.attr("stroke", "#ADADAD")
						.attr("stroke-width", 2)
						.attr("stroke-dasharray", ("5,3"))
					toolName.text(d.name)
					// arrangeStarGroup()
					lineGraph.attr("d", lineFunction( getLinePoints(prevCircle) ))
					// toolDetail.text(d.detail)
					setToolDetailText(d.detail)
					// toolImage.attr("xlink:href", d.image_url)
					toolImage.attr("xlink:href", lazyThumb(d.image_url))
					updateStars(d.star_average)

				}

				var lazyThumb = function(imageUrl) {
					return imageUrl.replace(".png", "-thumb.png")
				}

				var setToolDetailText = function(text) {
					var width = toolDetail.attr("width")
					var height = 30//toolImage.attr("height")					
					var wordSpace = 220;
					var maxCharacters = (width*height) / wordSpace;
					var textDisplay = text;
					if (text.length > maxCharacters) {
						textDisplay = text.substring(0, Math.floor(maxCharacters)) + "..."
					}

					toolDetail.text(textDisplay)
				}
				

				var getLeftFramePoints = function() {
					var points = []
					points.push([getMainContainerWidth(), 25])
					points.push([getMainContainerWidth() + 7, 25])
					//  180 height increase to account for tool description

					// what is taller, circle group or type of analysis list?
					var circleGroupHeight = getBBoxById("circle-group").height
					// var categoryGroupHeight
					var categoryGroupHeight = getBBoxById("category-group").height + 20
					var height = circleGroupHeight > categoryGroupHeight ? circleGroupHeight : categoryGroupHeight

					points.push([getMainContainerWidth() + 7, height])
					points.push([getMainContainerWidth(), height])					
					return points
				}

				var leftFrame = svg.append("path")
					.attr("d", lineFunction([]))
					.attr("stroke", "#ADADAD")
					.attr("stroke-width", 2)
					.attr("fill", "none")

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
					.attr("height", "128px")

				var arrangeStarGroup = function() {
					starGroup.attr('transform', "translate("+
						60
						+","+
						(getBBoxById("circle-group").height + 55)
						+")")
				}

				var arrangeObjects = function() {
					toolCount.attr('x', getMainContainerWidth() - itemArea / 2)
							.attr('y', 50)
					circleIndexPadding = 0
					circles.attrs( function (d, i) {
						return getCenter(d, i)
					})
					toolName.attr('x', 60)
							.attr('y', getBBoxById("circle-group").height + 50)
					toolDetail.attr('x', 0)
							.attr('y', getBBoxById("circle-group").height + 80)
							.attr('width', getMainContainerWidth() - 180)
							.attr('height', 180)

					toolImage.attr('y', getBBoxById("circle-group").height + 20)
							   .attr('x', getMainContainerWidth() - 180)
					leftFrame.attr("d", lineFunction(getLeftFramePoints()))

					categoryTitle.attr('x', getMainContainerWidth() + 10)
								 


					// give space for circles, image and padding
					var categoryHeight = getBBoxById("category-group").height
					var circlesHeight = getBBoxById("circle-group").height

					console.log(categoryHeight)
					console.log(circlesHeight)

					var svgHeight = circlesHeight > categoryHeight ? circlesHeight + 180 : categoryHeight + 200;

					svg.attr("height", svgHeight)

					// reset categories places
					categories.attr('x', getMainContainerWidth() + 20)
						.attr('y', function(d, i){ return i* 18 + 35;})

					arrangeStarGroup()

				}

				var highlightRandomTool = function() {
					var toolIndex = highlitableTools[Math.floor((Math.random() * highlitableTools.length))]
					highlightTool(toolIndex)
				}

				var restartIntervalTimer = function() {
					initialTimer.stop()
					intervalTimer = d3.interval( highlightRandomTool, 4000);
				}

				var restartTimer = function() {
					initialTimer.stop;
					initialTimer.restart(restartIntervalTimer, 2000);
				}

				arrangeObjects()
				highlightRandomTool()
				restartTimer()
				highlightCategory(categories._groups[0][0]);

				$(window).on("resize", function() {
					arrangeObjects()
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
