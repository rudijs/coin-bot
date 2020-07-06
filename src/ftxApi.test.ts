/**
 * @jest-environment node
 */
import { ftxApi, ftxParams } from "./ftxApi"
import axios from "axios"

if (!process.env.FTX_API_KEY || !process.env.FTX_SECRET) throw new Error("Missing required FTX env vars")

const apiKey = process.env.FTX_API_KEY
const apiSecret = process.env.FTX_SECRET

describe("ftxApi", () => {
  test.skip("should get GET Perp only markets", async () => {
    const method = "GET"
    const path = `/api/markets`
    const params: ftxParams = {
      axios,
      apiKey,
      apiSecret,
      method,
      path,
    }
    const res = await ftxApi(params)
    // console.log(res)
    expect(res.success).toBeTruthy()

    const perpMarkets = res.result
      .filter((item: any) => item.name.indexOf("PERP") > 0)
      .map((item: any) => item.name)
      .sort()
    // console.log(perpMarkets)
    expect(perpMarkets.length).toBeGreaterThan(0)
  })

  test.skip("should GET historical data", async () => {
    const method = "GET"
    const market = "BTC-PERP"
    const resolution = 86400
    const limit = 3
    const path = `/api/markets/${market}/candles?resolution=${resolution}&limit=${limit}`
    const params: ftxParams = {
      axios,
      apiKey,
      apiSecret,
      method,
      path,
    }
    const res = await ftxApi(params)
    console.log(res.result)
    // expect(res.success).toBeTruthy()
    // expect(res.result.length).toEqual(200)
  })
})
