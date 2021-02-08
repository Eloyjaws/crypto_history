const fs = require('fs')
require('isomorphic-fetch');

const generateDogecoinHistory = async ({from = 2013, to = 2021} = {}) => {
    const headers = ['date', 'open', 'high', 'low', 'close', 'volume', 'market_cap']

    const gen_api_url = (start, end) => `https://web-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical?id=74&convert=USD&time_start=${start}&time_end=${end}`
    
    const begin = from%2000;
    const end = to%2000;
    const gen_dates = () => {
        const dates = []
        for(let i=begin; i<=end; i++){
            dates.push({start: `01-01-20${i}`, end: `01-01-20${i+1}`})
        }
        return dates
    };

    dogecoin_history = ""
    dogecoin_history += headers.join(",")
    dogecoin_history += "\n"

    const fetch_data = async (endpoint) => {
        return fetch(endpoint)
        .then(res => res.json())
        .then(res => {
            if(res.status.error_code != 0) return []
            return res.data
        })
        .catch(console.log)
    }

    const appendToDogeHistory = (data) => {
        const quote = data.quote.USD
        const {timestamp: date, open, high, low, close, volume, market_cap} = quote
        const row = `${date.split('T')[0]},${open},${high},${low},${close},${volume},${market_cap}\n`
        dogecoin_history += row
    }

    dates = gen_dates()
    for(period of dates){
        let {start, end} = period;
        console.log(`Fetching history from ${start}:${end}`)
        // convert to milliseconds
        start = (new Date(start)).getTime()
        end = (new Date(end)).getTime()
        const endpoint = gen_api_url(start, end)
        const data =  await fetch_data(endpoint)
        data.quotes.map(appendToDogeHistory)
    }
    return dogecoin_history;
}

const main = async() => {
    const doge_history = await generateDogecoinHistory()
    const outputPath = 'analysis/DOGE.csv'
    fs.writeFileSync(outputPath, doge_history)
    console.log("DOGE.csv written to " + outputPath)
}

main();
