/**
 * Created by Administrator on 2016/5/12.
 */
$(document).ready(function () {
    if ($.cookie('username') == null) {  // 未登录
        $('#grzx').addClass('hidden')
    } else { // 已登录
        $('#grzx').removeClass('hidden')
    }
});