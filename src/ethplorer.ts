export const getTokens = async (axios: any, apiKey: string) => {
  let tokens: any = {}

  // top 50 tokens by capitalization
  let url = `https://api.ethplorer.io/getTop?apiKey=${apiKey}&criteria=cap`
  // console.log(url)
  const cap = await axios.get(url)

  // console.log(cap.data.tokens)
  tokens = appendTokens(tokens, cap.data.tokens)

  // top 50 tokens by Trade Volume
  url = `https://api.ethplorer.io/getTop?apiKey=${apiKey}&criteria=trade`
  const trade = await axios.get(url)
  tokens = appendTokens(tokens, trade.data.tokens)

  // top 50 tokens by Operations
  url = `https://api.ethplorer.io/getTop?apiKey=${apiKey}&criteria=count`
  const count = await axios.get(url)
  tokens = appendTokens(tokens, count.data.tokens)

  return tokens
}

function appendTokens(tokens: any, data: any) {
  for (const item of data) {
    // console.log(item.name)
    if (!tokens[item.address]) {
      tokens[item.address] = {
        name: item.name,
        address: item.address,
        symbol: item.symbol,
        coinGecko: `https://www.coingecko.com/en/coins/${item.name.toLowerCase()}#markets`,
        coinMarketCap: `https://coinmarketcap.com/currencies/${item.name.toLowerCase()}/markets`,
      }
    }
  }
  return tokens
}
