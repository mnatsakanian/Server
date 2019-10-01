const express = require('express');
const router = express.Router();

const isAdmin = require('../../middleware/isAdmin');

const create = require('./create');
const _delete = require('./delete');
const getAll = require('./getAll');
const getById = require('./getById');
const getBrief = require('./getBriefTest');
const getAvailable = require('./getAvailable');
const update = require('./update');

router.post('/create', isAdmin, create);
router.get('/', getAll);
router.get('/brief/:id', getBrief);
router.get('/available', getAvailable);
router.get('/:id', getById);
router.put('/:_id', update);
router.delete('/:_id', isAdmin, _delete);

module.exports = router;
