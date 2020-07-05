import * as axios from "axios"
import { getTokens } from "./ethplorer"

const main = async () => {
  if (!process.env.API_KEY) throw new Error("Missing required API_KEY")

  const res = await getTokens(axios, process.env.API_KEY)

  console.log(res)

  return true
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log("Error", err))
