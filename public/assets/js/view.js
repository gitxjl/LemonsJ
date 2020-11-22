const _METHOD = ["GET", "POST", "PUT", "PATCH", "DELETE", "COPY", "HEAD", "OPTIONS", "LINK", "UNLINK", "PURGE", "LOCK", "UNLOCK", "PROPFIND", "VIEW", "FILE"];
var _id = getQueryVariable('id');
var _file = getQueryVariable('f');
var _type = getQueryVariable('t');
if (!_id && _file) {
    $.getJSON('http://api.lemonsj.com/' + _file, function (d) {
        sFileView(_type,d);
        set_ToC_arr();
        setViewDefaultCurl();
        set_table();
        set_pre();
    });
}

function sFileView(_t,_d) {
    switch (parseInt(_t)) {
        case 4:
            return sPostmanView(_d);
        case 5:
            return sSwaggerView(_d);
        default :
            return sFileViewDefault(_d);
    }
}
function sPostmanView(_d) {
    var view = $('#view');
    view.html('');
    _d.name && view.append('<h1><a name="' + _d.name + '" class="reference-link"></a><span class="view-title">' + _d.name + '</span></h1>');
    var request = _d.request;
    var response = _d.response || '';
    if (request) {
        request.method && view.append('<pre class="url-method"><a name="URL" class="reference-link"></a><m class="' + request.method + '">' + request.method.toUpperCase() + '</m><span class="view-title">' + (request.url.raw || '') + '</span></pre>');


        request.description && view.append('<h3><a name="简要描述" class="reference-link"></a>简要描述</h3>\n' +
            '    <ul><li><span class="view-intro">' + (request.description || '') + '</span></li></ul>');

        request.header && view.append(viewTable(request.header, 'Header', true));
        request.url.query && view.append(viewTable(request.url.query, 'Params'));
        request.body && request.body.mode == 'formdata' && request.body.formdata.length && view.append(viewTable(request.body.formdata, 'Body - ' + request.body.mode));
        request.body && request.body.mode == 'graphql' && view.append(viewTableGraphql(request.body.graphql, 'Body - ' + request.body.mode));

    }
    response.length && postmanResponseView(response);
}
function sSwaggerView(_d) {
    var view = $('#view');
    view.html('');
    var info = _d.info;
    var tags = _d.tags;
    if (info){
        _d.info.title && view.append('<h1><a name="' + _d.info.title + '" class="reference-link"></a><span class="view-title">' + _d.info.title + '</span><small>'+_d.info.version+'</small></h1><small class="base-url">[&nbsp;Base URL:&nbsp;&nbsp;'+_d.host+_d.basePath+'&nbsp;]</small>');
        _d.info.description && view.append('<p>' + (_d.info.description || '') + '</p>');
        _d.info.version && view.append('<a href="'+_d.info.termsOfService+'" target="_blank" name="Terms of service" class="reference-link">Terms of service</a><br>');
        _d.info.contact && _d.info.contact.email && view.append('<a href="'+_d.info.contact.email+'" target="_blank" name="Contact the developer" class="reference-link">Contact the developer</a><br>');
        _d.info.license && _d.info.license.name && view.append('<a href="'+_d.info.license.url+'" target="_blank" name="'+_d.info.license.name+'" class="reference-link">'+_d.info.license.name+'</a><br>');
        _d.externalDocs && _d.externalDocs.description && view.append('<a href="'+_d.externalDocs.url+'" target="_blank" name="'+_d.externalDocs.description+'" class="reference-link">'+_d.externalDocs.description+'</a><br>');
        _d.schemes && view.append('<br><p><a name="Schemes" class="reference-link"></a><strong>Schemes:</strong>'+_d.schemes.join(',')+'</p>');
        _d.swagger && view.append('<p><a name="Swagger" class="reference-link"></a><strong>Swagger:</strong>'+_d.swagger+'</p>');

        _d.securityDefinitions && view.append('<h3><a name="Security Definitions" class="reference-link"></a>Security Definitions</h3>\n' +
            '<pre>' + JSON.stringify(_d.securityDefinitions) + '</pre>');
    }

    if (tags){
        _d.summary && view.append('<h1><a name="' + _d.summary + '" class="reference-link"></a><span class="view-title">' + _d.summary + '</span></h1>');
        (_d.description || _d.operationId) && view.append('<small class="base-url">[&nbsp;'+_d.description+_d.operationId+'&nbsp;]</small>');
        _d.url && view.append('<pre class="url-method"><a name="' + _d.url + '" class="reference-link"></a><m class="' + _d.method + '">' + _d.method.toUpperCase() + '</m><span class="view-title">' + _d.url + '</span></pre>');
        _d.consumes && view.append(viewTable([{key:'Content-Type',value:_d.consumes,disabled:true}], 'Header', true));

        var d = {};
        $.each(_d.parameters,function (k,v) {
            v['key'] = v.name;
            v['disabled'] = v.required;
            v['type'] = v.type + (v.format?'('+v.format+')':'');
            var vin = '';
            try{
                vin = v.in;
            }catch (e) {}
            if (d[vin] && d[vin].length) {
                d[vin].push(v);
            }else {
                d[vin] =[v];
            }
        });

        $.each(d,function (k,v) {
            view.append(viewTable(v, firstLetterToUpper(k)));
        });

        _d.responses && view.append(viewTableResponses(_d.responses));

    }
}
function sFileViewDefault(_d) {
}

