/*-----------------------------------------------------------------------------
Defining function for rendering chart.
This function is the starting point of Execution.
Which is responsible for loading JSON file asynchronously and calling function
for parsing JSON file and calling function for rendering SVG componants.
-------------------------------------------------------------------------------
*/

//Function for initiating all rendering fecility.
function renderEngine(entireChartObject)
{
// Starting of loadJsonFile function.
			var computedChartObject=entireChartObject;
			//Calculating chart height.
			var chartheight= entireChartObject.chartobject.chartHeight;
			//Calculating chart width.
			var chartwidth= entireChartObject.chartobject.chartWidth;
			//Calculating number of charts to be rendered according to internal data structure.
			var numOfChart = computedChartObject.chartobject.plot.length;
			// Getting Plot data from internal data structure.
			var plot = computedChartObject.chartobject.plot;
			//Getting caption value.
			var caption = computedChartObject.chartobject.chartCaption;
			//Getting sub-caption value.
			var subCaption = computedChartObject.chartobject.chartSubCption;
			//Checking entered div height and width.
			//Rendering graphical elements according to the number of chart created from internal data structure.
			document.getElementById("caption").innerHTML=caption+"<br/>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+subCaption;

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
//Declaring function for refrashing the page for asynchronously load JSON file.



// Declaration of parseJsonData function starts here

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
    chartObject.chartHeight= json.dataCosmetics.height;
    chartObject.chartWidth= json.dataCosmetics.width;
	for(var index=1;index<=numberOfCharts;index++)
	{
		var plotData = new Object();
		var xAxisData = json.dataValues[chartObject.xaxisName].split(",");
		var yAxisData = json.dataValues[dataValueProperties[index]].split(",");
		plotData.plotyAxisTitle= dataValueProperties[index];
		plotData.data = new Array();
		for(var interIndex=0; interIndex<xAxisData.length&&interIndex<yAxisData.length;interIndex++)
		{
			if((xAxisData[interIndex]===""||xAxisData[interIndex]===null|| typeof xAxisData[interIndex]===undefined)||(yAxisData[interIndex]===""||yAxisData[interIndex]===null|| typeof yAxisData[interIndex]===undefined))
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
//Function for getting number of tick values and labels for all x axis values.
function getXAxisTicks(chartObject,xAxisTick)
{
	for(var i=0;i<chartObject.plot[0].data.length;i++)
	{
  		 xAxisTick.xAxisLabels.push(chartObject.plot[0].data[i].label);
   		xAxisTick.numOfTickValues++;
	}
}
//function to to calculate round up-t0 different decimal place
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
// Fuction for calculating Y-Axis Tick Values it will take maximum and minimum yAxis valueand defined tick object
function getYAxisTicks(maxYAxisValue,minYAxisValue,yAxisTick)
{

	var maxValue = maxYAxisValue;
	var minValue = minYAxisValue;
	//flooring and cieling maximum and minimum values
	var roundedMinValue=Math.floor(minValue);
	var roundedMaxValue=Math.ceil(maxValue);
	var niceMinValue,niceMaxValue;
		niceMinValue=roundedMinValue;
		niceMaxValue= roundedMaxValue;
	
	//Calculation of number of digits.
	var niceMaxRangeValue,niceMinRangeValue;
	var mininterval="1";
	var maxinterval="1";
	//calculating numberof digits.
	var niceMaxValueDigit = parseInt(String(Math.abs(niceMaxValue)).length);
	var niceMinValueDigit = parseInt(String(Math.abs(niceMinValue)).length);
	//declaration of loop variable
	var i,j;
	//calculating minimum interval and maximum interval value.
	for(i=1;i<niceMinValueDigit;i++)
	{
		mininterval+="0";
	}
	for(j=1;j<niceMaxValueDigit;j++)
	{
		maxinterval+="0";
	}
	//rounding value up-to one decimal place.
	niceMinRangeValue= round(niceMinValue/parseInt(mininterval),1);
	niceMaxRangeValue= round(niceMaxValue/parseInt(maxinterval),1);

	var roundedNiceMinRangeValue= Math.floor(niceMinRangeValue);
	var roundedNiceMaxRangeValue= Math.ceil(niceMaxRangeValue);
	var exactNiceMaxValue,exactNiceMinValue;
	//exact Nice div values.
	exactNiceMinValue=roundedNiceMinRangeValue;
	exactNiceMaxValue=roundedNiceMaxRangeValue;
	exactNiceMaxValue*=parseInt(maxinterval);
	exactNiceMinValue*=parseInt(mininterval);
	//Array defination to hold Y-Axis divline properties
	var divLineValues = new Array();
	var stepValue=(exactNiceMaxValue-exactNiceMinValue)/5;
	divLineValues.push(exactNiceMinValue);
	for(var k =1;k<5;k++)
	{
		
		divLineValues.push(round((exactNiceMinValue+(k*stepValue)),1));


	}
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

//Function responsible for all SVG rendering fecility.
function svgCreate(chartheight,chartwidth,numOfXTick,xLabels,yTickDetails,yTitle,xTitle,plotData,i,numOfChart)
			{

				var height =chartheight;
				var width = chartwidth;
				var l1x1val = width/3;
 			 	var l1x2val = width/3;
 			 	var l1y1val = 0;
 			 	var l1y2val = (height*2)/3;
 				var l2x1val= width/3;
 			 	var l2x2val= width;
 			 	var l2y1val= (height*2)/3;
 				var l2y2val = (height*2)/3;
 				if(height<width)
 				{
 			 		hfontsize = height/20;
 			 	}
 			 	else if(height==width)
 			 	{
 			 		hfontsize = height/20;
 			 	}
 			 	else
 			 	{
 			 		hfontsize=width/20;
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
 				 svg.setAttribute("height",height);
 				 svg.setAttribute("width",width);
 				 svg.classList.add("chart");
 				
				var line = document.createElementNS(NS,"line");
				line.setAttribute("x1",l1x1val);
				line.setAttribute("x2",l1x2val);
				line.setAttribute("y1",l1y1val);
				line.setAttribute("y2",l1y2val);
				line.setAttribute("stroke","#202020");
				line.setAttribute("stroke-width",5);
				line.classList.add("xAxis");
				var line1 = document.createElementNS(NS,"line");
				line1.setAttribute("x1",l2x1val);
				line1.setAttribute("x2",l2x2val);
				line1.setAttribute("y1",l2y1val);
				line1.setAttribute("y2",l2y2val);
				line1.setAttribute("stroke","#202020");
				line1.setAttribute("stroke-width",5);
				line1.classList.add("yAxis");
				//Rendering X-Axis and Y-Axis titles
				if(i==numOfChart-1)
					{
				
				var text = document.createElementNS(NS,"text");
				text.setAttribute("x",(width*5)/8);
				text.setAttribute("y",(19*height)/20);
				text.setAttribute("fill", "#000000");
				text.style.fontSize=hfontsize;
				text.textContent = xTitle;
				text.classList.add("xAxisTitle");
				svg.appendChild(text);
				}
				var text1 = document.createElementNS(NS,"text");
				text1.setAttribute("x",width/40);
				text1.setAttribute("y",(height)/3);
				text1.setAttribute("fill", "#000000");
				text1.style.fontSize=hfontsize;
				text1.textContent = yTitle;
				text1.classList.add("yAxisTitle");
				var divLineValues= yTickDetails.DivLineValues;
				var niceMaxDivLineValues = yTickDetails.niceMaxExactDivValue;
				var niceMinDivLineValue = yTickDetails.niceMinExactDivValue;
				var numTickValue= yTickDetails.numOfYTickValues;
				var stepValue = yTickDetails.stepValue;
				//Rendering Tick values
				for(var k =0;k<divLineValues.length;k++)
				{
					var step =(l1y2val-l1y1val)/numTickValue;
					var divln = document.createElementNS(NS,"line");
					divln.setAttribute("x1",l2x1val);
					divln.setAttribute("x2",l2x2val);
					divln.setAttribute("y1",l2y1val-(k*step));
					divln.setAttribute("y2",l2y1val-(k*step));
					divln.setAttribute("stroke","#202020");
					divln.setAttribute("stroke-width",1);
					divln.classList.add("yAxisDivLine");
					if(j==0)
					{
						continue;
					}
					var yLabel = document.createElementNS(NS,"text");
					yLabel.setAttribute("x",width/6);
					yLabel.setAttribute("y",l2y1val-(k*step));
					yLabel.setAttribute("fill", "#000000");
					yLabel.style.fontSize=hfontsize;
					yLabel.textContent = divLineValues[k];
					yLabel.classList.add("yAxisLabels");
					var yMapping = new Object();
					yMapping.yCordinate= l2y1val-(k*step);
					yMapping.value= divLineValues[k];
					yCordarr.push(yMapping);
					svg.appendChild(divln);
					svg.appendChild(yLabel);

				}


				for(var j=0;j<(numOfXTick+1);j++)
				{

					var step = (l2x2val - l2x1val)/(numOfXTick+1);
					var xTick =document.createElementNS(NS,"line");
					xTick.setAttribute("x1",l2x1val+(j*step));
					xTick.setAttribute("x2",l2x1val+(j*step));
					xTick.setAttribute("y1",(height*2)/3);
					xTick.setAttribute("y2",(height*7)/10);
					xTick.setAttribute("stroke","#202020");
					xTick.setAttribute("stroke-width",2);
					xTick.classList.add("xAxisDivLine");
					
					if(j==0)
					{
					continue;
					}
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
                    toolTip.innerHTML ="Time: "+plotCircles[c].xValue +"<br/>Value: "+plotCircles[c].yValue; 
                    plotCircle.classList.add("plotDots");
                    plotCircle.appendChild(toolTip); 
					svg.appendChild(plotCircle);
					if((prevX!=0)&&(prevY!=0))
					{
						var linkLine = document.createElementNS(NS,"line");
						linkLine.setAttribute("x1",prevX);
					 	linkLine.setAttribute("x2",plotCircles[c].x);
						linkLine.setAttribute("y1",prevY);
						linkLine.setAttribute("y2",plotCircles[c].y);
						linkLine.setAttribute("stroke","green");
						linkLine.classList.add("plotLines");
						svg.appendChild(linkLine);
					}
					prevX=plotCircles[c].x;
					prevY= plotCircles[c].y;
					
				}
				
				
				svg.appendChild(text1);
				svg.appendChild(line);
				svg.appendChild(line1);
				
				div.appendChild(svg);
				document.body.appendChild(div);
				
			}
			//Function which will render X-Axis labels
			function createXLabel(j,tickCordinate,xLabels,xMapping,hfontsize)
			{		var NS="http://www.w3.org/2000/svg";
					
					var xLabel = document.createElementNS(NS,"text");
					xLabel.setAttribute("x",tickCordinate.X);
					xLabel.setAttribute("y",tickCordinate.Y+10);
					xLabel.setAttribute("fill", "#000000");
					xLabel.style.fontSize=hfontsize;
					xLabel.textContent = xLabels[j-1];
					xLabel.classList.add("xAxisLabels");
					xMapping.Value=xLabels[j-1];
					xMapping.xCordinate=tickCordinate.X;
					return xLabel;
			}
		
			//Function for calculating  Data-Plot Cordinates 
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
			/*
	JSON file is hosted in a server that's why to access JSON file need to call it asynchronously.
---------------------------------------------------------------------------------------------
loadJsonFile function is declared to access JSON file asynchronously.

---------------------------------------------------------------------------------------------
parseJsonData function is declared to read the multi-variate data set in the given JSON file
and convert it in internal data structure.

*/
	function loadJsonFile(url) {
	
	//declaration of variable to hold XMLHttpRequest object.
	//declaration of variable to hold parsed json file.
	var xmlhttp = new XMLHttpRequest(),
            json;
            
	//Anonymous function declared to parse every time the readState changes.           
	xmlhttp.onreadystatechange = function () {
		//Checking whether status is OK or not and request finished and response is ready.
    	if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
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
	//Calling function for loading JSON file.
			loadJsonFile("DataResource/DataSource.json");

