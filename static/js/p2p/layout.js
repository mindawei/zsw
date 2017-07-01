document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) { // enter 键
        $("#nav_search_btn").click();
    }
};

/** 显示错误 */
function my_alert(error_str) {
    $('#myModal').modal('show')
    $('#modal-alert').html(error_str);
}


$(document).ready(function () {

    if ($.cookie('username') == null) {  // 未登录
        $('#sign_in_out').text('登录');
        $('#register').removeClass('hidden')
        $('#grzx').addClass('hidden')
        $('#sign_in_out').click(function () {
            window.location.href = "/sign_in";
        })
    } else { // 已登录
        $('#sign_in_out').text('退出');
        $('#register').addClass('hidden')
        $('#grzx').removeClass('hidden')
        $('#sign_in_out').click(function () {
            $.removeCookie('username');
            window.location.href = "/home";
        })
    }
});


