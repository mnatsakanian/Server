const express = require('express');
const router = express.Router();

const isAdmin = require('../../middleware/isAdmin');

const create = require('./create');
const _delete = require('./delete');
const getAll = require('./getAll');
const getById = require('./getById');
const update = require('./update');
const updateStatus = require('./updateStatus');
const setResult = require('./setResult');

router.post('/create', isAdmin, create);
router.get('/', isAdmin, getAll);
router.get('/:id', getById);
router.put('/:_id', isAdmin, update);
router.put('/:_id/setStatus', updateStatus);
router.put('/:_id/setResult', setResult);
router.delete('/:_id', isAdmin, _delete);

module.exports = router;