if (_id && !_file) {
    ajaxs({
        type: "GET",
        url: "doc/" + _id,
        success: function (result) {
            if (result.code == 200) {
                setFormData(result.data);
            }
        }
    });
}

function postmanResponseView(d) {
    var view = $('#view');
    view.append('<h2 class="response"><a name="Response" class="reference-link"></a>Response</h2>');
    $.each(d, function (k, v) {
        view.append('<div class="response-d"><h3 class="response-h-' + k + '"><a name="' + v.name + '" class="reference-link"></a>' + v.name + '<i class="bi bi-plus" title="展开/折叠"></i></h3>' +
            '<b class="response-body">response body:</b><pre class="response-view response-body">' + JSON.stringify(v.body) + '</pre>' +
            '<pre class="response-view response-all hidden response-all-' + k + '">' + JSON.stringify(v) + '</pre>' +
            '<p><i class="bi bi-plus" title="展开/折叠"></i></p></div>');
    });

}

function viewTableGraphql(d, n = '', hi = false) {
    if (!d.query && !d.variables ) return '';
    var h = '';
    h += '<div class="view-table-' + n + '">';
    h += '<h3 class="view-table view-table-' + n + '"><a name="' + n + '" class="reference-link"></a>' + n + '' + (hi ? '<i class="bi bi-plus" title="展开/折叠"></i>' : '<i class="bi bi-plus bi-dash" title="折叠/展开"></i>') + '</h3>';
    h += '<table class="sTable ' + (hi ? 'hidden' : '') + '" h="' + (hi ? 1 : 0) + '">';
    h += '<thead><tr><th>查询(query)</th><th>变量(variables)</th><th>操作名称(operationName)</th></tr></thead>';
    h += '<tbody>';
    h += '<tr><td>' + d.query + '</td><td>' + d.variables + '</td><td>' + (d.operationName || '') + '</td></tr>';
    h += '</tbody>';
    h += '</table>';
    h += '</div>';
    return h;
}

function viewTableResponses(d) {

    var h = '';
    h += '<div class="view-table-Responses">';
    h += '<h3 class="view-table view-table-Responses"><a name="Responses" class="reference-link"></a>Responses</h3>';
    h += '<table class="skip">';
    h += '<thead><tr><th>Code</th><th>Description</th></tr></thead>';
    h += '<tbody>';


    $.each(d,function (k,v) {
        h += '<tr><td>' + k + '</td><td>' + (v.description || '') + '' + schema(v) +  responsesHeaders(v.headers) + '</td></tr>';
    });

    h += '</tbody>';
    h += '</table>';
    h += '</div>';
    return h;
}

