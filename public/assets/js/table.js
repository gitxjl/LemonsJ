var _SBER = '<span class="sb sb-bulk" type="0">Bulk Edit</span>';
var _SKVE = '<span class="sky">Key-Value Edit</span><i class="bi bi-question bulk_edit_question"></i>';

function table_data() {
    var d = [];
    $(".table-parameter").each(function (k,v) {
        d.push(get_table_data($(this)));
    });
    return d;
}
function get_table_data(_this){
    var _flag = _this.children('.header').children('.edit').attr('flag');
    var _err = _this.children('.header').children('.edit').attr('err');
    var _et = _this.children('.header').children('.edit-tips').find('.edit-type:checked').val();
    var _bulk_edit = _this.children('.bulk_edit');
    var _v = get_bulk_edit_val(_this.children('.bulk_edit').val());
    var _t = _this.children('.header').children('.title').text();
    var _iev = ( _this.children('.doc-table-ul').children('li').length == 1 && isNotNull(_v) && _v.length > 0);
    var param = {};

    if (_bulk_edit.is(':visible') && _v){
        param[_t]=encodeURIComponent(_v);
        param['type']=2;
        return param;
    }

    var _d = get_li_item(_this,1);
    if (_d.length > 0){
        param[_t]=_d;
        param['type']=1;
        return param;
    }
    return ;
}
function get_doc_table_data(_c){
    var _this = $(_c);
    var _flag = _this.children('.header').children('.edit').attr('flag');
    var _err = _this.children('.header').children('.edit').attr('err');
    var _et = _this.children('.header').children('.edit-tips').find('.edit-type:checked').val();
    var _v = get_bulk_edit_val(_this.children('.bulk_edit').val());
    var _t = _this.children('.header').children('.title').text();
    var _iev = ( _this.children('.doc-table-ul').children('li').length == 1 && isNotNull(_v) && _v.length > 0);

    if (
        (_flag == 1 && _err == 0 && _et == 1 && _iev) ||
        (_flag == 1 && _et == 1 && _iev) ||
        (_flag == 0 && _et == 1) ||
        (_flag == 0 && _this.children('.doc-table-ul').children('li').length == 1)){
        return _v;
    }

    var _d = get_li_item(_this,1);
    if (_d.length > 0){
        var param = {};
        param[_t]=_d;
        return param;
    }
    return ;
}

function get_bulk_edit_val(_v){
    if (_v.length <= 0) return ;
    var _l = [];
    try{
        _l = get_xml_key_val_item(_v);
        if (get_param(_l.length,0) > 0){
            return _v;
        }
    }catch (e) {
    }

    _l = [];
    try{
        _l = JSON.parse(_v)
        if (get_param(_l.length,0) > 0){
            return _v;
        }
    }catch (e) {
    }
    return r_comment(_v);
}

$(document).on('input propertychange','.table-parameter ul li .description,.table-parameter ul li .key,.table-parameter ul li .value', function(){
    var _index = $(this).closest('li').index();
    var _length = $(this).closest('.doc-table-ul').children('li').length;
    _index+1 == _length && dtul_add($(this).closest('.doc-table-ul'));
});

/*Response 格式化 json xml*/
$(document).on('input propertychange','.response', function(){
    var _v = $(this).val();
    var _s = '';
    if (_v.length > 0){
        try{
            _s = format_xml(_v)
        }catch (e) {
            _s = _v;
        }
        try{
            _s = JSON.stringify(JSON.parse(_v),null,4)
        }catch (e) {
            _s = _v;
        }

        $(this).val(_s);
    }

});

