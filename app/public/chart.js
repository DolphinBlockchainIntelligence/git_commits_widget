d3.json(window.location.href + '/json', function(data) {
  data = [data];
  console.log(data);
  nv.addGraph(function() {
    var chart = nv.models.lineChart()//cumulativeLineChart()
                  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1] })
                  .useInteractiveGuideline(true)
                  ;

     chart.xAxis
        .tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d))
          });

    chart.yAxis
	  .tickFormat(d3.format(',f'));

    d3.select('svg#chart')
        .datum(data)
        .call(chart);

    nv.utils.windowResize(chart.update);
    return chart;
  });
});
