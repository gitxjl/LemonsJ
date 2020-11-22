var Page = 2;
var TPage = 10;
teamListInit();

function teamEdit(_this, _i = '') {
    var _n = 'team_edit' + dateHMS();

    getData('team_edit', "team/all", function (d) {
        dialog({
            bi: 'bi-person-lines-fill',
            formId: _n,
            container: catalogInput('name', '团队名称')+
            catalogCombobox({
                title: '复制',
                name: 'cid',
                value: '',
                menu: menuTeam(d),
                but: '',
            }),
        });
    });

    function menuTeam(d, l = 0, a = 0) {
        var h = '';
        $.each(d,function (k,v) {
            h += '<dd i="' + v.id + '" f="1" p="0" t="0"><a m="' + v.id + '" f="1"><bg></bg> ' + v.name + '</a></dd>';
        })
        if (h.length <= 0) return '<dl></dl>';
        return '<dl>' + h + '</dl>';
    }
    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        ajaxs({
            url: "team",
            type: "POST",
            data: $(this).serialize(),
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) {
                    _this.closest('.dialog').remove();
                    var p = parseInt($('.doc-table-paginate span.active').text());
                    teamListInit(p);
                }
            }
        });
        return false;
    });
}

$("body").on("click", '.sortable-submit', function () {
    var sortable = $('.sortable-update');
    var teamList = [];
    var minusList = [];
    sortable.each(function (k, v) {
        var _this = $(this);
        var table = _this.closest('.doc-table');
        var plus = table.data('plus');
        var minus = table.data('minus');
        plus && plus.length > 0 && teamList.push({
            'tid': table.attr('i'),
            'plus': plus.join(','),
        });
        minus && minus.length > 0 && minusList.push(table.data('minus'))
    });

    ajaxs({
        data:{'list':JSON.stringify(teamList),'minus':minusList.join(',')},
        type:"POST",
        url: "team_user/sortable",
        success: function (result) {
            hint(result.msg);
            if (result.code == 200) {
                $('.sortable-submit').hide();

                var p = parseInt($('.doc-table-paginate span.active').text());
                teamListInit(p);
            }
        }
    });
});

$("body").on("click", '.ti-name-edit', function () {
    var _text = $(this).closest('.title').find('.team-name');
    var i = $(this).closest('.doc-table').attr('i');
    if (_text.hasClass('tn-edit')) {
        ajaxs({
            url: "team",
            type: "POST",
            data: {'id': i, 'name': _text.text()},
            success: function (result) {
                hint(result.msg);
                if (result.code == 200) _text.removeClass('tn-edit').attr('contenteditable', false);
            }
        });
    } else {
        _text.addClass('tn-edit').attr('contenteditable', true).select().focus();
    }
});

$("body").on("click", '.doc-table .header .title .bi-clone', function () {
    var _text = $(this).closest('.title').find('.team-name').text();
    var i = $(this).closest('.doc-table').attr('i');
    var _n = 'team_clone' + dateHMS();
    dialog({
        formId: _n,
        bi: 'bi-clone',
        container: catalogInput('name', '团队名称，默认：原名称-copy') +
        catalogInput('cid', 'CopyID', i, 1) +
        catalogInput('oname', 'oname', _text + ' - copy', 1),
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        if (i) {
            ajaxs({
                url: "team",
                type: "POST",
                data: _this.serialize(),
                success: function (result) {
                    hint(result.msg);
                    if (result.code == 200) {
                        _this.closest('.dialog').remove();
                        teamListInit();
                    }
                }
            });
        } else {
            hint('操作失败');
        }
        return false;
    });
});

$("body").on("click", '.doc-table .header .title .bi-plus', function () {
    var _text = $(this).closest('.title').find('.team-name').text();
    var tid = $(this).closest('.doc-table').attr('i');
    var _n = 'team_member_plus' + dateHMS();
    var ul = $(this).closest('.doc-table').find('.doc-table-ul');
    var p = 1;
    var paginate = $(this).closest('.doc-table').find('.paginate');
    getData('team_member_plus', "friend", function (d) {
        dialog({
            formId: _n,
            bi: 'bi-plus',
            container: catalogSearch('email', '搜索用户邮箱') +
            catalogInput('tid', '团队ID', tid, 1) +
            catalogComboboxMultiple({
                title: '好友',
                name: 'uid',
                value: '',
                menu: menuFriend(d),
            }),
        });
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        if (tid) {
            ajaxs({
                url: "team_user",
                type: "POST",
                data: _this.serialize(),
                success: function (result) {
                    hint(result.msg);
                    if (result.code == 200) {
                        _this.closest('.dialog').remove();
                        ajaxs({
                            type: "GET",
                            url: "team_user?tid=" + tid + "&page=" + p,
                            success: function (result) {
                                if (result.code == 200) {
                                    var h = '';
                                    $.each(result.data.data, function (k, v) {
                                        h += '<li i="' + v.id + '" tid="' + v.tid + '">\n' +
                                            '  <i class="bi bi-up-downs li-sort" title="移动"></i>\n' +
                                            '  <input class="key" name="name" type="text" value="' + v.name + '" readonly="readonly">\n' +
                                            '  <input class="key" name="email" type="text" value="' + v.email + '" readonly="readonly">\n' +
                                            '  <i class="bi bi-x" title="删除"></i>\n' +
                                            '</li>';
                                    });
                                    ul.html(h);

                                    var _p = Math.ceil(result.data.total / result.data.per_page);
                                    h = '';
                                    if (_p > 1) {
                                        for (var i = 1; i <= _p; i++) {
                                            var a = i == p ? ' class="active"' : '';
                                            h += '<span' + a + '>' + i + '</span>';
                                        }
                                        paginate.html(h);
                                    } else {
                                        paginate.remove();
                                    }
                                } else {
                                    hint(result.msg);
                                }
                            }
                        });
                    }
                }
            });
        } else {
            hint('操作失败');
        }
        return false;
    });
});

