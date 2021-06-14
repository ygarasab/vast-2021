const renderSlider = () => {
    let formatDateIntoHour = d3.timeFormat("%H:%M");
    let formatDate = d3.timeFormat("%H:%M");

    let startDate = new Date("2014-01-23T17:00:00"),
        endDate = new Date("2014-01-23T21:30:10");

    let margin = {top: 50, right: 50, bottom: 0, left: 50},
        width = 1300 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    let svg = d3.select("#vis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    ////////// slider //////////

    let moving = false;
    let currentValue = 0;
    let x = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, width])
        .clamp(true);

    let slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + height / 4 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-inset")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function () {
                slider.interrupt();
            })
            .on("start drag", function () {
                currentValue = d3.event.x;
                update(x.invert(currentValue));
            })
        );

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter()
        .append("text")
        .attr("x", x)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function (d) {
            return formatDateIntoHour(d);
        });

    let handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    let label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-25) + ")")


    ////////// plot //////////

    let dataset;

    const prepare = d => ({id: d.id, date: new Date(d.time), message: d.message, location : d.location})

    let plot = svg.append("g")
        .attr("class", "plot")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/ccdata.csv", prepare, data => {
        dataset = data;
        drawPlot(dataset);

    })


    function drawPlot(data) {

        plot.selectAll(".location").data([]).exit()
            .remove();

        var locations = plot.selectAll(".location")
            .data(data);

        // if filtered dataset has more circles than already existing, transition new ones in
        locations.enter()
            .append("circle")
            .attr('id', d => "sc"+d.id)
            .attr("class", "location")
            .attr("cx", function (d) {
                return x(d.date);
            })
            .attr("cy", height / 3)
            .style("fill", function (d) {
                return d3.hsl(d.date / 1000000000, 0.8, 0.8)
            })
            .style("stroke", function (d) {
                return d3.hsl(d.date / 1000000000, 0.7, 0.7)
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .style("opacity", 0.5)
            .attr("r", 8)
            .transition()
            .duration(400)
            .attr("r", 12)
            .transition()
            .attr("r", 8);


    }

    function update(h) {

        handle.attr("cx", x(h));
        label
            .attr("x", x(h))
            .text(formatDate(h));

        let back = h.getTime() - 2000000
        // filter data set and redraw plot
        var newData = dataset.filter(function (d) {
            return d.date < h && d.date.getTime() > back;
        })
        drawPlot(newData);

        clearTimeout(listennerTO)
        listennerTO = setTimeout( () => {
            console.log('hey')
            drawCalls(newData)
            runTimeChanges(new Date(back), h)
            showTopTweet(new Date(back), h)
        }, 500)
    }

    function handleMouseOver(d) {  // Add interactivity


        d3.select(this).attr('r', 16);

        mapSVG.selectAll('circle').attr('r', e => e.id === d.id ? 8 : 4)
            .attr('opacity', e => e.id === d.id ? 1 : .3)
        // Specify where to put label of text
        svg.append("text")
            .attr('class', "reportmessage")
            .attr('x', 42)
            .attr('y', 140)
            .text(function () {
                return d.date.toLocaleTimeString() + " - " + d.message  ;  // Value of the text
            });
    }

    function handleMouseOut(d) {
        // Use D3 to select element, change color back to normal
        d3.select(this).attr('r', 8).attr('opacity', .3);
        mapSVG.selectAll('circle').attr('r', 4).attr('opacity', .3)
        // Select text by id and then remove
        d3.selectAll(".reportmessage").remove();  // Remove text location
    }

    return plot
}

let sliderPlot = renderSlider()