
const Router = require('express');
const router = new Router();
const controller = require('../controllers/executor.controllers');


router.get('/executor_create', controller.formCreate);
router.post('/executorcreate',  controller.createExecutor);
router.post('/executor_cabinet',controller.openExecutorCabinet);
router.get('/executor_cabinet_',controller.backInExecutorCabinet);
router.post('/registration', controller.registration)
router.get('/', controller.getExecutors)
router.get('/updateform', controller.openFormUpdateExecutor)
router.post('/update',  controller.updateExecutor)
router.get('/executors/delete/:id_executor', controller.deleteExecutor)
router.get('/executors/:id_executor', controller.getExecutorById)
router.post('/services', controller.createService);
router.get('/log_out', controller.logOut);
router.post('/add_aria_list',controller.addAreaList);
router.post('/delete_aria_list',controller.deleteAreaList);
router.post('/add_service_list',controller.addServiceList);
router.post('/add_new_service_list',controller.addNewServiceList);
router.post('/update_service_list', controller.updateServiceList);
router.post('/delete_service_list',controller.delleteServiceList);
router.post('/search', controller.search);
router.post('/add_order',controller.addOrder);
router.post('/orders', controller.orders);
module.exports = router;