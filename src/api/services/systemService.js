import si from 'systeminformation';

class SystemService {

  async getCpuInfo() {
    try {
      const [time, cpuInfo, load, temp, speed] = await Promise.all([
        si.time(),
        si.cpu(),
        si.currentLoad(),
        si.cpuTemperature(),
        si.cpuCurrentSpeed(),
      ]);

      return {
        timestamp: time.current,
        uptime: time.uptime, // seconds
        model: cpuInfo.brand,
        speed: cpuInfo.avg,
        currentSpeed: speed.avg, // GHz, live
        cores: cpuInfo.cores,
        physicalCores: cpuInfo.physicalCores,
        usage: load.currentLoad,
        avgLoad: load.avgLoad, // 1/5/15 min load average
        loadHistory: [load.avgLoad], // caller should maintain rolling history
        temp: {
          main: temp.main, // package temp, °C
          cores: temp.cores, // per-core °C array
          max: temp.max,
        },
        perCore: load.cpus.map((core, index) => ({
          core: index + 1,
          usage: core.load,
          speed: speed.cores ? speed.cores[index] : null, // per-core GHz
          temp: temp.cores && temp.cores[index] !== undefined ? temp.cores[index] : null,
        })),
      };
    } catch (error) {
      console.error('Error fetching CPU info:', error);
      throw error;
    }
  }

  async getGpuInfo() {
    try {
      const gpuInfo = await si.graphics();
      return gpuInfo.controllers.map(ctrl => ({
        model: ctrl.model,
        vendor: ctrl.vendor,
        vram: ctrl.vram, // MB, static
        utilizationGpu: ctrl.utilizationGpu ?? null, // live load %, not available on all platforms/drivers
        temperatureGpu: ctrl.temperatureGpu ?? null, // live temp, same caveat
        memoryUsed: ctrl.memoryUsed ?? null,
        memoryTotal: ctrl.memoryTotal ?? null,
      }));
    } catch (error) {
      console.error('Error fetching GPU info:', error);
      throw error;
    }
  }

  async getMemoryInfo() {
    try {
      const memoryInfo = await si.mem();
      return {
        total: memoryInfo.total,
        used: memoryInfo.used,
        available: memoryInfo.available,
        free: memoryInfo.free,
        active: memoryInfo.active,
        cached: memoryInfo.cached,
        buffers: memoryInfo.buffers,
        usage: (memoryInfo.used / memoryInfo.total) * 100,
        swap: {
          total: memoryInfo.swaptotal,
          used: memoryInfo.swapused,
          free: memoryInfo.swapfree,
          usage: memoryInfo.swaptotal > 0
            ? (memoryInfo.swapused / memoryInfo.swaptotal) * 100
            : 0,
        },
        // Windows "Committed" memory isn't a direct si.mem() field.
        // si.mem().total + swaptotal is a reasonable proxy for commit limit;
        // actual commit charge may need a WMI call (os-specific) if exact parity matters.
        commitEstimate: memoryInfo.total + memoryInfo.swaptotal,
      };
    } catch (error) {
      console.error('Error fetching memory info:', error);
      throw error;
    }
  }

  async getDiskInfo() {
    try {
      const [fsSize, disksIO] = await Promise.all([
        si.fsSize(),
        si.disksIO(),
      ]);

      return {
        filesystems: fsSize.map(fs => ({
          fs: fs.fs,
          mount: fs.mount,
          size: fs.size,
          used: fs.used,
          available: fs.available,
          usagePercent: fs.use,
        })),
        io: {
          readBytesPerSec: disksIO?.rIO_sec ?? null,
          writeBytesPerSec: disksIO?.wIO_sec ?? null,
          totalIOPerSec: disksIO?.tIO_sec ?? null,
          readPercent: disksIO?.rIO ?? null,
          writePercent: disksIO?.wIO ?? null,
        },
      };
    } catch (error) {
      console.error('Error fetching disk info:', error);
      throw error;
    }
  }

  async getNetworkInfo() {
    try {
      const [stats, interfaces] = await Promise.all([
        si.networkStats(),
        si.networkInterfaces(),
      ]);

      const activeInterfaces = Array.isArray(interfaces) ? interfaces : [interfaces];
      const primary = activeInterfaces.find(
        iface => !iface.internal && iface.operstate === 'up' && iface.ip4
      );

      return {
        ip4: primary ? primary.ip4 : null,
        ip6: primary ? primary.ip6 : null,
        interfaceName: primary ? primary.iface : null,
        stats: stats.map(s => ({
          iface: s.iface,
          rxBytesPerSec: s.rx_sec,
          txBytesPerSec: s.tx_sec,
          rxBytesTotal: s.rx_bytes,
          txBytesTotal: s.tx_bytes,
        })),
      };
    } catch (error) {
      console.error('Error fetching network info:', error);
      throw error;
    }
  }

  async getBatteryInfo() {
    try {
      const battery = await si.battery();
      return {
        hasBattery: battery.hasBattery,
        percent: battery.percent,
        isCharging: battery.isCharging,
        acConnected: battery.acConnected,
        timeRemaining: battery.timeRemaining, // minutes, -1 if unknown/charging
      };
    } catch (error) {
      console.error('Error fetching battery info:', error);
      throw error;
    }
  }

  async getProcesses() {
    try {
      const processes = await si.processes();
      return processes.list.map(process => ({
        pid: process.pid,
        name: process.name,
        command: process.command,
        params: process.params,
        user: process.user,
        cpu: process.cpu,
        memory: process.mem,
        memRss: process.memRss, // MB, matches "MemB" column style
        threads: process.threads,
        state: process.state,
      }));
    } catch (error) {
      console.error('Error fetching processes info:', error);
      throw error;
    }
  }

  // Convenience: one call to get everything for a single poll tick.
  async getSnapshot() {
    const [cpu, gpu, memory, disk, network, battery, processes] = await Promise.all([
      this.getCpuInfo(),
      this.getGpuInfo(),
      this.getMemoryInfo(),
      this.getDiskInfo(),
      this.getNetworkInfo(),
      this.getBatteryInfo(),
      this.getProcesses(),
    ]);

    return { cpu, gpu, memory, disk, network, battery, processes };
  }
}

export default SystemService;