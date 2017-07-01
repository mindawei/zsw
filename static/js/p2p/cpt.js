/**
 * Created by Administrator on 2016/5/12.
 */
$(document).ready(function () {
    $("#search_btn").click(function () {
        var key_word = $("#search_key")[0].value;
        if (key_word.length == 0)
            my_alert("平台名称不能为空！")
        else
            window.location.href = "/search/" + key_word;
    });
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            $("#search_btn").click();
        }
    };
})
