// 获取url参数
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

// 设置搜索菜单列表
function setSearchTextEenu(searchText){
    $(".btn1").find('li').hide();
    if (searchText != "") {
        searchText.replace(/(^\s*)|(\s*$)/g, "");
        var arr = searchText.split(' ');
        $.each(arr, function (index, value) {
            $(".btn1").find('span:contains(' + value + ')').parents("li").show()
        });
    } else {
        $(".btn1").find('li').show();
    }
}

$(function () {
    //
    $(".showRequest").click(function(){
        $(this).nextAll(".requestDatabase").toggle(100);
        $(this).nextAll(".showRequestTip").toggle(100);
    });

    // 搜索清除
    $("input[type=search]").focus(function(){
        $(this).parent().children(".input_clear").show();
    });
    $("input[type=search]").blur(function(){
        if($(this).val()=='')
        {
            $(this).parent().children(".input_clear").hide();
        }
    });
    $(".input_clear").click(function(){
        $(this).parent().find('input').val('');
        $(this).hide();
        setSearchTextEenu('');
    });

    // 初始搜索
    var searchText = $("input[type=search]").val()
    setSearchTextEenu(searchText);//获取输入的搜索内容
    $("input[type=search]").on('input propertychange', function () {
        setSearchTextEenu($(this).val());//获取输入的搜索内容
    });

    // 格式化json
    $(".json-renderer").each(function () {
        try {
            input = eval('(' + $(this).html() + ')');
            options = {
                collapsed: 0,
                withQuotes: 1
            };
            $(this).jsonViewer(input, options);
        } catch (error) {
            console.log("Cannot eval JSON: " + error)
        }
    });

    // 菜单事件
    var $ul = $(".ant_side").find("ul");
    $ul.on("click", "li", function () {
        var $width = $(window).width();
        if ($width < 1200) {
            $ul.parent().removeClass("on");
            return false;
        } else {
            var hasSubMenu = $(this).find("ul").length > 0;
            var isOpen = $(this).hasClass("on");
            event.stopPropagation();
            if (hasSubMenu) {
                if (isOpen) {
                    console.log(1)
                    $(this).find("ul").slideUp().parent().removeClass("on");
                    // $(this).find("ul").find('li').siblings().show();
                } else {
                    console.log(0)
                    $(this).addClass("on").children("ul").slideDown();
                    // $(this).addClass("on").children("ul").slideDown().show();
                }
            } else {
                $(this).click(function () {
                    return false;
                })
            }
        }
    })

    // 初始化菜单
    urlPath = getQueryVariable("path");
    if (urlPath) {
        $('.' + urlPath).parents("li").addClass("on");
        $('.' + urlPath).parents("ul").removeClass("hidden");
        $('.' + urlPath).parent().addClass("selected");
        $('.' + urlPath).parent().addClass("on");
    }
});
