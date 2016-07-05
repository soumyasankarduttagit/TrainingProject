var xmlhttp = new XMLHttpRequest(),
            json;
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        console.log('working');
        json = JSON.parse(xmlhttp.responseText);
        console.log(json);
        var caption = json.chart.caption,
    subCaption= json.chart.subcaption,
    xAxisName= json.chart.xAxisName,
    time = json.chart.time;
var chartObject = new Object();
chartObject.chartCaption= caption;
chartObject.chartSubCption= subCaption;
chartObject.xaxisName=xAxisName;
chartObject.plot = new Array();
for (var i = 0; i<json.chart.plot.length; i++) {
	var plotData = new Object();
	plotData.plotyAxisTitle=json.chart.plot[i].yAxisName;
	plotData.data = new Array();
	for (var j = 0; j<time.length; j++) {
		var dataValue = new Object();
		dataValue.label=time[j];
		dataValue.value=json.chart.plot[i].data[j];
		plotData.data.push(dataValue);
	}	
chartObject.plot.push(plotData);
}
console.log(chartObject);	
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
}
xmlhttp.open('GET', 'triLineChart.json', true);
xmlhttp.send();


