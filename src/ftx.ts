import { ftxApi, ftxParams } from "./ftxApi"
import { EMA, HeikinAshi } from "technicalindicators"

export const getMarkets = async (axios: any, apiKey: string, apiSecret: string) => {
  const method = "GET"
  const path = `/api/markets`
  const params: ftxParams = {
    axios,
    apiKey,
    apiSecret,
    method,
    path,
  }
  const res = await ftxApi(params)
  // console.log(res)

  const perpMarkets = res.result
    .filter((item: any) => item.name.indexOf("PERP") > 0)
    .map((item: any) => item.name)
    .sort()
  // console.log(perpMarkets)
  return perpMarkets
}

export const getMarketHistoricalCloses = async (axios: any, apiKey: string, apiSecret: string, market: string) => {
  const method = "GET"
  // const market = "BTC-PERP"
  const resolution = 86400 // daily
  const limit = 100
  const path = `/api/markets/${market}/candles?resolution=${resolution}&limit=${limit}`
  const params: ftxParams = {
    axios,
    apiKey,
    apiSecret,
    method,
    path,
  }
  const res = await ftxApi(params)
  // console.log(res)
  res.result.pop() // remove today's OHLC, we decide on the close of yesterday's price action
  // console.log(res.result)

  // create Heiken Aishi OHLC
  const data = {
    open: Array(),
    high: Array(),
    low: Array(),
    close: Array(),
  }

  for (const ohlc of res.result) {
    data.open.push(ohlc.open)
    data.high.push(ohlc.high)
    data.low.push(ohlc.low)
    data.close.push(ohlc.close)
  }

  const heikinAshi = HeikinAshi.calculate(data)
  // console.log(heikinAshi)

  // value for regular candlesticks
  // const values = res.result.map((item: any) => item.close) // console.log(values)
  // return values

  return heikinAshi.close!
}

export const marketPosture = (market: string, closeValues: number[]) => {
  const currentPrice = closeValues[closeValues.length - 1]
  const previousPrice = closeValues[closeValues.length - 2]

  const ema21 = EMA.calculate({ period: 21, values: closeValues })
  const currentEma21 = ema21[ema21.length - 1]
  // console.log(currentEma21)

  const ema8 = EMA.calculate({ period: 8, values: closeValues })
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
    market,
    currentPrice,
    previousPrice,
    currentEma21,
    currentEma8,
    posture,
  }
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

    <title>FTX Report</title>
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
<body><div class="box"><h1>Ftx.com Report</h1>\n`

  // console.log(data)
  for (const posture of Object.keys(data)) {
    for (const item of data[posture]) {
      body += `<table style="background-color: ${colors[item.posture]}">
    <tr><td>${item.market}</td></tr>
    <tr><td><a href="https://ftx.com/trade/${item.market}" target="_blank">https://ftx.com/trade/${item.market}</td></tr>
    <tr><td><a href="https://bitscreener.com/coins/${item.market.replace(
      "-PERP",
      ""
    )}/chart" target="_blank">https://bitscreener.com/coins/${item.market.replace("-PERP", "")}/chart</td></tr>
    </table>\n`
    }
  }

  body += "</div></body></html>"

  return body
  // return "done"
}
