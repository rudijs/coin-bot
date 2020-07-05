import { EMA } from "technicalindicators"

export const getTokens = async (axios: any, apiKey: string) => {
  let tokens: any = {}

  // top 50 tokens by capitalization
  let url = `https://api.ethplorer.io/getTop?apiKey=${apiKey}&criteria=cap`
  // console.log(url)
  const cap = await axios.get(url)

  // console.log(cap.data.tokens)
  tokens = appendTokens(tokens, cap.data.tokens)

  // top 50 tokens by Trade Volume
  url = `https://api.ethplorer.io/getTop?apiKey=${apiKey}&criteria=trade`
  const trade = await axios.get(url)
  tokens = appendTokens(tokens, trade.data.tokens)

  // top 50 tokens by Operations
  url = `https://api.ethplorer.io/getTop?apiKey=${apiKey}&criteria=count`
  const count = await axios.get(url)
  tokens = appendTokens(tokens, count.data.tokens)

  return tokens
}

function appendTokens(tokens: any, data: any) {
  for (const item of data) {
    // console.log(item.name)
    if (!tokens[item.address]) {
      tokens[item.address] = {
        name: item.name,
        address: item.address,
        symbol: item.symbol,
        coinGecko: `https://www.coingecko.com/en/coins/${item.name.toLowerCase()}#markets`,
        coinMarketCap: `https://coinmarketcap.com/currencies/${item.name.toLowerCase()}/markets`,
        bitscreener: `https://bitscreener.com/coins/${item.name.toLowerCase()}`,
        uniSwap: `https://app.uniswap.org/#/swap?inputCurrency=${item.address}`,
        oneInch: `https://1inch.exchange/#/ETH/${item.symbol}`,
      }
    }
  }
  return tokens
}

export const getTokenPriceHistoryGrouped = async (axios: any, address: string, apiKey: string) => {
  const url = `https://api.ethplorer.io/getTokenPriceHistoryGrouped/${address}?apiKey=${apiKey}&period=22`
  const res = await axios.get(url)
  // console.log(res.data.history.prices.length)
  const prices = res.data.history.prices
  // console.log(prices)

  // we want 21 days data - for the 21 and 8 EMAs
  // remove today's open price, we'll calculate up until the close of yesterday (today's open and close are subject to change)
  const pricesCopy = prices.slice()
  pricesCopy.pop()
  // console.log(prices[0])
  // console.log(prices[prices.length - 1])

  const values = pricesCopy.map((item: any) => item.close)
  // console.log(values.length)
  return trendReport(values)
}

function trendReport(values: any) {
  const currentPrice = values[values.length - 1]
  const previousPrice = values[values.length - 2]

  const ema21 = EMA.calculate({ period: 21, values: values })
  const currentEma21 = ema21[ema21.length - 1]
  // console.log(currentEma21)

  const ema8 = EMA.calculate({ period: 8, values: values })
  const currentEma8 = ema8[ema8.length - 1]
  const previousEma8 = ema8[ema8.length - 2]

  let posture = "NOT_HOLD"

  // if we are above the Daily 21 EMA look for entry/exit
  if (currentPrice > currentEma21) {
    // are we above the Daily 8 EMA and the Daily 8 EMA is above the Daily 21 EMA
    if (currentPrice > currentEma8 && currentEma8 > currentEma21) {
      // if we just moved above the Daily 8 EMA it's a Buy
      if (previousPrice < previousEma8) posture = "BUY"
      // if we are still above the Daily 8 EMA it's a Hold
      if (previousPrice > previousEma8) posture = "HOLD"
    }

    // are we are below the Daily 8 EMA
    if (currentPrice < currentEma8) {
      // if we just moved below the Daily 8 EMA it's a Sell
      if (previousPrice > previousEma8) posture = "SELL"
      // if we are still below the Daily 8 EMA we should (already) not be holding
      if (previousPrice < previousEma8) posture = "NOT_HOLD"
    }
  }

  return {
    currentPrice,
    currentEma21,
    currentEma8,
    previousEma8,
    posture,
  }
}

export const tokenReport = async (axios: any, tokenList: any, apiKey: string) => {
  const addresses = Object.keys(tokenList)
  for (const address of addresses) {
    // console.log(address)
    try {
      const priceHistory = await getTokenPriceHistoryGrouped(axios, address, apiKey)
      tokenList[address].priceHistory = priceHistory
    } catch (e) {
      tokenList[address].priceHistory = { posture: "UNKNOWN" }
    } finally {
      // console.log(tokenList[address])
    }
  }
  // console.log(tokenList)
  return tokenList
}

export const sort = function (data: any) {
  const report: any = { SELL: [], BUY: [], NOT_HOLD: [], HOLD: [] }

  // console.log(data)
  for (const item in data) {
    // console.log(item)
    if (report[data[item].priceHistory.posture]) {
      report[data[item].priceHistory.posture].push(data[item])
    } else {
      report[data[item].priceHistory.posture] = [data[item]]
    }
  }

  return report
}