$(document).on('click','.doc-table .edit span',function () {
    var _t = $(this);
    var _edit = _t.parent('.edit');
    var _table = _t.closest('.doc-table');
    var _bulk_edit = _t.closest('.doc-table').children('.bulk_edit');
    var _kve = _t.closest('.doc-table').children('.key_value_edit');
    var _l = [];
    var _type = 1;
    var _err = _edit.attr('err');
    if (_bulk_edit.is(':visible')) {
        _edit.html('<span>Bulk Edit</span>');
        var _v = _bulk_edit.val();
        if (_v.length > 0){

            if (get_param(_l.length,0) == 0){
                _l = [];
                try{
                    _l = get_xml_key_val_item(_v);
                    _type = 1
                }catch (e) {
                }
            }
            if (get_param(_l.length,0) == 0){
                _l = [];
                try{
                    _l = JSON.parse(_v);
                    _type = 2
                }catch (e) {
                }
            }
            if (get_param(_l.length,0) == 0){
                _l = [];
                try{
                    _v = r_comment(_v);
                    var _item = _v.split('\n');
                    $(_item).each(function (k,v) {
                        if (v.length > 0){
                            var __v = v.split(':');
                            var _t = {};
                            _t.key = get_param(__v[0]);
                            _t.value = get_param(__v[1]);
                            _t.description = get_param(__v[2]);
                            _t.type = get_param(__v[3],'string');
                            _t.disabled = get_param(__v[4],1);
                            if(is_indexOf(_t.key)) {
                                _t.disabled = 0;
                            }
                            _t.key = html_encode_s(_t.key);
                            _l.push(_t)
                        }
                    });
                    _type = 3
                }catch (e) {
                }
            }

            if (_l.length == 0){
                hint('Bulk Edit 解析数据失败，作为Raq数据使用');
                _err = 0;
            }
            var _li = set_key_val(_l);
            if (!_li){
                hint('Bulk Edit 解析表单数据失败<br>转化为可提交自定义数据',2000,300);
                _err = 0;
            }else {
                _kve.html(_li);
                dtul_add(_kve);
                set_doc_table_li_w();
                _err = 1;
            }
        }
        _edit.attr('type',_type);
    }else {
        _edit.html('<span>Key-Value Edit</span><i class="bi bi-question bulk_edit_question"></i>');

        _l = get_li_item(_table);
        set_textarea(_l,_edit);
    }

    _bulk_edit.toggle();
    _kve.toggle();


});

$(document).on('mouseover','.doc-input-edit',function() {
    var _t = $(this);
    _t.children('.bi').css('display','inherit');
}) ;
$(document).on('mouseout','.doc-input-edit',function() {
    var _t = $(this);
    _t.children('.bi').css('display','none');
}) ;
$(document).on('mouseover','.doc-t-line',function() {
    var _t = $(this);
    _t.find('.bi-plus').css('display','inline-block');
    _t.find('.bi-x').css('display','inline-block');
}) ;
$(document).on('mouseout','.doc-t-line',function() {
    var _t = $(this);
    _t.find('.bi-plus').hide();
    _t.find('.bi-x').hide();
}) ;

$(document).on('click','.doc-input-edit .bi-edit',function () {
    var _t = $(this);
    var _input = '';
    _input = _t.parent('.doc-input-edit').children('.doc-input-edit-text');
    $('.doc-input-edit-text').removeClass('doc-input-edit-dis');
    _input.addClass('doc-input-edit-dis');
    var _placeholder = _t.parent('.doc-input-edit').children('.doc-input-edit-text').attr('placeholder');
    var h = '<div class="tips tips-textarea">' +
        '<textarea class="textarea" placeholder="' + _placeholder + '">' + _input.val() + '</textarea>' +
        '<span class="btn-cancel">取消</span>' +
        '<span class="btn-alter">修改</span>' +
        '</div>';
    $("body").prepend(h);
});

$(document).on('click', '.tips-textarea .btn-alter', function () {
    var _v = $(this).parent('.tips').children('.textarea').val();
    $('.doc-input-edit-dis').val(_v);
    $(this).parent('.tips').remove();
});
$(document).on('click', '.tips-textarea .btn-cancel', function () {
    $(this).parent('.tips').remove();
});

$(document).on('click', '.doc-table-ul .tdel', function () {
    if ($(this).closest('.doc-table-ul').children('li').length > 1 || !$(this).closest('.doc-table-ul').hasClass('key_value_edit')){
        var _l = $(this).closest('.doc-table-ul').children('li').length;
        var _ul = $(this).closest('.doc-table-ul');
        _l == 1 &&_ul.hide();
        $(this).closest('li').remove();
        set_doc_table_li_w();
    }
});

$(document).on('click', '.doc-table .add-ul', function () {
    dtul_add($(this).closest('.doc-table').children('ul'));
});

$(document).on('click', '.doc-table .add-li', function () {
    var _this = $(this).closest('li');

    if (_this.children('ul').length == 0){
        _this.append('<ul class="doc-table-ul"></ul>');
    }else {
        _this.children('ul').css('display','block');
    }
    dtul_add(_this.children('.doc-table-ul'));

});

