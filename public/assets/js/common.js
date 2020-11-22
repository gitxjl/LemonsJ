var type_list = [
    {'type': 4, 'name': 'PostMan', 'bi': 'bi-postman'},
    {'type': 5, 'name': 'Swagger 2', 'bi': 'bi-swagger'},
    // {'type': 6, 'name': 'OpenApi 3', 'bi': 'bi-open-api'},
    // {'type': 7, 'name': 'yaml', 'bi': 'bi-yaml'},
    // {'type': 8, 'name': 'har 1.2', 'bi': ''},
];

$(document).on("click", '.h-tab .bi-clone', function () {
    var d = $('.h-tab .h-tab-content>div.active').html();
    d = html_clone(d);
    var flag = copyText(d);
    hint(flag ? "已复制" : "复制失败！");
    $(this).closest('.hint').remove();
});
$(document).on("click", '.h-tab ul li', function () {
    var w = $(this).attr('w');
    if ($(this).hasClass('active')) return false;
    var _i = $(this).index();
    if ($('.h-tab .h-tab-content>div').eq(_i).length == 0) {
        hint('切换页面不存在');
        return false;
    }
    $('.h-tab .h-tab-content>div').eq(_i).show().addClass('active').siblings().hide().removeClass('active');
    $(this).addClass('active').siblings().removeClass('active');
    if (w > 0) {
        $(this).closest('.hint').width(w + 'px');
    }
});

$(document).on("click", 'i.sToggle', function () {
    var _dl = $('#sidebar').find('.sidebar-menu .combobox-dl dl.combobox-new').siblings();
    if (_dl.length == 0) _dl = $('#sidebar').find('.sidebar-menu .combobox-dl dl');
    if (_dl.find('dd dl').length <= 0) return false;
    if ($(this).hasClass('bi-chevron-contract') && _dl.find('dd dl').is(':visible')) {
        _dl.find('i.bi-right').removeClass('bi-down');
        _dl.find('dd dl').slideUp(300);
        $(this).removeClass('bi-chevron-contract').addClass('bi-chevron-expand');
    } else if (_dl.find('dd dl').is(':hidden')) {
        _dl.find('dd').each(function (k,v) {
            if ($(this).attr('t')<4 && $(this).find('dl dd').length > 0) {
                $(this).find('dl').slideDown(300);
                $(this).find('i.bi-right').addClass('bi-down');
            }
        });
        $(this).removeClass('bi-chevron-expand').addClass('bi-chevron-contract');
    }
});

$(document).on("click", '.item-edit', function () {
    $('.hint').remove();
    itemEdit(this);
});

function itemState(t) {
    switch (t) {
        case 1:
            if (!isNotNull(storage('iid'))) {
                hint('暂无项目信息，请<span class="item-edit">创建项目</span>后操作');
                return false;
            }
            break;
        default:
            break;
    }
    return true;
}

function link(_this, _h, _t = 0, _n = '', _r = false) {
    if (!itemState(_t)) return false;
    var _text = $(_this).text() || $(_this).parent().text();
    var _text = $(_this).attr('title') || _text;
    var _iclass = $(_this).find('i').prop('class') || $(_this).prop('class');
    if (_h) cIframes({
        url: _h,
        text: _text,
        iclass: _iclass,
        class: _n,
        refresh: _r,
    });
}

function getIBi(c, d) {
    var d = d || 'bi-plus';
    if (!c) return d;
    var arr = c.split(' ');
    for (var i in arr) {
        if (arr[i].substr(0, 3) == "bi-") {
            return arr[i];
        }
    }
    return d;
}

$.extend({
    storage: function (k, v, t) {
        if (window.localStorage) {
            k = k.toUpperCase();
            if (v || v == 0) {
                return window.localStorage.setItem(k, v);
            } else {
                return window.localStorage.getItem(k);
            }
        } else {
            console.warn('This browser does NOT support localStorage');
        }
    }
});

function cIframeInit() {
    try {
        iframeInit();
    } catch (e) {
        window.parent.iframeInit();
    }
}

function cIframes(e) {
    try {
        iframes(e);
    } catch (_e) {
        window.parent.iframes(e);
    }
}

function cdocViewRemove() {
    try {
        docViewRemove();
    } catch (_e) {
        window.parent.docViewRemove();
    }
}

function isNotNull(str) {
    if (str != '' && str != null && typeof(str) != "undefined" && str != "javascript:;") {
        return true;
    }
    return false;
}

function storageRemoveItem(k) {
    if (window.localStorage) {
        k = k.toUpperCase();
        window.localStorage.removeItem(k);
    } else {
        console.warn('This browser does NOT support localStorage clear');
    }
}
function storageClear() {
    if (window.localStorage) {
        window.localStorage.clear();
        hint('已清除')
    } else {
        console.warn('This browser does NOT support localStorage clear');
    }
}
function storage(k, v, t) {
    if (k.length <= 0) return '';
    if (window.localStorage) {
        k = k.toUpperCase();
        if (v || v == 0) {
            return window.localStorage.setItem(k, v);
        } else {
            return window.localStorage.getItem(k);
        }
    } else {
        console.warn('This browser does NOT support localStorage');
    }
}

String.prototype.visualLength = function () {
    !$('.ruler').length && $('body').append('<span class="ruler"></span>');
    let ruler = $('.ruler');
    ruler.text(this);
    return ruler[0].offsetWidth;
};
String.prototype.notNull = function () {
    return typeof(this) != "undefined" && this != '' && this != null && this != "javascript:;";
};

var _refresh = 0;

function times(str, num) {
    return num > 1 ? str += times(str, --num) : str;
}

function html_clone(str) {
    if (str.length == 0) return "";
    var s = str;
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/<br>/g, "");
    s = s.replace(/<pre>/g, "");
    s = s.replace(/<\/pre>/g, "");
    s = s.replace(/<xmp>/g, "");
    s = s.replace(/<\/xmp>/g, "");
    s = s.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, "\t");
    return s;
}

function copyText(text) {
    var textarea = document.createElement("textarea");
    var currentFocus = document.activeElement;
    document.body.prepend(textarea);
    textarea.value = text;
    textarea.focus();
    if (textarea.setSelectionRange)
        textarea.setSelectionRange(0, textarea.value.length);
    else
        textarea.select();
    try {
        var flag = document.execCommand("copy");
    } catch (eo) {
        var flag = false;
    }
    document.body.removeChild(textarea);
    currentFocus.focus();
    return flag;
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

function fetch(a, b) {
    if (isNotNull(a) || a == false || a == true) {
        return a
    }
    return b;
}

var aTime = 0;//提交间隔
function ajaxs(e) {
    if (e.time > 0) {
        if (aTime > 0) {
            hint('请等待 ' + aTime + ' 秒后再提交');
            return false;
        } else if (aTime < 0) {
            aTime = 0;
        }
        if (aTime == 0) {
            aTime = e.time;
            ajasTime();
        }
    } else {
        aTime == 0;
    }

    function ajasTime() {
        if (aTime == 0) aTime = e.time;
        setTimeout(function () {
            aTime--;
            if (aTime > 0) ajasTime();
        }, 1000);
    }

    $.ajax({
        async: fetch(e.async, true),
        type: fetch(e.type, 'POST'),
        url: fetch(e.durl, true) ? 'http://api.lemonsj.com/api/' + fetch(e.url, 'login') : e.url,
        data: e.data,
        dataType: fetch(e.dataType, 'json'),
        cache: fetch(e.type, false),
        processData: fetch(e.processData, true),
        contentType: fetch(e.contentType, 'application/x-www-form-urlencoded'),
        headers: {
            Accept: "application/prs.doc.v1+json",
            Authorization: "Bearer " + storage('token'),
        },
        // timeout: 5000,
        success: e.success,
        // success: function (result) {
        //     try {
        //         e.success(result)
        //     } catch (e) {}
        // },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == 401) {
                if (_refresh <= 1) {
                    loginR();
                } else {

                }
            } else if (XMLHttpRequest.status == 422 && XMLHttpRequest.responseJSON.msg) {
                var _h = '';
                $.each(XMLHttpRequest.responseJSON.error, function (k, v) {
                    _h += v[0] + '<br>';
                });
                hint(_h, 3000);
            } else if (XMLHttpRequest.status != 200) {
                try {
                    hint(XMLHttpRequest.responseJSON.msg);
                } catch (e) {
                    hint('返回错误！');
                }
            }
            try {
                e.error(XMLHttpRequest, textStatus, errorThrown)
            } catch (e) {
            }
        }
    });
}

function login(n, p) {
    $.ajax({url: "/assets/js/jquery.md5.js"}).done(function () {
        ajaxs({
            // async: false,
            data: {
                name: n,
                password: $.md5(p)
            },
            success: function (result) {
                $('.hint').hide();
                hint(n + ' ' + result.msg);
                if (result.code == 200) {
                    storage('token', result.data.token);
                    storage('icon',result.data.icon);
                    storage('name',result.data.name);
                    csIcon(result.data.icon,result.data.name);
                    cGetItem();
                    storage('islogin', 0);
                    cIframeInit();

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status == 401) {
                    _refresh++;
                    if (_refresh <= 1) {
                        refresh();
                    } else {

                    }
                }
            }
        });
    }).fail(function () {
        hint('脚本加载失败，请刷新重试。')
    });
}

function csIcon(i='',t='') {
    try {
        sIcon(i,t);
    } catch (e) {
        window.parent.sIcon(i,t);
    }
}
function cGetItem(iid = '') {
    try {
        getItem(iid);
    } catch (e) {
        window.parent.getItem(iid);
    }
    try {
        init('');
    } catch (e) {
        // window.parent.init('');
    }
    cdocViewRemove();
}