$("body").on("click", '.doc-table .header .title .bi-x', function () {
    var _this = $(this);
    var table = _this.closest('.doc-table');
    var i = table.attr('i');
    var n = table.find('.header .title span.team-name').text();

    var _n = 'team_del' + dateHMS();
    dialog({
        formId: _n,
        container: '<center>是否确认删除团队： ' + n + ' ？</center>' + catalogInput('id', '删除ID', i, 1),
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        if (i) {
            ajaxs({
                url: "team/" + i,
                type: "DELETE",
                success: function (result) {
                    hint(result.msg);
                    if (result.code == 200) {
                        _this.closest('.dialog').remove();
                        table.remove();
                    }
                }
            });
        } else {
            hint('操作失败');
        }
        return false;
    });
});

$("body").on("click", '.doc-table-ul li .bi-x', function () {
    var _this = $(this);
    var ul = _this.closest('.doc-table').find('.doc-table-ul');
    var liLen = ul.find('li').length;
    var paginate = _this.closest('.doc-table').find('.paginate');
    var li = _this.closest('li');
    var i = li.attr('i');
    var n = li.find('.key').val();
    var p = parseInt(_this.closest('.doc-table').find('.paginate span.active').text());
    p = liLen <= 1 ? p - 1 : p;
    var tid = _this.closest('.doc-table').attr('i');

    var _n = 'team_member_del' + dateHMS();
    dialog({
        formId: _n,
        container: '<center>是否确认删除成员： ' + n + ' ？</center>' + catalogInput('id', '删除ID', i, 1),
    });

    $(document).on('submit', 'form#' + _n, function () {
        var _this = $(this);
        if (i) {
            ajaxs({
                url: "team_user/" + i,
                type: "DELETE",
                success: function (result) {
                    hint(result.msg);
                    if (result.code == 200) {
                        _this.closest('.dialog').remove();
                        li.remove();
                        if (p <= 0) return false;
                        ajaxs({
                            type: "GET",
                            url: "team_user?tid=" + tid + "&page=" + p,
                            success: function (result) {
                                if (result.code == 200) {
                                    var h = '';
                                    $.each(result.data.data, function (k, v) {
                                        h += '<li i="' + v.id + '" tid="' + v.tid + '">\n' +
                                            '  <i class="bi bi-up-downs li-sort" title="移动"></i>\n' +
                                            '  <input class="key" name="name" type="text" value="' + v.name + '" readonly="readonly">\n' +
                                            '  <input class="key" name="email" type="text" value="' + v.email + '" readonly="readonly">\n' +
                                            '  <i class="bi bi-x" title="删除"></i>\n' +
                                            '</li>';
                                    });
                                    ul.html(h);

                                    var _p = Math.ceil(result.data.total / result.data.per_page);
                                    h = '';
                                    if (_p > 1) {
                                        for (var i = 1; i <= _p; i++) {
                                            var a = i == p ? ' class="active"' : '';
                                            h += '<span' + a + '>' + i + '</span>';
                                        }
                                        paginate.html(h);
                                    } else {
                                        paginate.remove();
                                    }
                                } else {
                                    hint(result.msg);
                                }
                            }
                        });
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
    var _this = $(this);
    var p = parseInt($(this).text());
    var ul = $(this).closest('.doc-table').find('.doc-table-ul');
    var tid = $(this).closest('.doc-table').attr('i');

    ajaxs({
        type: "GET",
        url: "team_user?tid=" + tid + "&page=" + p,
        success: function (result) {
            if (result.code == 200) {
                var h = '';
                $.each(result.data.data, function (k, v) {
                    h += '<li i="' + v.id + '" tid="' + v.tid + '">\n' +
                        '  <i class="bi bi-up-downs li-sort" title="移动"></i>\n' +
                        '  <input class="key" name="name" type="text" value="' + v.name + '" readonly="readonly">\n' +
                        '  <input class="key" name="email" type="text" value="' + v.email + '" readonly="readonly">\n' +
                        '  <i class="bi bi-x" title="删除"></i>\n' +
                        '</li>';
                });
                ul.html(h);
                h.length > 0 && _this.addClass('active').siblings().removeClass('active');
            } else {
                hint(result.msg);
            }
        }
    });
});
$("body").on("click", '.doc-table-paginate span', function () {
    var _this = $(this);
    var p = parseInt($(this).text());
    var box = $(this).closest('.doc-table-box');

    ajaxs({
        type: "GET",
        url: "team?page=" + p,
        success: function (result) {
            if (result.code == 200) {
                setTeamTable(result.data.data);
                setTeamTablePaginate(result.data, p);
                _this.addClass('active').siblings().removeClass('active');
            } else {
                hint(result.msg);
            }
        }
    });
});

function teamListInit(p=1) {
    ajaxs({
        type: "GET",
        url: "team?page="+p,
        success: function (result) {
            if (result.code == 200) {
                setTeamTable(result.data.data);
                setTeamTablePaginate(result.data,p);
            }else {
                hint(result.msg);
            }
        }
    });
}

function setTeamTablePaginate(d, _p = 1) {
    var p = Math.ceil(d.total / d.per_page);
    var h = 'Team:';
    if (p > 1) {
        for (var i = 1; i <= p; i++) {
            var a = i == _p ? ' class="active"' : '';
            h += '<span' + a + '>' + i + '</span>';
        }
    }
    $('.doc-table-paginate').html(h);
}

function setTeamTable(d) {
    var h = '';
    $.each(d, function (k, v) {
        h += '<div class="doc-table" i="' + v.id + '">\n' +
            '  <div class="header">\n' +
            '    <div class="title"><span class="team-name" contenteditable="true">' + v.name + '</span>\n' +
            '    <i class="bi bi-edit ti-name-edit" title="编辑"></i><i class="bi bi-clone" title="复制"></i><i class="bi bi-x" title="删除"></i><i class="bi bi-plus" title="添加成员"></i></div>\n' +
            '    <div class="else-right">' + v.created_at + '</div>\n' +
            '  </div>\n' +
            '    <ul class="doc-table-ul ui-sortable " placeholder="&nbsp;暂无成员" >';

        $.each(v.list, function (_k, _v) {
            h += '<li i="' + _v.id + '" tid="' + _v.tid + '">\n' +
                '  <i class="bi bi-up-downs li-sort" title="移动"></i>\n' +
                '  <input class="key" name="name" type="text" value="' + _v.name + '" readonly="readonly">\n' +
                '  <input class="key" name="email" type="text" value="' + _v.email + '" readonly="readonly">\n' +
                '  <i class="bi bi-x" title="删除"></i>\n' +
                '</li>';
        });

        h += '</ul>\n';
        var p = Math.ceil(v.total / v.per_page);
        if (p > 1) {
            h += '<div class="paginate">';
            for (var i = 1; i <= p; i++) {
                var a = i == 1 ? ' class="active"' : '';
                h += '<span' + a + '>' + i + '</span>';
            }
            h += '</div>';
        }
        h += '</div>';
    });
    $('.doc-table-box').html(h);
    init_sortable();
}


var m = 1;
var m1 = 1;
var isu = 1;
//初始化拖拽排序
init_sortable();

function init_sortable() {
    $(".doc-table-ul").sortable({
        start: function (event, ui) {
            if (m1 > 0) {
                hint('可拖拽至另一团队');
                m1--;
            }
        },
        change: function (event, ui) {
        },
        stop: function (event, ui) {
        },
        update: function (event, ui) {
            sortable_update(event, ui);

        },
        receive: function (event, ui) {
        },
        axis: "y",
        items: "li",
        dropOnEmpty: true,
        cursor: "move",
        connectWith: ".doc-table-ul",
        animation: 150,
        delay: 100,
        ghostClass: 'blue-background-class'
    }).disableSelection();
}

function sortable_update(e, ui) {
    var t = e.target;
    var table = $(t).closest('.doc-table');
    var tid = table.attr('i');
    var _ui = $(ui.item);
    var i = _ui.attr('i');
    var m = _ui.attr('m');
    var li_tid = _ui.attr('tid');
    var plus = table.data('plus') || [];
    var minus = table.data('minus') || [];
    table.addClass('sortable-update');
    if (isu == 1) {
        if (tid == li_tid) {
            minus.push(i);
        } else {
            plus.splice($.inArray(i, plus), 1);
            table.data('plus', plus);
            minus.splice($.inArray(i, minus), 1);
        }
        table.data('minus', minus);
        isu = 2;
    } else if (isu == 2) {

        if (tid == li_tid) {
            minus.splice($.inArray(i, minus), 1);
            table.data('minus', minus);
            plus.splice($.inArray(i, plus), 1);
        } else {
            plus.push(i);
        }
        table.data('plus', plus);
        isu = 1;
    }

    if (m > 0) {
        hint('右上角按钮 保存');
        m--;
    }
    $('.sortable-submit').show();
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