$(document).on('click', '.doc-table .add-ul-box', function () {
    var _this = $(this).closest('li');
    if (_this.find('ul').length == 0){
        _this.append('<ul class="doc-table-ul" style="min-height: 30px"></ul>');
    }else {
        _this.find('ul').css('display','block');
    }
});

function setTdlPath(_i){
    if(!isNaN(_i) && _i > 0){
        file = '/doc/tpl/' + _i
    }else{
        file = _i
    }

    if (file.length > 0) {
        $.get(file, function (md) {
            set_doc_table_data(md);
        });
    } else {
        set_doc_table_data();
    }
}

function set_doc_table_data(_d) {
    if (_d){
        try{
            var _d = JSON.parse(_d);
            if (isNotNull(_d.headers)) set_table_data(_d.headers,'.doc-headers');
            if (isNotNull(_d.params)) set_table_data(_d.params,'.doc-params');
            if (isNotNull(_d.body)) set_table_data(_d.body,'.doc-body');
            if (isNotNull(_d.url)) $('.doc-url').val(_d.url);
            if (isNotNull(_d.method)) $('.doc-method .doc-select-input').val(_d.method);
            if (isNotNull(_d.method)) $('.doc-method .text').text(_d.method);
            if (isNotNull(_d.intro)) $('.intro').val(_d.intro);
            if (isNotNull(_d.response)) $('.response').val(_d.response);
        }catch (e) {
            tips_msg('数据解析错误!');
        }
    }else {
        $('.doc-method .doc-select-input').val('GET');
        $('.doc-method .text').text('GET');
        $('.doc-url').val('');
        $('.intro').val('');
        $('.bulk_edit').val('');
        $('.bulk_edit').not('.response').hide();
        $('.edit').attr('flag',1);
        $('.edit').attr('err',1);
        $('.edit').attr('type','');
        $('.edit').html(_SBER);
        $('.doc-table').find('.edit-tips').css('display','none');
        var _kve = $('.doc-table .key_value_edit');
        _kve.find('li').remove();
        _kve.show();
        dtul_add(_kve);
    }
}
function set_table_data2(d,_c) {
    try{
        var _li = set_key_val(JSON.parse(d));
        if (_li.length > 0){
            var _kve = $(_c).children('.key_value_edit');
            $(_c).find('.edit').attr('flag',1);
            $(_c).find('.edit').attr('err',1);
            $(_c).find('.edit').attr('type',2);
            $(_c).find('.edit').html(_SBER);
            _kve.html(_li)
            dtul_add(_kve);
            set_doc_table_li_w();
        }else {
            var _be = $(_c).children('.bulk_edit');
            _be.val(d);
            _be.show();

            $(_c).find('.edit').attr('flag',0);
            $(_c).find('.edit').attr('err',1);
            $(_c).find('.edit').attr('type',2);
            $(_c).find('.edit').html(_SKVE);
            $(_c).find('.edit-tips').css('display','inline-flex');
            $(_c).find('.key_value_edit').hide();
        }
        return;
    }catch (e) {

    }
    try{
        var _l = get_xml_key_val_item(d);
        if (get_param(_l.length,0) > 0){
            var _be = $(_c).children('.bulk_edit');
            _be.val(d);
            _be.show();

            $(_c).find('.edit').attr('flag',0);
            $(_c).find('.edit').attr('err',1);
            $(_c).find('.edit').attr('type',1);
            $(_c).find('.edit').html(_SKVE);
            $(_c).find('.edit-tips').css('display','inline-flex');
            $(_c).find('.key_value_edit').hide();
            return;
        }
    }catch (e) {

    }

    try{
        var str = '/* "//":表示非必填；格式（key(字段):value(默认值):description(字段说明):type(字段类型：string):disabled(是否必填：1是/0否；"//" 优先于 "disabled")）*/\n\n';
        var _be = $(_c).children('.bulk_edit');
        _be.val(str+d);
        _be.show();

        $(_c).find('.edit').attr('flag',0);
        $(_c).find('.edit').attr('err',1);
        $(_c).find('.edit').attr('type',3);
        $(_c).find('.edit').html(_SKVE);
        $(_c).find('.edit-tips').css('display','inline-flex');
        $(_c).find('.key_value_edit').hide();
    }catch (e) {

    }
}
function set_table_data(_d,_c) {
    var is = false;
    try{
        if (is) return false;
        var _li = set_key_val(_d);
        var _kve = $(_c).children('.key_value_edit');
        $(_c).find('.edit').attr('flag',1);
        $(_c).find('.edit').attr('err',1);
        $(_c).find('.edit').attr('type',2);
        $(_c).find('.edit').html(_SBER);
        _kve.html(_li)
        dtul_add(_kve);
        set_doc_table_li_w();
        is = true;
    }catch (e) {

    }
    try{
        if (is) return false;
        var _l = get_xml_key_val_item(_d);
        if (get_param(_l.length,0) > 0){
            var _be = $(_c).children('.bulk_edit');
            _be.val(_d);
            _be.show();

            $(_c).find('.edit').attr('flag',0);
            $(_c).find('.edit').attr('err',1);
            $(_c).find('.edit').attr('type',1);
            $(_c).find('.edit').html(_SKVE);
            $(_c).find('.edit-tips').css('display','inline-flex');
            $(_c).find('.key_value_edit').hide();
            is = true;
        }
    }catch (e) {

    }

    try{
        if (is) return false;
        var str = '/* "//":表示非必填；格式（key(字段):value(默认值):description(字段说明):type(字段类型：string):disabled(是否必填：1是/0否；"//" 优先于 "disabled")）*/\n\n';
        var _be = $(_c).children('.bulk_edit');
        _be.val(str+decodeURIComponent(_d));
        _be.show();

        $(_c).find('.edit').attr('flag',0);
        $(_c).find('.edit').attr('err',1);
        $(_c).find('.edit').attr('type',3);
        $(_c).find('.edit').html(_SKVE);
        $(_c).find('.edit-tips').css('display','inline-flex');
        $(_c).find('.key_value_edit').hide();
        is = true;
    }catch (e) {

    }
}

