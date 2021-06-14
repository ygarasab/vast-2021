let mapSVG
const drawCalls = calls => {
    let svg = d3.select("#map"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    let projection = d3.geoMercator()
        .fitExtent([[10,10], [width - 10, height - 10]], map);

    svg.selectAll("circle")
        .data([]).exit().remove()

    svg.selectAll("circle")
        .data(calls).enter()
        .append('circle')
        .attr("id", d => "mc"+d.id)
        .attr("cx", d => projection(geocode(d.location))[0])
        .attr("cy", d => projection(geocode(d.location))[1])
        .attr("r", "4px")
        .attr("fill", "red")
        .attr("opacity", .3)
        .on('mouseover', function(d){
            d3.select(this)
                .attr('r', 8)
                .attr('opacity', 1)
            sliderPlot.select("#sc"+d.id)
                .attr('r', 20)
                .attr('opacity', 1)


            svg.append("text")
                .attr('class', "reportmessage")
                .attr('x', d.x)
                .attr('y', d.y)
                .text(function () {
                    return d.message  ;  // Value of the text
                });
        })

        .on('mouseout', function (d){
            d3.select(this)
                .attr('r', 4)
                .attr('opacity', .3)
            sliderPlot.select("#sc"+d.id)
                .attr('opacity', .7)
                .attr('r', 8)
        })
}

const drawMap = () => {

    let svg = d3.select("#map"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    let projection = d3.geoMercator()
        .fitExtent([[10,10], [width - 10, height - 10]], map);


    svg.append("g")
        .selectAll("path")
        .data(map.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .style("stroke", "#000")
        .style("opacity", .8)
        .style("fill", 'none')

    svg.append("text")
        .attr('class', "maptitlr")
        .attr('x', 342)
        .attr('y', 40)
        .attr('font-size', 18)
        .text("Distribuição de Chamadas de Emergência");
    svg.append("text")
        .attr('class', "maptitlr")
        .attr('x', 602)
        .attr('y', 60)
        .attr('font-size', 18)
        .text("em Abila");


    drawCalls(ccdata)

    return svg

}