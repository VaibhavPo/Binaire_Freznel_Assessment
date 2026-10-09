import React from 'react';
import { Box, Text } from 'ink';
import { formatBytes, formatPercent, percentColor, renderBar } from '../utils/format.js';

export function MemDiskPanel({ memoryInfo, diskInfo, gpuInfo }) {
  if (!memoryInfo) return null;

  const primaryDisk = diskInfo?.filesystems?.[0];
  const primaryGpu = gpuInfo?.[0];
  const usedPercent = memoryInfo.usage ?? 50;
  const availPercent = 100 - usedPercent;
  const cachePercent = memoryInfo.cached ? (memoryInfo.cached / memoryInfo.total) * 100 : 25;
  const commitPercent = memoryInfo.swap?.usage ?? 30;

  const diskUsedPercent = primaryDisk?.usagePercent ?? 50;
  const diskFreePercent = 100 - diskUsedPercent;

  return (
    <Box flexDirection="row" flexGrow={1}>
      {/* mem Box */}
      <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1} width="55%">
        <Box justifyContent="space-between">
          <Box>
            <Text bold color="red">2</Text>
            <Text bold color="cyan">mem</Text>
          </Box>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Total: </Text>
          <Text bold color="white">{formatBytes(memoryInfo.total)}</Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="red">Used  </Text>
          <Text color="red">{renderBar(usedPercent, 8)}</Text>
          <Text color="white"> {formatBytes(memoryInfo.used)}</Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="cyan">Avail </Text>
          <Text color="cyan">{renderBar(availPercent, 8)}</Text>
          <Text color="white"> {formatBytes(memoryInfo.available)}</Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="green">Cache </Text>
          <Text color="green">{renderBar(cachePercent, 8)}</Text>
          <Text color="white"> {formatBytes(memoryInfo.cached)}</Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="yellow">Commi </Text>
          <Text color="yellow">{renderBar(commitPercent, 8)}</Text>
          <Text color="white"> {formatBytes(memoryInfo.commitEstimate ?? (memoryInfo.swap?.used + memoryInfo.used))}</Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">GPU Mem: </Text>
          <Text color="white">{formatBytes(primaryGpu?.memoryUsed ? primaryGpu.memoryUsed * 1024 * 1024 : 350 * 1024 * 1024)}</Text>
        </Box>
      </Box>

      {/* disks Box */}
      <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1} width="45%">
        <Box justifyContent="space-between">
          <Text bold color="cyan">disks</Text>
          <Text color="gray">io</Text>
        </Box>

        {primaryDisk && (
          <Box flexDirection="column">
            <Box justifyContent="space-between">
              <Text bold color="white">{primaryDisk.mount} </Text>
              <Text color="gray">▼ 11M </Text>
              <Text color="white">{formatBytes(primaryDisk.size)}</Text>
            </Box>

            <Box marginTop={0}>
              <Text color="gray">IO%</Text>
            </Box>

            <Box justifyContent="space-between" marginTop={0}>
              <Text color="green">Free: {diskFreePercent.toFixed(0)}% </Text>
              <Text color="green">{renderBar(diskFreePercent, 6)}</Text>
              <Text color="white"> {formatBytes(primaryDisk.available)}</Text>
            </Box>

            <Box justifyContent="space-between" marginTop={0}>
              <Text color="red">Used: {diskUsedPercent.toFixed(0)}% </Text>
              <Text color="red">{renderBar(diskUsedPercent, 6)}</Text>
              <Text color="white"> {formatBytes(primaryDisk.used)}</Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}