function get_xml_key_val_item(_v){
    var _l = [];
    var __v = _v;

    var _t_l = '<item>'+_v+'</item>';
    if ($(_t_l).children("node").length > 0){
        __v = _t_l;
    }

    if ($(__v).children("node").length > 0) {
        $(__v).children("node").each(function () {

            var _this = $(this);
            var _o = {};

            $.each(this.attributes, function() {
                if(this.specified) {
                    _o[this.name] = this.value
                }
            });

            if (_this.children("item").length > 0){
                _o.item = get_xml_key_val_item(_this.children("item").html())
            }
            _l.push(_o)
        });
    }

    return _l;
}

function set_textarea(_l,_t) {
    var _type = get_param(_t.attr('type'),2);
    if (_l.length <= 0) return false;
    var _h = '';
    switch (parseInt(_type)){
        case 1:
            _h = get_xml_string(_l);
            if (_h.length > 0){
                _h = '<?xml version="1.0" encoding="utf-8"?>\n' + _h
            }
            break;
        case 2:
            _h = JSON.stringify(_l,null,2);
            break;
        case 3:
            _h = get_ky_string(_l);
            break;
    }

    if (_h.length > 0){
        _t.closest('.doc-table').children('.bulk_edit').val(_h);
    }
}
function html_encode_s(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, ">");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, " ");
    s = s.replace(/\'/g, "'");
    s = s.replace('//', "");
    s = s.replace(/\n/g, "<br>");
    s = s.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    return s;
}
function is_indexOf(str)
{
    if(str.indexOf('//') >= 0 ) {
        return true;
    }
    return false;
}
function get_param(str,v = '') {
    if (str != '' && str != null && typeof(str) != "undefined" && str != "javascript:;"){
        return str;
    }
    return v;
}
function  r_comment(str) {
    var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/\*(\n|.)*?\*\/)/g;
    var _m = str.match(reg);
    str = str.replace(reg, "");
    str = str.replace("<br>", "");
    if(_m){
        str = str.replace(/\n/, "");
        str = str.replace(/\r/, "");
    }
    return str;
}
function get_xml_string(_l,_level = 0) {
    var str = '';
    if (_l.length > 0){
        if (_level > 0) {
            str += times('\t',_level );
        }
        _level = _level + 1;
        str += '<item>\n';
        $(_l).each(function (k,v) {
            str += times('\t',_level);
            str += '<node ';
            str += 'key="' + v.key + '" ';
            str += 'value="' + v.value + '" ';
            str += 'description="' + v.description + '" ';
            str += 'disabled="' + v.disabled + '" ';
            str += 'type="' + v.type + '" ';
            str += '>\n';
            var _item = get_xml_string(v.item,_level);
            if (_item.length > 0){
                str += times('\t',_level);
                str += _item ;
            }
            str += times('\t',_level);
            str += '</node>\n';
        });

        var lastIndex = str.lastIndexOf(',');
        if (lastIndex > -1) {
            str = str.substring(0, lastIndex) + str.substring(lastIndex + 1, str.length);
        }
        if (_level > 1) {
            str += times('\t',_level);
        }
        str += '</item>\n';
    }
    return str;
}

