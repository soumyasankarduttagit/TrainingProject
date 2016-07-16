/*--------------------------------------------------------------------------------------------
	Defining function for rendering chart.
	This function is the starting point of Renderining visual elements.
----------------------------------------------------------------------------------------------
*/

//	@entireChartObject is an input parameter of internal chart Object.
function renderEngine(entireChartObject)
	{

	var computedChartObject=entireChartObject;
	//Calculating chart height.
	var chartheight=400;
	// entireChartObject.chartobject.chartHeight;
	//Calculating chart width.
	var chartwidth=800; 
	//entireChartObject.chartobject.chartWidth;
	//Calculating number of charts to be rendered according to internal data structure.
	var numOfChart = computedChartObject.chartobject.plot.length;
	// Getting Plot data from internal data structure.
	var plot = computedChartObject.chartobject.plot;
	//Getting caption value.
	var caption = computedChartObject.chartobject.chartCaption;
	//Getting sub-caption value.
	var subCaption = computedChartObject.chartobject.chartSubCption;
	//Rendering Caption and sub caption.
	document.getElementById("caption").innerHTML=caption;
	document.getElementById("subcaption").innerHTML=subCaption;
	//Rendering graphical elements according to the number of chart created from internal data structure.
	for(var i=0;i<numOfChart;i++)
		{
			//Local variable to hold X-Axis Tick values.
			var numOfXTick = computedChartObject.xaxistickvalues.numOfTickValues;
			//Local variable to hold Y-Axis details.
			var yTickDetails = computedChartObject.yaxistickvaluesdetails.yAxisTickValues[i];
			//Local variable to hold Y-Axis Title.
			var yTitle= computedChartObject.chartobject.plot[i].plotyAxisTitle;
			//Locl variable to hold X-Axis labels.
			var xLabels= computedChartObject.xaxistickvalues.xAxisLabels;
			//Local variable to hold X-Axis name.
			var xTitle = computedChartObject.chartobject.xaxisName;
			//Putting Plot information inside an array.
			var plotData= plot[i].data;
			//calling function for rendering all Data-Visualization items
			svgCreate(chartheight,chartwidth,numOfXTick,xLabels,yTickDetails,yTitle,xTitle,plotData,i,numOfChart);
		}			
	}
/*
-----------------------------------------------------------------------------------------------
	@parseJson() resposible for parsing external JSON structure to an internal JSON structure.
	@json input after after asynchronously loading JSON data from external JSON file.
-----------------------------------------------------------------------------------------------
*/
function parseJsonData(json)
	{
	/*
	Creation of intermidiate object to hold converted multi-variate data set
	and this calculation will be done from this intermidiate object for rendering purpose.

	*/
	var chartObject = new Object();
	//attributes defined for intermidiate object.
	var dataValueProperties = Object.keys(json.dataValues);
	var numberOfCharts = dataValueProperties.length-1;
	chartObject.chartCaption=json.dataCosmetics.caption;
	chartObject.chartSubCption=json.dataCosmetics.subCaption;
	chartObject.xaxisName= dataValueProperties[0];
	chartObject.plot = new Array();
    //chartObject.chartHeight= json.dataCosmetics.height;
    // chartObject.chartWidth= json.dataCosmetics.width;
	for(var index=1;index<=numberOfCharts;index++)
	{
		var plotData = new Object();
		var xAxisData = json.dataValues[chartObject.xaxisName].split(",");
		var yAxisData = json.dataValues[dataValueProperties[index]].split(",");
		plotData.plotyAxisTitle= dataValueProperties[index];
		plotData.data = new Array();
		for(var interIndex=0; interIndex<xAxisData.length&&interIndex<yAxisData.length;interIndex++)
		{
			if((xAxisData[interIndex]===""||xAxisData[interIndex]===null|| typeof xAxisData[interIndex]===undefined)||(yAxisData[interIndex]===""||yAxisData[interIndex]===null|| typeof yAxisData[interIndex]===undefined)||typeof yAxisData[interIndex]===NaN)
			{
				continue;
			}
			else
			{
				var dataValue = new Object();
				dataValue.label=xAxisData[interIndex];
				dataValue.value=yAxisData[interIndex];
				plotData.data.push(dataValue);
			}
		}
		chartObject.plot.push(plotData);

	}
	// declaring variable to hold chart-caption , Sub-Caption, X-Axis label, time values.
  

	//holding the different charts value for the newly created object and storing it in plot attribute as an array.
	

	/*
	Declaration of object for holding  X-Axis tick values
	such as number of tick values and value of tick labels.
	*/
	var xAxisTick = new Object();
	// Defining attributes for holding number of tick values and label values for XAxis.
	xAxisTick.numOfTickValues=0;
	xAxisTick.xAxisLabels = new Array();
	//Fetching number of tick values and labels for all x axis values.
	getXAxisTicks(chartObject,xAxisTick);
	//Logging xAxisTick Value
	//console.log(xAxisTick);
	//Declaration of object to store Y-Axis Tick Details
	var yAxisTickDetails = new Object();
	//Declaration of Object to store individual chart Y-Axis Details
 	yAxisTickDetails.yAxisTickValues = new Array();
 	//Declaration of loop to iterate within different plot
 	for(var j =0; j<chartObject.plot.length;j++){
			var minYAxisValue,maxYAxisValue;
			var yAxisValues = new Array();
			for(var i=0;i<chartObject.plot[j].data.length;i++)
			{
				yAxisValues.push(chartObject.plot[j].data[i].value);
			}
			//Calculation of maximum and minimum of Y-Axis values
			minYAxisValue= Math.min.apply(this,yAxisValues);
			maxYAxisValue= Math.max.apply(this,yAxisValues);
			//Creation of Tick Object to store individual chart Y-Axis tick values
			var yAxisTick = new Object();
 			yAxisTick.numOfYTickValues;
 			//Declaration of Array to hold different divline(tick) values
			yAxisTick.DivLineValues= new Array();
 			//Defining an array to hold different divline(tick) values.
			yAxisTick.DivLineValues= new Array();
			yAxisTick.stepValue;
			yAxisTick.niceMaxExactDivValue;
 			yAxisTick.niceMinExactDivValue;
			getYAxisTicks(maxYAxisValue,minYAxisValue,yAxisTick);
			yAxisTickDetails.yAxisTickValues.push(yAxisTick);
	}

		//Creating another chart object to pass in render-engine
	    var entireChartObject = new Object();
		entireChartObject.chartobject = chartObject;
		entireChartObject.xaxistickvalues= xAxisTick;
		entireChartObject.yaxistickvaluesdetails= yAxisTickDetails;
		//calling render-engine
		renderEngine(entireChartObject);
	}
