# coin-bot

Read the coingecko.com crypto currency api and report on assets to buy, sell, hold, not_hold

get coin list

for each coin calculate EMAs

if current < 21 then NOT_HOLD
if current > 21
if current > 8
if prev < 8 then BUY
if prev > 8 then HOLD
if current < 8
if prev > 8 then SELL
if prev < 8 then NOT_HOLD

// top 50
https://api.ethplorer.io/getTop?apiKey=${API_KEY}&criteria=cap -o erc-20-cap.json
curl "https://api.ethplorer.io/getTop?apiKey=${API_KEY}&criteria=cap" -o ethplorer-top-50-erc-20-cap.json
curl "https://api.ethplorer.io/getTop?apiKey=${API_KEY}&criteria=trade" -o ethplorer-top-50-erc-20-trade.json
curl "https://api.ethplorer.io/getTop?apiKey=${API_KEY}&criteria=count" -o ethplorer-top-50-erc-20-count.json

// asset price history
curl 'https://api.ethplorer.io/getTokenPriceHistoryGrouped/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39?apiKey=${API_KEY}' -o asset.json
// uniswap
https://app.uniswap.org/#/swap?inputCurrency=0xed1199093b1abd07a368dd1c0cdc77d8517ba2a0
