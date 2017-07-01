/**
 * Created by Administrator on 2016/5/12.
 */
function sign_in() {
    var username = $('#username')[0].value;
    var password = $('#password')[0].value;
    if (username.length == 0) {
        my_alert("请输入用户名！")
        return;
    }
    if (password.length == 0) {
        my_alert("请输入密码！")
        return;
    }

    var url = '/sign_in/username=' + username + '&password=' + password;
    $.getJSON(url, function (data) {
        if (data.result == 0) {
            my_alert("验证错误，请输入正确的用户名和密码！")
        } else {
            $.cookie('username', username);
            my_alert("登录成功！");
            window.location.href = "/grzx";
        }
    });
}