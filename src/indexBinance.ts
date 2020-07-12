import { exchangeInfo, marketPriceHistory, marketPosture, formatReport } from "./binance"
import * as axios from "axios"
import * as fs from "fs"
import * as path from "path"

const main = async () => {
  const markets = await exchangeInfo(axios)

  // BTC markets
  // console.log("markets", markets.btcMarkets)

  let date = new Date()
  let start = date.getTime()

  const reportsDir = path.resolve(__dirname, "../reports")
  let reportFile = "binance-btc.html"
  let reportPath = path.join(reportsDir, reportFile)

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
  fs.writeFileSync(reportPath, htmlReport, "utf8")
  console.log("==> binance.com BTC report done.")

  // ETH Markets
  // console.log("markets", markets.ethMarkets)

  date = new Date()
  start = date.getTime()

  reportFile = "binance-eth.html"
  reportPath = path.join(reportsDir, reportFile)

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
  fs.writeFileSync(reportPath, htmlReport, "utf8")
  console.log("==> binance.com ETH report done.")

  // USDT Markets
  // console.log("markets", markets.ethMarkets)

  date = new Date()
  start = date.getTime()

  reportFile = "binance-usdt.html"
  reportPath = path.join(reportsDir, reportFile)

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
  fs.writeFileSync(reportPath, htmlReport, "utf8")
  console.log("==> binance.com USDT report done.")

  return ""
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log("Error", err))

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
