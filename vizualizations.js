var all_tweets // global variable to store all tweets.
d3.csv("data/combined_tweets.csv").then(function(tweets){
    all_tweets = tweets
    
    displayPieChart()
})

function displayPieChart(){
    // set the dimensions and margins of the graph
    var width = 450
    height = 450
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#viz_non_viz")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
   var pie = d3.pie()
    .value(function(d) {
        return d[1]; })
    
    console.log(pie)

    var map = d3.rollup(all_tweets, v => v.length, d => d.has_viz)
    var map_entries = map.entries()
    var no_viz = map_entries.next().value[1]
    var viz = map_entries.next().value[1]
    var total = no_viz+viz
    var data = {"With Visualizations":(viz/total)*100,"Without Visualizations":(no_viz/total)*100}

    var color = d3.scaleOrdinal().domain(Object.keys(data))
    .range(["#143F6B", "#F55353"])
    
    var label = d3.arc()
                      .outerRadius(0)
                      .innerRadius(radius - 10);

    var data_ready = pie(Object.entries(data))
    console.log(data_ready)

    svg.selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('fill', function(d){ 
        return(color(d.data[0])) })
    .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
    )

    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(data_ready)
    .enter()
    .append("text")
    .attr("transform", d => `translate(${label.centroid(d)})`)
    .selectAll("tspan")
    .data(function(d){
        return [d.data[0],Math.round(d.data[1]*10)/10+"%"]
    })
    .enter()
    .append("tspan")
    .attr("x", 0)
      .attr("y", (_, i) => `${i * 1.2}em`)
      .attr("font-weight", (_, i) => i ? null : "bold")
    .text(d => d)
     
    }