function schema(v) {
    var d = gSchemaDatas(v.schema);
    var jd = JSON.stringify(d);
    return jd.length>2 ?'<pre>' + jd + '</pre>':'';
}
function gSchemaDatas(d) {
    var _d = {};
    if (d && $.inArray('type',d) && d['type'] == 'object'){
        _d = d;
        return _d;
    }

    var vt = typeof d;
    vt!='string' && $.each(d,function (k,v) {
        if (k == 'properties') {
            _d = v;
        }else {
            var vt = typeof v;
            vt!='string'?_d = gSchemaDatas(v):'';
        }
    });
    return _d;
}
function schemaType(t) {
    if (t=='integer') return 0;
    return t;
}
function isSchemaType(t) {
    if (t=='type' || t=='object' || t=='integer' || t=='int32' || t=='int64' || t=='string' ||  t=='format') return false;
    return true;
}
function schemaDatas(d) {
    var schemaDatas = schemaData(d);
    if ($.inArray('properties',schemaDatas)) {
        schemaDatas = schemaDatas['properties'];
    }
    return JSON.stringify(schemaDatas);
}
function schemaData(d) {
    var _d = {};

    $.each(d,function (k,v) {
        if ($.inArray('type',v)){
            _d[k] = schemaType(v.type)
        }
        try{
            var vT = typeof v;
        vT == 'object' && $.each(v,function (_k,_v) {
                if (isSchemaType(_k)){
                    _d[_k] = schemaData(_v);
                }
            });
        }catch (e) {}
    });
    return _d;
}

function responsesHeaders(d, n = '', hi = false) {
    if (!d)return '';
    var h = '';
    h += '<div class="view-table-Headers">';
    h += '<h4 class="view-table view-table-Headers">Headers:</h4>';
    h += '<table class="sTable ' + (hi ? 'hidden' : '') + '" h="' + (hi ? 1 : 0) + '">';
    h += '<thead><tr><th>Name</th><th>Description</th><th>Type</th></tr></thead>';
    h += '<tbody>';
    $.each(d, function (k, v) {
        h += '<tr><td>' + k + '</td><td>' + (v.description || '') + '</td><td>' + (v.type||'') + '</td></tr>';
    });
    h += '</tbody>';
    h += '</table>';
    h += '</div>';
    return h;
}

function viewTable(d, n = '', hi = false) {
    var h = '';
    h += '<div class="view-table-' + n + '">';
    h += '<h3 class="view-table view-table-' + n + '"><a name="' + n + '" class="reference-link"></a>' + n + '' + (hi ? '<i class="bi bi-plus" title="展开/折叠"></i>' : '<i class="bi bi-plus bi-dash" title="折叠/展开"></i>') + '</h3>';
    h += '<table class="sTable ' + (hi ? 'hidden' : '') + '" h="' + (hi ? 1 : 0) + '">';
    h += '<thead><tr><th>参数名</th><th>必选</th><th>类型</th><th>示例</th><th>说明</th></tr></thead>';
    h += '<tbody>';
    $.each(d, function (k, v) {
        h += '<tr><td>' + v.key + '</td><td>' + (v.disabled ? '是' : '否') + '</td><td>' + (v.type ? v.type : 'string') + '</td><td>' + (v.value||'') + '</td><td>' + (v.description || '') + '</td></tr>';
    });
    h += '</tbody>';
    h += '</table>';
    h += '</div>';
    return h;
}

function setFormData(d) {
    switch (parseInt(d.type)) {
        case 2:
            return setViewMarkdown(d);
        default :
            return setViewDefault(d);
    }
}

function setViewDefault(d) {
    var view = $('#view');
    view.html('');
    d.name && view.append('<h1><a name="' + d.name + '" class="reference-link"></a><span class="view-title">' + d.name + '</span></h1>');
    try {
        var cd = JSON.parse(d.content);
        cd.method && view.append('<h3><a name="请求URL"></a>请求URL</h3>\n' +
            '    <ul><li><code><span class="view-method">' + cd.method + '</span></code> <code><span class="view-url">' + (cd.url || '') + '</span></code></li></ul>');
        cd.intro && view.append('<h3><a name="简要描述" class="reference-link"></a>简要描述</h3>\n' +
            '    <ul><li><span class="view-intro">' + cd.intro + '</span></li></ul>');

        if (cd.parameter) {
            var h = '';
            $.each(cd.parameter, function (k, v) {
                $.each(v, function (_k, _v) {
                    if (_k == 'type') return true;
                    h += '<div class="view-table-' + _k + '">';
                    h += '<h3 class="view-table view-table-' + _k + '"><a name="' + _k + '" class="reference-link"></a>' + _k + '</h3>';
                    h += '<table>';
                    h += '<thead><tr><th>参数名</th><th>必选</th><th>类型</th><th>示例</th><th>说明</th></tr></thead>';
                    h += '<tbody>';
                    h += setViewDefaultTrtd(_v);
                    h += '</tbody>';
                    h += '</table>';
                    h += '</div>';
                });
            });
            view.append(h);
        }
        (cd.response || cd.content) && view.append('<h3><a name="返回示例" class="reference-link"></a>返回示例</h3>\n' +
            '<pre>' + (cd.response || cd.content) + '</pre>');

    } catch (e) {
    }

    set_ToC_arr();
    setViewDefaultCurl();
    set_table();
}

