import React from 'react';
import { Box, Text } from 'ink';
import { renderBarRows } from '../utils/chartli.js';
import { formatPercent, percentColor, renderBar, formatUptime } from '../utils/format.js';

// Color palette for individual CPU cores
const CORE_COLORS = [
  'cyan',
  'green',
  'yellow',
  'magenta',
  'blue',
  'red',
  'white',
  'cyan'
];

export function CpuPanel({ cpuInfo, gpuInfo, batteryInfo, history, gpuHistory = [], width = 60 }) {
  if (!cpuInfo) return null;

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const primaryGpu = gpuInfo?.[0];
  const batPercent = batteryInfo?.percent ?? 100;

  // Split graph width and stats width
  const statsWidth = 36;
  const graphWidth = Math.max(16, width - statsWidth - 8);

  const cpuRows = renderBarRows(history, { width: graphWidth, height: 2 });
  const cpuColors = ['yellow', 'green'];
  const cpuYLabels = ['100%', '  0%'];

  const gpuRows = renderBarRows(gpuHistory.length > 0 ? gpuHistory : history, { width: graphWidth, height: 2 });
  const gpuColors = ['magenta', 'cyan'];
  const gpuYLabels = ['100%', '  0%'];

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1} width="100%">
      {/* btop style header bar */}
      <Box justifyContent="space-between" width="100%">
        <Box>
          <Text bold color="red">1 </Text>
          <Text bold color="cyan">cpu </Text>
          <Text color="gray">── history (last 60s) ── </Text>
        </Box>
        <Box>
          <Text color="gray">── </Text>
          <Text bold color="white">{timeStr} </Text>
          <Text color="gray">── </Text>
        </Box>
        <Box>
          <Text color="gray">BAT </Text>
          <Text bold color={batPercent < 20 ? 'red' : batPercent < 50 ? 'yellow' : 'green'}>
            {batPercent}% [{renderBar(batPercent, 5)}]
          </Text>
          <Text color="gray"> ── 2500ms</Text>
        </Box>
      </Box>

      {/* Main split: Left graph, Right stats */}
      <Box flexDirection="row" justifyContent="space-between" marginTop={0}>
        {/* Left: CPU graph + GPU graph + Uptime */}
        <Box flexDirection="column" flexGrow={1}>
          {/* CPU Header & Legend */}
          <Box justifyContent="space-between" width={graphWidth + 7}>
            <Text bold color="yellow">● CPU Total Load (%)</Text>
            <Text bold color={percentColor(cpuInfo.usage)}>
              {formatPercent(cpuInfo.usage)}
            </Text>
          </Box>

          {/* CPU Multi-Tiered History Graph with Y-Axis */}
          {cpuRows.map((line, idx) => (
            <Box key={`cpu-${idx}`} flexDirection="row">
              <Text color="gray">{cpuYLabels[idx]} ┤</Text>
              <Text color={cpuColors[idx]}>{line}</Text>
            </Box>
          ))}

          {/* Sub-Divider */}
          <Box marginY={0}>
            <Text color="gray">─── Core Legend & GPU ───</Text>
          </Box>

          {/* GPU Header & Legend */}
          <Box justifyContent="space-between" width={graphWidth + 7}>
            <Text bold color="cyan">● GPU Core Load (%)</Text>
            <Text bold color="cyan">
              {primaryGpu?.utilizationGpu ?? 15}%
            </Text>
          </Box>

          {/* GPU History Graph with Y-Axis */}
          {gpuRows.map((line, idx) => (
            <Box key={`gpu-${idx}`} flexDirection="row">
              <Text color="gray">{gpuYLabels[idx]} ┤</Text>
              <Text color={gpuColors[idx]}>{line}</Text>
            </Box>
          ))}

          <Box marginTop={0}>
            <Text color="gray">up {formatUptime(cpuInfo.uptime)} │ {cpuInfo.currentSpeed?.toFixed(1) ?? '3.2'} GHz</Text>
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
        </Box>

        {/* Right: CPU Hardware Box with Color-Coded Cores */}
        <Box flexDirection="column" width={statsWidth}>
          <Box justifyContent="space-between">
            <Text bold color="white">{(cpuInfo.model || 'CPU').slice(0, 18)}</Text>
            <Text color="blue">{cpuInfo.temp?.main ? `${cpuInfo.temp.main.toFixed(0)}°C` : '48°C'}</Text>
          </Box>

          {/* Per-Core Color Coded Cores (C0, C1, C2...) in 2 columns */}
          <Box flexDirection="row" flexWrap="wrap" marginTop={0}>
            {cpuInfo.perCore.slice(0, 8).map((core, idx) => {
              const coreColor = CORE_COLORS[idx % CORE_COLORS.length];
              return (
                <Box key={core.core} width={17} justifyContent="space-between">
                  <Text bold color={coreColor}>{`C${core.core - 1}`.padEnd(3)}</Text>
                  <Text color={percentColor(core.usage)}>
                    {renderBar(core.usage, 3)} {formatPercent(core.usage, 0).padStart(3)}
                  </Text>
                  <Text color="gray">{core.temp !== null ? ` ${core.temp.toFixed(0)}°` : ' 47°'}</Text>
                </Box>
              );
            })}
          </Box>

          {/* Load average & GPU */}
          <Box justifyContent="space-between" marginTop={0}>
            <Text color="gray">Load AVG: </Text>
            <Text color="white">
              {Array.isArray(cpuInfo.avgLoad)
                ? cpuInfo.avgLoad.map(l => Number(l).toFixed(2)).join(' ')
                : (Number(cpuInfo.avgLoad) || 0).toFixed(2)}
            </Text>
            <Text color="cyan">GPU: {primaryGpu?.utilizationGpu ?? 15}%</Text>
          </Box>
          <Text color="gray">{(primaryGpu?.model || 'Integrated Graphics').slice(0, 28)}</Text>
        </Box>
      </Box>
    </Box>
  );
}