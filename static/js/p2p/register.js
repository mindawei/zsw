/**
 * Created by Administrator on 2016/5/12.
 */

$(document).ready(function () {
    $.getJSON("/ptpx/platform_name_list", function (data) {
        platform_name_list = data.platform_name_list
        for (var i = 0; i < platform_name_list.length; ++i) {
            platform_name = platform_name_list[i];
            $("#platform_name_select").append(" <option value='" + platform_name + "'>" + platform_name + "</option>")
        }
    });
});

function sign_in() {

    var username = $('#username')[0].value;
    var password = $('#password')[0].value;
    var password2 = $('#password2')[0].value;

    if (username.length == 0) {
        my_alert("请输入用户名！")
        return;
    }
    if (password.length == 0) {
        my_alert("请输入密码！")
        return;
    }
    if (password2.length == 0) {
        my_alert("请确认密码！")
        return;
    }
    if (password != password2) {
        my_alert("两次输入的密码不一致，请重新输入！")
        return;
    }

    var url = "/register/username=" + username + "&password=" + password;
    $.getJSON(url, function (data) {
        if (data.result == 0) {
            my_alert("用户名已经存在！")
        } else {
            my_alert("注册成功！即将跳转到登录页面...")
            window.setTimeout(function () {
                location.href = "/sign_in";
            }, 2500);
        }
    });
}