function register($n, $p, _e) {
    $.ajax({url: "/assets/js/jquery.md5.js"})
        .done(function () {
            ajaxs({
                url: 'register',
                // async: false,
                data: {
                    name: $n,
                    password: $.md5($p),
                    email: _e
                },
                success: function (result) {
                    hint($n + ' ' + result.msg);
                    if (result.code == 200) {
                        storage('token', result.data.token);
                        cIframeInit();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    try {
                        hint(XMLHttpRequest.responseJSON.msg)
                    } catch (e) {
                        hint('注册失败，请重新注册。')
                    }
                }
            });
        }).fail(function () {
        hint('注册失败，请重新注册。')
    });
}

function refresh() {
    ajaxs({
        type: "GET",
        url: "refresh",
        success: function (result) {
            hint(result.msg);
            if (result.code == 200) {
                storage('token', result.data.token);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (_refresh == 1 && XMLHttpRequest.status == 405) {
                loginR();
            } else {
                if (XMLHttpRequest.status == 401) {
                    loginR();
                }
                try {
                    hint(XMLHttpRequest.responseJSON.msg);
                } catch (e) {
                }
            }
        }
    });
}

function loginR() {
    try {
        loginReset();
    } catch (e) {
        try {
            window.parent.loginReset();
        } catch (e) {
            hint('token过期')
        }
    }
}

function setTabName(i, v) {
    if ($('.tab-nav ul li.doc-' + i).length > 0) {
        $('.tab-nav ul li.doc-' + i).find('n').text(v);
    } else {
        $('.tab-nav ul li.active').addClass('doc-' + i).find('n').text(v);
    }
}

function sidebarMenuDocAdd(e) {
    if (e.id > 0) {
        var _if = false;
        var d = JSON.parse(storage('catalog'));
        for (let i = 0; i < d.length; i++) {
            var v = d[i];
            if (e.id == v.id) {
                d[i] = e;
                _if = true;
            }
        }
        if (!_if) {
            d.unshift(e);
        }
        var _a_i = $('.combobox-menu .combobox-dl a.active').parent('dd').attr('i');
        storage('catalog', JSON.stringify(d));
        $(".combobox-menu dl.combobox-new").siblings().remove();
        $('.combobox-menu .combobox-dl').append(menu(d, 0, _a_i));
        $('.iframe-doc-' + e.id).length && $('.iframe-doc-' + e.id)[0].contentWindow.setFormComPid(d);
    }
}

function sidebarMenuDocDel(e) {
    if (e.id > 0) {
        var d = JSON.parse(storage('catalog'));
        for (let i = 0; i < d.length; i++) {
            var v = d[i];
            if (e.id == v.id) {
                d.splice(i, 1);
                i--;
            }
        }
        e.del && e.del.remove();
    }

}

function sidebar_menu(d = []) {
    $(".combobox-menu.sidebar-menu dl.combobox-new").siblings().remove();

    if (d.length > 0) {
        $('.combobox-menu.sidebar-menu .combobox-new').hide();
        storage('catalog', JSON.stringify(d));
        $('.combobox-menu.sidebar-menu  .combobox-dl').append(menu(d));
    } else {
        hint('暂无文档，请<span onclick="link(this,\'table.html\',1)">表格文档</span> 或 <span onclick="catalogsEdit(this)">新建目录</span>后操作');
        $('.combobox-menu.sidebar-menu .combobox-new').slideDown(600);

    }
}

function itemAll(d) {
    var h = '';
    $.each(d, function (k, v) {
        h += '<dd i="' + v.id + '" f="1" p="0"><a><bg></bg>' + v.name + '</a>';
        h += '</dd>';
    });
    if (h.length <= 0) return '';
    return '<dl>' + h + '</dl>';
}

function menuList(d, l = 0) {
    if (!d) return '';
    var h = '';
    for (let i = 0; i < d.length; i++) {
        var v = d[i];
        h += '<dd i="' + v.id + '" f="' + v.form + '" p="' + v.pid + '"><a>' + docFormI(v.form, 0) + docTypeI(v.type, v.form) + '<bg></bg>' + v.name + '</a>';
        h += '</dd>';
    }
    if (h.length <= 0) return '';
    return '<dl>' + h + '</dl>';
}

function menuUl(d, l = 0) {
    var h = '';
    for (let i = 0; i < d.length; i++) {
        var v = d[i];
        if (l == v.pid) {
            d.splice(i, 1);
            i--;
            var _m = menu(d, v.id);
            h += '<li i="' + v.id + '" f="' + v.form + '" p="' + v.pid + '"><a>' + docFormI(v.form, _m.length) + docTypeI(v.type, v.form) + '<bg></bg>' + v.name + '</a>';
            h += _m;
            h += '</li>';
        }
    }
    if (h.length <= 0) return '';
    return '<ul>' + h + '</ul>';
}

function menuFile(d, t = 0, l = 0) {
    var h = '';
    $.each(d, function (k, v) {
        var _i = '';
        var _method = v.method || '';
        l++;
        var _m = menuFile(v.list, t, l);
        h += '<dd class="'+(_m.length>9 || v.type > 3?'folder':'doc')+'" i="' + v.data + '" f="0" ft="' + (_m.length > 9 ? '2' : 1) + '" p="0" t="' + t + '"><a>' + method(_method) + docFormI(2, _m.length) + docTypeI(t, 0) + '<bg></bg>' + v.name + '</a>' + _i;
        h += _m;
        h += '</dd>';
    });
    if (h.length <= 0) return '';
    return '<dl>' + h + '</dl>';
}

function menuFriend(d, l = 0, a = 0) {
    var h = '';
    for (let i = 0; i < d.length; i++) {
        var v = d[i];
        h += '<dd i="' + v.fid + '" f="1" p="0" t="0"><a m="' + v.fid + '" f="1"><bg></bg> ' + v.name + ' <small>- ' + v.email + '</small></a></dd>';
    }
    if (h.length <= 0) return '<dl></dl>';
    return '<dl>' + h + '</dl>';
}

function menuForm(d, l = 0, a = 0) {
    if (!d) return '';
    var h = '';
    for (let i = 0; i < d.length; i++) {
        var v = d[i];
        if (l == v.pid) {
            var _m = menuForm(d, v.id, a);
            if (v.form > 0){
                h += '<dd class="'+(_m.length>9 || v.type > 3?'folder':'doc')+'" i="' + v.id + '" f="' + v.form + '" p="' + v.pid + '" t="' + v.type + '"><a>' + docFormI(v.form, _m.length) + docTypeI(v.type, v.form) + '<bg></bg>' + v.name + '</a>';
                h += _m;
                h += '</dd>';
            }
        }
    }
    if (h.length <= 0) return '<dl></dl>';
    return '<dl>' + h + '</dl>';
}
function menuSort(d, l = 0, a = 0) {
    var h = '';
    for (let i = 0; i < d.length; i++) {
        var v = d[i];
        if (l == v.pid) {
            var _m = menuSort(d, v.id, a);
            h += '<dd class="'+menu_file(v.form,)+'" i="' + v.id + '" f="' + v.form + '" p="' + v.pid + '" t="' + v.type + '"><a>' + docFormI(v.form, _m.length) + docTypeI(v.type, v.form) + '<bg></bg>' + v.name + '</a>';
            h += _m;
            h += '</dd>';
        }
    }
    if (h.length <= 0) return '<dl></dl>';
    return '<dl>' + h + '</dl>';
}
function menu(d, l = 0, a = 0) {
    var h = '';
    for (let i = 0; i < d.length; i++) {
        var v = d[i];
        var active = a == v.id ? 'class="active"' : '';
        if (l == v.pid) {
            var _m = menu(d, v.id, a);

            var _i = '<i class="bi bi-dots option"><ul>' + (v.type > 3 ? '' : '<li class="edit">编辑</li>') + (v.type > 3 ? '' : '<li class="view">查看</li>') + '<li class="del">删除</li></ul></i>';
            h += '<dd class="'+(_m.length>9 || v.type > 3?'folder':'doc')+'" i="' + v.id + '" f="' + v.form + '" p="' + v.pid + '" t="' + v.type + '"><a ' + active + '>' + docFormI(v.form, _m.length) + docTypeI(v.type, v.form) + '<bg></bg>' + v.name + '</a>' + _i;
            h += _m;
            h += '</dd>';
        }
    }
    if (h.length <= 0) return '<dl></dl>';
    return '<dl>' + h + '</dl>';
}

function method(_m) {
    if (_m) return '<m class="'+ _m +'">'+ _m +'</m>';
    return '';
}
function menu_file(f) {
    if (f == 0) return ' doc';
    if (f == 1) return ' folder';
    if (f > 1) return ' file';
    return '';
}
function docFormI(f, m) {
    if (f == 1) return '<i class="bi bi-right"></i>';
    if (f == 1 && m <= 9) return '';
    if (f == 1 && m > 9) return '<i class="bi bi-right"></i>';
    if (f == 2 && m > 0) return '<i class="bi bi-right"></i>';
    return '';
}

function docTypeI(t, f) {
    if (f == 1) return '';
    var ilist = {
        0: '<i class="bi bi-code"></i>',
        1: '<i class="bi bi-grid"></i>',
        2: '<i class="bi bi-markdown"></i>',
        3: '<i class="bi bi-curl"></i>',
        4: '<i class="bi bi-postman"></i>',
        5: '<i class="bi bi-swagger"></i>',
        6: '<i class="bi bi-open-api"></i>',
        7: '<i class="bi bi-yaml"></i>',
    };
    if (ilist[t]) {
        return ilist[t];
    }
    return '';
}

function loginReset() {
    storage('islogin', 1);
    $('.iframes').html('');
    $('.tab-nav ul').html('');
    $('.tab-fn .close').click();
    hint('需要重新登录');
    sidebar_menu();
    cIframes({
        url: 'login.html',
        text: '登录 or 注册',
    });
    setTimeout(function () {
        cSideBarOn(true);
    }, 100);
}

function cSideBarOn(t) {
    try {
        sidebarOn(t);
    } catch (e) {
        try {
            window.parent.sidebarOn(t);
        } catch (e) {
        }
    }
}

function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = (c == 'x' ? r : r & 0x03 | 0x08);

        return v.toString(16);
    });
}

function dateHMS() {
    var date = new Date();
    return date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
}

function question(h) {
    try {
        questions(h);
    } catch (e) {
        try {
            window.parent.questions(h);
        } catch (e) {
        }
    }
}

