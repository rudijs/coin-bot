#!/bin/bash

echo "==> Building ftx report..."
node ../dist/indexFtx.js

echo "==> Building ethplorer report..."
node ../dist/indexEthplorer.js

echo "==> Building coingecko report..."
node ../dist/indexCoingecko.js

echo "==> Done."
