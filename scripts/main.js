let full, ccdata, reports, map, wordsinfluence, retweets;
let listennerTO;

const runTimeChanges = (start, end) => {
        let newFlare = getFlare(start, end)
        renderSunburst(newFlare)
}

d3.queue()
    .defer(d3.csv, 'data/reports.csv')
    .defer(d3.csv, 'data/ccdata.csv')
    .defer(d3.json, 'data/wordsinfluence.json')
    .defer(d3.json, 'data/abila.json')
    .defer(d3.csv, 'data/retweets.csv')
    .await( (error, d1, d2, d3, d4, d5) => {
        reports = d1;
        ccdata = d2;
        wordsinfluence = d3;
        map = d4;
        retweets = d5;

        let flare = getFlare(0, 9999999999999999999999);
        loadSunBurst()
        renderSunburst(flare);

        mapSVG = drawMap()

    })



