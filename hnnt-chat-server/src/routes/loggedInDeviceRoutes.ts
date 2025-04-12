import { Router } from 'express';
import {
    getDevices,
    addDevice,
    updateDevice,
    deleteDevice,
    logoutOtherDevices,
} from '../controllers/loggedInDeviceController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Route to get all devices for the authenticated user
router.get('/', authenticate, getDevices);

// Route to add a new device
router.post('/', authenticate, addDevice);

// Route to update an existing device by ID
router.put('/:id', authenticate, updateDevice);

// Route to delete a device by ID
router.delete('/:id', authenticate, deleteDevice);

// Route to logout from all other devices except the current one
router.post('/logout-other', authenticate, logoutOtherDevices);

export default router;
