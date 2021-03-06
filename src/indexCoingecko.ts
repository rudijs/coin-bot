import { coinsMarkets, coinPriceHistory } from "./coinGecko"
import { sort, formatReport } from "./report"
import * as axios from "axios"
import * as fs from "fs"
import * as path from "path"

const main = async () => {
  const date = new Date()
  const start = date.getTime()

  const reportsDir = path.resolve(__dirname, "../reports")
  const reportFile = "coingecko.html"
  const reportPath = path.join(reportsDir, reportFile)

  const markets = await coinsMarkets(axios)
  // console.log("markets", markets)

  const signals = await coinPriceHistory(axios, markets)
  // console.log(signals)

  const sortedSignals = sort(signals)

  const end = new Date().getTime()
  const durationSeconds = (end - start) / 1000

  const htmlReport = formatReport(sortedSignals, date, durationSeconds)
  // console.log(htmlReport)
  console.log("==> Writing coingecko.com report...")
  fs.writeFileSync(reportPath, htmlReport, "utf8")
  console.log("==> coingecko.com report done.")

  return ""

  // console.log("SELL", JSON.stringify(sortedSignals.SELL, null, 2))
  // console.log("BUY", JSON.stringify(sortedSignals.BUY, null, 2))
  // console.log("HOLD", JSON.stringify(sortedSignals.HOLD, null, 2))
  // console.log("NOT_HOLD", JSON.stringify(sortedSignals.NOT_HOLD, null, 2))
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log("Error", err))