function setViewDefaultTrtd(d) {
    var h = '';
    $.each(d, function (k, v) {
        h += '<tr><td>' + v.key + '</td><td>' + (v.disabled ? '是' : '否') + '</td><td>' + v.type + '</td><td>' + v.value + '</td><td>' + v.description + '</td></tr>';
    });
    return h;
}

function setViewMarkdown(d) {
    setEditormd(d.content);
}

$('.nav').tabs({
    tab: '.nav>li',
    content: '.tab-content>div',
});

$(".markdown-body p").each(function () {
    if ($(this).has("code")) {
        $(this).css("padding-left", "20px");
        $(this).find("code").css("margin-left", "0px");
    }
});
$(".markdown-body pre").each(function () {
    if ($(this).prev("h5")) {
        $(this).css("margin-left", "20px");
    }
});

function set_pre() {
    $('#view pre').each(function () {
        try {
            var pre = eval('(' + $(this).text() + ')');
            var options = {
                collapsed: 0,
                withQuotes: 1
            };
            $(this).jsonViewer(pre, options);
        }
        catch (e) {
        }
    });
}

function set_table(table = '') {
    var _table = table || $(".markdown-body table.sTable");
    _table.each(function () {
        var _this = $(this);
        if ((_table.attr('init') == 2 && parseInt(_this.find('th').eq(0).css('width')) != 0) || parseInt(_this.find('th').eq(0).css('width')) == 0) return true;
        var _this_width = _this.width();
        var _thLen = _this.find("thead > tr > th").length;

        var width = [];
        for (var i = 0; i < _thLen; i++) {
            width["w_" + i] = 0;
        }
        var _init_w = 25;
        var _init_tw = 15;
        _this.find("tr").each(function (k, y) {
            var w = 0;
            var tw = 0;
            if ($(this).find("th").eq(0) && k === 0) {
                for (var i = 0; i < _thLen; i++) {
                    w = $(this).find("th").eq(i).width();

                    if (width["w_" + i] < w) {
                        width["w_" + i] = w;
                    }
                    tw = $(this).find("th").eq(i).text().length;
                    if (width["w_" + i] == 0 && tw > 0) {
                        width["w_" + i] = tw * _init_tw;
                    }
                }
            } else {
                var four = 0;
                for (var i = 0; i < _thLen; i++) {
                    w = $(this).find("td").eq(i).width();
                    tw = $(this).find("td").eq(i).text().length;
                    if (width["w_" + i] < w) {
                        width["w_" + i] = w;
                        if (i == 4) four = w;
                    } else if (width["w_" + i] < tw * _init_tw) {
                        width["w_" + i] = tw * (i == 0 && tw > 10 ? 8 : _init_tw);
                        if (i == 4) four = tw * (tw > 10 ? 10 : _init_tw);
                    }
                    if (i == 4 && four < 0) {
                        $(this).closest('table').find("thead > tr > th").eq(4).hide();
                        $(this).find("td").eq(4).hide();
                    }
                }
            }
        });

        gw = 200;
        _this.find("tr").each(function (k, y) {
            __tw = 0;
            _tw = _this_width;
            for (var i = 0; i < _thLen; i++) {
                if (i >= 4 && _thLen - 1 == i) {
                    if (_tw > 0) {
                        __tw = (_tw - 13 * _thLen);
                        $(this).find("td").eq(i).width(__tw);
                    }
                    continue
                }
                var _w = width["w_" + i] + _init_w;
                if (_w > $(this).width()) _w = $(this).width();
                if (i >= 4 && _w > gw) {
                    _tw = _tw - gw - _init_w;
                    $(this).find("th").eq(i).width(gw);
                    $(this).find("td").eq(i).width(gw);
                    continue
                }
                $(this).find("th").eq(i).width(_w);
                $(this).find("td").eq(i).width(_w);
                _tw = _tw - _w - _init_w;
            }
        });
        if (_this.attr('init') == ''){
            _this.attr('init',1);
        }else if (_table.attr('init') == 1){
            _this.attr('init',2);
        }else {
            _this.attr('init',1);
        }
    });
}


