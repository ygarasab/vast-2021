Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            return this.filter(x => x===value).length;
        }
    }
});

const showTopTweet = (start, end) => {

    let tweets = retweets.filter( t => new Date(t.time) > start && new Date(t.time) < end).map(t => t.tweet)
    let unique_tweets = [ ...new Set(tweets)]

    let tweet_rank = unique_tweets.map(t => ({tweet : t.split(' ').slice(2).join(' '), count : tweets.count(t)}))


    let top = tweet_rank.sort((a,b) => a.count >= b.count ? -1 : 1)[0].tweet

    document.getElementById("topt").innerText = "Top Tweet : " + top;

}