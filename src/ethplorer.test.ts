import { getTokens } from "./ethplorer"
import topCapitalization from "./fixtures/ethplorer-top-50-erc-20-cap.json"

describe("#ethplorer", () => {
  test("#getTokens", async () => {
    const axiosMock = { get: () => Promise.resolve({ data: topCapitalization }) }

    const res = await getTokens(axiosMock, "abc123")
    // console.log(res)

    expect(Object.keys(res).length).toEqual(51)
  })
})