$(document).on('click', '#view .response-d .bi-plus', function () {
    var _this = $(this);
    var d = _this.closest('.response-d').find('.response-all');
    var b = _this.closest('.response-d').find('.response-body');
    var i = _this.closest('.response-d').find('.bi');
    if (d.length <= 0) return false;

    if (i.hasClass('bi-dash')) {
        d.slideToggle(200);
        i.removeClass('bi-dash');
        _this.closest('.response-d').find('p>.bi').hide();
        b.show();
    } else {
        d.slideDown(200);
        i.addClass('bi-dash').show();
        b.hide();
    }
});

$(document).on('click', '#view .view-table > i', function () {
    var _this = $(this);
    var h = _this.closest('.view-table');
    var table = h.next('table');
    if (table.length <= 0) return false;

    if (_this.hasClass('bi-dash')) {
        table.slideUp(200);
        _this.removeClass('bi-dash');
    } else {
        table.slideDown(200);
        _this.addClass('bi-dash');
        table.attr('h') == 1 && set_table(table) && table.attr('h', 0);
    }
});

$(document).on('click', '#curl .bi-clone', function () {
    var _t = $(this);
    var str = _t.parent('#curl').children('p').text();
    var flag = copyText(str);
    hint(flag ? "已复制" : "复制失败！");
});


function find_doc_data2(_doc, classN) {
    var _d = [];
    if (_doc.find(classN).find('table tbody tr').length <= 0) return;
    _doc.find(classN).find('table tbody tr').each(function () {
        var _t = $(this);
        var _n = _t.find('td').eq(0).text();
        var _v = _t.find('td').eq(_t.find('td').length - 1).text();
        _d.push({
            'key': _n,
            'val': _v,
        });
    });
    return _d;
}

function setViewDefaultCurl() {
    var _doc = $('#view');
    var _h = _doc.html();

    if (!isNotNull(_h)) return;

    var _m = find_doc_method(_h);
    var _u = find_doc_url(_h);
    !isNotNull(_u) && (_u = find_doc_url2());
    var _hd = find_doc_data2(_doc, '.view-table-Headers');
    var _pd = find_doc_data2(_doc, '.view-table-Params');
    var _bd = find_doc_data2(_doc, '.view-table-Body');
    var _c = '';

    if (isNotNull(_pd)) {
        $.each(_pd, function (k, v) {
            _u = changeURLArg(_u, v.key, v.val);
        });
    }
    _c += 'curl "' + _u + '" -X ' + _m + ' ';
    $.each(_hd, function (k, v) {
        _c += ' -H "' + v.key + ':' + v.val + '" ';
    });
    $.each(_bd, function (k, v) {
        _c += ' -d "' + v.key + ':' + v.val + '" ';
    });

    _c += find_doc_pre(_doc);

    $('#curl').children('p').html(_c);
    $('#curl .fa').show();
}

function set_html_curl() {
    var _doc = $('#view');
    var _h = _doc.html();

    if (!isNotNull(_h)) return;

    var _m = find_doc_method(_h);
    var _u = find_doc_url(_h);
    var _d = find_doc_data(_doc);
    var _c = '';

    if (_m == 'GET') {
        if (isNotNull(_d)) {
            $.each(_d, function (k, v) {
                _u = changeURLArg(_u, v.key, v.val);
            });
        }
        _c += 'curl "' + _u + '" -X ' + _m + ' ';
        _c += find_doc_pre(_doc);
    } else {
        _c += 'curl "' + _u + '" -X ' + _m + ' ';

        $.each(_d, function (k, v) {
            _c += ' -d "' + v.key + ':' + v.val + '" ';
        });
        _c += find_doc_pre(_doc);
    }

    $('#curl').children('p').html(_c);
    $('#curl .fa').show();
}

function find_doc_data(_doc) {
    var _d = [];
    if (_doc.find('table tbody tr').length <= 0) return;
    _doc.find('table tbody tr').each(function () {
        var _t = $(this);
        var _n = _t.find('td').eq(0).text();
        var _v = _t.find('td').eq(_t.find('td').length - 1).text();
        _d.push({
            'key': _n,
            'val': _v,
        });
    });
    return _d;
}

