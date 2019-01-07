/**
*js for 登录页（login_new）
*2017-07-04
*/
var myLogin = angular.module('myLogin', ['ngCookies', 'ngVerify']);
myLogin.controller('loginController', ['$cookies', '$scope', function ($cookies, $scope) {
    $scope.changeBckgroud = function (item) {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);
        $cookies.put("login_skin", item, { 'expires': expireDate, path: "/index.php/Home/Ace" });//“login_skin”30天后过期
        $cookies.put('login_skin', item, { 'expires': expireDate, path: "/index.php" });
        $cookies.put('login_skin', item, { 'expires': expireDate, path: "/" });
        $scope.bodyClass = item;
    }
}]);



