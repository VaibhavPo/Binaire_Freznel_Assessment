import express from 'express';
const router = express.Router();
import systemRoutes from './systemRoutes.js';

import authUser from '../auth/middleware.js';

router.get('/', (req, res) => {
  res.send('Welcome to the System Information API');
});

// Authenticated users can access the system information routes.
router.use('/api', authUser, systemRoutes);

export default router;