function hint(s, t = 300, t2 = 2000) {
    try {
        hints(s, t, t2);
    } catch (e) {
        try {
            window.parent.hints(s, t, t2);
        } catch (e) {
        }
    }
}


function dialogsssss(e) {
    $('.dialog').remove();
    var n = 'NO' + dateHMS();
    $('<form>', {
        id: '',
        method: 'POST'
    });
    $('<div>', {
        class: 'dialog ' + n,
        html: '<div class="mask"></div><div class="header"><i class="bi bi-star"></i><i class="bi bi-x right"></i></div>' +
        '<form id="xxxx" method="POST">\n' +
        '        <div class="container">\n' +
        '            <div class="input-radio">\n' +
        '                <label>\n' +
        '                    <input type="radio" name="permissions" value="0" checked=""><n>默认</n><i class="bi bi-question" title="新增/编辑/删除"></i>\n' +
        '                </label>\n' +
        '                <label>\n' +
        '                    <input type="radio" name="permissions" value="1"><n>只读</n>\n' +
        '                </label>\n' +
        '            </div>\n' +
        '            <div class="input-box">\n' +
        '                <input class="input" type="text" name="search" value="1">\n' +
        '                <i class="bi bi-search"></i>\n' +
        '            </div>\n' +
        '            <div class="input-box">\n' +
        '                <div class="title">名称：</div>\n' +
        '                <input class="input" type="text" name="name" value="1">\n' +
        '            </div>\n' +
        '            <div class="input-box">\n' +
        '                <div class="title">项目切换：</div>\n' +
        '                <div class="value">\n' +
        '                    项目切换777\n' +
        '                </div>\n' +
        '                <i class="bi bi-down"></i>\n' +
        '            </div>\n' +
        '            <div class="input-box">\n' +
        '                <div class="title">排序：</div>\n' +
        '                <i class="bi bi-dash"></i>\n' +
        '                <input class="sort" type="text" name="sort" value="1">\n' +
        '                <i class="bi bi-plus"></i>\n' +
        '            </div>\n' +
        '            <div class="input-box">\n' +
        '                <div class="title">项目切换：</div>\n' +
        '                <div class="value">\n' +
        '                    <!--<n><t>胜多负少的方式胜多负少的方式胜多负少的方式胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n>-->\n' +
        '                    项目切换777\n' +
        '                    <!--项目切换7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777-->\n' +
        '                </div>\n' +
        '                <i class="bi bi-down"></i>\n' +
        '            </div>\n' +
        '            <div class="combobox">\n' +
        '                <div class="input-box">\n' +
        '                    <div class="title">项目切换：</div>\n' +
        '                    <div class="value">\n' +
        '                        <!--<n><t>胜多负少的方式胜多负少的方式胜多负少的方式胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n>-->\n' +
        '                        项目切换777\n' +
        '                        <!--项目切换7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777-->\n' +
        '                    </div>\n' +
        '                    <i class="bi bi-down"></i>\n' +
        '                </div>\n' +
        '                <div class="combobox-box">\n' +
        '                    <div class="search-box">\n' +
        '                        <input type="text" class="search" value="" placeholder="搜索 / Search">\n' +
        '                    </div>\n' +
        '                    <div class="combobox-menu">\n' +
        '                        <div class="combobox-dl">\n' +
        '                            <dl>\n' +
        '                                <dd><a href="baidu.com"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                            </dl>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="input-radio">\n' +
        '                <label>\n' +
        '                    <input type="radio" name="permissions" value="0" checked=""><n>默认</n><i class="bi bi-question" title="新增/编辑/删除"></i>\n' +
        '                </label>\n' +
        '                <label>\n' +
        '                    <input type="radio" name="permissions" value="1"><n>只读</n>\n' +
        '                </label>\n' +
        '            </div>\n' +
        '            <div class="combobox multiple">\n' +
        '                <div class="input-box">\n' +
        '                    <div class="title">好友：</div>\n' +
        '                    <div class="value">\n' +
        '                        <n class="gradient"><t>胜多负少的方式胜多负少的方式胜多负少的方式胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多</t><i class="bi bi-x"></i></n><n><t>少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n>\n' +
        '                        <!--项目切换777-->\n' +
        '                        <!--项目切换7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777-->\n' +
        '                    </div>\n' +
        '                    <i class="bi bi-down"></i>\n' +
        '                </div>\n' +
        '                <div class="combobox-box">\n' +
        '                    <div class="search-box">\n' +
        '                        <input type="text" class="search" value="" placeholder="搜索 / Search">\n' +
        '                    </div>\n' +
        '                    <div class="combobox-menu">\n' +
        '                        <div class="combobox-dl">\n' +
        '                            <dl>\n' +
        '                                <dd><a m="1"><bg></bg>网址</a></dd>\n' +
        '                                <dd><a t="2"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="3" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a t="4" href="#"><bg></bg>www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="5" href="#"><bg></bg>1111网址为www.divcss5.com</a>\n' +
        '                                    <dl>\n' +
        '                                        <dd><a m="1"><bg></bg>网址</a></dd>\n' +
        '                                        <dd><a m="2"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                        <dd><a m="3" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                        <dd><a m="4" href="#"><bg></bg>www.divcss5.com</a>\n' +
        '                                            <dl>\n' +
        '                                                <dd><a m="1"><bg></bg>网址</a></dd>\n' +
        '                                                <dd><a m="2"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                                <dd><a m="3" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                                <dd><a m="4" href="#"><bg></bg>www.divcss5.com</a></dd>\n' +
        '                                            </dl>\n' +
        '                                        </dd>\n' +
        '                                    </dl>\n' +
        '                                </dd>\n' +
        '                                <dd><a t="6" href="#"><bg></bg>tttt1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a t="7" href="#"><bg></bg>ttttt1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="8" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="9" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="10" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="11" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="12" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="13" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="14" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="15" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="16" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="17" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="18" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="19" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="20" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="21" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="22" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="23" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                                <dd><a m="24" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '                            </dl>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="buttons">\n' +
        '            <button type="text">取消</button>\n' +
        '            <button type="submit">提交</button>\n' +
        '        </div>\n' +
        '    </form>'
    }).appendTo('body').fadeIn(200);
}

