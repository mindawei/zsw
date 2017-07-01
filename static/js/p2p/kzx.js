var rowCount = 13;
var current = 0;
var type = "news";

function info_type_show(in_type){
    type = in_type;
     // 重命名
    if (type == 'news')
        $("#type").text("新闻")
    else if (type == 'policy')
        $("#type").text("政策")
    else if (type == 'opinion')
        $("#type").text("观点")

    // 情况

    current = 0;
     $('#pages').html("");


     // 导航栏
    $.getJSON("/info/" + type + "/list/size", function (data) {
        $('#num_info').text('每页最多 ' + rowCount + '条，共 ' + data.list_size + '条')
        // 计算页数
        var pages = Math.floor(data.list_size / rowCount);
        if ((data.list_size % rowCount) > 0)
            pages += 1;
        // 添加导航栏
        for (var i = 0; i < pages; ++i) {
            if (i == 0)
                $('#pages').append("<li class='active mynav' >" + "<a>" + (i + 1) + "</a></li>")
            else
                $('#pages').append("<li class='mynav'><a>" + (i + 1) + "</a></li>")
        }
        // 添加点击事件
        $(".mynav").click(reget_list);
    });

    // 显示
    $.getJSON("/info/" + type + "/list/current=" + current + "&rowCount=" + rowCount, function (data) {
        show_list(data);
    });
}

// 重新刷新数据
function reget_list() {
    var url = "/info/" + type + "/list/current=" + ($(this).text() - 1) + "&rowCount=" + rowCount;
    $.getJSON(url, function (data) {
        show_list(data);
    });
    $(".mynav").attr("class", "mynav");
    $(this).attr("class", "mynav active");

}

// 显示数据
function show_list(data) {
    $('#show').html("");
    for (var i = 0; i < data.type_list.length; ++i) {
        var item = data.type_list[i];
            var title = item.title;
            if (title.length == 0) {
                var content = item.content.substr(0, 40)
                title = content;
            }
            var head_str = '&nbsp;<span class="label label-default">';
            if (type == 'news') {
                head_str = '&nbsp;<span class="label label-danger">';
            } else if (type == 'policy') {
                head_str = '&nbsp;<span class="label label-warning">';
            } else if (type == 'opinion') {
                head_str = '&nbsp;<span class="label label-success">';
            }
            var tags_str = "";
            var tags = item.tags;
            if (tags.length > 0) {
                var tags_list = tags.split(',');
                for (var j = 0; j < tags_list.length; ++j) {
                    tag = tags_list[j]
                    tags_str += head_str + tag + '</span>';
                }
            }

            $('#show').append(
                "<a href='/info/" + type + "/" + item._id + "' class='list-group-item'>" +
                "<div class='row'>" +
                "<div class='col-md-8' style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'>" + title + tags_str + "</div>" +
                "<div class='col-md-2' style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'>" + item.author + "</div>" +
                "<div class='col-md-2' style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'>" + item.item_pub_time + "</div>" +
                "</div>" +
                "</a>"
            );
    }
}


// 根据返回信息添加元素
function append_info(div_id, type) {
    var num = 8;

    $.getJSON("/info/" + type + "/list/" + num, function (data) {
        var items = data.type_list;
        for (var i = 0; i < items.length; ++i) {
                var title = items[i].title;
                if (title.length == 0) {
                    var content = items[i].content
                    title = content;
                }

                var head_str = '&nbsp;<span class="label label-default">';
                if (type == 'news') {
                    head_str = '&nbsp;<span class="label label-danger">';
                } else if (type == 'policy') {
                    head_str = '&nbsp;<span class="label label-warning">';
                } else if (type == 'opinion') {
                    head_str = '&nbsp;<span class="label label-success">';
                }

                var tags_str = "";
                var tags = items[i].tags;
                if (tags.length > 0) {
                    var tags_list = tags.split(',');
                    for (var j = 0; j < tags_list.length; ++j) {
                        tag = tags_list[j]
                        tags_str += head_str + tag + '</span>';
                    }
                }

                $(div_id).append(
                    "<a href='/info/" + type + "/" + items[i]._id + "' class='list-group-item '>"
                    + "<div class='row'>"
                    + "<div class='col-md-12'>"
                    + "<div style='font-size: large;width:95%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'>" + title + "</div>"
                    + "<div style='margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'>" + items[i].item_pub_time + "&nbsp;&nbsp;&nbsp;&nbsp;" + items[i].author + tags_str + "</div>"
                    + "</div>"
                    + "</div>"
                    + "</a>"
                );
            }
    });
}

// 加载数据
$(document).ready(function () {
    append_info("#show_xw", "news");
    append_info("#show_zc", "policy");
    append_info("#show_gd", "opinion");
});


