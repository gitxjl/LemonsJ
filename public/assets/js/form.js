$(document).on('click', '.fun', function () {
    f_special({
        c:$(this).attr('c'),
        i:$('input[name="id"]').val(),
        t:$('input[name="type"]').val(),
        n:$('input[name="name"]').val(),
        f:0,
        ic:0,
    });
});
function f_special(e) {
    try {
        special(e);
    } catch (_e) {
        window.parent.special(e);
    }
}

var _id = getQueryVariable('id');
var _copy = getQueryVariable('copy');

$('input[name="iid"]').val(storage('iid'));
!_copy && $('input[name="id"]').val(_id);
if (_id){
    ajaxs({
        type: "GET",
        url: "doc/"+_id,
        success: function (result) {
            if (result.code == 200) {
                setFormData(result.data)
            }
        }
    });
}
$('.form-pid').length > 0 && form_pid();
$('.form-tdl').length > 0 && form_tdl();
dialogSelectInit($('#doc-create'));
function form_tdl(){
    var _type = $('input[name="type"]').val();
    var _n = 'tdl'+_type;
    getData(_n, "tdl/"+_type, function (d) {
        $('.form-tdl .combobox-dl').html(catalogs_null()+menuList(d));
    });
}
function form_pid(){
    var _n = 'catalog'+storage('iid');
    getData(_n, "catalog/"+storage('iid'), function (d) {
        setFormComPid(d);
    });
}

function setFormComPid(d) {
    $('.form-pid .combobox-dl').html(catalogs_l()+menuForm(d));
    !isNotNull(storage('formpidhide')) && $('.form-pid .combobox-dl').find('dd').each(function (){
        if($(this).attr('f') == 0 || $(this).attr('f') == 2){
            $(this).remove();
        }
    });
    $('.form-pid .combobox-dl').find('dd i').each(function (){
        if($(this).hasClass('option')){
            $(this).remove();
        }
    });
}

function setFormData(d){
    setFormDataGeneral(d);
    switch (parseInt(d.type)){
        case 0:
            return setFormDataHtml(d);
        case 1:
            return setFormDataTable(d);
        case 2:
            return setFormDataMarkdown(d);
        case 3:
            return setFormDataCurl(d);
        default :
            return '';
    }
}
function setFormDataGeneral(d) {
    $('input[name="name"]').val(d.name);
    $('input[name="sort"]').val(d.sort);
    $('input[name="pid"]').val(d.pid);
    $('input[name="tdl"]').val(d.tdl);
    $('.is_tdl').text(d.tdl == 1?'取消模板并保存':'设为模板并保存');
    comboboxInit($('.form-pid'));
    $('body').attr('i',d.id).attr('t',d.type).attr('n',d.name).attr('f',d.form).attr('ic',0);
}
function setFormDataHtml(d) {
    sethtmlCode(d.content);
}
function setFormDataTable(d) {
    if (!isNotNull(d)) return false;
    var c = JSON.parse(d.content);
    $('input[name="url"]').val(c.url);
    $('input[name="method"]').val(c.method);
    $('textarea[name="intro"]').val(c.intro);
    $('textarea[name="response"]').val(c.response);
    comboboxInit2($('.form-url'));
    setTableData(c.parameter);
    function setTableData(d) {
        isTableData(d,'Headers',0);
        isTableData(d,'Params',1);
        isTableData(d,'Body',2);
        function isTableData(d,n,i='') {
            var param = {};
            var is = false;
            $.each(d, function (k,v) {
                $.each(v, function(_k,_v) {
                    if (_k == n) is=true;
                });
            });
            if (!is){
                param[n] = [{'key':9257}];
                if (i!==''){
                    var _d = d[i];
                    d[i] = param;
                    d.push(_d)
                }else {
                    d.push(param)
                }
            }
        }

        var h = '';
        $.each(d, function (k,v) {
            $.each(v, function(_k,_v) {
                if (_k == 'type') return true;
                h+='<div class="doc-table table-parameter doc-table-'+_k+'">\n' +
                    '<div class="header">\n' +
                    '<div class="title">'+_k+'</div>\n' +
                    '<div class="edit" flag="1" err="1" title="Key-Value Edit / Bulk Edit or Raw：yaml、json、xml格式 " type=""><span class="sb sb-bulk" type="0">Bulk Edit</span></div>\n' +
                    '</div>\n' +
                    '<textarea class="bulk_edit" placeholder="yaml、json、xml格式" style="display: none"></textarea>' +
                    '<ul class="key_value_edit doc-table-ul"></ul>\n' +
                    '</div>';
            });
        });
        $('.parameter').html(h);

        $.each(d, function (k,v) {
            $.each(v, function(_k,_v) {
                set_table_data(v[_k],'.doc-table-'+_k);
            });
        });

    }
    comboboxInit2($('.form-type'));
    if ((c.method == 'GET' || c.method == 'get') && $('.doc-body').is(':visible')){
        $('.doc-body').hide();
    }

}
$(document).on('click','.form-tdl .combobox-box dd a', function () {
    var _type = $('input[name="type"]').val();
    var _dd = $(this).closest('dd');
    var _i = _dd.attr('i');
    ajaxs({
        type: "GET",
        url: "doc/"+_i,
        success: function (result) {
            if (result.code == 200) {
                setFormData(result.data)
            }
        }
    });
});
$(document).on('click','.form-url .combobox-box dd a', function () {
    var v = $(this).text().trim();
    if ((v == 'GET' || v == 'get') && $('.doc-body').is(':visible')){
        $('.doc-body').hide();
    }else if($('.doc-body').is(':hidden')){
        $('.doc-body').show();
    }
});
function setFormDataMarkdown(d) {
    markdownSetValue(d.content);
    $('.view-textarea').val(d.content);
}
function setFormDataCurl(d) {
    var c = JSON.parse(d.content);
    $('textarea[name="intro"]').val(c.intro);
    $('textarea[name="content"]').val(c.content);
}


