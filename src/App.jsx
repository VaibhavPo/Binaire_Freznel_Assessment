import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, useStdout, useInput } from 'ink';
import { fetchAllData } from './utils/refreshFetch.js';
import { HistoryBuffer } from './utils/history.js';
import { CpuPanel } from './components/CpuPanel.jsx';
import { MemDiskPanel } from './components/MemDiskPanel.jsx';
import { NetworkPanel } from './components/NetworkPanel.jsx';
import { ProcessPanel } from './components/ProcessPanel.jsx';

const POLL_INTERVAL_MS = 2500;

export function App({ token }) {
  const { stdout } = useStdout();
  const [snapshot, setSnapshot] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global keyboard shortcuts (Ctrl+C, q to exit; Up/Down arrows to scroll processes)
  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      process.stdout.write('\x1b[?1049l\x1b[?25h');
      process.exit(0);
    }
    if (input === 'q' || input === 'Q') {
      process.stdout.write('\x1b[?1049l\x1b[?25h');
      process.exit(0);
    }
    const procCount = snapshot?.processes?.length ?? 1;
    if (key.downArrow) {
      setSelectedIndex(prev => Math.min(prev + 1, procCount - 1));
    }
    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    }
    if (key.pageDown) {
      setSelectedIndex(prev => Math.min(prev + 7, procCount - 1));
    }
    if (key.pageUp) {
      setSelectedIndex(prev => Math.max(prev - 7, 0));
    }
  });

  // Real system measurement buffers
  const cpuBuf = useRef(new HistoryBuffer(60));
  const gpuBuf = useRef(new HistoryBuffer(60));
  const downBuf = useRef(new HistoryBuffer(60));
  const upBuf = useRef(new HistoryBuffer(60));

  const [cpuHistory, setCpuHistory] = useState([]);
  const [gpuHistory, setGpuHistory] = useState([]);
  const [netDownHistory, setNetDownHistory] = useState([]);
  const [netUpHistory, setNetUpHistory] = useState([]);
  const [authExpired, setAuthExpired] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timerId = null;

    async function poll() {
      try {
        const [cpuInfo, gpuInfo, memoryInfo, diskInfo, networkInfo, batteryInfo, processes] =
          await fetchAllData(token);

        if (cancelled) return;

        // Seed with actual live measurement on first tick, then push real values
        if (cpuBuf.current.get().length === 0) {
          cpuBuf.current.seedFromReal(cpuInfo?.usage ?? 0);
          gpuBuf.current.seedFromReal(gpuInfo?.[0]?.utilizationGpu ?? 0);
          downBuf.current.seedFromReal(networkInfo?.stats?.[0]?.rxBytesPerSec ?? 0);
          upBuf.current.seedFromReal(networkInfo?.stats?.[0]?.txBytesPerSec ?? 0);
        } else {
          cpuBuf.current.push(cpuInfo?.usage ?? 0);
          gpuBuf.current.push(gpuInfo?.[0]?.utilizationGpu ?? 0);
          downBuf.current.push(networkInfo?.stats?.[0]?.rxBytesPerSec ?? 0);
          upBuf.current.push(networkInfo?.stats?.[0]?.txBytesPerSec ?? 0);
        }

        setSnapshot({ cpuInfo, gpuInfo, memoryInfo, diskInfo, networkInfo, batteryInfo, processes });
        setCpuHistory([...cpuBuf.current.get()]);
        setGpuHistory([...gpuBuf.current.get()]);
        setNetDownHistory([...downBuf.current.get()]);
        setNetUpHistory([...upBuf.current.get()]);
        setErrorMsg(null);
      } catch (err) {
        if (cancelled) return;
        if (err.message?.includes('401')) {
          setAuthExpired(true);
          return;
        }
        setErrorMsg(err.message || 'Failed to fetch data');
      } finally {
        if (!cancelled) {
          timerId = setTimeout(poll, POLL_INTERVAL_MS);
        }
      }
    }

    poll(); // immediate first fetch

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [token]);

  if (authExpired) {
    return (
      <Box padding={2} borderColor="red" borderStyle="round" flexDirection="column">
        <Box><Text color="red" bold>Session Expired</Text></Box>
        <Box><Text>Your login session has expired (401 Unauthorized).</Text></Box>
        <Box><Text>Please press Ctrl+C to exit and restart the app to log in again.</Text></Box>
      </Box>
    );
  }

  if (!snapshot) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan">Loading dashboard data...</Text>
        {errorMsg && <Text color="red">Notice: {errorMsg} (retrying...)</Text>}
      </Box>
    );
  }

  const termWidth = stdout?.columns ?? 100;
  const termRows = stdout?.rows ?? 30;

  // Keep total dashboard lines well below terminal rows to prevent any jitter/scrolling on keypress
  const maxProcRows = Math.max(3, Math.min(6, termRows - 24));

  return (
    <Box flexDirection="column" width="100%">
      {/* Top: CPU & GPU full width */}
      <CpuPanel
        cpuInfo={snapshot.cpuInfo}
        gpuInfo={snapshot.gpuInfo}
        batteryInfo={snapshot.batteryInfo}
        history={cpuHistory}
        gpuHistory={gpuHistory}
        width={termWidth}
      />

      {/* Bottom split: Left column (Mem + Disks + Net), Right column (Proc) */}
      <Box flexDirection="row" width="100%">
        {/* Left Column */}
        <Box flexDirection="column" width="48%">
          <MemDiskPanel
            memoryInfo={snapshot.memoryInfo}
            diskInfo={snapshot.diskInfo}
            gpuInfo={snapshot.gpuInfo}
          />
          <NetworkPanel
            networkInfo={snapshot.networkInfo}
            downHistory={netDownHistory}
            upHistory={netUpHistory}
            width={Math.floor(termWidth * 0.48)}
          />
        </Box>

        {/* Right Column */}
        <Box flexDirection="column" width="52%" flexGrow={1}>
          <ProcessPanel
            processes={snapshot.processes}
            maxRows={maxProcRows}
            selectedIndex={selectedIndex}
          />
        </Box>
      </Box>
    </Box>
  );
}