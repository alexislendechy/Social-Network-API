const router = require('express').Router();
const useRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

router.use('/users', useRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;
