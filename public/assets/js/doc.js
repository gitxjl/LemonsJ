var _has = storage('pattern') == 'true';
var _t = _has ? '编辑模式' : '浏览模式';
var _t2 = _has ? '浏览模式' : '编辑模式';
var but_pattern = $('.floating-menu .but-pattern');

if (_has) {
    but_pattern.attr('title', '切换至' + _t2);
    _has ? but_pattern.find('i').removeClass('bi-edit') : but_pattern.find('i').addClass('bi-edit');
    but_pattern.find('span').text(_t2);
} else {
    but_pattern.attr('title', '切换至' + _t2);
    _has ? but_pattern.find('i').removeClass('bi-edit') : but_pattern.find('i').addClass('bi-edit');
    but_pattern.find('span').text(_t2);
}

function pattern(p = true) {
    var pattern = $('.floating-menu .but-pattern');
    var _has = pattern.find('i').hasClass('bi-edit');
    var _t = _has ? '编辑模式' : '浏览模式';
    var _t2 = _has ? '浏览模式' : '编辑模式';
    hint(_t);
    pattern.attr('title', '切换至' + _t2);
    _has ? pattern.find('i').removeClass('bi-edit') : pattern.find('i').addClass('bi-edit');
    pattern.find('span').text(_t2);

    $('.doc-view').each(function (k, v) {
        var _t = $(this).attr('t');
        var _i = $(this).attr('i');
        var url = '';
        if (p) {
            switch (parseInt(_t)) {
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
            url += '.html?id=' + _i
        } else {
            url = 'doc/common-view.html?id=' + _i;
            if (_t == 2) url = 'doc/markdown-view.html?id=' + _i;
        }
        $('.iframes iframe').eq($(this).index()).attr('src', url);
    });
    storage('pattern', p)
}


// back_keys/forward_keys stast
$(document).on('click', '.back_keys', function (e) {
    pager(-1);
});
$(document).on('click', '.forward_keys', function (e) {
    pager();
});

$(document).keyup(function (e) {
    var key = e.which || e.keyCode;
    key == 188 && pager(-1);
    key == 190 && pager();
});

function pager(p = 1) {
    var _active = $('.sidebar-menu dd.doc > a.active');
    var _i = _active.length ? _active.closest('dd').attr('i') : $('.sidebar-menu dd.doc:first').attr('i');
    var p = _active.length ? p : 0;
    var _a = $('.sidebar-menu dd.doc > a');
    _a.each(function (k, v) {
        if (_i == $(this).closest('dd').attr('i')) {
            var _k = k + p;
            _a.eq(_k).length && _a.eq(_k).click() &&
            _a.eq(_k).parents('.folder').children('dl').show() &&
            _a.eq(_k).parents('.folder').children('a').find('.bi-right').addClass('bi-down');
            !_a.eq(_k).length && _a.eq(0).click();
            tabNavToRight();
        }
    });
}
// back_keys/forward_keys end

$(document).on('click', '.face label', function (e) {
    $(this).addClass('active').siblings().removeClass('active');
    sIcon($(this).children('img').attr('src'));
});
$(document).on('click', '.floating-menu .but-pattern', function () {
    var _this = $(this);
    var _has = _this.find('i').hasClass('bi-edit');
    if (!_has && $('.doc-view').length > 0) {
        if (storage('dtip-1')) {
            pattern(_has);
            return false;
        }

        var _n = 'but_pattern' + dateHMS();
        dialog({
            formId: _n,
            container: '<center>当前有编辑状态文档，是否切换至' + _t + '？</center>',
            dtip: 1,
        });
        $(document).on('submit', 'form#' + _n, function () {
            pattern(_has);
            $(this).closest('.dialog').remove();
            return false;
        });
    } else {
        pattern(_has);
    }
});

$(document).on('click', '.floating-menu .fun', function () {
    var menu = $(this).closest('.floating-menu');
    if (!$(this).attr('c') || !menu.attr('i') || !menu.attr('t')) {
        hint('获取文档信息失败');
        return false;
    }
    special({
        c: $(this).attr('c'),
        i: menu.attr('i'),
        t: menu.attr('t'),
        n: menu.attr('n'),
        f: menu.attr('f'),
        ic: menu.attr('ic'),
    });
});

function special(e) {
    var u = '';
    switch (parseInt(e.c)) {
        case 1:
            var url = '';
            if (e.t > 3) {
                url = 'file.html?id=' + e.i + '&type=' + e.t + '&copy=1';
            } else {
                switch (parseInt(e.t)) {
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
                url += '.html?id=' + e.i + '&copy=1'
            }
            iframes({
                url: url,
                text: 'C:' + e.n,
                iclass: 'bi-clone',
                class: 'doc-clone-' + e.i,
            });
            break;
        case 2:
            if (e.t < 4 && e.ic == 1) {
                hint('删除失败，请将该目录下文档移至其他目录或逐一删除');
                return false;
            }
            delDoc(e);
            break;
        case 3:
            u = changeURLArg('', 'id', e.i);
            hint(copyText(u) ? "已复制" : "复制失败！");
            break;
        case 4:
            window.open(changeURLArg('', 'id', e.i));
            break;
        default:
            return false;
    }
}


// tab-menu stast
$(document).on('click', '.tab-menu .refresh', function (e) {
    var index = $('.tab-menu').attr('index');
    var iframe = $('.iframes iframe').eq(index);
    iframe.length > 0 && iframe.attr('src', iframe.attr('src'));
});
$(document).on('click', '.tab-menu .close-right', function (e) {
    var index = $('.tab-menu').attr('index');
    $('.tab-nav li').each(function (k, v) {
        if (k > index) {
            $('.iframes iframe').eq(k).length > 0 && $('.iframes iframe').eq(k).addClass('doc-close-right').hide();
            $(this).addClass('doc-close-right').hide();
            sTabCloseList($(this), k);
        }
        k == index && $(this).click();
    });
    $('.doc-close-right').remove();
});
$(document).on('click', '.tab-menu .close-left', function (e) {
    var index = $('.tab-menu').attr('index');
    $('.tab-nav li').each(function (k, v) {
        if (k < index) {
            $('.iframes iframe').eq(k).length > 0 && $('.iframes iframe').eq(k).addClass('doc-close-left').hide();
            $(this).addClass('doc-close-left').hide();
            sTabCloseList($(this), k);
        }
        k == index && $(this).click();
    });
    $('.doc-close-left').remove();
});
$(document).on('click', '.tab-menu .close-else', function (e) {
    var index = $('.tab-menu').attr('index');
    $('.tab-nav li').each(function (k, v) {
        if (k != index) {
            $('.iframes iframe').eq(k).length > 0 && $('.iframes iframe').eq(k).addClass('doc-close-else').hide();
            $(this).addClass('doc-close-else').hide();
            sTabCloseList($(this), k);
        }
        k == index && $(this).click();
    });
    $('.doc-close-else').remove();
});


var STCL = tabList('stcl');//sTabCloseList
var STCL_LEN = -4;
var STOL = tabList();//sTabOpenList JSON.parse(storage(n + storage('iid'))) || [];
var STOL_LEN = -4;
$(document).on('click', '.tab-menu .resume-last', function (e) {
    !STCL.length && hint('暂无记录');
    STCL.length && iframes(STCL.pop());
});

function sTabCloseList(_this, _index) {
    var url = $('.iframes iframe').eq(_index).length > 0 ? $('.iframes iframe').eq(_index).attr('src') : '';
    var t = _this.attr('t');
    var i = _this.attr('i');
    if (t > 3) {
        $.ajax({url: "/assets/js/jquery.md5.js"}).done(function () {
            var md5i = $.md5(i);
            STCL.push({
                url: url,
                text: _this.text(),
                iclass: getIBi(_this.find('i').prop('class')),
                class: 'doc-' + md5i,
                nclass: 'doc-view',
                attrs: {'t': t, 'i': md5i},
            });
        }).fail(function () {
        });
    } else {
        STCL.push({
            url: url,
            text: _this.text(),
            iclass: getIBi(_this.find('i').prop('class')),
            class: 'doc-' + i,
            nclass: 'doc-view',
            attrs: {'t': t, 'i': i},
        });
    }

    storage('STCL' + storage('iid'), JSON.stringify(STCL.slice(STCL_LEN)));
}

// tab-menu end
$(document).on('click', '.tab-nav ul li .bi-x', function () {
    var _index = $(this).closest('li').index();
    var _i = $(this).closest('li').attr('i');
    if (_index <= 0 && $(this).closest('ul').find('li').length <= 1) return false;
    var _a = $(this).closest('li').hasClass('active');
    sTabCloseList($(this).closest('li'), _index);
    $(this).closest('li').remove();
    $('.iframes iframe').eq(_index).remove();
    setScroll();
    iframeShowIs(_a, _index);
    dTabOpenList(_i);


});

function dTabOpenList(_i) {
    _i && STOL.length && $.each(STOL, function (k, v) {
        var __i = 0;
        try {
            __i = v.attrs.i;
        } catch (e) {

        }
        if (__i == _i) {
            STOL[k] = STOL[k + 1];
        }
    }) && storage('STOL' + storage('iid'), JSON.stringify(STOL.slice(STOL_LEN)));
}

function iframeShowIs(a, i) {
    if (a && $('.iframes iframe').eq(i).length > 0) {
        iframeShow(i)
    } else if (a && $('.iframes iframe').eq(i - 1).length > 0) {
        iframeShow(i - 1);
    }
}

function iframeShow(i) {
    $('.tab-nav ul li').eq(i).addClass('active');
    $('.tab-nav ul li').eq(i).show();
    $('.iframes iframe').eq(i).show();
}

$('.tab-box').mouseover(function () {
    (storage('tab') == 0 || storage('tab') == 1) && $(this).find('.tab').slideDown(200) && setScroll() && setTabPosition(true);
}).mouseleave(function () {
    if ((storage('tab') == 1 || storage('tab') == null) && $('.tab .tab-nav ul li').length <= 0) {
        $(this).find('.tab').slideUp(200) && setTabPosition(false);
    }
    storage('tab') == 0 && $(this).find('.tab').slideUp(200) && setTabPosition(false);
});

function setTabPosition(t) {
    if (t) {
        // $('.tab-box').css('position', 'initial');
    } else {
        // $('.tab-box').css('position','absolute');
    }
}

tabCloseInit();

function tabCloseInit() {
    if (storage('tab') == null) storage('tab', 0);
    if (storage('tab') == 1) {
        $('.tab-fn .close').removeClass('bi-box-arrow-in-down');
        if ($('.tab .tab-nav ul li').length > 0) {
            $('.tab').show();
        } else {
        }
    } else {
        $('.tab').hide();
    }
}

$('.tab-fn .close').click(function () {
    tabClose();
});

function tabClose() {
    var _close = $('.tab-fn .close');
    if (_close.hasClass('bi-box-arrow-in-down')) {
        $('.sidebar-mode').css('background-color', '#fff');
        _close.removeClass('bi-box-arrow-in-down');
        $('#container .tab').slideDown(200) && setTabPosition(true);
        storage('tab', 2);
        setTimeout(function () {
            storage('tab', 1);
        }, 300);
    } else {
        if (storage('tab') == 1) {
            $('#container .tab').slideUp(200) && setTabPosition(false);
            storage('tab', 2);
            $('.sidebar-mode').css('background-color', '#f4f4f4');
            setTimeout(function () {
                _close.addClass('bi-box-arrow-in-down');
                storage('tab', 0);
            }, 300);
        }
    }
}

function setAttr(d = []) {
    if (d.length <= 0) return '';
    var h = '';
    $.each(d, function (k, v) {
        h += k + '="' + v + '"';
    });
    return h;
}

function setI(c = '') {
    if (!c || !isNotNull(c)) return '';
    return '<i class="bi ' + c + '"></i>';
}

function docViewRemove() {
    $('.doc-view').remove();
    $('.iframe-doc-view').remove();
}

function iframes(e) {
    if (!e) return false;
    e.class = e.class || '';
    e.refresh = e.refresh || false;
    if (!e.url) return false;
    if (isNotNull(e.class) && $('.tab-nav ul li').hasClass(e.class)) {
        var _iframe = $('.iframes iframe').eq($('.tab-nav ul li.' + e.class).index());
        var _li = $('.tab-nav ul li.' + e.class);
        _li.addClass('active').siblings().removeClass('active');
        _iframe.show().siblings().hide();
        e.refresh && _iframe.attr('src', '').attr('src', e.url) && _li.html(setI(e.iclass) + '<n>' + e.text + '</n>');
        return false;
    }

    if ($('.tab-nav ul li.welcome').length >= 1) {
        $('.iframes iframe').eq($('.tab-nav ul li.welcome').index()).remove();
        $('.tab-nav ul li.welcome').remove();
    }

    $('.iframes').append('<iframe name="iframes" class="iframe-' + e.class + '" src="' + e.url + '" frameborder="0"></iframe>');
    $('.tab-nav ul li').removeClass('active');
    $('.tab-nav ul').append('<li class="active ' + e.nclass + ' ' + e.class + '" ' + setAttr(e.attrs) + '>' + setI(e.iclass) + '<n>' + e.text + '</n><i class="bi bi-x"></i></li>');

    setScroll();

    $('.iframes iframe').hide();
    $('.iframes iframe:last').show();
    tabNavToRight();

    var _i = 0;
    try {
        _i = e.attrs.i;
    } catch (e) {}
    if (_i > 0 && e.class != 'welcome') {
        STOL.push(e);
        storage('STOL' + storage('iid'), JSON.stringify(STOL.slice(STOL_LEN)));
    }

}

function tabNavToRight() {
    var _offset_left = 0;
    $('.tab-nav ul').find("li").each(function (k, v) {
        if ($(this).hasClass('active')) return false;
        _offset_left += $(this).width();
    });
    $('.tab-nav ul li.active').offset().left < 0 && $('.tab-nav ul').scrollLeft($('.tab-nav ul li.active').offset().left);
    _offset_left - $('.tab-nav ul li.active').width() > $('.tab-nav ul').width() && $('.tab-nav ul').scrollLeft(_offset_left);
}

function iframeInit() {
    $('.tab-nav ul').html('');
    $('.iframes').html('');
    sidebarOn(false);
    cIframes({
        url: 'welcome.html',
        text: '欢迎使用',
        class: 'welcome',
    })
}

function questions(h) {
    $(h).prependTo('body').fadeIn(300);
}

function hints(s, t = 300, t2 = 2000) {
    var _hint = storage('hint');// 记录上一条消息
    storage('hint', s);
    if (_hint == s) return false;

    var _top = 0;
    if ($('.hint').length > 0) {
        $('.hint').each(function () {
            _top += parseInt($(this).innerHeight()) + 10;
        });
    }
    _top = _top + 120;

    var n = 'NO' + dateHMS();
    $('<div>', {
        class: 'hint ' + n,
        html: '<i class="icon-x"></i><p>' + s + '</p>'
    }).prependTo('body').fadeIn(t);
    $('.' + n).css('margin-top', _top + 'px');
    _top = 0;
    setTimeout(function () {
        $('.' + n).fadeOut(t).remove();
        storage('hint', '')
    }, t2 + t);
}

$(function () {
    var _token = storage('token');
    var _domain = "http://api.doc.com/api/";
    var _iid = 0;
    var _refresh = 0;
    if (!_token) {
        sidebarOn(true);
        hint('正在使用游客账户登录', 6000);
        login('guest', 'guest');
    } else {
        storage('islogin', 0);
        getItem();
        sIcon();
        STOL.length && $.each(STOL, function (k, v) {
            iframes(v)
        })
    }
});

function sIcon(i = '', t = '') {
    var icon = $('.icon', parent.document);
    var name = $('.name', parent.document);
    if (i == 1) return $('.icon').attr('src');
    var i = i || storage('icon') || 'assets/face/00.jpg';
    var t = t || storage('name') || '';
    i && icon.attr('src', i) && storage('icon',i);
    t && name.text(t) && storage('name',t);
}

function getItem(iid = '') {
    iid = iid || storage('iid');
    ajaxs({
        // async: false,
        type: "GET",
        url: "item?iid=" + iid,
        success: function (result) {
            if (result.code == 200) {
                iframeInit();
                setSidebar(result.data);
                STOL = tabList();
                STOL.length && $.each(STOL, function (k, v) {
                    iframes(v)
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == 500 && XMLHttpRequest.responseJSON.msg) {
                // $('.sidebar-menu .combobox-dl').first().html(sidebar_menu());
                // setTimeout(function () {
                //     sidebarOn(false);
                // }, 300);
            }
        }
    });
}

function setSidebar(d) {
    var _iid = d.iid || 0;
    storage('iid', _iid);
    var _html = '<dl>';
    var url = 'item/item.html?id=';

    $.each(d.data, function (k, v) {
        if (_iid == v.id) $('.item-cut>.input-box>.value').html(v.name);
        var active = _iid == 0 && k == 0 ? ' class="active"' : _iid == v.id ? ' class="active"' : '';
        var url = 'item/item.html?id=' + v.id,_menu = '';
        if (v.permission == 0) {
            _menu = '<i class="bi bi-edit item-edit-but" title="编辑该项目"><ul><li onclick="itemEdit(this,' + v.id + ')">修改</li><li onclick="link(this,\'item/member.html?id=' + v.id + '\',0,\'' + v.name + '\')">成员</li><li onclick="itemTransfer(this,' + v.id + ')">转让</li><li onclick="itemDel(this,' + v.id + ',\'' + v.name + '\')">删除</li></ul></i>';
        } else {
            _menu = '<i class="bi bi-edit item-edit-but" title="编辑该项目"><ul><li onclick="itemDel(this,' + v.id + ',\'' + v.name + '\')">退出</li></ul></i>';
        }
        _html += '<dd><a' + active + ' i="' + v.id + '" href="javascript:;"><bg></bg>' + v.name + '</a>' + _menu + '</dd>';
    });
    _html += '</dl>';
    $('.item-cut .combobox-dl').html(_html);
    sidebar_menu(d.catalog);
}

(function ($) {
    $.fn.extend({
        drags: function (t) {
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
        tabss: function (t) {
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
            t.tab.click(function () {
                if ($(this).hasClass(t.class)) return false;
                var _i = $(this).index();
                if ($(t.content).eq(_i).length == 0) {
                    hint('切换页面不存在');
                    return false;
                }
                $(t.content).eq(_i).show().siblings().hide();
                $(this).addClass(t.class).siblings().removeClass(t.class);
            });
            t.close.click(function () {
                $(this).closest('.tab').slideUp();
                storage('tab', 1);
            });
            t.sBut.click(function () {
                if (t.scrollX.width() >= t.scrollX[0].scrollWidth) return false;
                var _t = t.scrollX, l = _t.scrollLeft(), m = this.attributes.d.value == 0 ? l - t.mDist : l + t.mDist;
                scrollXAnimate(m, _t);
            });

            t.scrollX && t.scrollX.width() < t.scrollX[0].scrollWidth && (navigator.userAgent.indexOf('MSIE') >= 0 ? msie() : ms());

            function msie() {
                var _t = t.scrollX;
                _t.on("mousewheel", function (e) {
                    var d = e.originalEvent.wheelDelta, l = this.scrollLeft, m = d < 0 ? l + t.mDist : l - t.mDist;
                    scrollXAnimate(m, _t);
                });
            }

            function ms() {
                var _t = t.scrollX;
                se = "mousewheel DOMMouseScroll MozMousePixelScroll";
                _t.on(se, function (e) {
                    var d = e.originalEvent.detail, d = d ? d : e.originalEvent.wheelDelta, l = this.scrollLeft,
                        m = d > 0 ? l + t.mDist : l - t.mDist;
                    scrollXAnimate(m, _t);
                });
            }

            function scrollXAnimate(m, _t) {
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


})(jQuery);

var _fm = $(".floating-menu");
var _tab_m = $(".tab-menu");

var W = storage('W') || 300;
var split = $('#split');
var sidebar = $('#sidebar');
var sidebar_m = $('.sidebar-mode');
var split = $('#split');
var container = $('#container');

$(function () {

    split.drag();

    $('.tab').tabs();

    $("body").on("mouseenter", '.item-cut .combobox-dl dl dd,.sidebar-menu .combobox-dl dl dd', function () {
        $(this).find('i.item-edit-but,i.option').show();
    });
    $("body").on("mouseleave", '.item-cut .combobox-dl dl dd,.sidebar-menu .combobox-dl dl dd', function () {
        $(this).find('ul').first().hide();
        $(this).find('i.item-edit-but,i.option').hide();
        // $('#split').show();
    });
    $(document).on('click', '.item-cut .combobox-dl dl dd .item-edit-but,.sidebar-menu .combobox-dl dl dd i.option', function (e) {
        var _ul = $(this).find('ul');
        var dd = $(this).closest('dd');

        $('.sidebar-menu').find('a').removeClass('special').removeClass('active');
        dd.children('a').addClass('active');

        if (_ul.first().is(':hidden')) {
            var _mh = ($(this).offset().top + _ul.height() > $(this).closest('.combobox-menu').height() && $(this).closest('.combobox-dl').height() > $(this).closest('.combobox-menu').height() ? -118 : 20);
            if ($(this).closest('.item-cut').length > 0) {
                _ul.css('position', $(this).closest('.combobox-dl').height() <= $(this).closest('.combobox-menu').height() ? 'fixed' : 'absolute');
            } else if ($(this).closest('.sidebar-menu').length > 0 &&
                $(this).closest('.sidebar-menu').find('dl:not(".combobox-new")').find('dd').length > 10 &&
                $(this).closest('.combobox-dl').find('dd').last().index() - dd.index() < 3) {
                _mh = _mh - (_mh + parseInt(_ul.height())) - 5;
            }
            _ul.css('margin-top', _mh + 'px');
            _ul.show();
            $('#split').hide();

        } else {
            $('#split').show();
            _ul.first().hide();
        }
    });
    $(document).on('click', '.sidebar-menu .combobox-dl dl dd i.option ul li.edit', function (e) {
        menuView($(this));
    });
    $(document).on('click', '.sidebar-menu .combobox-dl dl dd i.option ul li.view', function (e) {
        menuView($(this), 1);

    });
    $(document).on('click', '.sidebar-menu .combobox-dl dl dd i.option ul li.del', function (e) {
        var dd = $(this).closest('dd');
        if (!dd.attr('i') || !dd.attr('t')) {
            hint('获取文档信息失败');
            return false;
        }
        special({
            del: dd,
            c: 2,
            i: dd.attr('i'),
            t: dd.attr('t'),
            n: dd.children('a').text(),
            f: dd.attr('f'),
            ic: dd.children('dl').find('dd').length > 0 ? 1 : 0,
        });
    });

    function menuView(_this, _v = 0) {
        var dd = _this.closest('dd');
        var _t = parseInt(dd.attr('t'));
        var _f = parseInt(dd.attr('f'));
        if (_f>0){
            catalogsEdits(_this)
            return false;
        }

        var _i = dd.attr('i');
        var a = dd.children('a');
        var url = '';
        if (_v == 0) {
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
                case (_t > 3):
                    url = 'file';
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
            refresh: true,
            text: a.text(),
            iclass: getIBi(a.children('i').prop('class')),
            class: 'doc-' + _i,
            nclass: 'doc-view',
            attrs: {'t': _t, 'i': _i},
        });
    }

    $(document).on('mouseenter', '.doc-con', function (e) {
        if (!$(this).find('ul').first().is(':hidden')) return false;
        var _top = $(this).offset().top;
        _top += 25;
        $(this).find('ul').first().css({
            left: $(this).offset().left + 'px',
            top: _top + 'px'
        }).show();

        $(this).siblings().find('ul').hide();
        $('#split').hide();
    });
    $(document).on('mouseleave', '.doc-con', function (e) {
        if ($(this).find('ul').hasClass('floating-menu')) return false;
        $(this).find('ul').hide();
        $('#split').show();
    });

    $(document).on('mouseleave', '.input-icon', function (e) {
        $(this).find('span').hide();
    });
    $(document).on('mouseover', '.input-icon', function (e) {
        $(this).find('span').css('display','block');
    });

    $('.tab-fn i.bi-down').click(function () {
        $('.tab-menu').find('.tab-special').hide();
        var d = $(this).attr('d');
        var dh = $(d).html();
        if (d && dh) $(this).find('ul').html($(d).html());
        if ($(this).find('ul').first().is(':hidden')) {
            if ($(this).hasClass('bi-down')) {
                $(this).find('ul').first().css('position', 'relative');
                $('.iframes').css('z-index', -1);
            }
            var _top = $(this).offset().top;
            var _left = $(this).offset().left;
            _top += 25;
            if ($(this).hasClass('bi-down')) {
                _left = -130;
                _top = 22;
            }
            $(this).find('ul').first().css({
                left: _left + 'px',
                top: _top + 'px',
                display: 'inline-table'
            });
            $(this).siblings().find('ul').hide();
            $('#split').hide();
        } else {
            $(this).find('ul').first().hide();
        }
    });
    $('.tab').hover(function () {
    }, function () {
        $('.tab-menu').find('.tab-special').show();
        $('.tab-menu').hide();
    });


    $('.tab-menu').mouseleave(function () {
        $(this).is(':visible') && $(this).hide();
    });

    $('.doc-con ul').mouseleave(function () {
        $(this).is(':visible') && $(this).hide();
        $('#split').show();
    });

    // 右键菜单 start
    //功能图标
    // $('.fun-menu').mouseenter(function () {
    $('.fun-menu').click(function () {
        $('.doc-con ul').hide();
        var _this = $(this);
        if (!_fm.data('f')) {
            fuMenu({'x': _this.offset().left, 'y': _this.offset().top + _this.height()});
            _fm.data('f', true);
        } else {
            _fm.data('f', false).hide();
        }
    }).mouseleave(function () {
        _fm.data('f', false);
    });

    //右键菜单
    // window.oncontextmenu = function (e) {
    //     e.preventDefault();//取消默认的浏览器自带右键
    //     fuMenu({'x': e.clientX, 'y': e.clientY});
    // };

    _fm.mouseleave(function () {
        $(this).hide();
        $(this).data('f', false);
        $(this).find('a').removeClass('special');
    });
    //右键菜单 end

    sidebar.width() == 0 && sidebar_m.toggleClass('bi-on');
    $(document).on('click', '.sidebar-mode', function () {
        sidebarFn();
    });


    _fm.find('li').hover(function () {
        $(this).find('ul').show();
    }, function () {
        $(this).find('ul').hide();
    });

});

function sidebarHide() {
    var w = sidebar.width(), m = w <= 0 ? W : 0, t = 500;
    W = w > 0 && w;

    ((!W && !m) || (m == 'false' && !W) || (W == 'false' && !m)) && (m = 300, W = false);
    sidebar_m.toggleClass('bi-on');
    sidebar.animate({width: m}, t);
    split.animate({left: m}, t);
    container.animate({left: m}, t);
}

function sidebarFn() {
    var w = sidebar.width(), m = w <= 0 ? W : 0, t = 500;
    W = w > 0 && w;
    storage('MX', m);
    storage('W', W);
    ((!W && !m) || (m == 'false' && !W) || (W == 'false' && !m)) && (m = 300, W = false);
    sidebar_m.toggleClass('bi-on');
    sidebar.animate({width: m}, t);
    split.animate({left: m}, t);
    container.animate({left: m}, t);

    storage('tab', 2);
    setTimeout(function () {
        storage('tab', 1);
    }, 600);
}

//右键菜单 start
//右键菜单定位
function fuMenu(e) {
    if (e.i) {
        e.x += parseInt($('#sidebar').width());
        e.y += parseInt($('.tab-box').height());
    }
    var wh = $(window).height();
    var xy = {left: (e.x - 3) + 'px', top: (e.y - 3) + 'px'};
    if ((e.y + _fm.height() / 2) > wh) {
        xy.top = e.y - _fm.height();
    }
    
    _fm.data('f', false).css(xy).show();
    $('#split').hide();
}

//tab右键菜单定位
function tabMenu(e) {
    if (e.i) {
        e.x += parseInt($('#sidebar').width());
        e.y += parseInt($('.tab-box').height());
    }
    var wh = $(window).height();
    var xy = {left: (e.x - 2) + 'px', top: (e.y - 2) + 'px', display: 'inline-table', position: 'fixed'};
    if ((e.y + _fm.height() / 2) > wh) {
        xy.top = e.y - _fm.height();
    }
    $('.iframes').css('z-index', -1);
    //special
    if ($(e.target).closest('li').length == 0) {
        $('.tab-menu').find('.tab-special').hide();
    } else {
        $('.tab-menu').find('.tab-special').show();
    }

    var li_index = $(e.target).closest('li').index();
    $('.tab-menu').attr('index', li_index);

    _tab_m.css(xy);
}

function docCon(e) {
    $('.doc-con ul').is(':visible') && $('.doc-con ul').hide() && $('#split').show();
    // $('#split').show();
}

function itemEditBut(e) {
    $('.item-edit-but ul').is(':visible') && $('.item-edit-but ul').hide() && $('#split').show();
    // $('#split').show();
}

function closeFuMenu(e) {
    !_fm.is(e.target) && _fm.hide() && _fm.data('f', false);
}

//右键菜单 end

function tabH() {
    var tab = $('.tab');
    return tab.is(':hidden') ? 0 : tab.height();
}


// $('sdfsdf').data()

// e.exports = {
//     isArray: a, isArrayBuffer: function (e) {
//         return "[object ArrayBuffer]" === o.call(e)
//     }, isBuffer: i, isFormData: function (e) {
//         return "undefined" != typeof FormData && e instanceof FormData
//     }, isArrayBufferView: function (e) {
//         return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && e.buffer instanceof ArrayBuffer
//     }, isString: function (e) {
//         return "string" == typeof e
//     }, isNumber: function (e) {
//         return "number" == typeof e
//     }, isObject: s, isUndefined: function (e) {
//         return void 0 === e
//     }, isDate: function (e) {
//         return "[object Date]" === o.call(e)
//     }, isFile: function (e) {
//         return "[object File]" === o.call(e)
//     }, isBlob: function (e) {
//         return "[object Blob]" === o.call(e)
//     }, isFunction: u, isStream: function (e) {
//         return s(e) && u(e.pipe)
//     }, isURLSearchParams: function (e) {
//         return "undefined" != typeof URLSearchParams && e instanceof URLSearchParams
//     }, isStandardBrowserEnv: function () {
//         return ("undefined" == typeof navigator || "ReactNative" !== navigator.product) && "undefined" != typeof window && "undefined" != typeof document
//     }, forEach: c, merge: function e() {
//         var t = {};
//
//         function n(n, r) {
//             "object" == typeof t[r] && "object" == typeof n ? t[r] = e(t[r], n) : t[r] = n
//         }
//
//         for (var r = 0, i = arguments.length; r < i; r++) c(arguments[r], n);
//         return t
//     }, extend: function (e, t, n) {
//         return c(t, function (t, i) {
//             e[i] = n && "function" == typeof t ? r(t, n) : t
//         }), e
//     }, trim: function (e) {
//         return e.replace(/^\s*/, "").replace(/\s*$/, "")
//     }
// }

// $.ajax({
//     type: "post",
//     url: "/User/Edit",
//     data: { data: JSON.stringify(postdata) },
//     success: function (data, status) {
//         if (status == "success") {
//             toastr.success('提交数据成功');
//             $("#tb_aaa").bootstrapTable('refresh');
//         }
//     },
//     error: function (e) {
//     },
//     complete: function () {
//     }
//
// });

// (function ($) {
//     //1.定义jquery的扩展方法combobox
//     $.fn.combobox = function (options, param) {
//         if (typeof options == 'string') {
//             return $.fn.combobox.methods[options](this, param);
//         }
//         //2.将调用时候传过来的参数和default参数合并
//         options = $.extend({}, $.fn.combobox.defaults, options || {});
//         //3.添加默认值
//         var target = $(this);
//         target.attr('valuefield', options.valueField);
//         target.attr('textfield', options.textField);
//         target.empty();
//         var option = $('<option></option>');
//         option.attr('value', '');
//         option.text(options.placeholder);
//         target.append(option);
//         //4.判断用户传过来的参数列表里面是否包含数据data数据集，如果包含，不用发ajax从后台取，否则否送ajax从后台取数据
//         if (options.data) {
//             init(target, options.data);
//         }
//         else {
//             //var param = {};
//             options.onBeforeLoad.call(target, options.param);
//             if (!options.url) return;
//             $.getJSON(options.url, options.param, function (data) {
//                 init(target, data);
//             });
//         }
//         function init(target, data) {
//             $.each(data, function (i, item) {
//                 var option = $('<option></option>');
//                 option.attr('value', item[options.valueField]);
//                 option.text(item[options.textField]);
//                 target.append(option);
//             });
//             options.onLoadSuccess.call(target);
//         }
//         target.unbind("change");
//         target.on("change", function (e) {
//             if (options.onChange)
//                 return options.onChange(target.val());
//         });
//     }
//
//     //5.如果传过来的是字符串，代表调用方法。
//     $.fn.combobox.methods = {
//         getValue: function (jq) {
//             return jq.val();
//         },
//         setValue: function (jq, param) {
//             jq.val(param);
//         },
//         load: function (jq, url) {
//             $.getJSON(url, function (data) {
//                 jq.empty();
//                 var option = $('<option></option>');
//                 option.attr('value', '');
//                 option.text('请选择');
//                 jq.append(option);
//                 $.each(data, function (i, item) {
//                     var option = $('<option></option>');
//                     option.attr('value', item[jq.attr('valuefield')]);
//                     option.text(item[jq.attr('textfield')]);
//                     jq.append(option);
//                 });
//             });
//         }
//     };
//
//     //6.默认参数列表
//     $.fn.combobox.defaults = {
//         url: null,
//         param: null,
//         data: null,
//         valueField: 'value',
//         textField: 'text',
//         placeholder: '请选择',
//         onBeforeLoad: function (param) { },
//         onLoadSuccess: function () { },
//         onChange: function (value) { }
//     };
// })(jQuery);

//为所有 AJAX 请求设置默认 URL 和 success 函数：
// $.ajaxSetup({
//     url:"demo_ajax_load.txt",
//     success:function(result){
//         $("div").html(result);
//     }
// });

var tabScrollx = $('.tab-nav ul');
var tabScrollbut = $('.tab .scroll');
var tabScrollDist = 400;

function setScroll() {
    var _w = 0;
    $('.tab-nav ul li').each(function () {
        _w += $(this).outerWidth();
    });
    if (_w <= $('.tab-nav ul').width()) {
        $('.scroll').hide();
        $('.tab .tab-nav ul').removeClass('shadow');
        $('.tab .tab-nav ul').removeClass('shadow-l');
        $('.tab .tab-nav ul').removeClass('shadow-r');
    } else {
        tabsScroll();
        $('.scroll').show();
    }
}

function tabsScroll() {
    var _data = tabScrollx.data('scroll');
    _data != 1 && $.issetEmpty(tabScrollx[0]) && tabScrollx && tabScrollx.width() < tabScrollx[0].scrollWidth && (navigator.userAgent.indexOf('MSIE') >= 0 ? msie() : ms());
    tabScrollx.data('scroll', 1);
}

function msie() {
    var _t = tabScrollx;
    _t.on("mousewheel", function (e) {
        var d = e.originalEvent.wheelDelta, l = this.scrollLeft, m = d < 0 ? l + tabScrollDist : l - tabScrollDist;
        scrollXAnimate(m, this);
    });
}

function ms() {
    var _t = tabScrollx;
    se = "mousewheel DOMMouseScroll MozMousePixelScroll";
    _t.on(se, function (e) {
        var d = e.originalEvent.detail, d = d ? d : e.originalEvent.wheelDelta, l = this.scrollLeft,
            m = d > 0 ? l + tabScrollDist : l - tabScrollDist;
        scrollXAnimate(m, this);
    });
}

function scrollXAnimate(m, _t) {
    var _t = $(_t);
    var w = _t.width(), sw = _t[0].scrollWidth, l = _t[0].scrollLeft;
    if (m > 0 && (m + w) < sw && sw > w) {
        !_t.hasClass('shadow') && _t.addClass('shadow').removeClass('shadow-l').removeClass('shadow-r');
        tabScrollbut.removeClass('disabled');
    }
    if (m <= 0 && l <= 0 && !_t.hasClass('shadow-r')) {
        _t.removeClass('shadow');
        _t.removeClass('shadow-l');
        _t.addClass('shadow-r');
        tabScrollbut.removeClass('disabled');
        tabScrollbut.eq(0).addClass('disabled');
    }
    if (m + w >= sw && l + w >= sw && !_t.hasClass('shadow-l')) {
        _t.removeClass('shadow');
        _t.removeClass('shadow-r');
        _t.addClass('shadow-l');
        tabScrollbut.removeClass('disabled');
        tabScrollbut.eq(1).addClass('disabled');
    }
    _t.stop().animate({scrollLeft: m}, t.sTime, function () {
        if (!(m > 0 && (m + w) < sw && sw > w)) {
            $('.tab .scroll').removeClass('disabled');
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
        tabScrollbut.eq(0).addClass('disabled');
    }

    function aShadowR() {
        _t.addClass('shadow-r');
    }

    function rShadowR() {
        _t.removeClass('shadow-r');
        tabScrollbut.eq(1).addClass('disabled');
    }
}

function sidebarOn(t = true) {
    t && !$('.sidebar-mode').hasClass('bi-on') && $('.sidebar-mode').click();
    !t && $('.sidebar-mode').hasClass('bi-on') && $('.sidebar-mode').click();
    storage('tab') == 0 && t && !$('.tab-fn .close').hasClass('bi-box-arrow-in-down') && $('.tab-fn .close').click();
}

//TabList
function tabList(n='stol') {
    return JSON.parse(storage(n + storage('iid'))) || [];
}