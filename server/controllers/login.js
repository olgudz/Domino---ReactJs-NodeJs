const auth = require('../auth');

exports.getIndex = (req, res, next) => {
    if (auth.userAuthentication(req, res, next)) {
        res.sendStatus(200);
    }
    else{
        res.sendStatus(401);
    }
};

exports.getUser = (req, res, next) => {
    if (auth.userAuthentication(req, res, next)) {
        const id = req.session.id;
        const name =  auth.getUserInfo(id).name;
        res.status(200).json(name);
    }
    else{
        res.sendStatus(401);
    }
}

exports.getAllUsers = (req, res, next) => {
    const userList = auth.getAllUsers(req, res, next);
    res.json(userList);
};

exports.postAddUser = (req, res, next) => {
    result = auth.addUserToAuthList(req, res, next);
    if (result === 402) {
        res.status(402).send('Enter your name');
    }
    else if (result === 403) {
        res.status(403).send('User already exist');
    }
    else {
        res.sendStatus(200);
    }
};


