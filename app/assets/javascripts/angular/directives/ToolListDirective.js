"use strict";

app.directive('toolList', function () {
    return {
        restrict: 'E',
        template: '<svg></svg>',
        templateNamespace: 'svg',
        replace: 'true',
        require: 'ngModel',
        scope: {
            ngModel: "=",
            categoryList: "=",
            elementClick: "="
        },
        link: function ($scope, $element, attrs, ngModel) {
            var debug = attrs["debug"];
            if (debug !== undefined && debug !== null && debug === "true") {
                debug = true;
            } else {
                debug = false;
            }

            var lowQuality = attrs["lowQuality"];
            if (lowQuality !== undefined && lowQuality !== null && lowQuality === "true") {
                lowQuality = true;
            } else {
                lowQuality = false;
            }

            var categories = {};
            var selected = "";
            var i, j, t1, t2, category, element;
            var svg = d3.select($element[0]);
            var textGroup = svg.append("g");
            var dotGroup = svg.append("g").attr("fill", "white");
            var totalText = svg.append("text").text(total);
            var selectColor = "#29abe2";
            var baseFontHeight = 12;
            var basePadding = 5;
            var cellHeight = baseFontHeight + basePadding + basePadding;
            var total = $scope.ngModel.length;
            var totalWidth = Math.floor((total + "").length * baseFontHeight * 0.75);
            var currentElements = [];
            var emptyArray = [];
            var currentElementsDim = [0, 0, 1, 1];
            var elementsDim = [0, 0];

            // An index of function for sorted arrays. This allows for a major speed boost.
            var indexOfSortedDesc = function (array, check) {
                var min = 0;
                var max = array.length - 1;
                var center, value;

                while (min <= max) {
                    center = (min + max) >> 1;
                    value = array[center];

                    if (check > value) {
                        max = center - 1;
                    } else if (check < value) {
                        min = center + 1;
                    } else {
                        return center;
                    }
                }

                return -1;
            };

            var clickCategory = function (categoryName, textField) {
                var d, hDots, vDots;
                var innerRad, rad, pad, d, x, y, element;
                var div1, div2;
                //var elements = dotGroup.selectAll("circle")[0];
                var elements = dotGroup.node().children;

                textGroup.selectAll("g").selectAll("text")
                        .transition()
                        .attr({
                            "font-size": baseFontHeight + "px",
                            fill: "white"
                        });

                textField.transition()
                        .attr({
                            "font-size": cellHeight + "px",
                            fill: selectColor
                        });

                var categoryList = emptyArray; // Used to avaoid the recration of arrays.

                if (categoryName !== "") {
                    categoryList = categories[categoryName];
                }

                // Find all elements to return
                i = currentElements.length - 1;
                if (i >= 0) {
                    do {
                        j = currentElements[i];
                        if (indexOfSortedDesc(categoryList, j) < 0) {
                            element = d3.select(elements[j]);
                            x = element.attr("ox");
                            y = element.attr("oy");
                            rad = element.attr("or");

                            if (lowQuality) {
                                element.transition()
                                        .duration(500)
                                        .attr({
                                            cy: y,
                                            r: rad,
                                            fill: "white",
                                            cx: x
                                        });
                            } else {
                                t1 = Math.max(Math.abs((parseFloat(element.attr("cy")) - parseFloat(y)) / elementsDim[1]) * 500, 50);
                                t2 = Math.max(Math.abs((parseFloat(element.attr("cx")) - parseFloat(x)) / elementsDim[0]) * 500, 50);

                                element.transition()
                                        .duration(t1)
                                        .attr({
                                            cy: y,
                                            r: rad,
                                            fill: "white"
                                        })
                                        .transition()
                                        .duration(t2)
                                        .attr({
                                            cx: x
                                        });
                            }
                        }
                    } while (i--);
                }

                // Move elements to new location
                currentElements = categoryList;
                d = bestSquare(currentElementsDim[2], currentElementsDim[3], currentElements.length);
                hDots = Math.floor(currentElementsDim[2] / d);
                vDots = Math.floor(currentElementsDim[3] / d);

                rad = d >> 1;
                pad = Math.floor(rad * 0.25);
                innerRad = rad - pad;

                i = currentElements.length - 1;
                for (var v = 0; v < vDots; ++v) {
                    for (var u = 0; u < hDots; ++u) {
                        if (i >= 0) {
                            j = currentElements[i];
                            element = d3.select(elements[j]);

                            x = (u * d) + rad + currentElementsDim[0];
                            y = (v * d) + rad + currentElementsDim[1];

                            if (lowQuality) {
                                element.transition()
                                        .duration(500)
                                        .attr({
                                            cy: y,
                                            fill: selectColor,
                                            r: innerRad,
                                            cx: x
                                        });
                            } else {
                                t1 = Math.max(Math.abs((parseFloat(element.attr("cy")) - parseFloat(y)) / elementsDim[1]) * 500, 50);
                                t2 = Math.max(Math.abs((parseFloat(element.attr("cx")) - parseFloat(x)) / elementsDim[0]) * 500, 50);

                                element.transition()
                                        .duration(t1)
                                        .attr({
                                            cy: y,
                                            fill: selectColor,
                                            r: innerRad
                                        })
                                        .transition()
                                        .duration(t2)
                                        .attr({
                                            cx: x
                                        });
                            }

                            --i;
                        }
                    }
                }

                i = categoryName !== "" ? currentElements.length : total;
                /*totalText.data(i)
                 .transition()
                 .duration(1000)
                 .tween("text", function (d) {
                 var value = d3.interpolate(this.textContent, d);
                 
                 return function (t) {
                 this.textContent = Math.round(value(t));
                 };
                 });*/
                totalText.text(i);
            };

            var writeCategory = function (index, category) {
                var isSelected = category.id === selected;
                var fontHeight = (isSelected ? cellHeight : baseFontHeight);
                var padding = isSelected ? 0 : basePadding;
                var count = category.name !== "" ? categories[category.id].length : total;

                var g = textGroup.append("g")
                        .attr({
                            transform: "translate(0, " + (index * cellHeight) + ")",
                            fill: "white"
                        });

                var countText = g.append("text")
                        .attr({
                            x: 0,
                            y: cellHeight,
                            width: totalWidth,
                            "font-size": baseFontHeight + "px"
                        })
                        .text(count);

                var text = g.append("text")
                        .attr({
                            x: totalWidth + basePadding,
                            y: cellHeight,
                            "font-size": fontHeight + "px"
                        })
                        .text(category.name === "" ? "All" : category.name);

                if (isSelected) {
                    text.attr("fill", selectColor);
                }

                g.style("cursor", "pointer");
                g.on("click", function () {
                    clickCategory(category.id, text);
                });

                return g;
            };

            var bestSquare = function (width, height, n) {
                // Solution obtained from http://stackoverflow.com/questions/6463297/algorithm-to-fill-rectangle-with-small-squares
                var hi = Math.max(width, height);
                var lo = 0.0;
                var mid, midVal;
                while (Math.abs(hi - lo) > 0.5) {
                    mid = (lo + hi) / 2.0;
                    midVal = Math.floor(width / mid) * Math.floor(height / mid);
                    if (midVal >= n) {
                        lo = mid;
                    } else {
                        hi = mid;
                    }
                }

                return Math.min(width / Math.floor(width / lo), height / Math.floor(height / lo));
            };

            var createDot = function (index, x, y, r) {
                var element = $scope.ngModel[index];
                var dot = dotGroup.append("circle")
                        .attr({
                            cx: x,
                            cy: y,
                            r: r,
                            ox: x,
                            oy: y,
                            or: r,
                            fill: "white",
                            name: "dot_" + index
                        });

                dot.style("cursor", "pointer");
                dot.on("click", function () {
                    $scope.elementClick(element);
                });
            };

            var createDots = function (width, height) {
                if (debug) {
                    dotGroup.append("rect")
                            .attr({
                                width: width,
                                height: height,
                                fill: "red"
                            });
                }

                var innerRad, rad, pad, x, y;
                var d = bestSquare(width, height, total);
                var hDots = Math.floor(width / d);
                var vDots = Math.floor(height / d);

                rad = d >> 1;
                pad = Math.floor(rad * 0.25);
                innerRad = rad - pad;

                i = 0;
                for (var v = 0; v < vDots; ++v) {
                    for (var u = 0; u < hDots; ++u) {
                        if (i < total) {
                            x = (u * d) + rad;
                            y = (v * d) + rad;

                            createDot(i, x, y, innerRad);

                            ++i;
                        }
                    }
                }
            };

            var resize = function () {
                var width = $element.attr("width");
                var height = $element.attr("height");

                if (width === undefined || width === null) {
                    width = $element.width();
                }

                if (height === undefined || height === null) {
                    height = $element.height();
                }

                $element.innerHtml = "";

                // Add all of the text
                writeCategory(0, {id: "", name: ""});
                i = $scope.categoryList.length - 1;
                
                while ( i-- < 0) {
                    writeCategory(i + 1, $scope.categoryList[i]);
                }

                // Calculate placement
                var textTop = height - textGroup.node().getBBox().height;
                textGroup.attr("transform", "translate(0, " + textTop + ")");

                // Calculate the location of the tool circles.
                var heightSpace = textTop >> 1;

                currentElementsDim[0] = 0;
                currentElementsDim[1] = heightSpace;
                currentElementsDim[2] = width;
                currentElementsDim[3] = textTop - heightSpace;

                elementsDim[0] = width;
                elementsDim[1] = textTop;

                if (debug) {
                    dotGroup.append("rect")
                            .attr({
                                x: currentElementsDim[0],
                                y: currentElementsDim[1],
                                width: currentElementsDim[2],
                                height: currentElementsDim[3],
                                fill: "blue"
                            });
                }

                createDots(width, heightSpace);

                // Create the total text
                totalText.attr({
                    x: width,
                    y: height,
                    "text-anchor": "end",
                    "font-size": 48,
                    fill: selectColor
                }).text(total);
            };

            // Initialize the system
            i = $scope.categoryList.length - 1;
            console.log(i);
            
            while (i > 0) {
              category = $scope.categoryList[i];
              categories[category.id] = [];
              --i;
            }

            i = total - 1;
            while (i > 0) {
              element = $scope.ngModel[i];
              category = element[attrs["elementCategories"]];
              j = category.length - 1;
              if (j >= 0) {
                  do {
                      categories[category[j]].push(i);
                  } while (j--);
              }
              --i;
            } 

            resize();
        }
    };
});