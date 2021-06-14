let renderSunburst;

const loadSunBurst = () => {

    let width = 500,
        height = 500,
        radius = (Math.min(width, height) / 2) - 10,
        node

    const svg = d3.select('#sunburst')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('id', 'sunburstobj')
        .attr('transform', 'translate(' + width / 2 + ',' + (height / 2) + ')')

    const x = d3.scaleLinear().range([0, 2 * Math.PI])
    const y = d3.scaleLinear().range([0, radius])

    const colors = d3.scaleOrdinal(d3.schemeCategory20)
    const partition = d3.partition()

    const arc = d3.arc()
        .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
        .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
        .innerRadius(d => Math.max(0, y(d.y0)))
        .outerRadius(d => Math.max(0, y(d.y1)))

    renderSunburst = data => {


        const gSlices = svg.selectAll('#sunburstobj').data(partition(d3.hierarchy(data).sum(d => d.size)).descendants(), function (d) { return d.data.id }).enter().append('g')

        gSlices.exit().remove()

        gSlices.append('path')
            .style('fill', function (d) {
                if (d.depth === 0) return 'white'
                return colors(d.x0)
            })
            .on('click', click)

        gSlices.append('text')
            .attr('dy', '.25em')
            .text(function (d) { return d.parent ? d.parent.parent ? d.data.name :  d.data.name.slice(0,4) : ''})
            .attr('class', 'circle-text')
            .attr('id', function (d) { return 'w' + d.data.name })
            .attr('fill', '#fff')

        svg.selectAll('path')
            .transition('update')
            .duration(750).attrTween('d', function (d, i) {
            return arcTweenPath(d, i)
        })

        svg.selectAll('text')
            .transition('update')
            .duration(750)
            .attrTween('transform', function (d, i) { return arcTweenText(d, i)})
            .attr('text-anchor', function (d) {
                return d.textAngle > 180 ? 'start' : 'end'
            })
            .attr('dx', function (d) {
                return d.textAngle > 180 ? 27: 27
            })
            .attr('opacity', function (e) {
                return e.x1 - e.x0 > 0.01 ? 1 : 0
            })

    }

    function arcTweenText(a, i) {
        var oi = d3.interpolate({ x0: (a.x0s ? a.x0s : 0), x1: (a.x1s ? a.x1s : 0), y0: (a.y0s ? a.y0s : 0), y1: (a.y1s ? a.y1s : 0) }, a)

        function tween(t) {
            var b = oi(t)
            var ang = ((x((b.x0 + b.x1) / 2) - Math.PI / 2) / Math.PI * 180)

            b.textAngle = (ang > 90) ? 180 + ang : ang
            a.centroid = arc.centroid(b)

            return 'translate(' + arc.centroid(b) + ')rotate(' + b.textAngle + 90 + ')'
        }
        return tween
    }

    function arcTweenPath(a, i) {
        var oi = d3.interpolate({ x0: (a.x0s ? a.x0s : 0), x1: (a.x1s ? a.x1s : 0), y0: (a.y0s ? a.y0s : 0), y1: (a.y1s ? a.y1s : 0) }, a)

        function tween(t) {
            var b = oi(t)

            a.x0s = b.x0
            a.x1s = b.x1
            a.y0s = b.y0
            a.y1s = b.y1

            return arc(b)
        }
        if (!i && node) {

            let xd = d3.interpolate(x.domain(), [node.x0, node.x1])
            let yd = d3.interpolate(y.domain(), [node.y0, 1])
            let yr = d3.interpolate(y.range(), [node.y0 ? 40 : 0, radius])

            return function (t) {
                x.domain(xd(t))
                y.domain(yd(t)).range(yr(t))

                return tween(t)
            }
        } else {
            // first build
            return tween
        }
    }

    function click(d) {
        node = d
        const total = d.x1 - d.x0

        svg.selectAll('path')
            .transition('click')
            .duration(750)
            .attrTween('d', function (d, i) { return arcTweenPath(d, i)})

        svg.selectAll('text')
            .transition('click')
            .attr('opacity', 1)
            .duration(750)
            .attrTween('transform', function (d, i) {
                return arcTweenText(d)
            })
            .attr('text-anchor', function (d) {
                return d.textAngle > 180 ? 'start' : 'end'
            })
            .attr('dx', function (d) {
                if(d.data.name.length > 3) {
                    return d.textAngle > 180 ? -23 : 23
                }
                return d.textAngle > 180 ? -13 : 13
            })
            .attr('opacity', function (e) {
                // hide & show text
                if (e.x0 >= d.x0 && e.x1 <= (d.x1 + 0.0000000000000001)) {
                    const arcText = d3.select(this.parentNode).select('text')
                    arcText.attr('visibility', function(d) {
                        return (d.x1 - d.x0) / total < 0.01 ? 'hidden' : 'visible'
                    })
                } else {
                    return 0
                }
            })
    }

}