(function ($) {
    $.fn.serializeJson = function () {
        var serializeObj = {};
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
        return serializeObj;
    };
    $.fn.extend({
        drag: function (t) {
            var _this = null, i = {
                axis: 'x',
                cache: true,
                range: document,
                elem: [['#sidebar', 'x', 'width'], ['#container', 'x', 'left']]
            };
            t = $.extend({}, i, t || {});

            function _drag(e) {
                _this = this;
                var isL = false;
                var _r = {};
                var wr = {
                    w: $(_this).outerWidth(),
                    h: $(_this).outerHeight(),
                }
                if (t) {
                    if (t.range) {
                        isL = !isL;
                    }
                }
                if (isL) {
                    var rw = $(t.range).outerWidth();
                    var rh = $(t.range).outerHeight();
                    if (rw > 0 && rh <= 0) rh = wr.h;
                    _r = {
                        maxX: rw - wr.w,
                        maxY: rh - wr.h,
                        minX: 0,
                        minY: 0
                    };
                }
                var cX = e.clientX;
                var cY = e.clientY;
                var oLeft = _this.offsetLeft;
                var oTop = _this.offsetTop;
                $(document).bind('mousemove', moveEvent);

                function moveEvent(e) {
                    var sX = e.clientX - cX, sY = e.clientY - cY, x = sX + oLeft, y = sY + oTop;
                    if (isL) {
                        x = x < _r.minX ? 0 : (x > _r.maxX ? _r.maxX : x);
                        y = y < _r.minY ? 0 : (y > _r.maxY ? _r.maxY : y)
                    }
                    if ((t.minX && t.minX >= x) || (t.minY && t.minY >= y) || (t.maxX && t.maxX <= x) || (t.maxY && t.maxY <= y)) return false;
                    t.mX = x, t.mY = y;
                    elemS(_this, t.axis);
                    elemAxis(t.elem, t.axis);
                    if (t.mX >= 50) storage('mX', t.mX);
                    if (t.mX >= 50) storage('mY', t.mY);
                }
            }

            function elemAxis(e) {
                $.each(e, function (k, v) {
                    elemS(v[0], v[1], v[2]);
                })
            }

            function elemS(e, a, d = '') {
                var s = '';
                switch (a.toUpperCase()) {
                    case "X":
                        s = d ? d : 'left';
                        $(e).css(s, t.mX + 'px');
                        break;
                    case "Y":
                        s = d ? d : 'top';
                        $(e).css({s: t.mY + 'px'});
                        break;
                    default:
                        $(e).css({left: t.mX + 'px', top: t.mY + 'px'});
                        break;
                }
            }

            function endMove(e) {
                $("iframe").css({"z-index": 0});
                document.body.onselectstart = function () {
                    return true;
                }
                if (_this) {
                    if (_this.offsetLeft < 0) $(_this).css("left", 0);
                    if (_this.offsetTop < 0) $(_this).css("top", 0);
                }
                $(document).unbind('mousemove');
            }

            $(document).bind('mouseup', endMove);
            $(this).bind('mousedown', function (e) {
                $("iframe").css({"z-index": -1});
                document.body.onselectstart = function () {
                    return false;
                }
                _drag.apply(this, [e]);
            });
        },
        fDrop: function (t) {
            var i = {
                drop: $(this).find('ul').first(),
            };
            t = $.extend({}, i, t || {});
            var _h = $(this).height;
            var _x = $(this).offset().left;
            var _y = $(this).offset().top + 12;
            $(this).mouseover(function () {
                t.drop.is(':hidden') && t.drop.css({left: _x + 'px', top: _y + 'px'}).show();
                $('.floating-menu').hide();
            }).mouseout(function () {
                t.drop.is(':visible') && t.drop.hide();
            });
        },
        tabs: function (t) {
            var i = {
                scrollX: $('.tab-nav ul'),
                tab: '.tab-nav ul li',
                sBut: $('.tab .scroll'),
                close: $('.tab .close'),
                content: '.iframes>iframe',
                class: 'active',
                sTime: 800,
                mDist: 400,
            };
            t = $.extend({}, i, t || {});

            $(document).on("click", t.tab, function () {
                if ($(this).hasClass(t.class)) return false;
                var _i = $(this).index();
                if ($(t.content).eq(_i).length == 0) {
                    hint('切换页面不存在');
                    return false;
                }
                $(t.content).eq(_i).show().siblings().hide();
                $(t.content).eq(_i).attr('name', 'iframes-' + _i);
                $(this).addClass(t.class).siblings().removeClass(t.class);
                if ($(this).hasClass('undefined') || ($(this).hasClass('doc-view') && ($(this).attr('t') == 2 || $(this).attr('t') == 1))) {
                    try {
                        $(t.content).eq(_i)[0].contentWindow.viewInit();
                    } catch (e) {
                    }
                }
            });
            t.close.click(function () {
            });
            t.sBut.click(function () {
                if (t.scrollX.width() >= t.scrollX[0].scrollWidth) return false;
                var _t = t.scrollX, l = _t.scrollLeft(), m = this.attributes.d.value == 0 ? l - t.mDist : l + t.mDist;
                scrollXAnimate(m, _t);
            });

            function scrollXAnimate(m, _t) {
                var _t = $(_t);
                var w = _t.width(), sw = _t[0].scrollWidth, l = _t[0].scrollLeft;
                if (m > 0 && (m + w) < sw && sw > w) {
                    !_t.hasClass('shadow') && _t.addClass('shadow').removeClass('shadow-l').removeClass('shadow-r');
                    t.sBut.removeClass('disabled');
                }
                if (m <= 0 && l <= 0 && !_t.hasClass('shadow-r')) {
                    _t.removeClass('shadow');
                    _t.removeClass('shadow-l');
                    _t.addClass('shadow-r');
                    t.sBut.removeClass('disabled');
                    t.sBut.eq(0).addClass('disabled');
                }
                if (m + w >= sw && l + w >= sw && !_t.hasClass('shadow-l')) {
                    _t.removeClass('shadow');
                    _t.removeClass('shadow-r');
                    _t.addClass('shadow-l');
                    t.sBut.removeClass('disabled');
                    t.sBut.eq(1).addClass('disabled');
                }
                _t.stop().animate({scrollLeft: m}, t.sTime, function () {
                    if (!(m > 0 && (m + w) < sw && sw > w)) {
                        t.sBut.removeClass('disabled');
                        _t.removeClass('shadow');
                        m >= 0 ? aShadowL() : rShadowL();
                        (m + w) < sw ? aShadowR() : rShadowR();
                    }
                });

                function aShadowL() {
                    _t.addClass('shadow-l');
                }

                function rShadowL() {
                    _t.removeClass('shadow-l');
                    t.sBut.eq(0).addClass('disabled');
                }

                function aShadowR() {
                    _t.addClass('shadow-r');
                }

                function rShadowR() {
                    _t.removeClass('shadow-r');
                    t.sBut.eq(1).addClass('disabled');
                }
            }
        }
    });
    $.extend({
        tabClose: function (e) {
        },
        issetEmpty: function (s) {
            return s != '' && s != null && typeof(s) != "undefined" && s != "javascript:;";
        },
        sidebar_m: function () {

            if (self.frameElement && self.frameElement.tagName == "IFRAME") {
                sidebar_m = $('.sidebar-mode', parent.document);
                sidebar = $('#sidebar', parent.document);
                split = $('#split', parent.document);
                container = $('#container', parent.document);
            }

            var w = sidebar.width(), m = w <= 0 ? W : 0, t = 500;
            W = w > 0 && w;
            storage('MX', m);
            storage('W', W);
            ((!W && !m) || (m == 'false' && !W) || (W == 'false' && !m)) && (m = 300, W = false);

            m ? sidebar_m.removeClass('bi-on') : sidebar_m.addClass('bi-on');
            sidebar.animate({width: m}, t);
            split.animate({left: m}, t);
            container.animate({left: m}, t);
        },
        max: function (a, b) {
            return a > b ? a : b;
        }
    });

    var W = storage('W') || 300;
    var sidebar = $('#sidebar');
    var split = $('#split');
    var container = $('#container');
    var sidebar_m = $('.sidebar-mode');


    window.ondblclick = function (e) {
        var bn = e.target.tagName;
        (
            bn != 'BUTTON' &&
            bn != 'INPUT' &&
            bn != 'A' &&
            bn != 'I' &&
            !$(e.target).closest('.ondblclick').length &&
            !$(e.target).closest('#doc-create').length &&
            !$(e.target).closest('.combobox').length
        ) &&
        $.sidebar_m();
    };

    window.onclick = function (e) {
        var _con = $('.button-option');
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
            _con.find('.option ul').hide();
        }
        var _con = $('.combobox');
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
            $('.input-box').removeClass('combobox-show');
            $('.combobox').find('.combobox-box').hide();
        }
        var _con = $('.doc-con');
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
            try {
                docCon();
            } catch (e) {
                try {
                    window.parent.docCon();
                } catch (e) {
                }
            }
        }
        var _con = $('.item-edit-but');
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
            try {
                itemEditBut();
            } catch (e) {
                try {
                    window.parent.itemEditBut();
                } catch (e) {
                }
            }
        }

        var _con = $('.fun-menu');
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
            try {
                closeFuMenu(e);
            } catch (e) {
                try {
                    window.parent.closeFuMenu(e);
                } catch (e) {
                }
            }
        }
    };
})(jQuery);

function specialNull() {
    $('.floating-menu').find('li.fun').addClass('special');
}

function specialBodyMenu(e) {
    var _t = $(e).closest('body');
    var i = _t.attr('i');
    var t = _t.attr('t');
    var f = _t.attr('f');
    var n = _t.attr('n');
    var ic = _t.attr('ic');

    $('.floating-menu').attr('i', i).attr('t', t).attr('n', n).attr('f', f).attr('ic', ic);
    $('.floating-menu').find('li.fun').removeClass('special');
}

