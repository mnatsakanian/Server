const express = require('express');
const router = express.Router();

const isAdmin = require('../../middleware/isAdmin');

const create = require('./create');
const _delete = require('./delete');
const getAll = require('./getAll');
const getById = require('./getById');
const update = require('./update');

router.post('/create', isAdmin, create);
router.get('/', getAll);
router.get('/:id', getById);
router.delete('/:_id', isAdmin, _delete);
router.put('/:_id', isAdmin, update);


module.exports = router;