/*
	--------------------------------------------------------------------------------------------
	Function for getting number of tick values and labels for all x axis values.
	@chartObject-> Internal data structure parsed from external Json structure.
	--------------------------------------------------------------------------------------------
*/
function getXAxisTicks(chartObject,xAxisTick)
	{
	for(var i=0;i<chartObject.plot[0].data.length;i++)
	{
  		 xAxisTick.xAxisLabels.push(chartObject.plot[0].data[i].label);
   		xAxisTick.numOfTickValues++;
	}
	}
/*
	@round() to calculate round up-to nth different decimal place
*/
function round(value, precision) 
	{
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
	}
/*---------------------------------------------------------------------------------------------
 	Fuction for calculating Y-Axis Tick Values it will take maximum and minimum yAxis value and defined tick object
 ----------------------------------------------------------------------------------------------
 */
function getYAxisTicks(maxYAxisValue,minYAxisValue,yAxisTick)
	{
	
	var maxValue = maxYAxisValue;
	var minValue = minYAxisValue;
	var rangeval = maxValue-minValue;
	var noOfStep = 6;
	//Calling function for calculating nice step values.
	var niceRange = calculateNiceStepSize(rangeval,noOfStep);
	exactNiceMaxValue= niceRange*Math.ceil(maxValue/niceRange);
	exactNiceMinValue=niceRange* Math.floor(minValue/niceRange);
	//Array defination to hold Y-Axis divline properties
	var divLineValues = new Array();
	var stepValue=(exactNiceMaxValue-exactNiceMinValue)/6;
	divLineValues.push(exactNiceMinValue);
	for(var k =1;k<6;k++)
	{
		//checking whether the value only has fractional part
		if(Math.floor(exactNiceMinValue)===0)
		{
			//inserting values in an array
			divLineValues.push(round((exactNiceMinValue+(k*stepValue)),3));
		}
		else
		{
			//inserting values inside an array
			divLineValues.push(round((exactNiceMinValue+(k*stepValue)),0));
		}
	}
	//inserting values inside an array.
	divLineValues.push(exactNiceMaxValue);
	//Assigning calculated Y-Axis div-line properties into yAxisTick object.
	yAxisTick.niceMaxExactDivValue=exactNiceMaxValue;
 	yAxisTick.niceMinExactDivValue= exactNiceMinValue;
	yAxisTick.stepValue=stepValue;
	//assigning different divline(tick) values.
	//Storing divline(tick) values in the yAxisTick object property.
 	yAxisTick.DivLineValues=divLineValues;
 	yAxisTick.numOfYTickValues=divLineValues.length;
	}
