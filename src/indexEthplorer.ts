import * as axios from "axios"
import { getTokens, tokenReport, sort, formatReport } from "./ethplorer"
import * as fs from "fs"
import * as path from "path"

const main = async () => {
  if (!process.env.API_KEY) throw new Error("Missing required API_KEY")

  const date = new Date()
  const start = date.getTime()

  const reportsDir = path.resolve(__dirname, "../reports")
  const reportFile = "ethplorer.html"
  const reportPath = path.join(reportsDir, reportFile)

  const res = await getTokens(axios, process.env.API_KEY)
  // console.log(res)

  const report = await tokenReport(axios, res, process.env.API_KEY)
  // console.log(report)

  const sortedReport = sort(report)

  const end = new Date().getTime()
  const durationSeconds = (end - start) / 1000

  console.log("==> Writing ethplorer.io report...")
  fs.writeFileSync(reportPath, formatReport(sortedReport, date, durationSeconds), "utf8")
  console.log("==> ethplorer.io report done.")

  return ""
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log("Error", err))
