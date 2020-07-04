export const sort = (data: any) => {
  const report: any = { SELL: [], BUY: [], NOT_HOLD: [], HOLD: [] }

  // console.log(data)
  for (const item in data) {
    // console.log(item)
    if (report[data[item].posture]) {
      report[data[item].posture].push(item)
    } else {
      report[data[item].posture] = [item]
    }
  }

  return report
}
