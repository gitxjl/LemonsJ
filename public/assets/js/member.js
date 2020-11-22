var Page = 2;
init();
$(".doc-table-box .doc-table .header .title .ti-name").text($(".item-cut .input-box .value", window.parent.document).text()+' - 成员管理');

$("body").on("click", '.doc-table .header .title .bi-plus', function () {
    var _n = 'item_member_plus' + dateHMS();
    dialog({
        formId: _n,
        bi: 'bi-plus',
        container: catalogSearch('email', '搜索用户邮箱') +
        catalogInput('iid', '项目ID', storage('iid'), 1) +
        catalogComboboxMultiple({
            title: '好友',
            name: 'uid',
            value: '',
            menu: '',
            class: 'friend-list',
        }) +
        catalogComboboxMultiple({
            title: '团队',
            name: 'tid',
            value: '',
            menu: '',
            class: 'team-list',
        }) +
        catalogRadioPermissions(0),
    });
    getData('item_member_plus', "friend", function (d) {
        $('.combobox.friend-list .combobox-box .combobox-dl').html(menuFriend(d));
    });
    getData('team_edit', "team/all", function (d) {
        $('.combobox.team-list .combobox-box .combobox-dl').html(menuTeam(d));
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        ajaxs({
            url: "item_user",
            type: "POST",
            data: _this.serialize(),
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    init(1);
                }
            }
        });
        return false;
    });
});
function menuTeam(d, l = 0, a = 0) {
    var h = '';
    $.each(d,function (k,v) {
        h += '<dd i="' + v.id + '" f="1" p="0" t="0"><a m="' + v.id + '" f="1"><bg></bg> ' + v.name + '</a></dd>';
    });
    if (h.length <= 0) return '<dl></dl>';
    return '<dl>' + h + '</dl>';
}


$("body").on("click", '.doc-table-ul li .bi-x', function () {
    var _this = $(this);
    var ul = _this.closest('.doc-table').find('.doc-table-ul');
    var liLen = ul.find('li').length;
    var li = _this.closest('li');
    var i = li.attr('i');
    var n = li.find('.key').val();
    var p = parseInt(_this.closest('.doc-table').find('.paginate span.active').text());
    p = liLen <= 1 ? p - 1 : p;
    var _n = 'item_member_del' + dateHMS();
    dialog({
        formId: _n,
        container: '<center>是否确认删除成员： ' + n + ' ？</center>' + catalogInput('id', '删除ID', i, 1),
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        if (i) {
            ajaxs({
                url: "item_user/" + i,
                type: "DELETE",
                success: function (result) {
                    hint(result.msg);
                    if (result.code == 200) {
                        _this.closest('.dialog').remove();
                        li.remove();
                        if (p <= 0) return false;
                        init(p);
                    }
                }
            });
        } else {
            hint('操作失败');
        }
        return false;
    });
});

$("body").on("click", '.doc-table .paginate span', function () {
    var p = parseInt($(this).text());
    ajaxs({
        type: "GET",
        url: "item_user/"+storage('iid')+"?page=" + p,
        success: function (result) {
            if (result.code == 200) {
                setTable(result.data.data);
                setTablePaginate(result.data,p);
            } else {
                hint(result.msg);
            }
        }
    });
});

function init(p=1) {
    ajaxs({
        type: "GET",
        url: "item_user/"+storage('iid')+"?page="+p,
        success: function (result) {
            if (result.code == 200) {
                setTable(result.data.data);
                setTablePaginate(result.data,p);
            }else {
                hint(result.msg);
            }
        }
    });
}

function setTable(d){
    var ul = $(".doc-table-box .doc-table .doc-table-ul");
    var h = '';
    $.each(d, function (k, v) {
        var _n = v.uname || v.tname;
        var _e = v.uemail || (v.tid > 0 ?  '团队' : '') || '';
        var _i = v.tid > 0 ?  'bi-people-fill' : 'bi-person-fill';
        var _permission = v.permission == 1 ?  '默认' : '只读';
        h += '<li i="' + v.id + '">\n' +
            '  <i class="bi '+_i+'" title="移动"></i>\n' +
            '  <input class="key" name="name" type="text" value="' + _n + '" readonly="readonly">\n' +
            '  <input class="key" name="email" type="text" value="' + _e + '" readonly="readonly">\n' +
            '  <input class="key" name="permission" type="text" value="' + _permission + '" readonly="readonly" title="权限">\n' +
            '  <i class="bi bi-x" title="删除"></i>\n' +
            '</li>';
    });
    ul.html(h);
}
function setTablePaginate(d,_p=1){
    var paginate = $(".doc-table-box .doc-table .paginate");
    var p = Math.ceil(d.total / d.per_page);
    var h = '';
    if (p > 1){
        for (var i = 1; i <= p; i++) {
            var a = i == _p ? ' class="active"' : '';
            h += '<span' + a + '>' + i + '</span>';
        }
    }
    if (h.length > 0){
        paginate.show().html(h);
    }
}

$("body").on("mouseenter", '.doc-table', function () {
    $(this).find('.header .title .bi').css('display', 'inline-block');
});
$("body").on("mouseleave", '.doc-table', function () {
    $(this).find('.header .title .bi').hide();
});

$("body").on("mouseenter", '.doc-table li', function () {
    $(this).find('.bi-x').css('display', 'inline-block');
});
$("body").on("mouseleave", '.doc-table li', function () {
    $(this).find('.bi-x').hide();
});

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

function dateHMS() {
    var date = new Date();
    return date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
}