/*---------------------------------------------------------------------------------------------
	@calculateNiceStepSize -> calculating nice step values for Y-Axis values.
	-------------------------------------------------------------------------------------------
*/

var calculateNiceStepSize = function(range, noOfSteps)
	{
	var ln10 = Math.log(10);
  // calculate an initial guess at step size
  var tempStep = range / noOfSteps;

  // get the magnitude of the step size
  var magnitude = Math.floor(Math.log(tempStep) / ln10);
  var magPow = Math.pow(10, magnitude);

  // calculate most significant digit of the new step size
  var magMsd = Math.round(tempStep / magPow + 0.5);

  // promote the MSD to either 1, 2, or 5
  if (magMsd > 5.0)
    magMsd = 10.0;
  else if (magMsd > 2.0)
    magMsd = 5.0;
  else if (magMsd > 1.0)
    magMsd = 2.0;

  return magMsd * magPow;
	};
/*---------------------------------------------------------------------------------------------
	@svgCreate() Function responsible for creating and rendering  all SVG objects.
	input parameters 
	@chartheight -> Indivudual SVG height.
	@chartwidth  -> Individual SVG width.
	@numOfXTick  -> Number of X-Axis Ticks.
	@xLabels     -> Array of X-Axis Labels.
	@yTickDetails-> Array of Y-Axis Ticks.
	@yTitle      -> Title of Y-Axis.
	@xTitle 	 -> Title of X-Axis.
-----------------------------------------------------------------------------------------------
*/
function svgCreate(chartheight,chartwidth,numOfXTick,xLabels,yTickDetails,yTitle,xTitle,plotData,i,numOfChart)
			{
				//variable declarations for X-Axis and Y-Axis.
				var height =chartheight;
				var width = chartwidth;
				var l1x1val = width/3;
 			 	var l1x2val = width/3;
 			 	var l1y1val = 0;
 			 	var l1y2val = (height*2)/3;
 				var l2x1val= width/3;
 			 	var l2x2val= width-10;
 			 	var l2y1val= (height*2)/3;
 				var l2y2val = (height*2)/3;
 				if(height<width)
 				{
 			 		hfontsize = height/24;
 			 	}
 			 	else if(height==width)
 			 	{
 			 		hfontsize = height/24;
 			 	}
 			 	else
 			 	{
 			 		hfontsize=width/24;
 			 	}
 			 	
				var div = document.createElement("div");
				div.classList.add("chartContainer");
				var xCordArr = new Array();
				var yCordarr = new Array();
				//Defining array to hold all plot-slice attribute values.
				var plotSliceCollection = new Array();
				//Declaring SVG namespace.
				var NS="http://www.w3.org/2000/svg";
				//Creation of SVG object
				var svg=document.createElementNS(NS,"svg");
 				 svg.setAttributeNS(null,"height",height+"px");
 				 svg.setAttributeNS(null,"width",width+"px");
 				 svg.setAttributeNS(null,"class","chart");
 				 //creating Y-Axis
				var line = document.createElementNS(NS,"line");
				line.setAttributeNS(null,"x1",l1x1val);
				line.setAttributeNS(null,"x2",l1x2val);
				line.setAttributeNS(null,"y1",l1y1val);
				line.setAttributeNS(null,"y2",l1y2val);
				line.setAttributeNS(null,"stroke","#202020");
				line.setAttributeNS(null,"stroke-width",5);
				line.setAttributeNS(null,"class","xAxis");
				svg.appendChild(line);
				//Creating X-Axis
				var line1 = document.createElementNS(NS,"line");
				line1.setAttributeNS(null,"x1",l2x1val);
				line1.setAttributeNS(null,"x2",l2x2val);
				line1.setAttributeNS(null,"y1",l2y1val);
				line1.setAttributeNS(null,"y2",l2y2val);
				line1.setAttributeNS(null,"stroke","#202020");
				line1.setAttributeNS(null,"stroke-width",5);
				line1.setAttributeNS(null,"class","yAxis");
				svg.appendChild(line1);
				//Rendering X-Axis and Y-Axis titles
				if(i==numOfChart-1)
					{
				
						var text = document.createElementNS(NS,"text");
						text.setAttributeNS(null,"x",(width*5)/8);
						text.setAttributeNS(null,"y",(19*height)/20);
						text.setAttributeNS(null,"fill", "#000000");
						text.style.fontSize=hfontsize;
						text.textContent = xTitle;
						text.setAttributeNS(null,"class","xAxisTitle");
						svg.appendChild(text);
					}
				var text1 = document.createElementNS(NS,"text");
				var w =width/10;
				var h = (height)/3;
				text1.setAttributeNS(null,"x",w);
				text1.setAttributeNS(null,"y",h);
				text1.setAttributeNS(null,"fill", "#000000");
				text1.setAttributeNS(null,"transform","rotate(180 125 180)");
				text1.style.fontSize=hfontsize;
				text1.textContent = yTitle;
				svg.appendChild(text1);
				text1.classList.add("yAxisTitle");
				var divLineValues= yTickDetails.DivLineValues;
				var niceMaxDivLineValues = yTickDetails.niceMaxExactDivValue;
				var niceMinDivLineValue = yTickDetails.niceMinExactDivValue;
				var numTickValue= yTickDetails.numOfYTickValues;
				var stepValue = yTickDetails.stepValue;
				//Rendering Tick values
				for(var k =0;k<=divLineValues.length;k++)
				{
					var divLineValue= divLineValues[k];
					var step =(l1y2val-l1y1val)/numTickValue;
					var divln = document.createElementNS(NS,"line");
					divln.setAttributeNS(null,"x1",l2x1val-5);
					divln.setAttributeNS(null,"x2",l2x2val);
					divln.setAttributeNS(null,"y1",l2y1val-(k*step));
					divln.setAttributeNS(null,"y2",l2y1val-(k*step));
					divln.setAttributeNS(null,"stroke","#202020");
					divln.setAttributeNS(null,"stroke-width",1);
					svg.appendChild(divln);
					var divrect = document.createElementNS(NS,"rect");
					divrect.setAttributeNS(null,"x",l2x1val);
					divrect.setAttributeNS(null,"y",l2y1val-(k*step));
					divrect.setAttributeNS(null,"width",l2x2val-l2x1val);
					divrect.setAttributeNS(null,"height",(l1y2val-l1y1val)/numTickValue);
					divrect.setAttributeNS(null,"stroke","#ffffff");
					if(k%2==0)
					divrect.setAttributeNS(null,"fill","#ffffff");
					else
					divrect.setAttributeNS(null,"fill","#f5f5ef");
					divrect.setAttributeNS(null,"stroke-width",0);
					svg.appendChild(divrect);
					divln.classList.add("yAxisDivLine");
					var yLabel = document.createElementNS(NS,"text");
					yLabel.setAttributeNS(null,"x",width/4);
					yLabel.setAttributeNS(null,"y",l2y1val-(k*step));
					yLabel.setAttributeNS(null,"fill", "#000000");
					yLabel.style.fontSize=hfontsize;
					yLabel.textContent = valueNormalizer(divLineValue);
					yLabel.classList.add("yAxisLabels");
					svg.appendChild(yLabel);
					var yMapping = new Object();
					yMapping.yCordinate= l2y1val-(k*step);
					yMapping.value= divLineValues[k];
					yCordarr.push(yMapping);	

				}
				var chartRectangle = document.createElementNS(NS,"rect");
				chartRectangle.setAttributeNS(null,"x",l2x1val);
				chartRectangle.setAttributeNS(null,"y",l1y1val);
				chartRectangle.setAttributeNS(null,"width",(l2x2val-l2x1val)+10);
				chartRectangle.setAttributeNS(null,"height",(l1y2val-l1y1val));
				//chartRectangle.setAttributeNS(null,"fill","#202020");
				chartRectangle.setAttributeNS(null,"class","rect");
				svg.appendChild(chartRectangle);
				for(var j=0;j<(numOfXTick);j++)
				{
					var step = (l2x2val - l2x1val)/(numOfXTick-1);
					var xTick =document.createElementNS(NS,"line");
					xTick.setAttributeNS(null,"x1",l2x1val+(j*step));
					xTick.setAttributeNS(null,"x2",l2x1val+(j*step));
					xTick.setAttributeNS(null,"y1",(height*2)/3);
					xTick.setAttributeNS(null,"y2",(height*7)/10);
					xTick.setAttributeNS(null,"stroke","#202020");
					xTick.setAttributeNS(null,"stroke-width",2);
					xTick.classList.add("xAxisDivLine");
					var tickCordinate = new Object();
					tickCordinate.X= l2x1val+(j*step);
					tickCordinate.Y= (height*7)/10;
					var xMapping = new Object();
					xMapping.xCordinate;
					xMapping.Value;
					var xLabel = createXLabel(j,tickCordinate,xLabels,xMapping,hfontsize);
					xCordArr.push(xMapping);
					svg.appendChild(xTick);
					if(i==numOfChart-1)
					{
						svg.appendChild(xLabel);
					}
				}
				for(var t =0,u=1;t<yCordarr.length-1;t++,u++)
				{
					var plotSlice = new Object();
					plotSlice.minValue= yCordarr[t].value;
					plotSlice.maxValue= yCordarr[u].value;
					plotSlice.minCordinate= yCordarr[t].yCordinate;
					plotSlice.maxCordinate= yCordarr[u].yCordinate;
					plotSliceCollection.push(plotSlice);

				}
				//Drawing Data-plot anchors
				var plotCircles =drawPlot(xCordArr,yCordarr,plotSliceCollection,plotData);
				//console.log(plotCircles.length);
				var prevX=0;
				var prevY=0;
				for(var c =0;c<plotCircles.length;c++)
				{ 
					var plotCircle = document.createElementNS(NS,"circle");
					plotCircle.setAttributeNS(null, "cx", plotCircles[c].x);
					plotCircle.setAttributeNS(null, "cy", plotCircles[c].y);
					plotCircle.setAttributeNS(null, "r",  width/100);
					plotCircle.setAttributeNS(null, "fill", "green");
					var toolTip = document.createElementNS(NS, "title"); 
                    toolTip.setAttributeNS(null, "class", "plotToolTip"); 
                    toolTip.innerHTML =plotCircles[c].yValue; 
                    plotCircle.setAttributeNS(null,"class","plotDots");
                    plotCircle.appendChild(toolTip); 
					svg.appendChild(plotCircle);
					if((prevX!=0)&&(prevY!=0))
					{
						var linkLine = document.createElementNS(NS,"line");
						linkLine.setAttributeNS(null,"x1",prevX);
					 	linkLine.setAttributeNS(null,"x2",plotCircles[c].x);
						linkLine.setAttributeNS(null,"y1",prevY);
						linkLine.setAttributeNS(null,"y2",plotCircles[c].y);
						linkLine.setAttributeNS(null,"stroke","green");
						linkLine.setAttributeNS(null,"id","linkline");
						linkLine.classList.add("plotLines");
						svg.appendChild(linkLine);
					}
					prevX=plotCircles[c].x;
					prevY= plotCircles[c].y;
					
				}
				div.appendChild(svg);
				document.body.appendChild(div);

				//@crossLineCustomEventHandler -> function for propagating custom events and other events on chart.
				crossLineCustomEventHandler(document.getElementsByClassName("rect"),plotCircles);
				
			}