$(function () {
    //右键菜单
    window.oncontextmenu = function (es) {
        var _this = $(es.target);
        if (_this.closest('body').hasClass('no')) return;

        if (_this.closest('.sidebar-menu').length &&
            _this.closest('dd').length &&
            _this.closest('dd').attr('i') > 0) {

            var dd = _this.closest('dd');
            var dl = _this.closest('.combobox-dl');
            var i = dd.attr('i');
            var t = dd.attr('t');
            var f = dd.attr('f');
            var n = _this.text();
            var ic = dd.find('dl dd').length > 0 ? 1 : 0;

            dl.find('a').removeClass('special');
            _this.addClass('special');
            $('.floating-menu').attr('i', i).attr('t', t).attr('n', n).attr('f', f).attr('ic', ic).find('li.fun').removeClass('special');
        } else if (_this.closest('body').attr('i') > 0) {
            window.parent.specialBodyMenu(es.target);
        } else {
            window.parent.specialNull();
        }
        es.preventDefault();
        if (_this.closest('.tab-nav').length > 0) {
            try {
                tabMenu(es);
            } catch (e) {
                try {
                    window.parent.tabMenu({'x': es.clientX, 'y': es.clientY + window.parent.tabH(), 'i': true});
                } catch (e) {
                }
            }
        } else {
            try {
                fuMenu(es);
            } catch (e) {
                try {
                    var h = es.clientY;
                    // if (_this.closest('body').hasClass('is-iframe') || _this.closest('body').attr('iframe')){
                    //     h =h- 30;
                    // }
                    h =h- 30;
                    window.parent.fuMenu({'x': es.clientX, 'y': h, 'i': true});
                } catch (e) {
                }
            }
        }
    };

    $(document).on('click', '.hint .icon-x', function () {
        $(this).parent('.hint').remove();
    });
    $('.button-option .option').click(function () {
        if ($(this).find('ul').first().is(':hidden')) {
            $(this).find('ul').first().show();
        } else {
            $(this).find('ul').hide();
        }
    });
    $('.button-option .option ul').mouseleave(function () {
        $(this).is(':visible') && $(this).hide();
    });

    //combobox start
    $(document).on('click', '.combobox .input-box', function (e) {
        var _this = $(this), box = $(this).next('.combobox-box');
        var _target = $(e.target);

        if (_target.hasClass('fold') || _target.hasClass('unfold') || _target.hasClass('bi-x')) return false;
        if (box.length) {
            if (_this.closest('.combobox').find('.combobox-menu .combobox-dl dl').length <= 0) {
                hint('暂无选项');
                return false;
            }
            $('.input-box').not($(this)).removeClass('combobox-show');
            $('.combobox').not($(this).parent('.combobox')).find('.combobox-box').hide();
            box.slideToggle(200, function () {
                $(this).is(":visible") && _this.addClass('combobox-show');
            });
            _this.hasClass('combobox-show') ? setTimeout(function () {
                _this.removeClass('combobox-show')
            }, 150) : _this.addClass('combobox-show');
        }
        _this.closest('.combobox.multiple').length && multipleSelect(_this.closest('.combobox.multiple').find('.combobox-menu .combobox-dl'));
    });

    $(document).on('click', '.combobox-dl dd a', function (e) {
        var _this = $(this), dl = _this.closest('dd').children('dl'), ml = _this.closest('.combobox.multiple').length;
        (dl.length > 0 || _this.children('i.bi-right').length || _this.closest('.combobox').length || !storage('A')) && e.preventDefault();
        var _i = _this.parent('dd').attr('i') || _this.attr('i');
        var _f = _this.parent('dd').attr('f') || _this.attr('f');
        var _t = parseInt(_this.parent('dd').attr('t'));
        var _s_m = _this.closest('.combobox-menu').length;
        var _c_d = _this.closest('.combobox-download').length;
        var _f_t = _this.closest('.form-type').length;
        var _dd = _this.closest('dd');
        var _dd_has_r = _this.find('i').hasClass('bi-right');
        var _dl = _this.find('dl');
        var _dldd = _dl.find('dl dd');
        var _text = _this.text();
        var _c_type= _this.closest('.combobox').attr('t');

        if (_c_type == 1 && _f == 2) {
            hint('文件目录不可选');
            return false;
        }
        if (_i && _f == 0 && !_this.closest('.dialog-ul-box').length && (!_s_m && !_c_d)) {
            hint('非目录不可选');
            return false;
        }

        if (!ml) {
            _this.addClass('active').closest('.combobox-dl').find('a').not(_this).removeClass('active');
            !_c_type && dl.find('dd').length > 0 && dl.slideToggle(200) && _this.children('i.bi-right').toggleClass('bi-down');
            (!_i || _s_m > 0) && dl.find('dd').length <= 0 && _this.closest('.dialog').length <= 0 && _f == 1 && _this.children('i.bi-right').length && hint('该目录下暂无文档');
        }
        if (_i && _f == 1 && !ml) {
            _this.closest('.combobox').find('.input-box .combobox-input').val(_i);
            _this.closest('.combobox').find('.input-box .value').html(_text.trim().replace(/\s/g, ""));
            $('.input-box').removeClass('combobox-show');
            $('.combobox').find('.combobox-box').hide();
        } else if (_this.closest('.combobox').length && !ml) {
            _this.closest('.combobox').find('.input-box .combobox-input').val(_text.trim().replace(/\s/g, ""));
            _this.closest('.combobox').find('.input-box .value').html(_text.trim().replace(/\s/g, ""));

            $('.combobox').find('.input-box').removeClass('combobox-show');
            $('.combobox').find('.combobox-box').hide();
        }

        if (_this.closest('.item-cut').length && !ml && !_c_d) {
            cGetItem(_this.attr('i'));
        }
        if (_this.closest('.sort').length) {
            _this.closest('.sort').find('.combobox-dl dd a').removeClass('active');
        }

        if (_s_m && _t >= 0 && !ml && !_c_d && _f != 1) {
            var url = '';
            if (_t > 3 && !_this.find('i').hasClass('bi-down') && !_this.attr('a') == 1) {
                if ((_this.parent('dd').attr('ft') == 1 && !_dd_has_r) || (_this.parent('dd').attr('ft') == 1 && _f == 0)) {
                    switch (_t) {
                        case 4:
                            url = 'postman';
                            break;
                        case 5:
                            url = 'swagger';
                            break;
                        case 6:
                            url = 'openApi';
                            break;
                        case 7:
                            url = 'yaml';
                            break;
                        case 8:
                            url = 'har';
                            break;
                        default :
                            url = 'postman';
                            break;
                    }
                    url = 'doc/view/' + url + '.html?f=' + _i+'&t='+_t;
                    $.ajax({url: "/assets/js/jquery.md5.js"}).done(function () {
                        var md5i = $.md5(_i);
                        cIframes({
                            url: url,
                            text: _text,
                            iclass: getIBi(_this.find('i').prop('class')),
                            class: 'doc-' + md5i,
                            nclass: 'doc-view',
                            attrs: {'t': _t, 'i': md5i},
                        });
                    }).fail(function () {
                    });
                } else if (!_this.parent('dd').attr('ft')) {
                    ajaxs({
                        type: "GET",
                        url: "doc/" + _i,
                        success: function (result) {
                            if (result.code == 200 && result.data && result.data.content) {
                                _this.parent('dd').find('dl').remove();
                                _this.parent('dd').append(menuFile(JSON.parse(result.data.content), _t));
                                _this.attr('a', 1);
                                _this.find('i.bi-right').addClass('bi-down');
                                _this.parent('dd').children('dl').show();
                            }
                        }
                    });
                }

            } else if (_t <= 3) {

                if (storage('pattern') == 'true') {
                    switch (_t) {
                        case 0:
                            url = 'html';
                            break;
                        case 1:
                            url = 'table';
                            break;
                        case 2:
                            url = 'markdown';
                            break;
                        case 3:
                            url = 'curl';
                            break;
                        default :
                            url = 'html';
                            break;
                    }
                } else {
                    url = 'doc/common-view';
                    if (_t == 2) url = 'doc/markdown-view';
                }
                url += '.html?id=' + _i;
                cIframes({
                    url: url,
                    text: _text,
                    iclass: getIBi(_this.find('i').prop('class')),
                    class: 'doc-' + _i,
                    nclass: 'doc-view',
                    attrs: {'t': _t, 'i': _i},
                });
            }

            $('.sidebar-menu dl dd a').removeClass('special');
        }
    });

    //multiple start
    $(document).on('click', '.combobox.multiple .input-box .bi.bi-x', function (e) {
        setMultipleValue($(this).closest('.combobox.multiple').find('.combobox-menu .combobox-dl'), $(this).parent('n').attr('m'), $(this).parent('n').attr('t'));
    });
    $(document).on('click', '.combobox.multiple .input-box .bi.fold', function (e) {
        $(this).toggleClass('fold').toggleClass('unfold').parent().children('.value').addClass('fold');
    });
    $(document).on('click', '.combobox.multiple .input-box .bi.unfold', function (e) {
        $(this).toggleClass('unfold').toggleClass('fold').parent().children('.value').removeClass('fold');
    });

    function multipleSelect(_this, _f = '') {
        var _m = _this.data('m');
        if (_m) return false;
        _this.data('m', 1);
        var ism = false;
        var isd = false;
        var obj = _this.find('a');
        $(obj).on("click", function (e) {
            isd = true;
            setMoveMultipleSelect($(this));
            setMultipleValue(_this);
        });
        $(obj).on("mousedown", function (e) {
            e.preventDefault();
            ism = true;
        });
        $(document).on("mouseup", function (e) {
            $(document).off('mousemove');
            $(obj).attr('_m', 0);
            if (ism && isd) {
                isd = false;
                setMultipleValue(_this);
            }
            ism = false;
            isd = false
        });
        $(obj).on("mousemove", function (e) {
            if (ism && (!$(this).attr('_m') || $(this).attr('_m') == 0)) {
                isd = true;
                setMoveMultipleSelect($(this));
                $(this).attr('_m', 1);
            }
        });
        $(obj).on("mouseout", function (e) {
            if (ism) $(this).attr('_m', 0);
        });
    }

    function setMultipleValue(_this, m = 0, t = 0) {
        var multiple = _this.closest('.combobox.multiple').children('.input-box'), _v = multiple.children('.value'),
            _input_v = multiple.children('.combobox-input'),
            _bi = multiple.children('.bi');
        _v.empty();

        var u = [];
        _this.find('a.active').each(function (k, v) {
            var am = $(this).attr('m');
            var at = $(this).attr('t');
            u.push(am);
            m && m == am && $(this).removeClass('active');
            t && t == at && $(this).removeClass('active');
            if (($.issetEmpty(am) || $.issetEmpty(at)) && (m != am && t != at)) {
                var _t = '';
                try {
                    _t = $(this)[0].childNodes[3].data;
                } catch (e) {
                    _t = $(this).not('firstChild').text();
                }
                if (_t) {
                    var n = $('<n>', {
                        class: _t.visualLength() > 80 ? 'gradient' : '',
                        title: _t,
                        m: am,
                        t: at,
                        html: '<t>' + _t + '</t><i class="bi bi-x"></i>',
                    });
                    _v.append(n);
                }
            }
        });
        _input_v.val(u.join(','));
        !_v.text().visualLength() && _v.text('暂无选择');
        _v.height() <= 22 && _v.find('n').length <= 2 && _bi.removeClass('unfold') && _bi.removeClass('fold') && _v.removeClass('fold');
        _v.height() > 22 && _v.find('n').length > 2 && _bi.addClass('fold') && _bi.removeClass('unfold');
        _v.find('.gradient').length && _v.tabs({scrollX: _v.find('.gradient t')});
        _v.find('n').length == 1 && _v.find('n').first().find('t').css('max-width', '100%');
    }

    function setMoveMultipleSelect(_this) {
        $.issetEmpty(_this.attr('m')) || $.issetEmpty(_this.attr('t')) ? _this.toggleClass('active') : hint('目录、缺少必要参数等不可选择');
    }

    //multiple end
    //combobox end
    function serach(e) {
        var _menu = $(e).parent('.search-box').siblings('.combobox-menu');
        if (_menu.length <= 0) return false;
        var _v = $(e).val();
        if (_v.length > 0) {
            var arr = _v.split(' ');
            _menu.find('dd').hide();
            $.each(arr, function (index, value) {
                _menu.find('a:contains(' + value + ')').parents("dd").show();
                _menu.find('a:contains(' + value + ')').parents("dd").find("dl").show();
            });
            $(e).siblings(".bi-search").addClass('bi-x');
        } else {
            _menu.find('dd').show();
            $(e).siblings(".bi-search").removeClass('bi-x');
        }
    }

    $(document).on('input propertychange', '.search-box .search', function () {
        serach(this)
    });
    $(document).on('click', '.search-box .bi-x', function () {
        $(this).siblings('input.search').val('').removeClass('bi-x');
        serach($(this).siblings('input.search'));
    });

});

function comboboxInit2(_this = '') {
    if (_this.length > 1) {
        _this.each(function () {
            var _t = $(this);
            var _i = _t.find('.combobox-input').val();
            if (_i) {
                _t.find('dd a').removeClass('active');
                _t.find('dd').each(function () {
                    if ($(this).find('a').text().trim().replace(/\s/g, "") == _i) {
                        $(this).children('a').addClass('active');
                        _t.find('.input-box .value').html($(this).children('a').text());
                    }
                });
            }
        });

    } else if (_this) {
        var _i = _this.find('.combobox-input').val();
        if (_i) {
            _this.find('dd a').removeClass('active');
            _this.find('dd').each(function () {
                if ($(this).find('a').text().trim().replace(/\s/g, "") == _i) {
                    $(this).children('a').addClass('active');
                    _this.find('.input-box .value').html($(this).children('a').text());
                }
            });
        }
    } else {
    }
}

