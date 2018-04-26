var user = require('../proxy').User;

exports.login = function (req, res, next) {

    var uname = req.body.uname;
    user.getUsersByQuery({ username: uname }, function (err, doc) {
        if (err) {
            res.json({ status: 500, msg: err });
            console.log(err);
        } else if (!doc) {
            res.json({ status: 404, msg: "用户名不存在" });
        } else {
            if (req.body.upwd != doc.password) {

                res.json({ status: 404, msg: "密码错误" });

            } else {
                req.session.user = doc;
                if (req.session.originalUrl) {
                    var redirectUrl = req.session.originalUrl;
                    req.session.originalUrl = null;
                } else {
                    var redirectUrl = '/pk10';
                }
                res.json({ status: 200, msg: "", url: redirectUrl });
            }
        }
    });
};