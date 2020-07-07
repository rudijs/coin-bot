import * as axios from "axios"
import { getTokens, tokenReport, sort, formatReport } from "./ethplorer"
import * as fs from "fs"

const main = async () => {
  if (!process.env.API_KEY) throw new Error("Missing required API_KEY")

  const res = await getTokens(axios, process.env.API_KEY)
  // console.log(res)

  const report = await tokenReport(axios, res, process.env.API_KEY)
  // console.log(report)

  const sortedReport = sort(report)

  console.log("==> Writing ethplorer.io report...")
  fs.writeFileSync("./tmp/ethplorerReport.html", formatReport(sortedReport), "utf8")
  console.log("==> ethplorer.io report done.")

  return ""
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log("Error", err))
