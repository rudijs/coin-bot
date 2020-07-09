import { EMA } from "technicalindicators"

export const getTokens = async (axios: any, apiKey: string) => {
  let tokens: any = {}

  // top 50 tokens by capitalization
  console.log("==> Fetching Top 50 tokens by capitalization...")
  let url = `https://api.ethplorer.io/getTop?apiKey=${apiKey}&criteria=cap`
  // console.log(url)
  const cap = await axios.get(url)

  // console.log(cap.data.tokens)
  tokens = appendTokens(tokens, cap.data.tokens)

  // top 50 tokens by Trade Volume
  console.log("==> Fetching Top 50 tokens by volume...")
  url = `https://api.ethplorer.io/getTop?apiKey=${apiKey}&criteria=trade`
  const trade = await axios.get(url)
  tokens = appendTokens(tokens, trade.data.tokens)

  // top 50 tokens by Operations
  console.log("==> Fetching Top 50 tokens by operations...")
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
        coinGecko: `https://www.coingecko.com/en/coins/${item.name.toLowerCase().replace(/\ /g, "-")}#markets`,
        coinMarketCap: `https://coinmarketcap.com/currencies/${item.name.toLowerCase().replace(/\ /g, "-")}/markets`,
        bitscreener: `https://bitscreener.com/coins/${item.name.toLowerCase().replace(/\ /g, "-")}/chart`,
        uniSwap: `https://app.uniswap.org/#/swap?inputCurrency=${item.address}`,
        oneInchBuy: `https://1inch.exchange/#/ETH/${item.symbol}`,
        oneInchSell: `https://1inch.exchange/#/${item.symbol}/ETH`,
        oneInchSellUsd: `https://1inch.exchange/#/${item.symbol}/USDC`,
        etherscan: `https://etherscan.io/token/${item.address}`,
      }
    }
  }
  return tokens
}

export const getTokenPriceHistoryGrouped = async (axios: any, address: string, apiKey: string) => {
  // console.log(`Fetching ethplorer.io address: ${address} ...`)
  const url = `https://api.ethplorer.io/getTokenPriceHistoryGrouped/${address}?apiKey=${apiKey}&period=91`
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
    console.log(`==> Fetching ethplorer.io price history: ${tokenList[address].name}`)
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
  const report: any = { SELL: [], BUY: [], HOLD: [], NOT_HOLD: [] }

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

export const formatReport = (data: any) => {
  const colors: any = {
    SELL: "#f3d8d7",
    BUY: "#a5eabf",
    HOLD: "#a5d7f4",
    NOT_HOLD: "#eae4e0",
    UNKNOWN: "#c5c5c5",
  }

  let body = `<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

    <title>Ethplorer Report</title>
    <style>
      table {
        border-collapse: collapse;
        margin-bottom: 50px;
      }

      table,
      th,
      td {
        border: 1px solid black;
        padding: 15px;
      }
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
</style>
</head>
<body><div class="box"><h1>Ethplorer.io Report</h1>\n`

  // console.log(data)
  for (const posture of Object.keys(data)) {
    for (const item of data[posture]) {
      body += `<table style="background-color: ${colors[item.priceHistory.posture]}">
    <tr><td>${item.symbol}</td><td>${item.name}</td><td>${item.address}</td></tr>
    <tr><td colspan="3"><a href="${item.bitscreener}" target="_blank">${item.bitscreener}</a></td></tr>
    <tr><td colspan="3"><a href="${item.coinGecko}" target="_blank">${item.coinGecko}</a></td></tr>
    <tr><td colspan="3"><a href="${item.coinMarketCap}" target="_blank">${item.coinMarketCap}</a></td></tr>
    <tr><td colspan="3"><a href="${item.uniSwap}" target="_blank">${item.uniSwap}</a></td></tr>
    <tr><td colspan="3">
    <a href="${item.oneInchBuy}" target="_blank">1Inch - Buy</a>&nbsp;|&nbsp
    <a href="${item.oneInchSell}" target="_blank">1inch - Sell ETH</a>&nbsp;|&nbsp
    </td></tr>
    <tr><td colspan="3"><a href="${item.etherscan}" target="_blank">${item.etherscan}</a></td></tr>
    </table>\n`
    }
  }

  body += "</div></body></html>"

  return body
  // return "done"
}
