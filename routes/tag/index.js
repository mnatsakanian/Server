const express = require('express');
const router = express.Router();

const isAdmin = require('../../middleware/isAdmin');

const getAll = require('./getAll');
const update = require('./update');
const create = require('./create');
const _delete = require('./delete');

router.post('/', isAdmin, create);
router.get('/', getAll);
router.put('/:id', isAdmin, update);
router.delete('/:_id', isAdmin, _delete);

module.exports = router;
