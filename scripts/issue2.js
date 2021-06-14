const issue2 = () => {


    let svg = d3.select("#issue1map"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    let path = d3.geoPath();
    let projection = d3.geoEquirectangular()
        .scale(200)
        .center([0,20])
        .translate([width / 2, height / 2]);


    let target = svg.append("g")
        .selectAll("path")
        .data(map.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .style("stroke", "#000")
        .style("opacity", .8)

}