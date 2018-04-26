var user = require('../proxy').User;

user.newAndSave("wsdn", "wsdn321", "13856632132", function (err, result) {
    if (err) { 
        console.log(err); 
        return; 
    }
    console.log('创建成功');
});