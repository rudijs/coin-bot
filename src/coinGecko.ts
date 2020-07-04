import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { EMA } from "technicalindicators"

export const coinsMarkets = async (axios: any) => {
  const markets = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false")
  // console.log(101, markets)

  const coinIdList = markets.data.map((item: any) => item.id)
  // console.log(coinIdList)

  return coinIdList
}

export const coinPriceHistory = async (axios: any, coinIdList: string[]) => {
  const today = dayjs.utc().format("YYYY-MM-DD")

  const todayUnixMilliseconds = dayjs(`${today}T00:00:00.000Z`).valueOf()

  const report: any = {}

  for (const item of coinIdList) {
    // Minutely data will be used for duration within 1 day, Hourly data will be used for duration between 1 day and 90 days,
    // Daily data will be used for duration above 90 days.
    const url = `https://api.coingecko.com/api/v3/coins/${item}/market_chart?vs_currency=usd&days=91`
    // console.log(url)

    const res = await axios.get(url)
    // console.log(res.data)

    const prices = []

    for (const item of res.data.prices) {
      const time = item[0]
      const price = item[1]
      const date = new Date(time)
      // console.log(date, time, price)
      if (time <= todayUnixMilliseconds) {
        // prices.push({ date, time, price })
        prices.push(price)
      }
    }
    // console.log("prices", prices.length)

    const currentPrice = prices[prices.length - 1]
    const previousPrice = prices[prices.length - 2]

    const ema21 = EMA.calculate({ period: 21, values: prices })
    const currentEma21 = ema21[ema21.length - 1]
    // console.log(currentEma21)

    const ema8 = EMA.calculate({ period: 8, values: prices })
    const currentEma8 = ema8[ema8.length - 1]
    const previousEma8 = ema8[ema8.length - 2]

    /*
if current < 21 then NOT_HOLD
if current > 21
if current > 8
if prev < 8 then BUY
if prev > 8 then HOLD
if current < 8
if prev > 8 then SELL
if prev < 8 then NOT_HOLD
*/
    let posture = "NOT_HOLD"

    // if we are above the Daily 21 EMA look for entry/exit
    if (currentPrice > currentEma21) {
      // are we above the Daily 8 EMA
      if (currentPrice > currentEma8) {
        // if we just moved above the Daily 8 EMA it's a Buy
        if (previousPrice < previousEma8) posture = "BUY"
        // if we are still above the Daily 8 EMA it's a Hold
        if (previousPrice > previousEma8) posture = "HOLD"
      }

      // are we below the Daily 8 EMA
      if (currentPrice < currentEma8) {
        // if we just moved below the Daily 8 EMA it's a Sell
        if (previousPrice > previousEma8) posture = "SELL"
        // if we are still below the Daily 8 EMA we should (already) not be holding
        if (previousPrice < previousEma8) posture = "NOT_HOLD"
      }
    }

    report[item] = {
      currentPrice,
      currentEma21,
      currentEma8,
      previousEma8,
      posture,
    }

    // coingecko.com free API has a rate limit of 100 calls per minute - if you exceed that limit you will be blocked until the next 1 minute window
    // so we'll wait one second between api calls
    await sleep(1000)
  }

  return report
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
