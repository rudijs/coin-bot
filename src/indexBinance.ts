import { exchangeInfo, marketPriceHistory, marketPosture, formatReport } from "./binance"
import * as axios from "axios"
import * as fs from "fs"

const main = async () => {
  const markets = await exchangeInfo(axios)

  // BTC markets
  // console.log("markets", markets.btcMarkets)

  let date = new Date()
  let start = date.getTime()

  let signals: any = { SELL: [], BUY: [], HOLD: [], NOT_HOLD: [] }

  for (const market of markets.btcMarkets) {
    // console.log(market.symbol)
    const res = await marketPriceHistory(axios, market.symbol) // console.log(res)
    const posture = marketPosture(res, market.symbol) // console.log(posture)
    signals[posture.posture].push(posture)
    await sleep(500)
    // if (signals.NOT_HOLD.length === 1) break
  }

  // console.log(signals)

  let end = new Date().getTime()
  let durationSeconds = (end - start) / 1000

  let htmlReport = formatReport(signals, date, durationSeconds, "BTC") // console.log(htmlReport)

  console.log("==> Writing binance.com BTC report...")
  fs.writeFileSync("./tmp/binanceBtcReport.html", htmlReport, "utf8")
  console.log("==> binance.com BTC report done.")

  // ETH Markets
  // console.log("markets", markets.ethMarkets)

  date = new Date()
  start = date.getTime()

  signals = { SELL: [], BUY: [], HOLD: [], NOT_HOLD: [] }

  for (const market of markets.ethMarkets) {
    // console.log(market.symbol)
    const res = await marketPriceHistory(axios, market.symbol) // console.log(res)
    const posture = marketPosture(res, market.symbol) // console.log(posture)
    signals[posture.posture].push(posture)
    await sleep(500)
    // if (signals.NOT_HOLD.length === 1) break
  }

  // console.log(signals)

  end = new Date().getTime()
  durationSeconds = (end - start) / 1000

  htmlReport = formatReport(signals, date, durationSeconds, "ETH") // console.log(htmlReport)

  console.log("==> Writing binance.com ETH report...")
  fs.writeFileSync("./tmp/binanceEthReport.html", htmlReport, "utf8")
  console.log("==> binance.com ETH report done.")

  // USDT Markets
  // console.log("markets", markets.ethMarkets)

  date = new Date()
  start = date.getTime()

  signals = { SELL: [], BUY: [], HOLD: [], NOT_HOLD: [] }

  for (const market of markets.usdtMarkets) {
    // console.log(market.symbol)
    const res = await marketPriceHistory(axios, market.symbol) // console.log(res)
    const posture = marketPosture(res, market.symbol) // console.log(posture)
    signals[posture.posture].push(posture)
    await sleep(500)
    // if (signals.NOT_HOLD.length === 1) break
  }

  // console.log(signals)

  end = new Date().getTime()
  durationSeconds = (end - start) / 1000

  htmlReport = formatReport(signals, date, durationSeconds, "USDT") // console.log(htmlReport)

  console.log("==> Writing binance.com USDT report...")
  fs.writeFileSync("./tmp/binanceUsdtReport.html", htmlReport, "utf8")
  console.log("==> binance.com USDT report done.")

  return ""
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log("Error", err))

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
