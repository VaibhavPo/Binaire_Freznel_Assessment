import express from 'express';
const router = express.Router();
import systemService from '../services/systemService.js';

const sytemServiceInstance = new systemService();
router.get('/cpu', async (req, res) => {
  try {
    const cpuInfo = await sytemServiceInstance.getCpuInfo();
    res.json(cpuInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CPU info' });
  }
});
router.get('/gpu', async (req, res) => {
  try {
    const gpuInfo = await sytemServiceInstance.getGpuInfo();
    res.json(gpuInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GPU info' });
  }
});
router.get('/memory', async (req, res) => {
  try {
    const memoryInfo = await sytemServiceInstance.getMemoryInfo();
    res.json(memoryInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memory info' });
  }
});
router.get('/disk', async (req, res) => {
  try {
    const diskInfo = await sytemServiceInstance.getDiskInfo();
    res.json(diskInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disk info' });
  }
});
router.get('/network', async (req, res) => {
  try {
    const networkInfo = await sytemServiceInstance.getNetworkInfo();
    res.json(networkInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch network info' });
  }
});
router.get('/battery', async (req, res) => {
  try {
    const batteryInfo = await sytemServiceInstance.getBatteryInfo();
    res.json(batteryInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch battery info' });
  }
});
router.get('/processes', async (req, res) => {
  try {
    const processesInfo = await sytemServiceInstance.getProcesses();
    res.json(processesInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch processes info' });
  }
});

export default router;