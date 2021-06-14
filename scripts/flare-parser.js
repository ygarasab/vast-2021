const influencers = ['HomelandIlluminations', 'AbilaPost', 'KronosStar', 'CentralBulletin', 'NewsOnlineToday', 'InternationalNews', 'megaMan', 'truccotrucco', 'FriendsOfKronos']

const getFlare = (start, end) => {

    let children = influencers.map( inf => ({name : inf, children : []}))

    let localData = wordsinfluence.filter(line => new Date(line.time) > start && new Date(line.time) < end)

    let words =  [...new Set( localData.map(line => line.word.toLowerCase()) )]

    for (let i = 0; i < children.length; i++) {

        let influencer = children[i].name

        for(let word of words){

            let size = localData.filter(line => line.word === word && line.author === influencer).length
            if(size > 7) children[i].children.push({name : word, size})
        }

    }

    return {name : 'flare', children}

}

