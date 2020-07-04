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
