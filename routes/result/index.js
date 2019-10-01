const express = require('express');
const router = express.Router();

const getAll = require('./getAll');
const getById = require('./getById');
const toggleShare = require('./toggleShare');
const canSeeResult = require('../../middleware/canSeeResult');

router.get('/', getAll);
router.get('/:id', canSeeResult, getById);
router.post('/:id/toggleShare', toggleShare);

module.exports = router;
