let full, neighbors, reports;

d3.csv('data/full.csv', data => {

    full = data

    d3.csv('data/reports.csv', data => {

        reports = data

        d3.json('data/neighbors.json', data => {
            neighbors = data

            issue1()
        })

    })

})