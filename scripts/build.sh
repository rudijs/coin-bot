#!/bin/bash

BASE_PATH=$(dirname $(readlink -f $0))

echo "==> Building ftx report..."
node $BASE_PATH/../dist/indexFtx.js

echo "==> Building binance reports..."
node $BASE_PATH/../dist/indexBinance.js

echo "==> Building ethplorer report..."
node $BASE_PATH/../dist/indexEthplorer.js

echo "==> Building coingecko report..."
node $BASE_PATH/../dist/indexCoingecko.js

echo "==> Done."
