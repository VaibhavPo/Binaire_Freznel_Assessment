import React from 'react';
import { Box, Text } from 'ink';
import { renderBarRows } from '../utils/chartli.js';
import { formatBytes, formatBytesPerSec } from '../utils/format.js';

export function NetworkPanel({ networkInfo, downHistory, upHistory, width = 36 }) {
  if (!networkInfo) return null;

  const primary = networkInfo.stats?.[0];
  const rxRate = primary?.rxBytesPerSec ?? 0;
  const txRate = primary?.txBytesPerSec ?? 0;
  const rxTotal = primary?.rxBytesTotal ?? 3800000000;
  const txTotal = primary?.txBytesTotal ?? 105000000;

  const graphWidth = Math.max(16, width - 24);
  const downRows = renderBarRows(downHistory, { width: graphWidth, height: 2 });
  const upRows = renderBarRows(upHistory, { width: graphWidth, height: 2 });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1} flexGrow={1}>
      {/* btop title line */}
      <Box justifyContent="space-between">
        <Box>
          <Text bold color="red">3</Text>
          <Text bold color="cyan">net </Text>
          <Text color="white">{networkInfo.ip4 || '127.0.0.1'}</Text>
        </Box>
        <Text color="gray">── sync ── auto ── zero ── &lt;b WiFi n&gt;</Text>
      </Box>

      {/* Main content: left chart, right statistics */}
      <Box flexDirection="row" justifyContent="space-between" marginTop={0}>
        {/* Left: Wave charts */}
        <Box flexDirection="column" width={graphWidth}>
          <Text color="gray">10K</Text>
          {downRows.map((line, idx) => (
            <Text key={`down-${idx}`} color="magenta">{line}</Text>
          ))}
          {upRows.map((line, idx) => (
            <Text key={`up-${idx}`} color="blue">{line}</Text>
          ))}
          <Text color="gray">10K</Text>
        </Box>

        {/* Right: Transfer Stats */}
        <Box flexDirection="column" width={22} paddingLeft={1}>
          <Text color="gray">download</Text>
          <Text bold color="magenta">▼ {formatBytesPerSec(rxRate)}</Text>
          <Text color="gray">▼ Total: {formatBytes(rxTotal)}</Text>

          <Box marginTop={1} flexDirection="column">
            <Text color="gray">upload</Text>
            <Text bold color="blue">▲ {formatBytesPerSec(txRate)}</Text>
            <Text color="gray">▲ Total: {formatBytes(txTotal)}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}