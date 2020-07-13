/**
 * @jest-environment node
 */
import { getMarkets, getMarketHistoricalCloses, marketPosture } from "./ftx"
import axios from "axios"

if (!process.env.FTX_API_KEY || !process.env.FTX_SECRET) throw new Error("Missing required FTX env vars")

const apiKey = process.env.FTX_API_KEY
const apiSecret = process.env.FTX_SECRET

describe("ftx", () => {
  test.skip("#getMarkets", async () => {
    // const axiosMock = () => Promise.resolve({ result: ["BTC-PERP"] })

    const res = await getMarkets(axios, apiKey, apiSecret)
    // console.log(101, res)
  })

  test.skip("#getMarketHistoricalPrices", async () => {
    const resolution = 86400 // daily
    const res = await getMarketHistoricalCloses(axios, apiKey, apiSecret, "BTC-PERP", resolution)
    // console.log(101, res)
  })

  test.skip("#marketPosture", () => {
    const closeValues = [
      5872.5,
      6404.5,
      6418,
      6672,
      6795,
      6739,
      6867,
      6778,
      7340,
      7196.5,
      7369,
      7292.5,
      6872.5,
      6887,
      6910,
      6848.5,
      6874,
      6620,
      7116.5,
      7031,
      7256.5,
      7129,
      6830.5,
      6844.5,
      7134,
      7493.5,
      7509.5,
      7543,
      7710,
      7787.5,
      7750,
      8790,
      8631,
      8835,
      8982,
      8907.5,
      8886.5,
      9029,
      9148,
      10013,
      9815.5,
      9551.5,
      8726,
      8567,
      8821.5,
      9320,
      9798.5,
      9316.5,
      9381.5,
      9678,
      9731,
      9783,
      9508.5,
      9062,
      9167.5,
      9176,
      8708.5,
      8897,
      8836,
      9205.5,
      9581,
      9423.5,
      9704,
      9438.5,
      10247,
      9523,
      9671.5,
      9793.5,
      9616,
      9668.5,
      9758,
      9793.5,
      9783,
      9895,
      9270,
      9464,
      9474.5,
      9334.5,
      9428,
      9523.5,
      9459.5,
      9377,
      9299.5,
      9357.5,
      9288,
      9693.5,
      9625.5,
      9285,
      9240.5,
      9154,
      8999.5,
      9111.5,
      9188.5,
      9135.5,
      9237.5,
      9088,
      9055,
      9143.5,
      9077.5,
    ]

    const res = marketPosture("BTC-PERP", closeValues)
    console.log(res)
  })
})
