import * as usersDao from "./users-dao.js";

const findAllUsers = async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    if (username && password) {
        const user = await usersDao.findUserByCredentials(username, password);
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } else if (username) {
        const user = await usersDao.findUserByUsername(username);
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } else {
        const users = await usersDao.findAllUsers();
        res.json(users);
    }
};

const findUserById = async (req, res) => {
    const id = req.params.id;
    const user = await usersDao.findUserById(id);
    res.json(user);
};

const createUser = async (req, res) => {
    const newUser = await usersDao.createUser(req.body);
    res.json(newUser);
};

const deleteUser = async (req, res) => {
    const id = req.params.uid;
    const status = await usersDao.deleteUser(id);
    res.json(status);
};

const updateUser = async (req, res) => {
    const id = req.params.uid;
    const status = await usersDao.updateUser(id, req.body);
    const user = await usersDao.findUserById(id);
    req.session["currentUser"] = user;
    res.json(status);
};

const register = async (req, res) => {
    const user = await usersDao.findUserByUsername(req.body.username);
    if (user) {
        res.sendStatus(403);
        return;
    }
    const newUser = await usersDao.createUser(req.body);
    req.session["currentUser"] = newUser;
    res.json(newUser);
};

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        const user = await usersDao.findUserByCredentials(username, password);
        if (user) {
            req.session["currentUser"] = user;
            res.json(user);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
};

const profile  = async (req, res) => { 
    const user = req.session["currentUser"];
    // const user = await usersDao.findUserById(uid);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.json(user);
 
};

 const logout   = (req, res) => { 
    req.session.destroy();
    res.sendStatus(200);
};

const UserController = (app) => {
    app.get('/api/users', findAllUsers)
    app.get('/api/users/:uid', findUserById);
    app.post('/api/users', createUser);
    app.delete('/api/users/:uid', deleteUser);
    app.put('/api/users/:uid', updateUser);
    app.post("/api/users/register", register);
    app.post("/api/users/login",    login);
    app.post("/api/users/profile",  profile);
    app.post("/api/users/logout",   logout);
 
};
export default UserController;