/*
	@crossLineCustomEventHandler() -> propagating and handling all events intiated within the chart.
	@listOfCharts -> colection of SVG rectangle created.
*/
function crossLineCustomEventHandler(listOfCharts,plotCircles)
	{
		for(var charts of listOfCharts)
			{
				//event handler for mousemove event.
				charts.addEventListener("mouseenter",function(event)
					{
						//@intializeCrossHeir -> custom event for creating crossheir in all other charts.
						var initializeCrossHeir = new CustomEvent("InitializeCrossHeir",{detail:event.clientX});
							for(var chart of listOfCharts)
								{
									if(chart!==event.target)
									{
										chart.dispatchEvent(initializeCrossHeir);
									}
								}
						var svgheight = parseInt(event.target.getAttributeNS(null,"x"));
						var svgwidth = parseInt(event.target.getAttributeNS(null,"y"));
						var NS="http://www.w3.org/2000/svg";
						var cross = document.createElementNS(NS,"line");
						cross.setAttributeNS(null,"x1",svgwidth);
						cross.setAttributeNS(null,"x2",svgwidth);
						cross.setAttributeNS(null,"y1",0);
						cross.setAttributeNS(null,"y2",svgheight);
						cross.setAttributeNS(null,"stroke","red");
						cross.setAttributeNS(null,"class","cross");
						cross.setAttributeNS(null,"id","ii");
						event.target.parentNode.appendChild(cross);
						var toolTipRectangle = document.createElementNS(NS,"rect");
						toolTipRectangle.setAttributeNS(null,"x",svgwidth/3);
						toolTipRectangle.setAttributeNS(null,"y",svgheight);
						toolTipRectangle.setAttributeNS(null,"width",95);
						toolTipRectangle.setAttributeNS(null,"height",35);
						toolTipRectangle.setAttributeNS(null,"fill","#ffb3b3");
						toolTipRectangle.setAttributeNS(null,"id","rec");
						toolTipRectangle.setAttributeNS(null,"class","rectHide");
						var toolTipText = document.createElementNS(NS,"text");
						toolTipText.setAttributeNS(null,"x",svgwidth/3);
						toolTipText.setAttributeNS(null,"y",svgheight);
						toolTipText.setAttributeNS(null,"id","text");
						//toolTipText.textContent="helo";
						toolTipText.setAttributeNS(null,"class","tooTipHide");
						event.target.parentNode.appendChild(toolTipRectangle);
						event.target.parentNode.appendChild(toolTipText);
					
					},false);

					charts.addEventListener("InitializeCrossHeir",function(event)
					{
						var svgheight = parseInt(event.target.getAttributeNS(null,"x"));
						var svgwidth = parseInt(event.target.getAttributeNS(null,"y"));
						var NS="http://www.w3.org/2000/svg";
						var cross = document.createElementNS(NS,"line");
						cross.setAttributeNS(null,"x1",svgwidth);
						cross.setAttributeNS(null,"x2",svgwidth);
						cross.setAttributeNS(null,"y1",0);
						cross.setAttributeNS(null,"y2",svgheight);
						cross.setAttributeNS(null,"stroke","red");
						cross.setAttributeNS(null,"class","cross");
						cross.setAttributeNS(null,"id","ii");
						event.target.parentNode.appendChild(cross);
						var toolTipRectangle = document.createElementNS(NS,"rect");
						toolTipRectangle.setAttributeNS(null,"x",svgwidth);
						toolTipRectangle.setAttributeNS(null,"y",svgheight);
						toolTipRectangle.setAttributeNS(null,"width",95);
						toolTipRectangle.setAttributeNS(null,"height",35);
						toolTipRectangle.setAttributeNS(null,"fill","#ffb3b3");
						toolTipRectangle.setAttributeNS(null,"id","rec");
						toolTipRectangle.setAttributeNS(null,"class","rectHide");
						var toolTipText = document.createElementNS(NS,"text");
						toolTipText.setAttributeNS(null,"x",svgwidth/3);
						toolTipText.setAttributeNS(null,"y",svgheight);
						toolTipText.setAttributeNS(null,"id","text");
						toolTipText.setAttributeNS(null,"class","toolTipHide");
						event.target.parentNode.appendChild(toolTipRectangle);
						event.target.parentNode.appendChild(toolTipText);
					});
				charts.addEventListener("mousemove",function(event)
					{
						var crossHeirMove = new CustomEvent("CrossHeirMove",{detail:{mousex:event.clientX,mousey:event.clientY}});
						for(var chart of listOfCharts)
							{
								if(chart!==event.target)
									{
										chart.dispatchEvent(crossHeirMove);
									}
							}

						var svgheight = parseInt(event.target.getAttributeNS(null,"x"));
						var svgwidth = parseInt(event.target.getAttributeNS(null,"y"));
						var ee = event.clientX;
						var rec = event.currentTarget.parentNode.getElementById("rec");
						var ttext = event.currentTarget.parentNode.getElementById("text");
						var tool = event.currentTarget.parentNode.getElementsByClassName("plotToolTip");
						for(var t of tool)
							{

								if(event.currentTarget.parentNode === t.parentNode.parentNode)
									{
										
										if(ee-9=== Math.round(t.parentNode.getAttributeNS(null,"cx")))
										{
											
											rec.setAttributeNS(null,"x",t.parentNode.getAttributeNS(null,"cx"));
											rec.setAttributeNS(null,"y",t.parentNode.getAttributeNS(null,"cy")-20);
											rec.setAttributeNS(null,"fill","#ffb3b3");
											rec.setAttributeNS(null,"class","rectShow");
											ttext.setAttributeNS(null,"x",t.parentNode.getAttributeNS(null,"cx"));
											ttext.setAttributeNS(null,"y",t.parentNode.getAttributeNS(null,"cy"));
											ttext.setAttributeNS(null,"class","toolTipShow");
											ttext.textContent= t.innerHTML;
											console.log(ee+"   "+t.innerHTML);
											
										}
										else
										{
											//rec.setAttributeNS(null,"class","rectHide");
											//ttext.setAttributeNS(null,"class","toolTipHide");
										}

										
									}
							}
							var cross = document.getElementsByClassName("cross");
						for(var c of cross)
							{

								c.setAttributeNS(null,"x1",ee-10);
								c.setAttributeNS(null,"x2",ee-10);
								
							}
					
				},false);
					charts.addEventListener("CrossHeirMove",function(event){
					var svgheight = parseInt(event.target.getAttributeNS(null,"x"));
					var svgwidth = parseInt(event.target.getAttributeNS(null,"y"));
					
					var ee = event.detail.mousex;
					var yy = event.detail.mousey;
					
					if(charts!=event.source)
						{
							var rec = event.currentTarget.parentNode.getElementById("rec");
							var ttext = event.currentTarget.parentNode.getElementById("text");
							
								var tool = event.currentTarget.parentNode.getElementsByClassName("plotToolTip");
						for(var t of tool)
							{

								if(event.currentTarget.parentNode === t.parentNode.parentNode)
									{
										if(ee-9=== Math.round(t.parentNode.getAttributeNS(null,"cx")))
										{
											rec.setAttributeNS(null,"x",t.parentNode.getAttributeNS(null,"cx"));
											rec.setAttributeNS(null,"y",t.parentNode.getAttributeNS(null,"cy")-20);
											rec.setAttributeNS(null,"fill","#ffb3b3");
											rec.setAttributeNS(null,"class","rectShow");
											ttext.setAttributeNS(null,"x",t.parentNode.getAttributeNS(null,"cx"));
											ttext.setAttributeNS(null,"y",t.parentNode.getAttributeNS(null,"cy"));
											//ttext.setAttributeNS(null,"fill","#ffb3b3");
											ttext.setAttributeNS(null,"class","toolTipShow");
											ttext.textContent= t.innerHTML;
											console.log(ee+"   "+t.innerHTML);
										}
										else
										{
											//rec.setAttributeNS(null,"class","rectHide");
											//ttext.setAttributeNS(null,"class","toolTipHide");
										}
										
									}

							}
							var cross = document.getElementsByClassName("cross");
							for(var c of cross)
								{

									c.setAttributeNS(null,"x1",ee-1);
									c.setAttributeNS(null,"x2",ee-1);
									//c.setAttributeNS(null,"y1",0);
									//c.setAttributeNS(null,"y2",svgwidth/3);
								}
					}});
					charts.addEventListener("mouseleave",function(event)
				{




					var cross = event.currentTarget.parentNode.getElementById("ii");
					var rec = event.currentTarget.parentNode.getElementById("rec");
					var ttext = event.currentTarget.parentNode.getElementById("text");
						//	for(var c of cross)
						//{
						//	if(c.parentNode===event.target.parentNode)
						//	{
							if(cross)
								event.currentTarget.parentNode.removeChild(cross);
							if(rec)
							event.currentTarget.parentNode.removeChild(rec);
							if(ttext)
								event.currentTarget.parentNode.removeChild(ttext);
							//}
						//}
					
					//cross.setAttributeNS(null,"stroke","blue");
					//var cross = document.getElementById("ii");
						//	for(var c of cross)
						//{
						//if(c.parentNode===event.target.parentNode)
						//	{
							//	cross.setAttributeNS(null,"class","crossHide");
						//	if(cross)
						//	{
						//		event.target.parentNode.removeChild(cross);
						//	}
						//	}
						//}
					var crossHeirDisappear = new CustomEvent("DisapearCrossHeir",{detail:event.clientX});
					for(var chart of listOfCharts)
					{
						if(chart!==event.target)
						{
							event.target.dispatchEvent(crossHeirDisappear);
						}
					}
					
				});
					charts.addEventListener("DisapearCrossHeir", function(event){
						//if(event.target!=event.source)
						//{
							/*var cross = document.getElementsByClassName("cross");
							for(var c of cross)
						{
							if(c.parentNode===event.target.parentNode)
							{
								event.target.parentNode.removeChild(c);
							}
						}*/
						var cross = event.currentTarget.parentNode.getElementById("ii");
						//	for(var c of cross)
						//{
						//	if(c.parentNode===event.target.parentNode)
						//	{
							if(cross)
								event.currentTarget.parentNode.removeChild(cross);

						//}
					});

				}
			}
