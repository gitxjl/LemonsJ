$(function () {
    //去除url中指定参数
    function delQueStr(url, ref) //删除参数值
    {
        var str = "";
        if (url.indexOf('?') != -1)
            str = url.substr(url.indexOf('?') + 1);
        else
            return url;
        var arr = "";
        var returnurl = "";
        var setparam = "";
        if (str.indexOf('&') != -1) {
            arr = str.split('&');
            for (i in arr) {
                if (arr[i].split('=')[0] != ref) {
                    returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
                }
            }
            return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
        }
        else {
            arr = str.split('=');
            if (arr[0] == ref)
                return url.substr(0, url.indexOf('?'));
            else
                return url;
        }
    }
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

    // 获取url参数
    function getLastPath() {
        return location.pathname.match('[^/]+(?!.*/)')[0];;
    }

    // 搜索清除
    $("input[type=search]").focus(function(){
        $(".fa-close").show();
    });
    $("input[type=search]").blur(function(){
        if($(this).val()=='') $(".fa-close").hide();
    });
    $(".fa-close").click(function(){
        $(this).parent().find('input').val('');
        $(this).hide();
        setSearchTextEenu('');
        $("#sidebar-menu ul a").each(function () {
            if ($(this).attr("href")) {
                url = delQueStr($(this).attr("href"),"search");
                $(this).attr("href",url);
            }
        });
    });

    // 初始搜索
    var searchText = $("input[type=search]").val();
    if (!searchText){
        url_search = getQueryVariable("search");
        if (url_search) {
            searchText = decodeURI(getQueryVariable("search"));
            $("input[type=search]").val(searchText);
        }
    }
    setSearchTextEenu(searchText);//获取输入的搜索内容
    //搜索
    $("input[type=search]").on('input propertychange', function () {
        setSearchTextEenu($(this).val());//获取输入的搜索内容
    });

    function changeURLArg(url,arg,arg_val){
        var pattern=arg+'=([^&]*)';
        var replaceText=arg+'='+arg_val;
        if(url.match(pattern)){
            var tmp='/('+ arg+'=)([^&]*)/gi';
            tmp=url.replace(eval(tmp),replaceText);
            return tmp;
        }else{
            if(url.match('[\?]')){
                return url+'&'+replaceText;
            }else{
                return url+'?'+replaceText;
            }
        }
        return url+'\n'+arg+'\n'+arg_val;
    }

    // 添加 或者 修改 url中参数的值
    function UpdateUrlParam(url,name, val) {
        var thisURL = url;

        // 如果 url中包含这个参数 则修改
        if (thisURL.indexOf(name+'=') > 0) {
            var v = getUrlParam(name);
            if (v != null) {
                // 是否包含参数
                thisURL = thisURL.replace(name + '=' + v, name + '=' + val);

            }
            else {
                thisURL = thisURL.replace(name + '=', name + '=' + val);
            }

        } // 不包含这个参数 则添加
        else {
            if (thisURL.indexOf("?") > 0) {
                thisURL = thisURL + "&" + name + "=" + val;
            }
            else {
                thisURL = thisURL + "?" + name + "=" + val;
            }
        }

        return thisURL;

    }

    // 设置搜索菜单列表
    function setSearchTextEenu(searchText){
        searchText = searchText.trim().replace(/\s/g,"");
        if (searchText) {
            $("#sidebar-menu ul").find('li').hide();
            searchText.replace(/(^\s*)|(\s*$)/g, "");
            var arr = searchText.split(' ');
            $("#sidebar-menu ul a").each(function () {
                if ($(this).attr("href")) {
                    $(this).attr("href",changeURLArg($(this).attr("href"),'search',searchText));
                }
            });
            $.each(arr, function (index, value) {
                $("#sidebar-menu ul").find('a:contains(' + value + ')').parents("li").show();
                $("#sidebar-menu ul").find('a:contains(' + value + ')').parents("li").find("ul").show();
                $("#sidebar-menu ul").find('a:contains(' + value + ')').parents("li").find("ul li").show();
            });
            if($('input[type=search]').val()) $(".fa-close").show();
        } else {
            if($('input[type=search]').val()=='') $(".fa-close").hide();
            $("#sidebar-menu ul").find('li').show();
        }
    }

    // 初始化菜单
    urlPath = getQueryVariable("path");
    if (urlPath) {
        $('.' + urlPath).parents("ul").show();
    }

    var t = 200
        $(".navbar li a").click(function(){
        var die=$(this);
        if(die.next("ul").is(":hidden")){
            die.next("ul").fadeIn(t);
        }else{
            die.next("ul").fadeOut(t);
        }
    });

    $("#sidebar-menu li").each(function () {
        if ($(this).find("ul").length > 0) {
            $(this).find("a:eq(0)").prepend('<i class="fa fa-caret-right"></i> <span class="fa fa-folder"></span> ');
        } else {
            $(this).find("a:eq(0)").prepend('<span class="fa fa-file-text"></span> ');
        }
    });
    $("#sidebar-menu ul li a").hover(function () {
        $(this).find("span").addClass("fa-folder-open");
        $(this).find("span").removeClass("fa-folder");
    }, function () {
        if (!$(this).find("i").is(".fa-caret-down")) {
            $(this).find("span").addClass("fa-folder");
            $(this).find("span").removeClass("fa-folder-open");
        }
    });
    var t = 200;
    $("#sidebar-menu ul li a").click(function () {
        var die = $(this);
        if (die.next("ul").is(":hidden")) {
            die.next("ul").fadeIn(t);
            die.parent("li").siblings().find("ul").hide(t);
            die.parent("li").siblings().find("a").find("i").removeClass("fa-caret-down");
            die.parent("li").siblings().find("a").find("i").addClass("fa-caret-right");
            die.parent("li").siblings().find("a").find("span").removeClass("fa-folder-open");
            die.parent("li").siblings().find("a").find("span").addClass("fa-folder");
            die.find("i").removeClass("fa-caret-right");
            die.find("i").addClass("fa-caret-down");
            die.find("span").removeClass("fa-folder");
            die.find("span").addClass("fa-folder-open");
        } else {
            die.next("ul").fadeOut(t);
            die.find("i").addClass("fa-caret-right");
            die.find("i").removeClass("fa-caret-down");
            die.find("span").addClass("fa-folder");
            die.find("span").removeClass("fa-folder-open");
            die.next("ul").find("a").find("i").removeClass("fa-caret-down");
            die.next("ul").find("a").find("i").addClass("fa-caret-right");
            die.next("ul").find("a").find("i").removeClass("fa-folder");
            die.next("ul").find("a").find("i").addClass("fa-folder-open");
            die.next("ul").find("ul").hide(t);
        }
    });

    editormd.markdownToHTML("test-editormd-view", {
        markdown: $("#test-editormd-view").text(),
        htmlDecode: "style,script,iframe",  // you can filter tags decode
        tocm: true,    // Using [TOCM]
        tocContainer: "#custom-toc-container", // 自定义 ToC 容器层
        emoji: true,
        taskList: true,
        tex: true,  // 默认不解析
        flowChart: true,  // 默认不解析
        sequenceDiagram: true,  // 默认不解析
    });

    $(".markdown-body p").each(function () {
        if ($(this).has("code")){
            $(this).css("padding-left","20px");
            $(this).find("code").css("margin-left","0px");
        }
    });

    $(".markdown-body pre").each(function () {
        if ($(this).prev("h5")){
            $(this).css("margin-left","20px");
        }
    });
    $(".markdown-body table").each(function () {
        _this = this;
        _this_width = $(_this).width();
        thlen = $(_this).find("thead").find("tr").find("th").length;
        width = [];
        for (var i = 0; i < thlen; i++) {
            width["w_"+i] = 0;
        }

        $(_this).find("tr").each(function(k,y) {
            w =0;
            if ($(this).find("th").eq(0) && k===0){
                for (var i = 0; i < thlen; i++) {
                    w = $(this).find("th").eq(i).width();

                    if (width["w_"+i] < w){
                        width["w_"+i] = w;
                    }
                }
            }else{
                for (var i = 0; i < thlen; i++) {
                    w = $(this).find("td").eq(i).width();

                    if (width["w_"+i] < w){
                        width["w_"+i] = w;
                    }
                }
            }

        });

        gw = 200;
        $(_this).find("tr").each(function(k,y) {
            __tw = 0;
            _tw = _this_width;
            for (var i = 0; i < thlen; i++) {
                if (i >= 4 && thlen-1 == i){
                    if (_tw > 0){
                        __tw = (_tw - 13*thlen);
                        $(this).find("td").eq(i).width(__tw);
                    }
                    continue
                }

                _w = width["w_"+i]+20;

                if (i >= 4 && _w > gw){
                    _tw = _tw - gw - 20;
                    $(this).find("th").eq(i).width(gw);
                    $(this).find("td").eq(i).width(gw);
                    continue
                }

                $(this).find("th").eq(i).width(_w);
                $(this).find("td").eq(i).width(_w);
                _tw = _tw - _w - 20;
            }
        });
    });

});