var userController = require('./controller/userController.js');

module.exports = function (app){
app.post('/api/user/signup', userController.signupuser);
    app.get('/api/user/viewprofile/:id', userController.viewProfile);
app.post('/api/user/login',userController.loginuser);
    app.post('/api/user/logout/:id',userController.logoutuser);
    app.post('api/user/array', userController.signexample);
    app.post('api/user/changepassword', userController.changepassword);
}