/*----------------------------------------------------------------------------------------------------------
	Function which will rendering  X-Axis labels
	@index--> parameter for denoting a particular Tick.
	@tickCordinate for holdig cordinate value of a particular tick.
	@xLabel Returing a SVG object.
	--------------------------------------------------------------------------------------------------------
*/

function createXLabel(index,tickCordinate,xLabels,xMapping,hfontsize)
	{		
		var NS="http://www.w3.org/2000/svg";	
		var xLabel = document.createElementNS(NS,"text");
		xLabel.setAttributeNS(null,"x",tickCordinate.X);
		xLabel.setAttributeNS(null,"y",tickCordinate.Y+10);
		xLabel.setAttributeNS(null,"fill", "#000000");
		xLabel.style.fontSize=hfontsize;
		xLabel.textContent = xLabels[index];
		//xLabel.setAttribute("transform","rotate(2 "+tickCordinate.X+" "+tickCordinate.Y+10+")");
		xLabel.classList.add("xAxisLabels");
		xMapping.Value=xLabels[index];
		xMapping.xCordinate=tickCordinate.X;
		return xLabel;
	}
		
/*----------------------------------------------------------------------------------------------------------
	Function for calculating  Data-Plot Cordinates and producing internal data-structure
	with data plot coordinates and values.
------------------------------------------------------------------------------------------------------------
*/ 
function drawPlot(xCordArr,yCordarr,plotSliceCollection,plotData)
	{
		var dataPlotCollection = new Array();
		for(var d=0;d<plotData.length;d++)
			{
				var plotXValue = plotData[d].label;
				var plotYValue = plotData[d].value;
				var plotXCordinate=0;
				var plotYCordinate=0;
				for(var t=0;t<xCordArr.length;t++)
					{
						if(xCordArr[t].Value==plotXValue)
						{
							plotXCordinate= xCordArr[t].xCordinate;	
							break;
						}		
					}
					for(var p=0;p<plotSliceCollection.length;p++)
					{
						
						if(plotYValue>plotSliceCollection[p].minValue || plotYValue<plotSliceCollection[p].maxValue)
						{
							var valueRange = plotSliceCollection[p].maxValue- plotSliceCollection[p].minValue;
							var cordinateRange = plotSliceCollection[p].minCordinate-plotSliceCollection[p].maxCordinate;
							var pixcelValue = valueRange/cordinateRange;
							var valueValue = 1/pixcelValue;
							plotYCordinate= plotSliceCollection[p].minCordinate-(valueValue*(plotYValue-plotSliceCollection[p].minValue));
							break;

						}
					}

					var plotcord = new Object();
					plotcord.xValue=plotXValue;
					plotcord.yValue=plotYValue;
					plotcord.x = plotXCordinate;
					plotcord.y = plotYCordinate;
					dataPlotCollection.push(plotcord);
				}
				
			return dataPlotCollection;
	}

