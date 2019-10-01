const express = require('express');
const router = express.Router();

const authenticate = require('./authenticate');
const register = require('./register');
const update = require('./update');
const _delete = require('./delete');
const getAll = require('./getAll');
const getCurrent = require('./getCurrent');
const emailExists = require('./emailExists');
const updatePermissions = require('./updatePermissions');
const getUserById = require('./getUserById');
const assignTest = require('./assignTest');
const completeTest = require('./completeTest');
const socialLogin = require('./socialLogin');

router.post('/authenticate', authenticate);
router.post('/authenticate/social', socialLogin);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:_id', getUserById);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.get('/emailExists', emailExists);
router.post('/updatePermissions', updatePermissions);
router.post('/assignTest', assignTest);
router.post('/complete', completeTest);

module.exports = router;