function get_json_string(_l,_level = 0) {
    var str = '';
    if (_l.length > 0){
        _level = _level + 1;
        str += '[';
        $(_l).each(function (k,v) {
            str += '{\n';
            str += times('\t',_level);
            str += '"key":"' + v.key + '",';
            str += '\n';
            str += times('\t',_level);
            str += '"value":"' + v.value + '",';
            str += '\n';
            str += times('\t',_level);
            str += '"description":"' + v.description + '",';
            str += '\n';
            str += times('\t',_level);
            str += '"disabled":"' + v.disabled + '",';
            str += '\n';
            str += times('\t',_level);

            var _item = get_json_string(v.item,_level);
            if (_item.length > 0){

                str += '"type":"' + v.type + '",';
                str += '\n';
                str += times('\t',_level);
                str += '"item":' + _item + '\n';
            }else {
                str += '"type":"' + v.type + '"';
                str += '\n';
            }

            if (_level > 1) {
                str += times('\t',_level - 1);
            }
            str += '},';
        });

        var lastIndex = str.lastIndexOf(',');
        if (lastIndex > -1) {
            str = str.substring(0, lastIndex) + str.substring(lastIndex + 1, str.length);
        }

        str += ']\n';
    }
    return str;
}

//转换为key value格式
function get_ky_string(_l) {
    var str = '/* "//":表示非必填；格式（key(字段):value(默认值):description(字段说明):type(字段类型：string):disabled(是否必填：1是/0否；"//" 优先于 "disabled")）*/\n\n';
    /*var str = '';*/
    $(_l).each(function (k,v) {
        if (v.disabled == 0) str += '//';
        str += v.key + ':' + v.value + ':' + v.description + ':' + v.type + ':' + v.disabled + '\n';
    });
    return str;
}

function get_li_item(_t,_s = 0) {
    var _l = [];
    _t.children('ul.doc-table-ul').each(function () {
        $(this).children('li').each(function () {
            var _line = $(this).children('.doc-t-line');
            var _key = _line.find('.key').val();
            var _true = 1,_false = 0;
            if (_s == 1){
                _true = true;
                _false = false;
            }
            if (isNotNull(_key)){
                var _t = {
                    'key':_line.children('.key').val(),
                    'disabled':_line.children('.disabled').is(':checked') ? _false : _true,
                    'type':_line.children('.form-type').find('.combobox-input').val(),
                    'value':_line.children('.value').val(),
                    'description':_line.children('.doc-input-edit').find('.description').val(),
                    'item':get_li_item($(this),_s)
                };
                _l.push(_t)
            }
        })
    });

    return _l;
}

function dtul_add(obj){
    var _html = '<li>\n' +
        '<div class="doc-t-line">\n' +
        '<i class="bi bi-up-downs li-sort" title="排序"></i><input class="disabled" type="checkbox" checked title="必填"/><input class="key" type="text" placeholder="Key">' +form_type() +
        '<input class="value" type="text" placeholder="Value">\n' +
        '<div class="doc-input-edit">\n' +
        '<textarea class="doc-input-edit-text description" type="text" placeholder="Description"></textarea><i class="bi bi-edit" title="窗口编辑描述"></i>\n' +
        '</div>\n' +
        '<i class="bi bi-plus add-li" title="插入子元素"></i><i class="bi bi-x tdel" title="删除当前元素和子元素"></i>\n' +
        '</div>\n' +
        '<ul class="doc-table-ul"></ul>\n' +
        '</li>';
    obj.append(_html);
    init_sortable();
    set_doc_table_li_w();
}

