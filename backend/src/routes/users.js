const express = require('express');
const {
  getUsers,
  getUser
} = require('../controllers/users');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'officer'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser);

module.exports = router;
