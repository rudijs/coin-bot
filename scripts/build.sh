#!/bin/bash

echo "==> Building ftx report..."
node ../dist/index3.js > ../tmp/ftxReport.html

echo "==> Building ethplorer report..."
node ../dist/index2.js > ../tmp/ethplorerReport.html

echo "==> Building coingecko report..."
node ../dist/index.js > ../tmp/coinGeckoReport.html

echo "==> Done."
