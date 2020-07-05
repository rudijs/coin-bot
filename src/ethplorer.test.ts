import { getTokens, getTokenPriceHistoryGrouped, tokenReport } from "./ethplorer"
import topCapitalization from "./fixtures/ethplorer-top-50-erc-20-cap.json"
import tokenPriceHistory from "./fixtures/tokenPriceHistoryGrouped.json"
import { data } from "./fixtures/ethplorer-top-50-erc-20-all"

describe("#ethplorer", () => {
  test("#getTokens", async () => {
    const axiosMock = { get: () => Promise.resolve({ data: topCapitalization }) }

    const res = await getTokens(axiosMock, "abc123")
    // console.log(res)

    expect(Object.keys(res).length).toEqual(51)
  })

  test("#getTokenPriceHistoryGrouped", async () => {
    const axiosMock = { get: () => Promise.resolve({ data: tokenPriceHistory }) }

    const expected = {
      currentPrice: 0.00334409200212,
      currentEma21: 0.003158395147838095,
      currentEma8: 0.0031844431836846776,
      previousEma8: 0.0031388292355602997,
      posture: "HOLD",
    }

    const res = await getTokenPriceHistoryGrouped(axiosMock, "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39", "abc123")
    // console.log(res)

    expect(res).toEqual(expected)
  })

  test("#tokenReport", async () => {
    // console.log(tokenPriceHistory)
    const axiosMock = { get: () => Promise.resolve({ data: tokenPriceHistory }) }
    const res = await tokenReport(axiosMock, data, "abc123")
    // console.log(res)
  })
})
