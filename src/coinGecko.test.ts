import { coinsMarkets, coinPriceHistory } from "./coinGecko"
// import * as axios from "axios"
import fixtureDataCoinsMarkets from "./fixtures/coinsMarkets.json"
import fixtureDataBitcoinMarketChart from "./fixtures/bitcoinMarketChart.json"

describe("coinsGecko", () => {
  const expectedMarkets = ["bitcoin", "ethereum", "tether", "ripple", "bitcoin-cash", "cardano", "bitcoin-cash-sv", "litecoin", "eos", "binancecoin"]

  test("#coinMarkets should return a list of coin ids", async () => {
    // console.log(await coinsMarkets(axios))

    const axiosMock = { get: () => Promise.resolve({ data: fixtureDataCoinsMarkets }) }

    const res = await coinsMarkets(axiosMock)

    expect(res).toEqual(expectedMarkets)
  })

  test("#coinPriceHistory", async () => {
    const axiosMock = { get: () => Promise.resolve({ data: fixtureDataBitcoinMarketChart }) }

    const expected = {
      bitcoin: {
        currentPrice: 9068.829235023099,
        currentEma21: 9258.000765954333,
        currentEma8: 9143.05276706753,
        previousEma8: 9164.259490508795,
        posture: "NOT_HOLD",
      },
      binancecoin: {
        currentPrice: 9068.829235023099,
        currentEma21: 9258.000765954333,
        currentEma8: 9143.05276706753,
        previousEma8: 9164.259490508795,
        posture: "NOT_HOLD",
      },
    }

    const res = await coinPriceHistory(axiosMock, ["bitcoin", "binancecoin"])
    // console.log(res)

    expect(res).toEqual(expected)
  })
})
