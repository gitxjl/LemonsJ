var liP = getQueryVariable('p');
if (liP === false) liP = '';
$('.item-box>ul>li').each(function (k, v) {
    var _this = $(this);liP == _this.attr('p') && _this.addClass('active').siblings().removeClass('active') && init(_this.attr('p'));
});

$("body").on("click", '.item-box .item-view .list', function () {
    var _this = $(this);
    cGetItem(_this.attr('i'));
    cdocViewRemove();
});
$("body").on("click", '.item-box .paginate span', function () {
    var _this = $(this),_p = parseInt(_this.text()),box = _this.closest('.doc-table-box'),p = $('.item-box>ul>li.active').attr('p');
    ajaxs({
        type: "GET",
        url: "item/list?p=" + p + "&page=" + _p,
        success: function (result) {
            if (result.code == 200) {
                setList(result.data.data);
                setPaginate(result.data, _p);
                _this.addClass('active').siblings().removeClass('active');
            } else {
                hint(result.msg);
            }
        }
    });
});
$(document).on('click', '.item-box>ul>li:not(".right")', function () {
    var _this = $(this);!_this.hasClass('active') && _this.addClass('active').siblings().removeClass('active') && init(_this.attr('p'));
});

function init(p = '', _p = 1) {
    if (!p) p = $('.item-box>ul>li.active').attr('p');
    ajaxs({
        type: "GET",
        url: "item/list?p=" + p,
        success: function (result) {
            if (result.code == 200) {
                setList(result.data.data);
                setPaginate(result.data, _p);
            } else {
                hint(result.msg);
            }
        },
        error: function () {
            $('.item-box .item-view .list:not(".item-new")').remove();
        }
    });
}

function setPaginate(d, _p = 1) {
    var p = Math.ceil(d.total / d.per_page),h = '';
    if (p > 1) {
        h = 'Item:';
        for (var i = 1; i <= p; i++) {
            var a = i == _p ? ' class="active"' : '';
            h += '<span' + a + '>' + i + '</span>';
        }
    }
    $('.item-box .paginate').html(h);
}

function dStatus(s) {
    var n = '只读';
    switch (s) {
        case 0:
            n = '创建';
            break;
        case 1:
            n = '默认';
            break;
    }
    return n;
}

function setList(d) {
    var h = '';
    $.each(d, function (k, v) {
        v.open = v.open == 1 ? '公开' : '私有';
        v.status = dStatus(v.permission);
        h += '            <div class="list" i="' + v.id + '">\n' +
            '  <a href="javascript:;" title="' + v.name + '">\n' +
            '    <div class="title">' + v.name + '</div>\n' +
            '  </a>\n' +
            '  <div class="else">\n' +
            '    <span title="权限"><i class="bi bi-controller"></i>' + v.status + '</span><span title="文档状态"><i class="bi bi-item"></i>' + v.open + '</span>&nbsp;&nbsp;' + v.created_at + '\n' +
            '  </div>\n';
        if (v.permission == 0) {
            h += '  <div class="gear">\n' +
                '    <i class="bi bi-gear-fill doc-con">\n' +
                '    <ul>\n' +
                '    <li onclick="itemEdit(this,' + v.id + ')">修改</li>\n' +
                '    <li onclick="link(this,\'item/member.html?id=' + v.id + '\',0)" title="'+v.name+'项目成员">成员</li>\n' +
                '    <li onclick="itemTransfer(this,' + v.id + ')">转让</li>\n' +
                '    <li onclick="itemDel(this,' + v.id + ',\'' + v.name + '\')">删除</li>\n' +
                '    </ul>\n' +
                '    </i>\n' +
                '  </div>\n';
        } else {
            h += '  <div class="gear">\n' +
                '    <i class="bi bi-gear-fill doc-con">\n' +
                '    <ul>\n' +
                '    <li onclick="itemDel(this,' + v.id + ',\'' + v.name + '\')">退出</li>\n' +
                '    </ul>\n' +
                '    </i>\n' +
                '  </div>\n';
        }
        h += '</div>';
    });
    $('.item-box .item-view .list:not(".item-new")').remove();
    $('.item-box .item-view').append(h);
}

if (storage('item-list') == 1) {
    var _this = $('.item-box ul li.right i.bi-list');
    !_this.hasClass('active') && $('.item-box .item-view').toggleClass('item-list') && _this.addClass('active').siblings().removeClass('active');
}
$(document).on('click', '.item-box ul li.right i', function () {
    var _this = $(this);
    !_this.hasClass('active') && $('.item-box .item-view').toggleClass('item-list') && _this.addClass('active').siblings().removeClass('active');
    storage('item-list', _this.hasClass('bi-list') ? 1 : 0);
});
$(document).on('mouseenter', '.doc-con', function (e) {
    if ($(this).find('ul').first().is(':hidden')) {
        var _top = $(this).offset().top + 25;
        $(this).find('ul').first().css({
            left: ($(this).offset().left - 11) + 'px',
            top: _top + 'px'
        }).show();
        $(this).siblings().find('ul').hide();
    } else {
        $(this).find('ul').hide();
    }
});
$(document).on('mouseleave', '.doc-con', function (e) {
    $(this).find('ul').hide();
});

