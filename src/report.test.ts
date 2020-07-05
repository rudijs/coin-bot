import { sort, formatReport } from "./report"
import { data } from "./fixtures/report"
import { data as dataSorted } from "./fixtures/reportSorted"

describe("#report", () => {
  test("#sort", () => {
    const sorted = sort(data)
    // console.log(sorted)
    expect(sorted["SELL"].length).toEqual(0)
    expect(sorted["BUY"].length).toEqual(1)
    expect(sorted["HOLD"].length).toEqual(17)
    expect(sorted["NOT_HOLD"].length).toEqual(32)
  })

  test("#formatReport", () => {
    const res = formatReport(dataSorted)
    // console.log(res)
  })
})
