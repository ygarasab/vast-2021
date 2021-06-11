const parseReportsToLocationDataset = reports => {

    let locationsThroughTime = []

    reports.forEach(report => JSON.parse(report.location.replaceAll("'",'"')).forEach(
        location => locationsThroughTime.push({location, time : new Date(report.time)})
    ))
    return locationsThroughTime

}


const getFrequencyOnPeriod = (data, start, end) => {

    if(start) data = data.filter(line => line.time >= start)
    if(end) data = data.filter(line => line.time <= end)

    let labels = [...new Set(data.map(line => line.location))]
    return labels.map(label => ({label, count : data.filter(line => line.location === label).length}))

}

const displayBars = data =>{

    var margin = {top: 20, right: 30, bottom: 40, left: 20},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    data.sort(function (a, b) {
        return d3.descending(Math.abs(a.count), Math.abs(b.count))
    })

    if(data.length > 7) data = data.slice(0,7)
    height = 500;

// append the svg object to the body of the page
    let svg = d3.select("#issue1bars")
        .append("svg")
        .attr("width", 1000)
        .attr("height",600)
        .append("g")
        .attr("transform",
            "translate(20,10)");

    let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain( [...new Set(data.map(line => line.label))]);
    y.domain([0, 16]);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5))
    ;

// Create rectangles
    let bars = svg.selectAll('.bar')
        .data(data)
        .enter()
        .append("g");

    bars.append('rect')
        .attr('class', 'bar')
        .attr("x", function(d) { return x(d.label); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); });

    bars.append("text")
        .text(function(d) {
            return d.count;
        })
        .attr("x", function(d){
            return x(d.label) + x.bandwidth()/2;
        })
        .attr("y", function(d){
            return y(d.count) - 5;
        })
        .attr("font-family" , "sans-serif")
        .attr("font-size" , "14px")
        .attr("fill" , "black")
        .attr("text-anchor", "middle");


}


const issue1 = () => {

    let locations = parseReportsToLocationDataset(reports)
    let frequency = getFrequencyOnPeriod(locations)
    displayBars(frequency)

}