import React from 'react';
import { Box, Text } from 'ink';
import { renderBarRows } from '../utils/chartli.js';
import { formatPercent, percentColor, renderBar, formatUptime } from '../utils/format.js';

export function CpuPanel({ cpuInfo, gpuInfo, batteryInfo, history, gpuHistory = [], width = 60 }) {
  if (!cpuInfo) return null;

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const primaryGpu = gpuInfo?.[0];
  const batPercent = batteryInfo?.percent ?? 100;

  // Split graph width and stats width
  const statsWidth = 36;
  const graphWidth = Math.max(25, width - statsWidth - 4);

  const cpuRows = renderBarRows(history, { width: graphWidth, height: 3 });
  const cpuColors = ['red', 'yellow', 'green'];

  const gpuRows = renderBarRows(gpuHistory.length > 0 ? gpuHistory : history, { width: graphWidth, height: 2 });
  const gpuColors = ['yellow', 'green'];

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1} flexGrow={1}>
      {/* btop style header bar */}
      <Box justifyContent="space-between" width="100%">
        <Box>
          <Text bold color="red">1</Text>
          <Text bold color="cyan">cpu </Text>
          <Text color="gray">── menu ── preset * </Text>
        </Box>
        <Box>
          <Text color="gray">── </Text>
          <Text bold color="white">{timeStr} </Text>
          <Text color="gray">── </Text>
        </Box>
        <Box>
          <Text color="gray">BAT </Text>
          <Text bold color={batPercent < 20 ? 'red' : batPercent < 50 ? 'yellow' : 'green'}>
            {batPercent}% [{renderBar(batPercent, 6)}]
          </Text>
          <Text color="gray"> ── 2500ms +</Text>
        </Box>
      </Box>

      {/* Main split: Left graph, Right stats */}
      <Box flexDirection="row" justifyContent="space-between" marginTop={1}>
        {/* Left: CPU graph + GPU graph + Uptime */}
        <Box flexDirection="column" flexGrow={1}>
          {cpuRows.map((line, idx) => (
            <Text key={`cpu-${idx}`} color={cpuColors[idx]}>
              {line}
            </Text>
          ))}
          <Box marginY={0}>
            <Text color="gray">──────── cpu ▲▼ gpu ────────</Text>
          </Box>
          {gpuRows.map((line, idx) => (
            <Text key={`gpu-${idx}`} color={gpuColors[idx]}>
              {line}
            </Text>
          ))}
          <Box marginTop={0}>
            <Text color="gray">up {formatUptime(cpuInfo.uptime)}</Text>
          </Box>
        </Box>

        {/* Vertical divider */}
        <Box marginX={1} flexDirection="column">
          <Text color="gray">│</Text>
          <Text color="gray">│</Text>
          <Text color="gray">│</Text>
          <Text color="gray">│</Text>
          <Text color="gray">│</Text>
          <Text color="gray">│</Text>
          <Text color="gray">│</Text>
          <Text color="gray">│</Text>
          <Text color="gray">│</Text>
        </Box>

        {/* Right: CPU Hardware Box */}
        <Box flexDirection="column" width={statsWidth}>
          <Box justifyContent="space-between">
            <Text bold color="white">{(cpuInfo.model || 'CPU').slice(0, 20)}</Text>
            <Text color="cyan">{cpuInfo.currentSpeed?.toFixed(1) ?? '3.2'} GHz</Text>
          </Box>

          {/* Overall CPU load */}
          <Box justifyContent="space-between" marginTop={0}>
            <Text bold>CPU </Text>
            <Text color={percentColor(cpuInfo.usage)}>
              {renderBar(cpuInfo.usage, 8)} {formatPercent(cpuInfo.usage).padStart(5)}
            </Text>
            <Text color="blue">
              {cpuInfo.temp?.main ? ` ${cpuInfo.temp.main.toFixed(0)}°C` : ' 48°C'}
            </Text>
          </Box>

          {/* Per-Core mini-bars in 2 columns */}
          <Box flexDirection="row" flexWrap="wrap" marginTop={0}>
            {cpuInfo.perCore.slice(0, 8).map(core => (
              <Box key={core.core} width={17} justifyContent="space-between">
                <Text color="gray">{`C${core.core - 1}`}</Text>
                <Text color={percentColor(core.usage)}>
                  {renderBar(core.usage, 4)} {formatPercent(core.usage, 0).padStart(4)}
                </Text>
                <Text color="blue">{core.temp !== null ? ` ${core.temp.toFixed(0)}°` : ' 47°'}</Text>
              </Box>
            ))}
          </Box>

          {/* Load average */}
          <Box marginTop={1}>
            <Text color="gray">Load AVG: </Text>
            <Text color="white">
              {Array.isArray(cpuInfo.avgLoad)
                ? cpuInfo.avgLoad.map(l => Number(l).toFixed(2)).join(' ')
                : (Number(cpuInfo.avgLoad) || 0).toFixed(2)}
            </Text>
          </Box>

          {/* GPU info */}
          <Box justifyContent="space-between" marginTop={0}>
            <Text bold>GPU </Text>
            <Text color="green">
              {renderBar(primaryGpu?.utilizationGpu ?? 15, 8)} {(primaryGpu?.utilizationGpu ?? 15)}%
            </Text>
            <Text color="blue">
              {primaryGpu?.temperatureGpu ? ` ${primaryGpu.temperatureGpu}°C` : ' 48°C'}
            </Text>
          </Box>
          <Text color="gray">{(primaryGpu?.model || 'HD Graphics / Dedicated').slice(0, 30)}</Text>
        </Box>
      </Box>
    </Box>
  );
}