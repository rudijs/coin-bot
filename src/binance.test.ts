import { exchangeInfo, marketPriceHistory, marketPosture } from "./binance"
import binanceExchangeInfo from "./fixtures/binanceExchangeInfo.json"
import binancePriceHistoryEthBtc from "./fixtures/binancePriceHistoryEthBtc.json"
// import * as axios from "axios"

describe("binance", () => {
  test("#exchangeInfo", async () => {
    const axiosMock = { get: () => Promise.resolve({ data: binanceExchangeInfo }) }
    const res = await exchangeInfo(axiosMock)
    expect(res.btcMarkets.length).toEqual(180)
    expect(res.ethMarkets.length).toEqual(86)
    expect(res.usdtMarkets.length).toEqual(121)
    // console.log(res.btcMarkets[0])
  })

  test("#marketPriceHistory", async () => {
    const axiosMock = { get: () => Promise.resolve({ data: binancePriceHistoryEthBtc }) }
    const res = await marketPriceHistory(axiosMock, "ETHBTC")
    // console.log(res)
    expect(res.length).toEqual(500)
  })

  test("#marketPosture", () => {
    const expected = {
      symbol: "ETHBTC",
      currentPrice: 0.025902,
      previousPrice: 0.025973,
      currentEma21: 0.025339925400272762,
      currentEma8: 0.02576642343529655,
      posture: "HOLD",
    }

    const res = marketPosture(binancePriceHistoryEthBtc, "ETHBTC")
    // console.log(res)
    expect(res).toEqual(expected)
  })
})
