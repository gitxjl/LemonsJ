$('button.submit').click(function () {
    var screen = $('input[name="screen"]').prop("checked") ? 1 : 0;
    var all = $('input[name="all"]').prop("checked") ? 1 : 0;
    var iid = parseInt($('input[name="iid"]').val());
    var type = parseInt($('input[name="type"]').val());
    var select = $('input[name="select"]:checked');
    var did = [];
    screen = screen == 1 && all == 1 ? 0 : screen;
    if (screen == 1 && select.length > 0) {
        select.each(function () {
            did.push($(this).val())
        });
    }
    did.length <= 0 && screen == 0;
    ajaxs({
        time: 10,
        url: "export",
        type: 'POST',
        data: {
            'iid': iid,
            'type': type,
            'screen': screen,
            'did': JSON.stringify(did)
        },
        success: function (result) {
            hint(result.msg);
            if (result.code == 200) {
                window.location.href=result.data;
            }
        }
    });
    return false;
});

$('input[name="screen"]').prop("checked", false);
var p_item_cut = $('.item-cut', parent.document);
$('.down-item-cut .input-box .value').text(p_item_cut.find('.input-box .value').text());
$('.down-item-cut .input-box .combobox-input').val(storage('iid'));
$('.down-item-cut .combobox-box .combobox-menu').html(p_item_cut.find('.combobox-box .combobox-menu').html());
$('.down-item-cut .combobox-box .combobox-menu').find('dd .item-edit-but').remove();
$('.down-item-cut .combobox-box .combobox-menu').find('dd a').attr('f', 1);

$(document).on('click', '.down-item-cut dd a', function () {
    $('input[name="screen"]').attr("out",0)
    $('input[name="screen"]').prop("checked") != false && screen_menu($(this).attr('i'));
});
$('input[name="screen"]').click(function () {
    $(this).prop("checked") == false && $('.download-box>.search-box').slideUp(300) && $('.download-box>.combobox-menu').slideUp(300);
    $(this).prop("checked") != false && screen_menu($('.down-item-cut .input-box .combobox-input').val());
});

function screen_menu(iid) {
    var screen = $('input[name="screen"]');
    if (screen.attr("out") == 1){
        $('.download-box>.search-box').slideDown(300).css('display', 'flex') && $('.download-box>.combobox-menu').slideDown(300);
        return false;
    }
    if (screen.attr("out") == 2){
        screen.prop("checked", false);
        hint('暂无文档');
        return false;
    }
    getData('catalog' + iid, 'catalog/' + iid, function (d) {
        if (d.length) {
            $('.download-box>.combobox-menu .combobox-dl').html(menuDownload(d));
            screen.attr("out",1).prop("checked") != false && $('.download-box>.search-box').slideDown(300).css('display', 'flex') && $('.download-box>.combobox-menu').slideDown(300);
        } else {
            hint('暂无文档');
            screen.attr("out",2).prop("checked", false) && $('.download-box>.search-box').slideUp(300) && $('.download-box>.combobox-menu').slideUp(300);
        }
    });
}

function menuDownload(d, l = 0, a = 0) {
    var h = '';
    for (let i = 0; i < d.length; i++) {
        var v = d[i];
        var active = a == v.id ? 'class="active"' : '';
        if (l == v.pid) {
            var _m = menuDownload(d, v.id, a);
            h += '<dd i="' + v.id + '" f="' + v.form + '" p="' + v.pid + '" t="' + v.type + '">';
            if (_m.length > 0) h += '<input name="select" type="checkbox" value="' + v.id + '">';
            h += '<a ' + active + '>' + docFormI(v.form, _m.length) + docTypeI(v.type, v.form) + '<bg></bg>' + v.name;
            if (_m.length <= 0) h += '<input name="select" type="checkbox" value="' + v.id + '">';
            h += '</a>';
            h += _m;
            h += '</dd>';
        }
    }
    if (h.length <= 0) return '';
    return '<dl>' + h + '</dl>';
}

$(document).on("click", 'i.dToggle', function () {
    var _dl = $('#download').find('.combobox-menu .combobox-dl dl.combobox-new').siblings();
    if (_dl.length == 0) _dl = $('#download').find('.combobox-menu .combobox-dl dl');
    if (_dl.find('dd dl').length <= 0) return false;
    if ($(this).hasClass('bi-chevron-contract') && _dl.find('dd dl').is(':visible')) {
        _dl.find('i.bi-right').removeClass('bi-down');
        _dl.find('dd dl').slideUp(300);
        $(this).removeClass('bi-chevron-contract').addClass('bi-chevron-expand');
    } else if (_dl.find('dd dl').is(':hidden')) {
        _dl.find('dd dl').slideDown(300);
        _dl.find('dd dl').parent('dd').find('i.bi-right').addClass('bi-down');
        $(this).removeClass('bi-chevron-expand').addClass('bi-chevron-contract');
    }
});
$(document).on('click', '.inverse', function () {
    var _select = $(this);
        $('.combobox-menu input[name="select"]').each(function (i, o) {
            $(o).prop("checked", !$(o).prop("checked"));
        });
    if ($('.combobox-menu a input[name="select"]:checked').length <= 0) $('input[name="all"]').prop("checked", false);
});
$(document).on('click', 'input[name="all"]', function () {
    var _select = $(this);
    if (_select.prop("checked") != false) {
        $('.combobox-menu input[name="select"]').prop("checked", true);
    }
});
$(document).on('click', '.combobox-menu .combobox-dl dd a', function () {
    var _select = $(this).find('input[name="select"]');
    var _dd = $(this).closest('dl').parent('dd');
    if (_select.prop("checked") == false) {
        _select.prop("checked", true);
        _dd.length > 0 && _dd.children('input[name="select"]').prop("checked", true);
    } else {
        _select.prop("checked", false);
        _dd.length > 0 && _dd.find('a input[name="select"]:checked').length <= 0 && _dd.children('input[name="select"]').prop("checked", false);
        $('input[name="all"]').prop("checked", false);
    }
});
$(document).on('click', '.combobox-menu .combobox-dl dd a>input[name="select"]', function () {
    var _select = $(this);
    var _dd = _select.closest('dl').parent('dd');
    setTimeout(function () {
        if (_select.prop("checked") == false) {
            _select.prop("checked", true);
            _dd.length > 0 && _dd.children('input[name="select"]').prop("checked", true);
        } else {
            _select.prop("checked", false);
            _dd.length > 0 && _dd.find('a input[name="select"]:checked').length <= 0 && _dd.children('input[name="select"]').prop("checked", false);
            $('input[name="all"]').prop("checked", false);
        }
    }, 100)
});
$(document).on('click', '.combobox-menu .combobox-dl dd>input[name="select"]', function () {
    var _select = $(this);
    var _dl_select = _select.parent('dd').find('input[name="select"]');
    if (_select.prop("checked") == false) {
        _dl_select.prop("checked", false);
    } else {
        _dl_select.prop("checked", true);
    }
});