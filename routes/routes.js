const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
   res.send('You know nothing, Jon Snow!');
});
router.post('/', function(req, res){
   res.send('You posted nothing, Jon Snow!');
});

//export this router
module.exports = router;