/*-----------------------------------------------------------------------------------------------------------
	@valuNormalizer function is responsible for showing Y-Axis values with a particular unit accorrding to the defined range.
	 @divLineValue local variable acts as parameter for possible number system
--------------------------------------------------------------------------------------------------------------
*/
function valueNormalizer(divLineValue)
	{	
		//console.log(divLineValue);
		var resValue;
		if((Math.floor(divLineValue)===0))
			{
				resValue= divLineValue;

			}
			else
			{
				var valueLength = parseInt(String(Math.abs(Math.floor(divLineValue))).length);
				if(valueLength>=1 && valueLength<4)
				{
					resValue= divLineValue;
				}
				else if(valueLength>=4&&valueLength<6)
				{
					resValue= round((divLineValue/1000),1)+"k";
				}
				else if(valueLength>=6 && valueLength<8)
				{
					resValue= round((divLineValue/100000),1)+"Lkh";
				}
				else
				{
					resValue= round((divLineValue/10000000),1)+"Cr";
				}
			}
				return resValue;
	}
/*
	JSON file is hosted in a server that's why to access JSON file need to call it asynchronously.
	---------------------------------------------------------------------------------------------
	loadJsonFile function is declared to access JSON file asynchronously.

	---------------------------------------------------------------------------------------------
	parseJsonData function is declared to read the multi-variate data set in the given JSON file
	and convert it in internal data structure.

*/
//@url parameter for passing JSON File address
function loadJsonFile(url) 
	{
	
		//declaration of variable to hold XMLHttpRequest object.
		//declaration of variable to hold parsed json file.
		var xmlhttp = new XMLHttpRequest(),
            json;
            
		//Anonymous function declared to parse every time the readState changes.           
		xmlhttp.onreadystatechange = function () 
		{
			//Checking whether status is OK or not and request finished and response is ready.
    		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) 
    			{
					//Parsing the JSON file and holding it in a variable.     
       				 json = JSON.parse(xmlhttp.responseText);
					//calling parseJsonData function to convert multi-variate data set into customized intermidiate data structure.     
       				parseJsonData(json);
				}

		}
		//Specifies the type of request
		xmlhttp.open('GET', url, true);
		//Sends the request to the server
		xmlhttp.send();
	}
//Calling function for loading JSON file asynchronously.
//Everytime page loads loadJsonFile function wil be called.
loadJsonFile("DataResource/DataSource.json");

