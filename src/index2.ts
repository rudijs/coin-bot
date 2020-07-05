import * as axios from "axios"
import { getTokens, tokenReport, sort, formatReport } from "./ethplorer"

const main = async () => {
  if (!process.env.API_KEY) throw new Error("Missing required API_KEY")

  const res = await getTokens(axios, process.env.API_KEY)
  // console.log(res)

  const report = await tokenReport(axios, res, process.env.API_KEY)
  // console.log(report)

  const sortedReport = sort(report)

  // console.log(JSON.stringify(sortedReport.SELL, null, 2))
  // console.log(JSON.stringify(sortedReport.BUY, null, 2))
  // console.log(JSON.stringify(sortedReport.HOLD, null, 2))
  // console.log(JSON.stringify(sortedReport.NOT_HOLD, null, 2))
  // console.log(JSON.stringify(sortedReport.UNKNOWN, null, 2))

  // return JSON.stringify(report)
  // console.log(sortedReport)
  // console.log(util.inspect(sortedReport, { showHidden: false, depth: null }))
  // console.log(JSON.stringify(sortedReport, null, 2))
  console.log(formatReport(sortedReport))
  return ""
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log("Error", err))