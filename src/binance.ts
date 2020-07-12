import { EMA } from "technicalindicators"

export const exchangeInfo = async (axios: any) => {
  if (process.env.NODE_ENV !== "test") console.log("==> Fetching binance.com markets ...")
  const res = await axios.get("https://api.binance.com/api/v3/exchangeInfo")
  // console.log(res)
  const tradingMarkets = res.data.symbols.filter((item: any) => item.status === "TRADING")
  // console.log("tradingMarkets", tradingMarkets.length)
  // console.log(tradingMarkets[0])
  const btcMarkets = tradingMarkets.filter((item: any) => item.quoteAsset === "BTC")
  const ethMarkets = tradingMarkets.filter((item: any) => item.quoteAsset === "ETH")
  const usdtMarkets = tradingMarkets.filter((item: any) => item.quoteAsset === "USDT")
  // console.log(btcMarkets[10])
  return { btcMarkets, ethMarkets, usdtMarkets }
}

export const marketPriceHistory = async (axios: any, symbol: string) => {
  if (process.env.NODE_ENV !== "test") console.log(`==> Fetching binance.com market history ${symbol} ...`)
  const res = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d`)
  const data = res.data
  // console.log(res.data[res.data.length - 1])
  // console.log(res.data[res.data.length - 2])
  return data
}

export const marketPosture = (data: any, symbol: string) => {
  const closeValues = data.map((item: any) => parseFloat(item[4]))
  // console.log(closeValues)
  // remove the current period
  closeValues.pop()

  const currentPrice = closeValues[closeValues.length - 1]
  const previousPrice = closeValues[closeValues.length - 2]
  // console.log("currentPrice", currentPrice)
  // console.log("previousPrice", previousPrice)

  // console.log(closeValues)

  const ema21 = EMA.calculate({ period: 21, values: closeValues })
  // console.log(ema21)
  const currentEma21 = ema21[ema21.length - 1]
  // console.log("currentEma21", currentEma21)

  const ema8 = EMA.calculate({ period: 8, values: closeValues })
  const currentEma8 = ema8[ema8.length - 1]
  // console.log("currentEma8", currentEma8)
  const previousEma8 = ema8[ema8.length - 2]
  // console.log("previousEma8", previousEma8)

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
    symbol,
    currentPrice,
    previousPrice,
    currentEma21,
    currentEma8,
    posture,
  }
}

export const formatReport = (data: any, date: Date, durationSeconds: number, market: string) => {
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

    <title>Binance ${market} Report</title>
    <style>
      table {
        width: 600px;
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
<body><div class="box">
<h1>Binance.com ${market} Report</h1>
<p>Date: ${date.toLocaleString("en-US", { timeZone: "Asia/Manila" })}</p>
<p>Duration Seconds: ${durationSeconds}s</p>
\n`

  // console.log(data)
  for (const posture of Object.keys(data)) {
    for (const item of data[posture]) {
      body += `<table style="background-color: ${colors[posture]}">
    <tr><td>${item.symbol}</td></tr>
    <tr><td><a href="https://bitscreener.com" target="_blank">https://bitscreener.com</td></tr>
    <tr><td><a href="https://www.binance.com/en/trade/pro/${item.symbol}" target="_blank">https://www.binance.com/en/trade/pro/${item.symbol}</td></tr>
    </table>\n`
    }
  }

  body += "</div></body></html>"

  return body
  // return "done"
}
