const express = require('express');
const router = express.Router();

const controller = require('../controllers/task.controller');

router.all('/list/:id', controller.createOrReturnExistingList);
router.get('/:listId', controller.getTasks);
router.post('/:listId', controller.saveTask);
router.put('/:listId/task/:id', controller.updateTask);
router.delete('/:listId/task/:id', controller.deleteTask);

module.exports = router;
