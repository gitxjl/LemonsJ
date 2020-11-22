$("form.login-form").submit(function () {
    var _n = $('form.login-form input[name="name"]').val().trim().replace(/\s/g,"");
    var _p = $('form.login-form input[name="pwd"]').val().trim().replace(/\s/g,"");
    if (!isLogin(_n,_p)) return false;
    login(_n,_p);
    storage('iid','');
    return false;
});

$("form.register-form").submit(function () {
    var _n = $('form.register-form input[name="name"]').val().trim().replace(/\s/g,"");
    var _p = $('form.register-form input[name="pwd"]').val().trim().replace(/\s/g,"");
    var _e = $('form.register-form input[name="email"]').val().trim().replace(/\s/g,"");

    if (!isLogin(_n,_p)) return false;
    if (!isEmail(_e)) return false;

    register(_n,_p,_e);

    return false;
});

function isEmail(e) {
    if (!e || e == '') {
        hint("请输入你的邮箱");
        return false;
    }
    if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(e) == false) {
        hint("邮箱格式不正确，请重新填写");
        return false;
    }
    return true;
}

function isLogin(n,p) {
    if(n.length <= 0){
        hint('请输入用户名');
        return false;
    }
    if(p.length <= 0){
        hint('请输入密码');
        return false;
    }
    if(n.length > 32 || p.length > 32){
        hint('账户密码过长');
        return false;
    }
    return true;
}