function set_key_val(d){
    var _li = '';
    $.each(d,function (k,v) {
        if (!isNotNull(v.key)) {
            return false
        }
        var _key = v.key;
        var _value = v.value;
        var _description = v.description;
        var _disabled = v.disabled ? 'checked="checked"' : '';
        var _type = v.type;
        var _item = v.item;
        if (_key == 9257) return '';


        _li += '<li>' +
            '<div class="doc-t-line">' +
            '<i class="bi bi-up-downs li-sort" title="排序"></i><input class="disabled" type="checkbox" ' + _disabled + ' title="必填"/>' +
            '<input class="key" type="text" placeholder="Key" value="' + _key + '">'+form_type(_type) +
            '<input class="value" type="text" placeholder="Value" value="' + _value + '">' +
            '<div class="doc-input-edit">' +
            '<textarea class="doc-input-edit-text description" type="text" placeholder="Description">' + _description + '</textarea><i class="bi bi-edit" title="窗口编辑描述"></i>' +
            '</div>' +
            '<i class="bi bi-plus add-li title="插入子元素"></i><i class="bi bi-x tdel" title="删除当前元素和子元素"></i>' +
            '</div>' +
            '<ul class="doc-table-ul" ';

        if (isNotNull(_item) && _item.length > 0){
            _li += 'style="display: block">';
            _li += set_key_val(_item)
        }else {
            _li += '>';
        }

        _li +='</ul>' +
            '</li>';
    });

    return _li

}

//显示li ul
function init_test(s){
    s.item.parents('.doc-table-ul').css('padding-left','0px');
    s.item.children('ul').css('display','block');
    s.item.children('ul').css('background','#f2f2f2');
    s.item.children('ul').css('padding-left','15px');
    s.item.children('ul').css('min-height','30px');
}

//初始化拖拽排序
init_sortable();
function init_sortable(){
    $(".doc-table-ul").sortable({
        start : function(event, ui) {
        },
        change: function(event, ui) {
            sort_ul_status(event);
            set_doc_table_li_w();
        },
        stop: function(event, ui) {
            sort_ul_status(event);
            set_doc_table_li_w();
        },
        update: function(event, ui) {
            sort_ul_status(event);
            set_doc_table_li_w();
        },
        axis: "y",
        items: "li",
        // revert: true,//默认动画
        dropOnEmpty : true,
        cursor: "move",
        // containment: "parent",
        connectWith: ".doc-table-ul",
        animation: 150,
        delay:100,
        ghostClass: 'blue-background-class'
    }).disableSelection();
}

/*隐藏打开的空ul*/
var _kw = 200;
var _n = 0;
function sort_ul_status(e) {
    var t = e.target;

    window.setTimeout(function(){
        $(t).find('ul').each(function () {
            var _this = $(this);
            _this.css('background','#fff0');
            _this.css('padding-left','0px');
            if (_this.children('li').length == 0){
                _this.hide();
            }
        });
    }, 1000);

    if ($(t.children[0]).length <= 0 && $(t).closest('.doc-table-ul').hasClass('key_value_edit')){
        $(t).html(doc_t_line());
    }

}

function set_doc_table_li_w() {
    _n = 0;

    $('.doc-table').children('ul').children('li').each(function () {
        var _this = $(this);
        get_ul_level(_this);
    });
    $('.doc-table ul').children('li').children('.doc-t-line').find('.key').css('width',(parseInt(_kw) + (_n * 25)) + 'px');

    $('.doc-table').children('ul').children('li').each(function () {
        var _this = $(this);
        set_ul_level_w(_this,_n)
    });
}

function set_ul_level_w(_this,_n) {
    _n = _n - 1;
    if (_this.children('ul').children('li').length > 0){
        _this.children('ul').children('li').children('.doc-t-line').find('.key').css('width',(parseInt(_kw) + (_n * 25)) + 'px');
        _this.children('ul').children('li').each(function () {
            var _t = $(this);
            set_ul_level_w(_t,_n)
        })
    }
}

function get_ul_level(_this) {
    var _i = 0;
    if (_this.children('ul').children('li').length > 0){
        _i = 1;
        _n = 1;
        var __n = 0;
        var _in = false;
        _this.children('ul').children('li').each(function () {
            var _t = $(this);
            __n = get_ul_level(_t);
            if (__n > 0) {
                _in = true
            }
        });
        if (_in){
            _n = _n + 1;
        }
    }
    return _i ;
}

