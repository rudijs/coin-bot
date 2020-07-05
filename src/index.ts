import { coinsMarkets, coinPriceHistory } from "./coinGecko"
import { sort, formatReport } from "./report"
import * as axios from "axios"

const main = async () => {
  const markets = await coinsMarkets(axios)
  // console.log("markets", markets)

  const signals = await coinPriceHistory(axios, markets)
  // console.log(signals)

  const sortedSignals = sort(signals)

  const htmlReport = formatReport(sortedSignals)
  console.log(htmlReport)

  return ""

  // console.log("SELL", JSON.stringify(sortedSignals.SELL, null, 2))
  // console.log("BUY", JSON.stringify(sortedSignals.BUY, null, 2))
  // console.log("HOLD", JSON.stringify(sortedSignals.HOLD, null, 2))
  // console.log("NOT_HOLD", JSON.stringify(sortedSignals.NOT_HOLD, null, 2))
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log("Error", err))
