$(document).ready(function () {

    username = $.cookie('username')
    if (username == null) {  // 未登录
        window.location.href = "/sign_in";
        return
    }

    $('#welcome_username').html(username)

    show_topics();
    show_commments();

});

function add_topic() {
    var title = $('#title')[0].value;
    var description = $('#description')[0].value;
    if (title.length == 0) {
        my_alert("请输入话题名称！")
        return;
    }
    if (description.length == 0) {
        my_alert("请输入话题描述！")
        return;
    }
    username = $.cookie('username')


    var url = '/topic/add/username=' + username + '&title=' + title + '&description=' + description;
    $.getJSON(url, function (data) {
        if (data.result == 1) {
            my_alert("发布成功！");
            window.location.href = "/djs";
        }
    });

}


function delete_topic(index) {
    var span_id = '#topics_div_span_' + index;
    var topic_id = $(span_id).text()
    $.getJSON('/topics/delete/one/' + topic_id, function (data) {
        if (data.result == 1) {
            show_topics();
            my_alert("删除成功！")
        }
    })
}

function show_topics() {
    username = $.cookie('username')
    $.getJSON('/topic/get/mine/' + username, function (data) {
        $("#topics_div").html("");
        var items = data.topics;
        for (var i = 0; i < items.length; ++i) {
            topic = items[i]
            $("#topics_div").append(
                '<div class="topic_div_block">' +
                '<h1 style=" text-align: center;">' + topic.title + '</h1>' +
                '<hr>' +
                '<p class="lead" >' + topic.description + '</p>' +
                '<hr>' +
                '<p style="text-align: center">' +
                '<a class="btn " style="margin-left:10px;padding-left: 15px;padding-right: 15px;background-color:transparent;border:1px solid lightgrey" href="/djs/topic/' + topic._id + '">查看详情</a>' +
                '<button class="btn text-primary " style="margin-left:10px;padding-left: 15px;padding-right: 15px;background-color:transparent;border:1px solid lightgrey" onclick="delete_topic(' + i + ')">删除</button>' +
                '<span class="hidden" id="topics_div_span_' + i + '">' + topic._id + '</sapn>' +
                '</p>' +
                '</div>'
            )
        }
    });
}

function delete_comment(index) {
    var span_id = '#comments_div_span_' + index;
    var comment_id = $(span_id).text()
    $.getJSON('/comments/delete/one/' + comment_id, function (data) {
        if (data.result == 1) {
            show_commments();
            my_alert("删除成功！")
        }
    })
}
function show_commments() {
    $("#comments_div").html("");
    username = $.cookie('username')
    $.getJSON('/comments/get/mine/' + username, function (data) {
        var items = data.comments;
        for (var i = 0; i < items.length; ++i) {
            comment = items[i]
            $("#comments_div").append(
                '<div class="topic_div_block">' +
                '<h2 style=" text-align: center;">' + comment.title + '</h2>' +
                '<hr>' +
                '<p class="lead" >' + comment.content + '</p>' +
                '<hr>' +
                '<p style="text-align: center">' +
                '<a class="btn " style="margin-left:10px;padding-left: 15px;padding-right: 15px;background-color:transparent;border:1px solid lightgrey" href="/djs/topic/' + comment.topic_id + '">查看话题</a>' +
                '<button class="btn text-primary " style="margin-left:10px;padding-left: 15px;padding-right: 15px;background-color:transparent;border:1px solid lightgrey" onclick="delete_comment(' + i + ')">删除</button>' +
                '<span class="hidden" id="comments_div_span_' + i + '">' + comment._id + '</sapn>' +
                '</p>' +
                '</div>'
            )
        }
    });
}