function find_doc_method(_h) {
    var _m = _METHOD[0];
    $(_METHOD).each(function (k, v) {
        if (_h.indexOf(v) > -1) {
            _m = v;
        }
    });
    return _m;
}

function find_doc_url2(_h) {
    if ($('pre.url-method').length <= 0) return '';
    return $('pre.url-method .view-title').text();
}

function find_doc_url(_h) {
    if ($('.view-url').length > 0) return $('.view-url').text();
    var source = (_h || '').toString();
    var urlArray = [];
    var matchArray;
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;
    while ((matchArray = regexToken.exec(source)) !== null) {
        return matchArray[0];
    }
    return urlArray;
}

function find_doc_pre(_doc) {
    var _c = '';
    var _p = _doc.find('pre').text();
    if (isNotNull(_p)) {
        try {
            JSON.parse(_p);
            _c += ' -H "Content-Type: application/json" ' + " --data '" + _p + "' ";
        } catch (e) {
            _c += ' -H "Content-Type: text/plain" ' + " --data '" + html_encode(_p) + "' ";
        }
    }
    return _c;
}

function html_encode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, ">");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, " ");
    s = s.replace(/\'/g, "'");
    s = s.replace(/\n/g, "<br>");
    s = s.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    return s;
}

function show_table_html() {
    var _this = $('#doc-content');
    var _curl = $('#curl');
    var _d = _this.text();
    var _h = '', _c = '';
    try {
        _d = JSON.parse(_d);

        if (isNotNull(_d.url)) {
            _h += '<h3>请求URL</h3><ul><li><code>' + _d.method + '</code>    <code>' + _d.url + '</code></li></ul>';

            if (isNotNull(_d.params)) {
                _d.url = set_url_param(_d.url, _d.params)
            }
            _c += 'curl "' + _d.url + '" -X ' + _d.method + ' ';
        }

        if (isNotNull(_d.name)) {
            _c += ' -H "Document-Title:' + html_encode_01(r_comment(_d.name)) + '" ';
        }
        if (isNotNull(_d.intro)) {
            _h += '<h3>简要描述</h3><ul><li>' + _d.intro + '</li></ul>';
            _c += ' -description "' + html_encode_01(r_comment(_d.intro)) + '"';
        }
        if (isNotNull(_d.headers)) {
            _h += get_table_html(_d.headers, 'Headers');
            _c += get_curl_param(_d.headers, '-H');
        }
        if (isNotNull(_d.params)) {
            _h += get_table_html(_d.params, 'Params');
        }
        if (isNotNull(_d.body)) {
            _h += get_table_html(_d.body, 'Body');
            _c += get_curl_param(_d.body, '-d', '=', 1);
        }
        if (isNotNull(_d.response)) {
            _h += '<h3>Response</h3><div class="text-content"><i class="bi bi-clone" title="复制"></i><pre>' + html_encode_01(r_comment(_d.response)) + '</pre></div>';
            _c += ' -response "' + html_encode_01(r_comment(_d.response)) + '"';
        }

        _curl.children('p').html(_c);
        $('#view').append(_h);
        $('#curl .fa').show();
        _this.remove();
    } catch (e) {
        $('#view').append(_d);
    }
}

function get_curl_param(_d, _t, _f, _i = 0) {
    var _h = '';
    try {
        var __d = JSON.parse(_d);
        _h += get_curl_param_t(__d, _t, _f, _i)
    } catch (e) {
        try {
            JSON.parse(_d);
            _h = '-H "Content-Type: application/json" ';
            _h += "--data '" + _d + "'";
        } catch (e) {
            _h = '-H "Content-Type: text/plain" ';
            _h += "--data '" + html_encode(r_comment(_d)) + "'";
        }
    }
    return _h;
}

function get_curl_param_t(_d, _t, _f = ':', _i) {
    var _h = '';
    $.each(_d, function (key, val) {
        if (!isNotNull(val.key)) $.error('null');
        $.each(val, function (k, v) {
            if ($.isArray(v)) {
                if (_i == 1) $.error('null');
                _h += get_curl_param_t(v, _t, _f);
            } else {
                _h += _t + ' "' + k + _f + '' + v + '" ';
            }
        });
    });

    return _h;
}

