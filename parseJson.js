/*
JSON file is hosted in a server that's why to access JSON file need to call it asynchronously.
---------------------------------------------------------------------------------------------
loadJsonFile function is declared to access JSON file asynchronously.

---------------------------------------------------------------------------------------------
parseJsonData function is declared to read the multi-variate data set in the given JSON file
and convert it in internal data structure.

*/

// Starting of loadJsonFile function.

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
// Declaration of parseJsonData function starts here

function parseJsonData(json)
{

    console.log(json);
	// declaring variable to hold chart-caption , Sub-Caption, X-Axis label, time values.
    var caption = json.chart.caption,
    subCaption= json.chart.subcaption,
    xAxisName= json.chart.xAxisName,
    time = json.chart.time;

	/*
	Creation of intermidiate object to hold converted multi-variate data set
	and this calculation will be done from this intermidiate object for rendering purpose.

	*/
	var chartObject = new Object();
	//attributes defined for intermidiate object.
	chartObject.chartCaption= caption;
	chartObject.chartSubCption= subCaption;
	chartObject.xaxisName=xAxisName;

	//holding the different charts value for the newly created object and storing it in plot attribute as an array.
	chartObject.plot = new Array();
	for (var i = 0; i<json.chart.plot.length; i++) {
		//each object storedd in plot array is object.
		var plotData = new Object();
		//Defining and storing title attribute for each intermediate chart objects.
		plotData.plotyAxisTitle=json.chart.plot[i].plotyAxisTitle;
		//data array will hold different data set values.
		plotData.data = new Array();
		for (var j = 0; j<time.length; j++) {
			var dataValue = new Object();
			dataValue.label=time[j];
			dataValue.value=json.chart.plot[i].data[j];
			plotData.data.push(dataValue);
		}	

		chartObject.plot.push(plotData);
	}
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
	console.log(xAxisTick);
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
			//yAxisTick.DivLineValues= new Array();
			yAxisTick.stepValue;
			yAxisTick.niceMaxExactDivValue;
 			yAxisTick.niceMinExactDivValue;
			getYAxisTicks(maxYAxisValue,minYAxisValue,yAxisTick);
			yAxisTickDetails.yAxisTickValues.push(yAxisTick);
	}
	//Logging the Y-Axis Tick object structure
	console.log(yAxisTickDetails);


	// showing newly created intermediate object's different propery values in console.

	console.log(chartObject);	
	console.log("------------- showing intermediate datastructure after persing and converting from multi-variate dataset----------------");
	console.log(chartObject.chartCaption);
	console.log(chartObject.chartSubCption);
	console.log(chartObject.xaxisName);
	for(var p in chartObject.plot)
	{
		console.log(chartObject.plot[p].plotyAxisTitle);
		for(var d in chartObject.plot[p].data)
		{
			console.log(chartObject.plot[p].data[d].label);
			console.log(chartObject.plot[p].data[d].value);
		}
    }
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
// Fuction for calculating Y-Axis Tick Values it will take maximum and minimum yAxis valueand defined tick object
function getYAxisTicks(maxYAxisValue,minYAxisValue,yAxisTick)
{

	var maxValue = maxYAxisValue;
	var minValue = minYAxisValue;
	//Rounding-up maximum and minimum values
	var roundedMinValue=Math.round(minValue);
	var roundedMaxValue=Math.round(maxValue);
	var niceMinValue,niceMaxValue;
	//checking whether the rounded min value is greater than chart actual min value.
	if(roundedMinValue>minValue)
	{
		niceMinValue=roundedMinValue-(roundedMinValue-(minValue>>0));
	}
	else
	{
		niceMinValue=roundedMinValue;
	}
	//checking whether the rounded max value is less than chart actual max value.
	if(roundedMaxValue<maxValue)
	{
		niceMaxValue= roundedMaxValue+1;
	}
	else
	{
		niceMaxValue=roundedMaxValue;
	}
	//Calculation of number of digits.
	var niceMaxRangeValue,niceMinRangeValue;
	var mininterval="1";
	var maxinterval="1";
	var niceMaxValueDigit = parseInt(String(niceMaxValue).length);
	var niceMinValueDigit = parseInt(String(niceMinValue).length);
	var i,j;
	for(i=0;i<niceMinValueDigit;i++)
	{
		mininterval+="0";
	}
	for(j=1;j<niceMaxValueDigit-i;j++)
	{
		maxinterval+="0";
	}
	niceMinRangeValue= niceMinValue/parseInt(mininterval);
	niceMaxRangeValue=(niceMaxValue/parseInt(mininterval))/parseInt(maxinterval);

	var roundedNiceMinRangeValue= Math.round(niceMinRangeValue);
	var roundedNiceMaxRangeValue= Math.round(niceMaxRangeValue);
	var exactNiceMaxValue,exactNiceMinValue;
	if(roundedNiceMinRangeValue>niceMinRangeValue)
	{
		exactNiceMinValue=roundedNiceMinRangeValue-(roundedNiceMinRangeValue-(niceMinRangeValue>>0));
	}
	else
	{
		exactNiceMinValue=roundedNiceMinRangeValue;
	}
	if(roundedNiceMaxRangeValue<niceMaxRangeValue)
	{
		exactNiceMaxValue= roundedNiceMaxRangeValue+1;
	}
	else
	{
		exactNiceMaxValue=roundedNiceMaxRangeValue;
	}
	if(exactNiceMaxValue==niceMaxRangeValue)
	{
		exactNiceMaxValue+=1;
	}
	//calculating nice divline maximum and minimum values.
	exactNiceMaxValue*=parseInt(mininterval);
	exactNiceMaxValue*=parseInt(maxinterval);
	exactNiceMinValue*=parseInt(mininterval);
	var divLineValues = new Array();
	var stepValue=exactNiceMaxValue/5;
	divLineValues.push(exactNiceMinValue);
	divLineValues.push(stepValue);
	for(var k =2;k<5;k++)
	{
		
		divLineValues.push(stepValue*k);
	}
	divLineValues.push(exactNiceMaxValue);
	//Assigning calculated values into yAxisTick object.
	yAxisTick.niceMaxExactDivValue=exactNiceMaxValue;
 	yAxisTick.niceMinExactDivValue= exactNiceMinValue;
	yAxisTick.stepValue=stepValue;
 	//yAxisTick.DivLineValues=divLineValues;
 	yAxisTick.numOfYTickValues=divLineValues.length;

}
//Calling  loadJsonFile function.
loadJsonFile('triLineChart.json');