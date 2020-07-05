export const sort = (data: any) => {
  const report: any = { SELL: [], BUY: [], HOLD: [], NOT_HOLD: [] }

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

export const formatReport = (data: any) => {
  const colors: any = {
    SELL: "#f3d8d7",
    BUY: "#a5eabf",
    HOLD: "#a5d7f4",
    NOT_HOLD: "#925b4d",
    UNKNOWN: "#c5c5c5",
  }

  let body = `<html><head><style>
      table {
        width: 600px;
        border-collapse: collapse;
        margin-bottom: 50px;
      }

      table,
      th,
      td {
        border: 1px solid black;
        padding: 15px;
      }
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
</style>
</head>
<body><div class="box">\n`

  // console.log(data)
  for (const posture of Object.keys(data)) {
    for (const item of data[posture]) {
      body += `<table style="background-color: ${colors[posture]}">
    <tr><td>${item}</td></tr>
    <tr><td><a href="https://bitscreener.com/coins/${item}/chart" target="_blank">https://bitscreener.com/coins/${item}/chart</td></tr>
    <tr><td><a href="https://www.coingecko.com/en/coins/${item}#markets" target="_blank">https://www.coingecko.com/en/coins/${item}#markets</td></tr>
    <tr><td><a href="https://coinmarketcap.com/currencies/${item}" target="_blank">https://coinmarketcap.com/currencies/${item}</td></tr>
    </table>\n`
    }
  }

  body += "</div></body></html>"

  return body
  // return "done"
}
