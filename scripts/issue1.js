const parseReportsToLocationDataset = reports => {

    let locationsThroughTime = []

    reports.forEach(report => JSON.parse(report.location.replaceAll("'",'"')).forEach(
        location => locationsThroughTime.push({location, time : new Date(report.time)})
    ))
    return locationsThroughTime

}

const displayBars = setMapView =>{

    var margin = {top: 20, right: 30, bottom: 40, left: 400},
        width = 1200 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#issue1bars")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
    d3.json("data/gdp-to-indicator-correlation.json", data => {

        d3.select("#map-label")
            .text('Employment in agriculture (% of total employment) (modeled ILO estimate)')

        data.sort(function (a, b) {
            return d3.descending(Math.abs(a.value), Math.abs(b.value))
        })
        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, .8])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(function (d) {
                return d.indicator;
            }))
            .padding(.1);
        svg.append("g")
            .call(d3.axisLeft(y))

        //Bars
        let bars = svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")

        bars.on('click', d => { setMapView(d.indicator); d3.select("#map-label").text(d.indicator)})
            .attr("x", x(0))
            .attr("y", d => y(d.indicator))
            .attr("width", d => Math.abs(x(d.value)))
            .attr("height", y.bandwidth())
            .attr("fill", d => d.value > 0 ? 'blue' : "red")


    })
}


const issue1 = () => {

    let locations = parseReportsToLocationDataset(reports)
    console.log(locations)

}