function comboboxInit(_this = '') {
    if (_this) {
        var _i = _this.find('.combobox-input').val();
        if (_i) {
            _this.find('dd a').removeClass('active');
            _this.find('dd').each(function () {
                if ($(this).attr('i') == _i) {
                    $(this).children('a').addClass('active');
                    _this.find('.input-box .value').html($(this).children('a').text());
                }
            });
        }
    } else {
        $('.combobox').each(function () {
            comboboxInit(this);
        });
    }
}

$(document).on('click', '.dialog .header .bi-x,.dialog .back', function () {
    $(this).closest('.dialog').remove();
});
$(document).on('click', '.dialog .dtip', function () {
    storage('dtip-' + $(this).attr('dtip'), $(this).attr('dtip'));
    $(this).closest('.dialog').submit();
});
//counter start
$(document).on('click', '.counter .bi-dash', function () {
    var _n = $(this).siblings('.counter .numeric');
    _n.val(parseInt(_n.val()) - 1);
});
$(document).on('click', '.counter .bi-plus', function () {
    var _n = $(this).siblings('.counter .numeric');
    _n.val(parseInt(_n.val()) + 1);
});
$(document).on('input propertychange', '.counter .numeric', function () {
    var _n = $(this);
    var _v = parseInt(_n.val());
    if (!_v) _v = 0;
    _n.val(_v);
});

//counter end

function catalogs_l() {
    var h = '<dl><dd i="0" f="1"><a href=":;"><bg></bg>一级目录</a></dd>';
    h += '</dl>';
    return h;
}

function catalogs_null() {
    var h = '<dl><dd i="0" f="1"><a href=":;"><bg></bg>暂不选择</a></dd>';
    h += '</dl>';
    return h;
}

function catalogs_edit() {
    var h = '<dl><dd i="0" f="1"><a href=":;"><bg></bg>暂不选择</a></dd>';
    h += '</dl>';
    return h;
}

function typeList(t) {
    var h = '<dl>';
    $.each(type_list, function (k, v) {
        var a = '';
        if (v.type == t) {
            a = 'active'
        }
        h += '<dd i="' + v.type + '" f="1"><a href=":;" class="' + a + '"><i class="bi ' + v.bi + '"></i><bg></bg>' + v.name + '</a></dd>';
    });
    h += '</dl>';
    return h;
}

function uploadFile(_this, _t = 0) {
    var _this = $(_this);
    var _n = 'upload_file' + dateHMS();
    var _s = false;
    getData('upload_file', "catalog/" + storage('iid'), function (d) {
        dialog({
            bi: getIBi(_this.find('i').prop('class')),
            formId: _n,
            container: catalogInput('name', '文档名称，默认文件内名称') +
            catalogInput('iid', 'iid', storage('iid'), 1) +
            catalogInput('tdl', 'tdl', 0, 1) +
            catalogUploadFile() +
            catalogCombobox({
                title: '类型',
                name: 'type',
                value: _t,
                menu: typeList(_t),
                but: '',
            }) +
            catalogCombobox({
                type: 1,
                title: '所属',
                name: 'pid',
                value: '0',
                menu: '<dl><dd i="-1"><a href=":;"><bg></bg>新项目建立</a></dd></dl>' + menuForm(d),
                but: '<i class="bi bi-catalogs-plus"></i>',
            }) +
            catalogCalculate(),
        });
    });

    $(document).on('submit', 'form#' + _n, function () {
        if (_s) return false;
        var _this = $(this);
        var formData = new FormData($('form#' + _n)[0]);

        ajaxs({
            url: "doc",
            type: 'POST',
            data: formData,
            // async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    _s = true;

                    sidebarMenuDocAdd({
                        id: result.data.id,
                        name: result.data.name,
                        pid: result.data.pid,
                        form: 2,
                        param: 1,
                        sort: result.data.sort,
                        type: result.data.type,
                    });

                }
            }
        });

        return false;
    });
}

function uploadFiles(_this, _t = 0) {
    var _this = $(_this);
    var _n = 'upload_file' + dateHMS();
    var _s = false;
    dialog({
        bi: getIBi(_this.find('i').prop('class')),
        formId: _n,
        container: catalogInput('name', '文档名称，默认文件内名称') +
        catalogInput('pid', 'pid', -1, 1) +
        catalogUploadFile() +
        catalogCombobox({
            title: '类型',
            name: 'type',
            value: _t,
            menu: typeList(_t),
            but: '',
        }),
    });
    $(document).on('submit', 'form#' + _n, function () {
        if (_s) return false;
        var _this = $(this);
        var formData = new FormData($('form#' + _n)[0]);
        ajaxs({
            url: "doc",
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    _s = true;
                    cGetItem(result.data.id);
                }
            }
        });
        return false;
    });
}

function itemTransfer(_this, _i = '') {
    if (!itemState(1)) return false;
    var _n = 'item_transfer' + dateHMS();

    getData('item_transfer', "friend", function (d) {
        dialog({
            bi: 'bi-item-plus',
            formId: _n,
            container: catalogSearch('email', '搜索用户邮箱') +
            catalogInput('iid', '项目ID', _i, 1) +
            catalogCombobox({
                title: '好友',
                name: 'uid',
                value: '',
                menu: menuFriend(d),
            }),
        });
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        ajaxs({
            url: "item/transfer",
            data: $(this).serialize(),
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    cGetItem();
                }
            }
        });
        return false;
    });
}

function itemEdit(_this, _i = '') {
    if (!itemState(1)) return false;
    var _n = 'item_edit' + dateHMS();
    var _text = $(_this).closest('a').text() || $(_this).closest('dd').find('a').text() || $(_this).closest('.list').find('.title').text();
    if (_i == -1) {
        _i = storage('iid');
        if (!_i || _i<=0){
            hint('暂无项目，请<span onclick="itemEdit(this)">新建项目</span>后操作');
            return false;
        }
        _text = $('.item-cut .input-box .value').text();
    }

    var _html = catalogInput('name', '项目名称', _text) +
        catalogInput('id', '项目ID', _i, 1);

    getData('item_all', "item/all", function (d) {
        if (!_i) _html += catalogCombobox({
            title: '复制',
            name: 'copy',
            value: '',
            menu: itemAll(d),
            but: '',
        });
        dialog({
            bi: 'bi-item-plus',
            formId: _n,
            container: _html,
        });
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        ajaxs({
            url: "item",
            data: $(this).serialize(),
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    cGetItem(result.data.id);
                }
            }
        });
        return false;
    });
}

function icon() {
    var _n = 'icon' + dateHMS();

    getData('', "info", function (d) {
        dialog({
            formId: _n,
            container: catalogIcon('icon', '头像', d.icon),
        });
    });
    var ui = $('.user-edit > img').attr('src');
    $(document).on('click', '.dialog.'+_n+' .header .bi-x,.dialog.'+_n+' .back', function () {
        csIcon(ui);
    });
    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        ajaxs({
            url: "icon",
            data: $(this).serialize(),
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    storage('icon',_this.find("input[name='icon']:checked").val())
                }
            }
        });
        return false;
    });
}

// 修改用户名或邮箱 status
function verifiedHint(result){
    if (result.code == 200) {
        (result.data.verified == 0 || result.data.verified == 1) && $('.email_verified').text(result.data.verified==0?'未激活':'更改').attr('verified',result.data.verified);
        result.data.verified == 2 && hint('修改地址已发送到 '+result.data.email+' 邮箱，请查收并修改',6000);
        $('.email_verified').attr('verified',result.data.verified);
    }
}
$(document).on('click', '.resend', function () {
    var _hint = $(this).closest('.hint');
    ajaxs({
        url: "resend",
        type: "GET",
        success: function (result) {
            hint(result.msg);
            _hint.remove();
            verifiedHint(result);
        }
    });
});
$(document).on('click', '.email_verified', function () {
    var _v = $(this).attr('verified');
    (_v == 0 || _v == 2) && hint('查收邮箱 或 <span class="resend">重新发送</span> ？',3000);
    _v == 1 && send();
    return false;
});

function send(){
    ajaxs({
        url: "send",
        type: "GET",
        success: function (result) {
            verifiedHint(result);
        }
    });
}
function edit() {
    var _n = 'edit' + dateHMS();
    var _email = '';
    getData('', "info", function (d) {
        dialog({
            bi: 'bi-edit',
            formId: _n,
            container: catalogIconImg(d.icon)
            + catalogInput('name', '名称', d.name)
            + '<p class="input-p">' + d.email + '<span class="email_verified" verified="'+d.verified+'">'+(d.verified==0?'未激活':'更改')+'</span></p>'
            ,
        });
    });
    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        ajaxs({
            url: "name",
            data: $(this).serialize(),
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    csIcon('',result.data.name);
                }
            }
        });
        return false;
    });
}
// 修改用户名或邮箱 end

function itemDel(_this, i = '', n = '') {
    if (!itemState(1)) return false;
    var _n = 'item_del' + dateHMS();
    var _hint = '<center>是否确认' + $(_this).text() + '项目： ' + n + ' ？</center>';
    if (i == storage('iid')){
        hint('当前项目不可删除，请切换项目');
        return false;
    }
    dialog({
        formId: _n,
        container: _hint + catalogInput('id', '删除ID', i, 1),
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        if (i) {
            ajaxs({
                url: "item/" + i,
                type: "DELETE",
                success: function (result) {
                    hint(result.msg);
                    if (result.code == 200) {
                        _this.closest('.dialog').remove();
                        cGetItem();
                    }
                }
            });
        } else {
            hint('操作失败');
        }
        return false;
    });
}