function get_table_html(_d, _n) {
    var _h = '';
    try {
        var __d = JSON.parse(_d);
        _h += '<h3>' + _n + '</h3>';
        _h += '<table><thead><tr><th>参数名</th><th>必选</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>';
        _h += get_table_tbody_tr(__d);
        _h += '</tbody></table>';
    } catch (e) {
        _h = '';
        _h += '<h3>' + _n + '</h3>';
        try {
            JSON.parse(_d);
            _h += '<div class="text-content"><i class="bi bi-clone" title="复制"></i><pre>' + _d + '</pre></div>';
        } catch (e) {
            _h += '<div class="text-content"><i class="bi bi-clone" title="复制"></i><pre>' + html_encode_01(r_comment(_d)) + '</pre></div>';
        }
    }
    return _h;
}

function get_table_tbody_tr(_d, _l = 0) {
    var _h = '';
    $.each(_d, function (key, val) {
        if (!isNotNull(val.key)) $.error('null');
        var _i = 0;
        _h += '<tr>';
        $.each(val, function (k, v) {
            if ($.isArray(v)) {
                _h += get_table_tbody_tr(v, _l + 1);
            } else {
                _h += '<td>';
                if (_i == 0 && _l > 0) {
                    _h += times('&nbsp;', _l * 6);
                }
                _h += v + '</td>';
            }
            _i++;
        });
        _h += '</tr>';
    });

    return _h;
}

function set_ToC_arr() {
    var html = "";
    var lastLevel = 0;
    var startLevel = 1;
    html = "<ul>";
    if ($('#view :header').length <= 3) {
        $('#sidebar-toc ul.nav li:first').remove();
        $('#sidebar-toc #toc').remove();
        $('#sidebar-toc ul.nav li:first').click();
        return false;
    }
    $('#view :header').each(function (k, v) {

        var _t = $(this);
        var _c = 'header_' + k;
        _t.addClass(_c);

        switch (v.tagName) {
            case 'H1':
                level = 1;
                break;
            case 'H2':
                level = 2;
                break;
            case 'H3':
                level = 3;
                break;
            case 'H4':
                level = 4;
                break;
            case 'H5':
                level = 5;
                break;
            case 'H6':
                level = 6;
                break;
            case 'H7':
                level = 7;
                break;
        }

        var text = v.textContent;

        if (level < startLevel) {
            return true;
        }

        if (level > lastLevel) {
            html += "";
        }
        else if (level < lastLevel) {
            html += (new Array(lastLevel - level + 2)).join("</ul></li>");
        }
        else {
            html += "</ul></li>";
        }
        html += "<li><a class=\"toc-level-" + level + "\" href=\"#" + text + "\" name=\"" + _c + "\" >" + text + "</a><ul>";
        lastLevel = level;
    });
    html += "<ul>";
    html.length > 0 && $('#sidebar-toc ul.nav li:first').show();
    html.length <= 0 && $('.doc-ToC').hide();
    $('.doc-ToC').html(html)
}

$("#view p").each(function () {
    if ($(this).has("code")) {
        $(this).css("padding-left", "20px");
        $(this).find("code").css("margin-left", "0px");
    }
});

$("#view pre").each(function () {
    if ($(this).prev("h5")) {
        $(this).css("margin-left", "20px");
    }
});

$("#view table").each(function () {
    _this = this;
    _this_width = $(_this).width();
    thlen = $(_this).find("thead").find("tr").find("th").length;
    width = [];
    for (var i = 0; i < thlen; i++) {
        width["w_" + i] = 0;
    }

    $(_this).find("tr").each(function (k, y) {
        w = 0;
        if ($(this).find("th").eq(0) && k === 0) {
            for (var i = 0; i < thlen; i++) {
                w = $(this).find("th").eq(i).width();

                if (width["w_" + i] < w) {
                    width["w_" + i] = w;
                }
            }
        } else {
            for (var i = 0; i < thlen; i++) {
                w = $(this).find("td").eq(i).width();

                if (width["w_" + i] < w) {
                    width["w_" + i] = w;
                }
            }
        }

    });

    gw = 200;
    $(_this).find("tr").each(function (k, y) {
        __tw = 0;
        _tw = _this_width;
        for (var i = 0; i < thlen; i++) {
            if (i >= 4 && thlen - 1 == i) {
                if (_tw > 0) {
                    __tw = (_tw - 13 * thlen);
                    $(this).find("td").eq(i).width(__tw);
                }
                continue
            }

            _w = width["w_" + i] + 20;

            if (i >= 4 && _w > gw) {
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