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

// calling parseJsonData function to convert multi-variate data set into customized intermidiate data structure.     
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
	plotData.plotyAxisTitle=json.chart.plot[i].yAxisName;
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

loadJsonFile('triLineChart.json');