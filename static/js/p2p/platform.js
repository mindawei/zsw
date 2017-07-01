
// 显示基本数据
function show_basic_info(data) {
    data = data['basic']
    $('#platLogo').attr("src", data['platLogoUrl']);
    $('#platform_earn').text(data['platEarnings']);
    $('#platform_volume').text(data['registeredCapital']);
    $('#platform_borrowing_period').text(data['term']);
    $('#platform_time').text(data['onlineDate']);
    $('#platform_need_return').text(data['locationAreaName'] + data['locationCityName']);
    $('#platform_platUrl').html("<a href='"+data['platUrl']+"' target='_blank'>"+data['platUrl']+"</a>");
}

// 显示运营公司信息
function show_company_info(data){
    data = data['company_info']
    $('#qiyemingcheng').text(data['qiyemingcheng']);
     $('#kaiyeriqi').text(data['kaiyeriqi']);
     $('#dengjijiguan').text(data['dengjijiguan']);
     $('#lianxidizhi').text(data['lianxidizhi']);
     $('#400').text(data['400']);
     $('#qiyefaren').text(data['qiyefaren']);
     $('#gongsileixing').text(data['gongsileixing']);
     $('#ptjianjie').text(data['ptjianjie']);
}

// 初始化和配置图表数据
var data_chart_json;
function init_and_show_chart(data) {
    if (data['chart']['0'] == null) {
        $("#chart_div_title").hide();
        $("#chart_dropdown").hide();
        $("#chart_div").hide();
    } else {
        data_chart_json = data['chart'];
        show_chart('chart_div', '利率信息', '0', 'x', 'y1', '百分比(%)');
    }
}
// 动态显示图表
function show_chart(div_id, data_text, index, x_index, y_index, y_name) {

    $("#show_chart_title").text(data_text);

    data_x = data_chart_json[index][x_index];
    data_y = data_chart_json[index][y_index];

    var chart = echarts.init(document.getElementById(div_id));
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: data_x
            }
        ],
        yAxis: [
            {
                name: y_name,
                type: 'value'
            }
        ],
        series: [
            {
                name: data_text,
                type: 'line',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {normal: {}},
                data: data_y
            }
        ]
    };

    chart.setOption(option);
}


var reviews;
var show_index = '2';
var rowCount = 6;

// 初始化和配置评论数据
function init_and_show_reviews(data) {
    if (data['reviews']['0'] == null||data['reviews']['0']['comments'] .length==0) {
        $("#reviews_div_title").hide();
        $("#reviews_label").hide();
        return;
    }
    reviews = data['reviews'];
    show_reviews();
}

// 按钮点击事件
function btn_reviews(click_index) {
    show_index = click_index;
    show_reviews();
}

// 动态显示评论
function show_reviews() {
    // 刷新列表

    $('#reviews_label').html("");
    $('#reviews_label').html('<div class="btn-group" role="group">' +
        '<button type="button" class="btn btn-success" onclick="btn_reviews(2)">推荐</button>' +
        '<button type="button" class="btn btn-warning" onclick="btn_reviews(1)">一般</button> ' +
        '<button type="button" class="btn btn-danger" onclick="btn_reviews(0)">不推荐</button>' +
        '</div>&nbsp&nbsp')
    var labels_list = reviews[show_index]['labels'];
    var tags_str = "";
    for (var i = 0; i < labels_list.length; ++i) {
        tags_str += '&nbsp;&nbsp;<span class="badge">' + labels_list[i] + '</span>';
    }
    $('#reviews_label').append(tags_str);

    $('#reviews_div').html("");
    var comments_list = reviews[show_index]['comments'];
    var len = Math.min(comments_list.length, rowCount);
    for (var i = 0; i < len; ++i) {
        $('#reviews_div').append("<a class='list-group-item'>"
            + "<strong>" + comments_list[i].date + "</strong><br>"
            + comments_list[i].content + "</a>");
    }

    // 计算页数
    var pages = Math.floor(comments_list.length / rowCount);
    if ((comments_list.length % rowCount) > 0)
        pages += 1;

    $('#pages').html("");
    // 添加导航栏
    for (var i = 0; i < pages; ++i) {
        if (i == 0)
            $('#pages').append("<li class='active mynav' >" + "<a>" + (i + 1) + "</a></li>")
        else
            $('#pages').append("<li class='mynav'><a>" + (i + 1) + "</a></li>")
    }
    // 添加点击事件
    $(".mynav").click(reshow_reviews);
}

// 重新刷新数据
function reshow_reviews() {

    var current = $(this).text() - 1;
    var start = current * rowCount;
    var comments_list = reviews[show_index]['comments'];
    var end = Math.min(comments_list.length, (current + 1) * rowCount)

    $('#reviews_div').html("");
    for (var i = start; i < end; ++i) {
        $('#reviews_div').append("<a class='list-group-item'>" + "<strong>" + comments_list[i].date + "</strong><br>" +
            comments_list[i].content + "</a>");
    }

    $(".mynav").attr("class", "mynav");
    $(this).attr("class", "mynav active");

}


// 显示新闻
function show_news(data) {
    var recent_news_list = data['news'];
    var related_news_list = data['related'];

    if (recent_news_list.length +related_news_list.length == 0) {
        $('#related_news_div').hide();
    }


    for (var i = 0; i < recent_news_list.length; ++i) {
        $('#related_news_div').append(
            "<a href='" + recent_news_list[i].url + "' target='_blank' class='list-group-item' style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align: center;border-top: none'>" +
            recent_news_list[i].title +"&nbsp;&nbsp;<span style='color: red;font-weight: 700'>New</span>"+
            "</a>"
        );
    }

    for (var i = 0; i < related_news_list.length; ++i) {
        $('#related_news_div').append(
            "<a href='" + related_news_list[i].url + "' target='_blank' class='list-group-item' style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align: center;border-top: none'>"
            + related_news_list[i].title + "</div>" +
            "</a>"
        );
    }

}


// 加载数据
$(document).ready(function () {
    var platform_name = $("#platform_name").text();
    // 显示
    $.getJSON("/platform/info/" + platform_name , function (data) {

        // 显示基本数据
        show_basic_info(data);
        // 显示运营公司
        show_company_info(data);
        // 初始化和配置图表数据
        init_and_show_chart(data);
        // 显示新闻
        show_news(data);

        // 初始化和配置评论数据
        init_and_show_reviews(data);

    });

});