function form_type(_type=''){
    var _type = _type ? _type : 'string';
    return '<div class="combobox form-type">\n' +
        '    <div class="input-box">\n' +
        '        <div class="value">\n' +
        '            '+_type+'\n' +
        '        </div>\n' +
        '        <i class="bi bi-down"></i>\n' +
        '        <input class="combobox-input" type="hidden" value="'+_type+'">\n' +
        '    </div>\n' +
        '    <div class="combobox-box">\n' +
        '        <div class="combobox-menu">\n' +
        '            <div class="combobox-dl">\n' +
        '                <dl>\n' +
        '                    <dd><a class="active"><bg></bg>string</a></dd>\n' +
        '                    <dd><a><bg></bg>float</a></dd>\n' +
        '                    <dd><a><bg></bg>int</a></dd>\n' +
        '                    <dd><a><bg></bg>long</a></dd>\n' +
        '                    <dd><a><bg></bg>byte</a></dd>\n' +
        '                    <dd><a><bg></bg>double</a></dd>\n' +
        '                    <dd><a><bg></bg>number</a></dd>\n' +
        '                    <dd><a><bg></bg>boolean</a></dd>\n' +
        '                    <dd><a><bg></bg>object</a></dd>\n' +
        '                    <dd><a><bg></bg>array</a></dd>\n' +
        '                    <dd><a><bg></bg>array[string]</a></dd>\n' +
        '                    <dd><a><bg></bg>array[int]</a></dd>\n' +
        '                    <dd><a><bg></bg>array[float]</a></dd>\n' +
        '                    <dd><a><bg></bg>array[long]</a></dd>\n' +
        '                    <dd><a><bg></bg>array[byte]</a></dd>\n' +
        '                    <dd><a><bg></bg>array[double]</a></dd>\n' +
        '                    <dd><a><bg></bg>array[number]</a></dd>\n' +
        '                    <dd><a><bg></bg>array[boolean]</a></dd>\n' +
        '                    <dd><a><bg></bg>array[object]</a></dd>\n' +
        '                    <dd><a><bg></bg>file</a></dd>\n' +
        '                </dl>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
}
function doc_t_line(){
    return '<li>\n' +
        '<div class="doc-t-line"><i class="bi bi-up-downs li-sort" title="排序"></i><input class="disabled" type="checkbox" checked="" title="必填">\n' +
        '<input class="key" type="text" placeholder="Key" style="width: 200px;"><div class="combobox form-type">\n' +
        '            <div class="input-box">\n' +
        '                <div class="value">\n' +
        '                    string\n' +
        '                </div>\n' +
        '                <i class="bi bi-down"></i>\n' +
        '                <input class="combobox-input" type="hidden" value="">\n' +
        '            </div>\n' +
        '            <div class="combobox-box">\n' +
        '                <div class="combobox-menu">\n' +
        '                    <div class="combobox-dl">\n' +
        '                        <dl>\n' +
        '                            <dd><a class="active"><bg></bg>string</a></dd>\n' +
        '                            <dd><a><bg></bg>float</a></dd>\n' +
        '                            <dd><a><bg></bg>int</a></dd>\n' +
        '                            <dd><a><bg></bg>long</a></dd>\n' +
        '                            <dd><a><bg></bg>byte</a></dd>\n' +
        '                            <dd><a><bg></bg>double</a></dd>\n' +
        '                            <dd><a><bg></bg>number</a></dd>\n' +
        '                            <dd><a><bg></bg>boolean</a></dd>\n' +
        '                            <dd><a><bg></bg>object</a></dd>\n' +
        '                            <dd><a><bg></bg>array</a></dd>\n' +
        '                            <dd><a><bg></bg>array[string]</a></dd>\n' +
        '                            <dd><a><bg></bg>array[int]</a></dd>\n' +
        '                            <dd><a><bg></bg>array[float]</a></dd>\n' +
        '                            <dd><a><bg></bg>array[long]</a></dd>\n' +
        '                            <dd><a><bg></bg>array[byte]</a></dd>\n' +
        '                            <dd><a><bg></bg>array[double]</a></dd>\n' +
        '                            <dd><a><bg></bg>array[number]</a></dd>\n' +
        '                            <dd><a><bg></bg>array[boolean]</a></dd>\n' +
        '                            <dd><a><bg></bg>array[object]</a></dd>\n' +
        '                            <dd><a><bg></bg>file</a></dd>\n' +
        '                        </dl>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <input class="value" type="text" placeholder="Value">\n' +
        '        <div class="doc-input-edit">\n' +
        '            <textarea class="doc-input-edit-text description" type="text"\n' +
        '                      placeholder="Description"></textarea><i class="bi bi-edit" title="窗口编辑描述"></i>\n' +
        '        </div>\n' +
        '        <i class="bi bi-plus add-li" title="插入子元素" style="color: rgb(255, 255, 255);"></i><i\n' +
        '            class="bi bi-x tdel" title="删除当前元素和子元素" style="color: rgb(255, 255, 255);"></i>\n' +
        '    </div>\n' +
        '    <ul class="doc-table-ul ui-sortable" style=""></ul>\n' +
        '</li>';
}

