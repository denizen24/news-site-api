const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.send('Главная страница');
});


module.exports = router;