function delDoc(e) {
    if (!e.i) return false;
    var _n = 'doc_del' + dateHMS();
    var _hint = '<center>是否确认删除 ';
    if (e.n) _hint += e.n;
    _hint += e.f == 1 ? '目录' : '文档';
    _hint += ' 操作？</center>';
    dialog({
        formId: _n,
        container: _hint + catalogInput('id', '删除ID', e.i, 1),
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        if (e.i) {
            ajaxs({
                url: "doc/" + e.i,
                type: "DELETE",
                success: function (result) {
                    hint(result.msg);
                    if (result.code == 200) {
                        _this.closest('.dialog').remove();
                        sidebarMenuDocDel({
                            id: e.i,
                            del: e.del
                        });
                        var doc_i = $('.tab-nav').find('.doc-' + e.i);
                        var i_index = doc_i.index();
                        $('.iframes iframe').eq(i_index).remove();
                        doc_i.remove();
                        if (doc_i.hasClass('active')) {
                            $('.tab-nav ul li:last').addClass('active');
                            $('.iframes iframe:last').show();
                        }
                    }
                }
            });
        } else {
            hint('操作失败');
        }
        return false;
    });
}

function catalogsSort(_this) {
    if (!itemState(1)) return false;
    var _this = $(_this);
    var _n = 'sort' + dateHMS();
    var _nd = dateHMS();
    var _s = false;
    var _im = false;
    var iid = storage('iid');
    $.ajax({url: "/assets/js/jquery-ui.min.js"}).done(function () {
        getData('catalog'+ iid, "catalog/" + iid, function (d) {
            if (!d || !d.length){
                hint('暂无文档，请<span onclick="link(this,\'table.html\',1)">表格文档</span> 或 <span onclick="catalogsEdit(this)">新建目录</span>后操作');
                return false;
            }
            dialog({
                bi: getIBi(_this.find('i').prop('class')),
                formId: _n,
                container: catalogInput('iid', 'iid', iid, 1) +
                catalogSortBox(menuSort(d)),
            });
            $(".combobox-dl dl").sortable({
                change: function (event, ui) {
                    _im = true;
                    sort_ul_status(event);
                },
                stop: function (event, ui) {
                    _im = true;
                    sort_ul_status(event);
                },
                update: function (event, ui) {
                    _im = true;
                    sort_ul_status(event);
                },
                items: "dd",
                revert: true,
                dropOnEmpty: true,
                cursor: "move",
                connectWith: ".combobox-dl dd.folder dl",
                animation: 150,
            }).disableSelection();

            hint('请拖动排序<br>1、拖动的同时滚动鼠标并移动可扩大范围排序', 5000, 300);
            if ($(".dialog .combobox-dl").find('.file').length > 0) {
                hint('文件文档的子文档、子目录不展示和移动', 5000, 300);
                $(".dialog .combobox-dl").find('.file').find('dl').remove();
            }
            if ($(".dialog .combobox-dl").find('.doc').length > 0) {
                $(".dialog .combobox-dl").find('.doc').find('dl').remove();
            }
        });

    }).fail(function () {
        hint('排序功能暂时无法使用，请使用编辑文档进行排序。')
    });

    $(document).on('submit', 'form#' + _n, function () {
        if (_s) return false;
        var _this = $(this);
        if (!_im) {
            hint('请拖动排序');
            return false;
        }
        var _l = get_tips_sort_l(_this.closest('.dialog').find(".dialog-ul-box .combobox-dl dl"));
        if (_l <= 0) {
            hint('数据获取失败!');
            return false;
        }
        ajaxs({
            url: "catalog/sort",
            data: {
                'sort': JSON.stringify(_l),
                'iid': iid,
            },
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    sidebar_menu(result.data);
                    _s = true;
                    storageRemoveItem('catalog'+ storage('iid'));
                }
            }
        });
        return false;
    });
}

function get_tips_sort_l(_t, _p = 0) {
    var _l = [];
    _t.children('dd').each(function (k, v) {
        var _i = $(this).attr('i');
        var _m = $(this).attr('m');
            _l.push({
                '0': _i,
                '1': k,
                '2': _p
            });
        if ($(this).children('dl').find('dd').length > 0) {
            var __l = get_tips_sort_l($(this).children('dl'), _i);
            $.each(__l, function (k, v) {
                _l.push({
                    '0': v[0],
                    '1': v[1],
                    '2': v[2]
                });
            });
        }
    });
    return _l;
}

//显示li ul
function init_test(s) {
    s.item.parents('.ui-sortable').css('padding-left', '0px');
    s.item.children('dl').css('display', 'block');
    s.item.children('dl').css('background', '#f2f2f2');
    s.item.children('dl').css('padding-left', '15px');
    s.item.children('dl').css('min-height', '30px');
}

function sort_ul_status(e) {
    var t = e.target;
    $('.ui-sortable-helper').attr('m', 1);
    window.setTimeout(function () {
        $(t).find('dl').each(function () {
            var _this = $(this);
            _this.css('background', '#fff0');
            _this.css('padding-left', '0px');
            if (_this.children('dd').length == 0) {
                _this.hide();
            }
        });
    }, 1000);
}

function catalogsEdits(_this) {
    if (!itemState(1)) return false;
    $('.hint').remove();

    var dd = _this.closest('dd');
    var _t = parseInt(dd.attr('t'));
    var _f = parseInt(dd.attr('f'));
    var _i = dd.attr('i');
    var _p = dd.attr('p');
    var a = dd.children('a');

    var _this = $(_this);
    var _n = 'catalog' + dateHMS();
    var _s = false;
    var _iid = storage('iid');
    getData('catalog'+ _iid, "catalog/" + _iid, function (d) {
        dialog({
            bi: getIBi(a.find('i').prop('class')),
            formId: _n,
            container: catalogInput('name', '目录名称',a.text()) +
            catalogInput('iid', '项目ID', _iid, 1) +
            catalogInput('id', 'ID', _i, 1) +
            catalogInput('form', '类型', _f, 1) +
            catalogCombobox({
                type: 1,
                title: '所属目录',
                name: 'pid',
                value: _p,
                menu: menuForm(d),
            }),
        });

    });

    $(document).on('submit', 'form#' + _n, function () {
        if (_s) return false;
        var _this = $(this);
        ajaxs({
            url: "catalog",
            data: $(this).serialize(),
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    sidebar_menu(result.data);
                    _s = true;
                    storageRemoveItem('catalog'+ _iid);
                }
            },
            error: function () {

            }
        });
        return false;
    });
}
function catalogsEdit(_this) {
    if (!itemState(1)) return false;
    $('.hint').remove();
    var _this = $(_this);
    var _n = 'catalog' + dateHMS();
    var _s = false;
    var _iid = storage('iid');
    getData('catalog'+ _iid, "catalog/" + _iid, function (d) {
        dialog({
            bi: getIBi(_this.find('i').prop('class')),
            formId: _n,
            container: catalogInput('name', '目录名称') +
            catalogInput('iid', '项目ID', _iid, 1) +
            catalogInput('form', '类型', 1, 1) +
            catalogCombobox({
                type: 1,
                title: '所属目录',
                name: 'pid',
                value: 0,
                menu: menuForm(d),
            }),
        });
    });

    $(document).on('submit', 'form#' + _n, function () {
        if (_s) return false;
        var _this = $(this);
        ajaxs({
            url: "catalog",
            data: $(this).serialize(),
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    sidebar_menu(result.data);
                    _s = true;
                    storageRemoveItem('catalog'+ _iid);
                }
            },
            error: function () {

            }
        });
        return false;
    });
}

function gStorage(k) {
    var _d = JSON.parse(storage(k));
    return _d > 0 ? _d:'';
}

function getData(n, u, f, t = 'GET') {
    var _data = n.length <= 0 ? '' : gStorage(n);
    if (_data) {
        f(_data)
    } else {
        ajaxs({
            type: t,
            url: u,
            success: function (result) {
                if (result.code == 200) {
                    storage(n, JSON.stringify(result.data));
                    f(result.data)
                }
            }
        });
    }
}

function catalogUploadFile() {
    return '<div class="input-box upload-file">' +
        '   <input name="file" type="file" class="file-input" style="opacity: 0;display: contents;" accept="">\n' +
        '   <input type="text" class="file-text" placeholder="上传文件" readonly="readonly">\n' +
        '   <i class="bi bi-upload"></i>\n' +
        '</div>';
}

$(document).on('click', '.upload-file .file-text,.upload-file .bi-upload', function () {
    $(this).siblings('.file-input').click();
});

$(document).on('click', '.upload-file .file-input', function () {
    var file = $('.file-input').val();
    $('.file-text').val(file);
});
$(document).on('change', '.upload-file .file-input', function () {
    var file = $('.file-input').val();
    $('.file-text').val(file);
});

function catalogCalculate(t = '排序', n = 'sort') {
    return '<div class="input-box counter">\n' +
        '   <div class="title">' + t + '：</div>\n' +
        '   <i class="bi bi-dash"></i>\n' +
        '   <input class="numeric ' + n + '" type="text" name="' + n + '" value="0">\n' +
        '   <i class="bi bi-plus"></i>\n' +
        '</div>';
}

function catalogRadioPermissions(t = 1) {
    return '<div class="input-radio ' + setCatalogInputState(t) + '">\n' +
        '权限：<label><input type="radio" name="permission" value="1" checked=""><n>默认</n><i class="bi bi-question" title="新增/编辑/删除"></i></label>\n' +
        '<label><input type="radio" name="permission" value="2"><n>只读</n></label>\n' +
        '</div>';
}

function setCatalogInputState(t) {
    switch (t) {
        case 1:
            return 'hidden';
            break;
    }
    return '';
}

function catalogSortBox(d) {
    return '<div class="dialog-ul-box"><div class="combobox-dl">' + d + '</div></div>';
}

function catalogIcon(n, p, v = '', t) {
    var i = ['assets/face/0.jpg','assets/face/1.jpg','assets/face/2.jpg','assets/face/3.jpg','assets/face/4.jpg','assets/face/5.jpg','assets/face/6.jpg'];
    var h = '<div class="face">';
    var ui = $('.user-edit > img').attr('src');
    $.each(i,function (k,v) {
        h += '<label class="'+(ui==v?'active':'')+'"><input type="radio" value="'+v+'" name="'+n+'"><img src="'+v+'"></label>';
    });
    h += '</div>';
    return h;
}
function catalogIconImg(_icon='assets/face/00.jpg') {
    return '<div class="input-icon" onclick="icon()"><img class="icon" src="'+_icon+'"><span>修改</span></div>';
}
function catalogInput(n, p, v = '', t) {
    return '<div class="input-box ' + setCatalogInputState(t) + '"><input class="input" type="text" name="' + n + '" value="' + v + '" placeholder="' + p + '"></div>';
}