$("form#doc-create").submit(function () {
    if (!itemState(1)) return false;
    var _data = formData($('input[name="type"]').val(),this);
    ajaxs({
        url: "doc",
        data:_data,
        success: function (result) {
            hint(result.msg);
            if (result.code == 200) {
                $('input[name="id"]').val(result.data.id);
                try{
                    window.parent.setTabName(result.data.id,$('input[name="name"]').val());
                }catch (e) {
                }
                try{
                    window.parent.sidebarMenuDocAdd({
                        id:result.data.id,
                        name:$('input[name="name"]').val(),
                        pid:$('input[name="pid"]').val(),
                        form:0,
                        param:1,
                        sort:$('input[name="sort"]').val(),
                        type:$('input[name="type"]').val(),
                    });
                }catch (e) {}
                if (!_id){

                }else {

                }
            }
        }
    });
    return false;
});
$("li.is_tdl").click(function () {
    var _tdl = $('input[name="tdl"]');
    var _v = 0;
    if (_tdl.val() == 0) {
        _v = 1;
        $(this).text('取消模板并保存');
    } else {
        _v = 0;
        $(this).text('设为模板并保存');
    }
    _tdl.val(_v);
    $("form#doc-create").submit();
});


function formDataTable(d) {
    d.content = {
        'method':d.method,
        'url':d.url,
        'intro':d.intro,
        'parameter':table_data(),
        'response':d.response,
        'content':d.content,
    };
    d.content = JSON.stringify(d.content);
    return d;
}
function formDataMarkdown(d) {
    d.content = d["editormd-markdown-doc"];
    return d;
}
function formDataCurl(d) {
    d.content = {'intro':d.intro,'content':d.content};
    d.content = JSON.stringify(d.content);
    return d;
}
function formData(type,_this){
    switch (parseInt(type)){
        case 1:
            return formDataTable($(_this).serializeJson());
        case 2:
            return formDataMarkdown($(_this).serializeJson());
        case 3:
            return formDataCurl($(_this).serializeJson());
        default :
            return $(_this).serialize();
    }
}