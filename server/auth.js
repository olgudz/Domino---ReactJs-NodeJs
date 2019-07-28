const userList = {};

exports.userAuthentication = (req, res, next) => {
	if (userList[req.session.id] === undefined) {
		return false;
	} else {
		return true;
	}
};

exports.addUserToAuthList = (req, res, next) => {
	if (userList[req.session.id] !== undefined) {
		return 403;
	}
	if (req.query.userName === 'empty') {
		return 400;
	} else {
		for (sessionid in userList) {
			const name = userList[sessionid];
			if (name === req.query.userName) {
				return 403;
			}
		}
		userList[req.session.id] = req.query.userName;
		return 200;
	}
};

//todo
exports.removeUserFromAuthList = (req, res, next) => {
	if (userList[req.session.id] === undefined) {
		return 403;
	} else {
		userList[req.session.id] = undefined;
		return req.session.id;
	}
};

exports.getUserInfo = (id) => {
	return { name: userList[id] };
};

exports.getAllUsers = () => {
	return userList;
}