function catalogSearch(n, p, v = '', t) {
    return '<div class="input-box ' + setCatalogInputState(t) + '"><input class="input" type="text" name="' + n + '" value="' + v + '" placeholder="' + p + '"><i class="bi bi-search"></i></div>';
}

function catalogComboboxMultiple(e) {
    e.but = e.but || '';
    return '<div class="combobox multiple ' + e.class + '">\n' +
        '    <div class="input-box">\n' +
        '        <div class="title">' + e.title + '：</div>\n' +
        '        <div class="value">暂无选择</div>\n' +
        '        <i class="bi bi-down"></i>\n' +
        '        <input class="combobox-input" name="' + e.name + '" type="hidden" value="' + e.value + '">\n' +
        '    </div>\n' +
        '    <div class="combobox-box">\n' +
        '        <div class="search-box">\n' +
        '            <input type="text" class="search" value="" placeholder="搜索 / Search"/>\n' +
        '            <i class="bi bi-search"></i>\n' + e.but +
        '        </div>\n' +
        '        <div class="combobox-menu">\n' +
        '            <div class="combobox-dl">\n' +
        '            ' + e.menu +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
}

function dialogSelectInit(obj) {
    obj.find('.combobox').each(function (k,v) {
        var _this = $(this);
        var _t = _this.attr('t');
        var _val = _this.find('.combobox-input').val();
        _this.find('a').removeClass('active');
        _val && _this.find('dd').each(function (k,v) {
            var _dd = $(this),_dl = _dd.children('dl'),_a = _dd.children('a');
            if (_dd.attr('i') == _val ){
                _a.addClass('active');
                _this.children('.input-box').children('.value').text(_a.text());
                if (!_t){
                    _a.addClass('active').children('.bi-right').addClass('bi-down');
                    _dd.children('dl').show();
                    _dd.parents('dd').children('dl').show();
                    _dd.parents('dd').children('a').children('.bi-right').addClass('bi-down');
                }
            }
            _t && _dl.find('dd').length > 0 && _dl.slideToggle(200) && _a.children('i.bi-right').toggleClass('bi-down');
        });
    });
}
function catalogCombobox(e) {
    e.but = e.but || '';
    return '<div class="combobox" t="'+ e.type + '">\n' +
        '    <div class="input-box">\n' +
        '        <div class="title">' + e.title + '：</div>\n' +
        '        <div class="value">暂无选择</div>\n' +
        '        <i class="bi bi-down"></i>\n' +
        '        <input class="combobox-input" name="' + e.name + '" type="hidden" value="' + e.value + '">\n' +
        '    </div>\n' +
        '    <div class="combobox-box">\n' +
        '        <div class="search-box">\n' +
        '            <input type="text" class="search" value="" placeholder="搜索 / Search"/>\n' +
        '            <i class="bi bi-search"></i>\n' + e.but +
        '        </div>\n' +
        '        <div class="combobox-menu">\n' +
        '            <div class="combobox-dl">\n' +
        '            <dl><dd i="0" f="1"><a href=":;"><bg></bg>暂不选择</a></dd></dl>' + e.menu +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
}

function dialog(e) {
    var h = '<div class="dialog ' + e.formId + '">\n' +
        '<div class="mask"></div>\n' +
        '<div class="header"><i class="bi ' + e.bi + '"></i><i class="bi bi-x right"></i></div>\n' +
        '<form id="' + e.formId + '" method="POST" enctype="multipart/form-data">\n' +
        '<div class="container">\n' + e.container +
        '</div>\n' +
        '<div class="buttons">\n';
    if (e.dtip) {
        h += '<button class="dtip" dtip="' + e.dtip + '" type="text">不在提示</button>\n';
    }
    h += '<button type="submit">确认</button>\n' +
        '<button class="back" type="text">取消</button>\n' +
        '</div>\n' +
        '</form>\n' +
        '</div>';
    $('body').append(h);
    dialogSelectInit($('.'+e.formId));
}

function dialogtest() {
    var _html = '';
    _html = '<div class="dialog">\n' +
        '<div class="mask"></div>\n' +
        '<div class="header"><i class="bi bi-star"></i><i class="bi bi-x right"></i></div>\n' +
        '<form id="xxxx" method="POST">\n' +
        '<div class="container">\n' +
        '<div class="input-radio">\n' +
        '<label>\n' +
        '<input type="radio" name="permissions" value="0" checked=""><n>默认</n><i class="bi bi-question" title="新增/编辑/删除"></i>\n' +
        '</label>\n' +
        '<label>\n' +
        '<input type="radio" name="permissions" value="1"><n>只读</n>\n' +
        '</label>\n' +
        '</div>\n' +
        '<div class="input-box">\n' +
        '<input class="input" type="text" name="search" value="1">\n' +
        '<i class="bi bi-search"></i>\n' +
        '</div>\n' +
        '<div class="input-box">\n' +
        '<div class="title">名称：</div>\n' +
        '<input class="input" type="text" name="name" value="1">\n' +
        '</div>\n' +
        '<div class="input-box">\n' +
        '<div class="title">项目切换：</div>\n' +
        '<div class="value">\n' +
        '项目切换777\n' +
        '</div>\n' +
        '<i class="bi bi-down"></i>\n' +
        '</div>\n' +
        '<div class="input-box">\n' +
        '<div class="title">排序：</div>\n' +
        '<i class="bi bi-dash"></i>\n' +
        '<input class="sort" type="text" name="sort" value="1">\n' +
        '<i class="bi bi-plus"></i>\n' +
        '</div>\n' +
        '<div class="input-box">\n' +
        '<div class="title">项目切换：</div>\n' +
        '<div class="value">\n' +
        '项目切换777\n' +
        '</div>\n' +
        '<i class="bi bi-down"></i>\n' +
        '</div>\n' +
        '<div class="combobox">\n' +
        '<div class="input-box">\n' +
        '<div class="title">项目切换：</div>\n' +
        '<div class="value">\n' +
        '项目切换777\n' +
        '</div>\n' +
        '<i class="bi bi-down"></i>\n' +
        '</div>\n' +
        '<div class="combobox-box">\n' +
        '<div class="search-box">\n' +
        '<input type="text" class="search" value="" placeholder="搜索 / Search"/>\n' +
        '</div>\n' +
        '<div class="combobox-menu">\n' +
        '<div class="combobox-dl">\n' +
        '<dl>\n' +
        '<dd><a href="baidu.com"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '</dl>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '<div class="input-radio">\n' +
        '<label>\n' +
        '<input type="radio" name="permissions" value="0" checked=""><n>默认</n><i class="bi bi-question" title="新增/编辑/删除"></i>\n' +
        '</label>\n' +
        '<label>\n' +
        '<input type="radio" name="permissions" value="1"><n>只读</n>\n' +
        '</label>\n' +
        '</div>\n' +
        '<div class="combobox multiple">\n' +
        '<div class="input-box">\n' +
        '<div class="title">好友：</div>\n' +
        '<div class="value">\n' +
        '<n class="gradient"><t>胜多负少的方式胜多负少的方式胜多负少的方式胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多</t><i class="bi bi-x"></i></n><n><t>少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n><n><t>胜多负少的方式</t><i class="bi bi-x"></i></n>\n' +
        '</div>\n' +
        '<i class="bi bi-down"></i>\n' +
        '</div>\n' +
        '<div class="combobox-box">\n' +
        '<div class="search-box">\n' +
        '<input type="text" class="search" value="" placeholder="搜索 / Search"/>\n' +
        '</div>\n' +
        '<div class="combobox-menu">\n' +
        '<div class="combobox-dl">\n' +
        '<dl>\n' +
        '<dd><a m="1"><bg></bg>网址</a></dd>\n' +
        '<dd><a t="2"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="3" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a t="4" href="#"><bg></bg>www.divcss5.com</a></dd>\n' +
        '<dd><a m="5" href="#"><bg></bg>1111网址为www.divcss5.com</a>\n' +
        '<dl>\n' +
        '<dd><a m="1"><bg></bg>网址</a></dd>\n' +
        '<dd><a m="2"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="3" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="4" href="#"><bg></bg>www.divcss5.com</a>\n' +
        '<dl>\n' +
        '<dd><a m="1"><bg></bg>网址</a></dd>\n' +
        '<dd><a m="2"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="3" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="4" href="#"><bg></bg>www.divcss5.com</a></dd>\n' +
        '</dl>\n' +
        '</dd>\n' +
        '</dl>\n' +
        '</dd>\n' +
        '<dd><a t="6" href="#"><bg></bg>tttt1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a t="7" href="#"><bg></bg>ttttt1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="8" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="9" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="10" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="11" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="12" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="13" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="14" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="15" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="16" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="17" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="18" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="19" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="20" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="21" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="22" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="23" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '<dd><a m="24" href="#"><bg></bg>1111网址为www.divcss5.com</a></dd>\n' +
        '</dl>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '<div class="buttons">\n' +
        '<button type="text">取消</button>\n' +
        '<button type="submit">提交</button>\n' +
        '</div>\n' +
        '</form>\n' +
        '</div>';
    return _html;
}


function get_href(_h) {
    if (isNotNull(_h)) {
        _h = _h.replace(/#/g, '');
    }

    if (!isNotNull(_h)) {
        _h = window.location.href;
    }
    _h = _h.replace(/#/g, '');
    return _h;
}

//增加修改url参数
function changeURLArg(url, arg, arg_val) {
    if (!isNotNull(url)) url = get_href();
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        if (arg_val.length > 0) {
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);

            return tmp;
        }
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
    return url + '\n' + arg + '\n' + arg_val;
}

function quit() {
    storage('token', '');
    window.location.reload();
}
function firstLetterToUpper(str) {
    return str.replace(str[0],str[0].toUpperCase());
}