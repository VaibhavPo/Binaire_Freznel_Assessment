import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { formatBytes, formatPercent, percentColor, renderBar } from '../utils/format.js';

export function ProcessPanel({ processes = [], maxRows = 7, sortBy = 'cpu', selectedIndex = 0 }) {
  if (!processes || processes.length === 0) return null;

  const sorted = [...processes].sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));
  const totalCount = sorted.length;

  // Calculate sliding viewport window
  const halfWindow = Math.floor(maxRows / 2);
  let startIndex = Math.max(0, selectedIndex - halfWindow);
  if (startIndex + maxRows > totalCount) {
    startIndex = Math.max(0, totalCount - maxRows);
  }
  const visibleProcesses = sorted.slice(startIndex, startIndex + maxRows);

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1} flexGrow={1}>
      {/* btop title bar */}
      <Box justifyContent="space-between">
        <Box>
          <Text bold color="red">4</Text>
          <Text bold color="cyan">proc </Text>
          <Text color="gray">── filter ── per-core ── reverse ── tree ── services ── </Text>
          <Text color="white">&lt; cpu lazy &gt;</Text>
        </Box>
      </Box>

      {/* Table Headers */}
      <Box justifyContent="space-between" marginY={0}>
        <Text bold color="cyan">{'Pid:'.padEnd(7)}</Text>
        <Text bold color="cyan">{'Program:'.padEnd(14)}</Text>
        <Text bold color="cyan">{'Command:'.padEnd(18)}</Text>
        <Text bold color="cyan">{'Threads:'.padEnd(8)}</Text>
        <Text bold color="cyan">{'User:'.padEnd(10)}</Text>
        <Text bold color="cyan">{'MemB'.padEnd(8)}</Text>
        <Text bold color="cyan">{'Cpu% ↑'.padStart(8)}</Text>
      </Box>

      {/* Process Rows */}
      {visibleProcesses.map((p, idx) => {
        const actualIndex = startIndex + idx;
        const isSelected = actualIndex === selectedIndex;
        const memFormatted = p.memRss ? `${(p.memRss / 1024).toFixed(0)}M` : `${formatBytes(p.memory * 1024 * 1024 * 50)}`;
        const cpuVal = p.cpu ?? 0;

        return (
          <Box key={p.pid} justifyContent="space-between" width="100%">
            <Text color={isSelected ? 'yellow' : 'gray'}>
              {isSelected ? '▶' : ' '}{String(p.pid).padEnd(6).slice(0, 6)}
            </Text>
            <Text bold color={isSelected ? 'yellow' : 'cyan'}>
              {(p.name || '').slice(0, 11).padEnd(12)}
            </Text>
            <Text color="gray">{(p.command || p.name || '').slice(0, 14).padEnd(15)}</Text>
            <Text color="green">{String(p.threads || 1).padEnd(6).slice(0, 6)}</Text>
            <Text color="gray">{(p.user || 'SYSTEM').slice(0, 8).padEnd(9)}</Text>
            <Text color="white">{memFormatted.padEnd(7).slice(0, 7)}</Text>
            <Text color={percentColor(cpuVal)}>
              {formatPercent(cpuVal).padStart(5)} {renderBar(cpuVal, 2)}
            </Text>
          </Box>
        );
      })}

      {/* btop Footer with interactive scroll index */}
      <Box justifyContent="space-between" marginTop={0}>
        <Box>
          <Text color="red">↑/↓ select </Text>
          <Text color="yellow">PgUp/PgDn </Text>
          <Text color="red">terminate</Text>
        </Box>
        <Text color="cyan">{selectedIndex + 1}/{totalCount}</Text>
      </Box>
    </Box>
  );
}