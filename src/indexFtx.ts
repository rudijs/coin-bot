import { getMarkets, getMarketHistoricalCloses, marketPosture, formatReport } from "./ftx"
import axios from "axios"
import * as fs from "fs"

const main = async () => {
  if (!process.env.FTX_API_KEY || !process.env.FTX_SECRET) throw new Error("Missing required FTX env vars")

  const apiKey = process.env.FTX_API_KEY
  const apiSecret = process.env.FTX_SECRET

  // get Markets
  console.log("==> Fetching ftx.com markets...")
  const markets = await getMarkets(axios, apiKey, apiSecret)
  // console.log(markets)
  // const markets = ["BTC-PERP", "ETH-PERP"]

  const report: any = { SELL: [], BUY: [], HOLD: [], NOT_HOLD: [] }

  for (const market of markets) {
    // console.log(market)
    console.log(`Fetching ${market} historical data...`)
    const marketHistoricalCloseValues = await getMarketHistoricalCloses(axios, apiKey, apiSecret, market)
    // console.log(res)
    const thisMarketPosture = marketPosture(market, marketHistoricalCloseValues)
    // console.log(thisMarketPosture)
    report[thisMarketPosture.posture].push(thisMarketPosture)
  }

  // console.log(report)
  // console.log(formatReport(report))
  console.log("==> Writing ftx.com report...")
  fs.writeFileSync("./tmp/ftxReport.html", formatReport(report), "utf8")
  console.log("==> ftx.com report done.")

  return ""
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log("Error", err))
