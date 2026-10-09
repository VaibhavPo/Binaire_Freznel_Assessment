import React from 'react';
import { Box, Text } from 'ink';
import { formatUptime } from '../utils/format.js';

export function Header({ cpuInfo, batteryInfo }) {
  if (!cpuInfo) return null;

  return (
    <Box justifyContent="space-between" paddingX={1}>
      <Text color="gray">up {formatUptime(cpuInfo.uptime)}</Text>
      <Text>
        Load AVG: {cpuInfo.avgLoad?.toFixed(2) ?? 'N/A'}
      </Text>
      {batteryInfo?.hasBattery && (
        <Text color={batteryInfo.isCharging ? 'green' : 'yellow'}>
          BAT {batteryInfo.percent}%
        </Text>
      )}
    </Box>
  );
}