$(document).on("click", '.bulk_edit_question', function () {
    question('<div class="hint"style="width: 700px"><i class="icon-x"></i>\n' +
        '    <div class="h-tab">\n' +
        '        <ul>\n' +
        '            <li w="700" class="active">yaml</li>\n' +
        '            <li w="300">json</li>\n' +
        '            <li w="690">xml</li>\n' +
        '        </ul>\n' +
        '        <div class="h-tab-content">\n' +
        '            <div class="active">/* "//":表示非必填；格式（Key(字段):Value(默认值):Description(字段说明):type(字段类型：string):disabled(是否必填：1是/0否；"//" 优先于 "disabled")）*/<br><br>\n' +
        '//status::说明01:int<br>\n' +
        'per_page:10:说明02:float<br>\n' +
        'page:1:说明03:double<br>\n' +
        'type:2:说明04:number:0<br>\n' +
        '//to:home:说明05:array:1<br>\n' +
        'code:false<br>\n' +
        'order_no:NO5465465<br>\n' +
        'from:{}<br>\n' +
        'name:test</div>\n' +
        '            <div>\n' +
        '[{<br>\n' +
        '    "key": "1name",<br>\n' +
        '    "value": "默认内容",<br>\n' +
        '    "description": "名称",<br>\n' +
        '    "disabled": "0",<br>\n' +
        '    "type": "string"<br>\n' +
        '}, {<br>\n' +
        '    "key": "2name",<br>\n' +
        '    "value": "默认内容",<br>\n' +
        '    "description": "名称",<br>\n' +
        '    "disabled": "1",<br>\n' +
        '    "type": "string",<br>\n' +
        '    "item": [{<br>\n' +
        '        "key": "3id",<br>\n' +
        '        "value": "默认内容",<br>\n' +
        '        "description": "名称",<br>\n' +
        '        "disabled": "0",<br>\n' +
        '        "type": "int"<br>\n' +
        '        }, {<br>\n' +
        '        "key": "1name",<br>\n' +
        '        "value": "默认内容",<br>\n' +
        '        "description": "名称",<br>\n' +
        '        "disabled": "1",<br>\n' +
        '        "type": "string"<br>\n' +
        '        }]\n' +
        '}, {<br>\n' +
        '    "key": "4name",<br>\n' +
        '    "value": "默认内容",<br>\n' +
        '    "description": "名称",<br>\n' +
        '    "disabled": "1",<br>\n' +
        '    "type": "string"<br>\n' +
        '}, {<br>\n' +
        '    "key": "5name",<br>\n' +
        '    "value": "默认内容",<br>\n' +
        '    "description": "名称",<br>\n' +
        '    "disabled": "1",<br>\n' +
        '    "type": "string"<br>\n' +
        '}]\n' +
        '            </div>\n' +
        '            <div><pre><xmp><?xml version="1.0" encoding="utf-8"?>\n' +
        '<node key="1name" value="默认内容" description="名称" disabled="1" type="string">\n' +
        '    <item>\n' +
        '        <node key="2name" value="默认内容" description="名称" disabled="1" type="string"></node>\n' +
        '        <node key="3name" value="默认内容" description="名称" disabled="1" type="string"></node>\n' +
        '        <node key="4name" value="默认内容" description="名称" disabled="1" type="string"></node>\n' +
        '    </item>\n' +
        '</node></xmp></pre></div>\n' +
        '        </div>\n' +
        '        <i class="bi bi-clone"></i>\n' +
        '    </div>\n' +
        '</div>');
});