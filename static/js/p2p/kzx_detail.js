$(document).ready(function () {

    // 处理文本中的换行和空格
    var content = $("#content").text();
    content = content.replace(new RegExp("#n#", "gm"), "<br>");
    content = content.replace(new RegExp("#r#", "gm"), "");
    content = content.replace(new RegExp(" ", "gm"), "&nbsp;")
    $("#content").html(content);

    if ($("#title").text().length == 0)
        $("#title").html(content.substr(0, 20) + "...")

    type = $("#type").text();
    if (type == 'news')
        $("#type").text("新闻")
    else if (type == 'policy')
        $("#type").text("政策")
    else if (type == 'opinion')
        $("#type").text("观点")
    else if (type == 'ugc')
        $("#type").text("用户评论")
});
