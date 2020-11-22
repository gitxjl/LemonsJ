const _METHOD = ["GET","POST","PUT","PATCH","DELETE","COPY","HEAD","OPTIONS","LINK","UNLINK","PURGE","LOCK","UNLOCK","PROPFIND","VIEW","FILE"] ;
var _ITEMS = '';
var _Member = '';
var _TEAMLIST = '';
var _W = 0;
var _MENU = '';
var _MemberTeam = '';
var _TeamMember = '';
var _M = $('body').attr("m");
var _DID = $('body').attr("did");
var _IID = $('body').attr("iid");
var _TID = $('body').attr("tid");
var _CSRF = $('meta[name="csrf-token"]').attr("content");
let _CE = [ "doc-select-search", "fa-fa-search"];

var _DI = [];
var _DTI = [];
const FL_ATM = {
    0 : {
        'n':'<i class="fa fa-user-o fa-com"><i class="fa fa-search fa-com4"></i></i>',
    },
    1 : {
        'n':'<i class="fa fa-user-o fa-com"><i class="fa fa-plus fa-com1"></i></i>',
    },
    2 : {
        'n':'<i class="fa fa-user-o fa-comc1"><i class="fa fa-user-o fa-com2"></i><i class="fa fa-plus fa-com3"></i></i>',
    }
};
const FL = {
    0 : {
        'n':'fa-item-add',
        'a':'.json,.yaml,.har',
    },
    5 : {
        'n':'fa-postman',
        'a':'.json',
    },
    6 : {
        'n':'fa-swagger',
        'a':'.json',
    },
    7 : {
        'n':'fa-open-api',
        'a':'.yaml,.json',
    },
    8 : {
        'n':'fa-yaml',
        'a':'.yaml,.json',
    },
    9 : {
        'n':'fa-header',
        'a':'.har',
    },
    10 : {
        'n':'fa-file-word-o',
        'a':'.doc,.docx',
    },
    11 : {
        'n':'fa-file-excel-o',
        'a':'.xls,.xlsx,.csv,.pdf',
    },
    12 : {
        'n':'fa-file-pdf-o',
        'a':'.pdf',
    }
};
let _s_sidebar_nav_key = 'sidebar_nav-tabs_li_a';
var _F = getQueryVariable('f');

var DocS = $('.doc-select');
var DocSS = $('.doc-select .doc-select-show');
var DocSSTFSB = $('.doc-select .doc-select-show .text .fa-step-backward');
var C_STEP = c_get('step');

if (DocSSTFSB.length > 0 && C_STEP == 1){
    DocSSTFSB.toggleClass('fa-step-forward');
    DocSSTFSB.toggleClass('fa-step-backward');
}else {
}

setSidebarNavTabs();
function setSidebarNavTabs() {
    var _s_sidebar_nav_val = c_get(_s_sidebar_nav_key);
    if (_s_sidebar_nav_val){
        $('#sidebar .nav-tabs li').each(function () {
            var _href = $(this).children('a').attr('href');
            if (_href == _s_sidebar_nav_val) {
                $(this).children('a').click();
                $(this).addClass('active');
            }
        });
    }
}

var _W = c_get('w');
if (_W > 300 && $('#left-component').length > 0) {
    $('#left-component').css('width',_W + 'px');
    $('#divider').css('left',_W + 'px');
    $('#right-component').css('left',_W + 'px');
}


if ($('.component-menu').length > 0) {
    /*目录数据*/
    $.get('/doc/catalog/'+_IID, function (_d) {
        set_menu(_d)
    });
}


$('#left-component .doc-select-show').hover(function () {
    $(this).find('.fa-refresh').addClass('fa-spin');
},function () {
    $(this).find('.fa-refresh').removeClass('fa-spin');
});


$(window).keydown(function(event){
    switch (event.which) {
        /*case(74): //J键
            break;
        case(75)://K键
            break;
        case(72)://H键
            break;
        case(76)://L键
            break;*/
        case(188):/*//Comma semicolon*/
            cma(false);
            break;
        case(190):/*//Period colon*/
            cma(true);
            break;
    }
});

function cma(_is){
    $('.cma').each(function (k,v) {
        if ($(this).hasClass('active')){
            var _k = _is ? k+1:k-1;
            var _href = $('.cma').eq(_k).attr('href');
            if (isNotNull(_href)){
                window.location.href = _href
            }
        }
    });
}

function set_html_curl() {
    var _doc = $('#view');
    var _h = _doc.html();

    if (!isNotNull(_h)) return;

    var _m = find_doc_method(_h);
    var _u = find_doc_rul(_h);
    var _d = find_doc_data(_doc);
    var _c = '';

    if (_m == 'GET'){
        if (isNotNull(_d)) {
            $.each(_d,function (k,v) {
                _u = changeURLArg(_u,v.key,v.val);
            });
        }
        _c += 'curl "' + _u + '" -X ' + _m + ' ';
        _c += find_doc_pre(_doc);
    }else {
        _c += 'curl "' + _u + '" -X ' + _m + ' ';

        $.each(_d,function (k,v) {
            _c += ' -d "' + v.key + ':' + v.val + '" ';
        });
        _c += find_doc_pre(_doc);
    }

    $('#curl').children('p').html(_c);
    $('#curl .fa').show();
}

function find_doc_pre(_doc) {
    var _c = '';
    var _p = _doc.find('pre').text();
    if (isNotNull(_p)) {
        try {
            JSON.parse(_p);
            _c += ' -H "Content-Type: application/json" ' + " --data '" + _p + "' ";
        }catch (e) {
            _c += ' -H "Content-Type: text/plain" ' + " --data '" + html_encode(_p) + "' ";
        }
    }
    return _c;
}

function find_doc_data(_doc) {
    var _d = [];
    if (_doc.find('table tbody tr').length <= 0) return;
    _doc.find('table tbody tr').each(function () {
        var _t = $(this);
        var _n = _t.find('td').eq(0).text();
        var _v = _t.find('td').eq(_t.find('td').length - 1).text();
        _d.push({
            'key':_n,
            'val':_v,
        });
    });
    return _d;
}

function find_doc_method(_h) {
    var _m = _METHOD[0];
    $(_METHOD).each(function (k,v) {
        if (_h.indexOf(v) > -1){
            _m = v;
        }
    });
    return _m;
}

function find_doc_rul(_h)
{
    var source = (_h || '').toString();
    var urlArray = [];
    var matchArray;
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        return matchArray[0];
        var token = matchArray[0];
        urlArray.push( token );
    }
    return urlArray;
}

String.prototype.removeLineEnd = function() {
    return this.replace(/(<.+?\s+?)(?:\n\s*?(.+?=".*?"))/g, '$1 $2')
};

function format_xml(text) {
    text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function($0, name, props) {
        return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
    }).replace(/>\s*?</g, ">\n<");

    text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function($0, text) {
        var ret = '<!--' + escape(text) + '-->';
        return ret;
    }).replace(/\r/g, '\n');

    var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
    var nodeStack = [];
    var output = text.replace(rgx, function($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
        var isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/') || (isFull1 == '/') || (isFull2 == '/');
        var prefix = '';
        if (isBegin == '!') {
            prefix = getPrefix(nodeStack.length);
        } else {
            if (isBegin != '/') {
                prefix = getPrefix(nodeStack.length);
                if (!isClosed) {
                    nodeStack.push(name);
                }
            } else {
                nodeStack.pop();
                prefix = getPrefix(nodeStack.length);
            }

        }
        var ret = '\n' + prefix + all;
        return ret;
    });

    var outputText = output.substring(1);

    outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function($0, prefix, text) {
        if (prefix.charAt(0) == '\r')
            prefix = prefix.substring(1);
        text = unescape(text).replace(/\r/g, '\n');
        var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
        return ret;
    });

    return outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
}

function getPrefix(prefixIndex) {
    var span = '    ';
    var output = [];
    for (var i = 0; i < prefixIndex; ++i) {
        output.push(span);
    }

    return output.join('');
}

function times(str, num){
    return num > 1 ? str += times(str, --num): str;
}

function in_array(key,arr){
    $(arr).each(function(k,v){
        if(v == key){
            return true;
        }
    });
    return false;
}
function is_array(arr,val){
    var testStr=','+arr.join(",")+",";
    return testStr.indexOf(","+val+",")!=-1;
}

if ($('.team-user-list').length > 0){
    teamUserList();
}
function teamUserList(){
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: 'GET',
        url: '/team/user/'+_TID,
        dataType: 'json',
        async : 'false',
        success: function(data){
            if (data){
                _TEAMLIST = data;
                var h="";
                $.each(data,function (k,v) {
                    var i = '<i class="fa fa-user-o person"></i>';
                    h += '<div class="team-list">'+i+
                        '<n>' + v.email + ' --- ' + v.name + '</n>\n' +
                        '<i class="fa fa-remove member-deleted" data-url="/team/user/del/'+v.id+'" data-fun="teamUserList" title="删除"></i>\n' +
                        '</div>';
                    _DI.push(v.uid)
                });
                $('.team-user-list').html(h);
                $('.items-fun-list').show();

            }else {
                $('.items-fun-list-c').show();
            }
        },
        error:function(){
            $('.items-fun-list-c').show();
            tips_msg("系统错误");
        }
    });
}

if ($('.team-team-list').length > 0){
    teamTeamList();
}
function teamTeamList(){
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: 'GET',
        url: '/team/list',
        dataType: 'json',
        async : 'false',
        success: function(data){
            if (data){
                _TEAMLIST = data;
                var h="";
                $.each(data,function (k,v) {
                    var _in = v.permission == 0 ? 'fa-user ':'fa-user-o ';
                    var p = v.permission == 0 ? '默认':'只读';
                    var i = '<i class="fa '+_in + ' fa-comc1"><i class="fa '+_in+' fa-com2"></i></i>';
                    var _i = v.type == 1 ? 0:v.tId;
                    var _l = [];
                    if (isNotNull(v.list)){
                        $.each(v.list,function (k,v) {
                            _l.push(v.id)
                        })
                    }
                    h += '<div class="team-list">'+i+
                        '<n>'+v.name+'</n>\n' +
                        '<n>--- '+v.m_count+'m </n> \n' +
                        '<i class="fa fa-remove member-deleted" data-url="/team/del/'+v.id+'" data-fun="teamTeamList" title="删除"></i>\n' +
                        '<i class="fa fa-edit"onclick="aTeam('+v.id+',\''+v.name+'\','+_l.join(",")+')" title="编辑"></i>\n' +
                        '</div>';
                });
                $('.team-team-list').html(h);
                $('.items-fun-list').show();
            }else {
                $('.items-fun-list-c').show();
            }
        },
        error:function(){
            $('.items-fun-list-c').show();
            tips_msg("系统错误");
        }
    });
}

if ($('.item-team-list').length > 0){
    itemMemberList();
}
function itemMemberList(){
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: 'GET',
        url: '/item/user/'+_IID,
        dataType: 'json',
        async : 'false',
        success: function(data){
            if (data){
                var h="";
                $.each(data,function (k,v) {
                    var _in = v.permission == 0 ? 'fa-user ':'fa-user-o ';
                    var _ine = v.permission == 0 ? 'entity-user ':'';
                    var p = v.permission == 0 ? '默认':'只读';
                    var i = v.type == 1 ? '<i class="fa '+_in+' person"></i>':'<i class="fa '+_in + _ine +' fa-comc1"><i class="fa '+_in+' fa-com2"></i></i>';
                    var n = v.type == 1 ? v.email:'<a href="/team/'+v.tId+'" title="'+v.tName+'-团队管理">'+v.tName+'</a> --- '+v.m_count+'m';
                    var _n = v.type == 1 ? v.email:v.tName;
                    var _i = v.type == 1 ? 0:v.tId;

                    if (v.type == 1){
                        _DI.push(v.id)
                    } else {
                        _DTI.push(v.tId)
                    }

                    h += '<div class="team-list">'+i+'<per>'+p+'</per>\n' +
                        ' <span>'+n+'</span>\n' +
                        '<i class="fa fa-remove member-deleted" data-url="/item/user/del/'+v.id+'" data-fun="itemMemberList" title="删除"></i>\n' +
                        '<i class="fa fa-edit" i="'+v.id+'" ti="'+_i+'" t="'+v.type+'" p="'+v.permission+'" n="'+_n+'" title="编辑"></i>\n' +
                        '</div>';
                });
                $('.item-team-list').html(h);
                $('.items-fun-list').show();
            }else {
                $('.items-fun-list-c').show();
            }
        },
        error:function(){
            $('.items-fun-list-c').show();
            tips_msg("系统错误");
        }
    });
}
function dateHMS() {
    var date = new Date();
    return date.getHours()+date.getSeconds()+date.getSeconds();
}

function aTeamUser(){
    var n = 'tips-aTeamUser'+ dateHMS();
    var _is = false;
    var _data = $('.add-team-user').attr('d');
    if (_TeamMember.length > 0){
        s_html(_TeamMember)
    }else {
        $.get('/team/mt', function (_d) {
            _d = teamMemberTeamFormat(_d);
            _TeamMember = _d;
            s_html(_d)
        });
    }

    function teamMemberTeamFormat(_d) {
        var h = '';
        try {
            $.each(_d,function (k,v) {
                if (isNotNull(v.list) || isNotNull(v.m_count) || v.m_count == 0){
                    h += '<li><a i="'+v.id+'"><m>'+v.m_count+'m</m><bg></bg><i class="fa fa-i fa-angle-down"></i><i class="fa fa-user-o fa-comc1"><i class="fa fa-user-o fa-com2"></i></i>'+ v.name + '</a><ul>';
                    $.each(v.list,function (_k,_v) {
                        h += '<li><a m="'+_v.id+'"><bg></bg><i class="fa fa-user-o"></i>'+ _v.email + '</a></li>';
                    });
                    h += '</ul></li>';
                } else {
                    h += '<li><a m="'+v.uid+'"><bg></bg><i class="fa fa-user-o"></i>'+ v.email + '</a></li>';
                }

            });
        }catch (e) {
            console.log('好友、团队：数据获取错误');
        }
        return h;
    }

    function s_html(_d) {
        $('.tips').remove();
        var _html = '<div class="tips tips-catalog '+n+'">\n' +
            '        <i class="fa fa-user-o fa-comc1" title="新增团队"><i class="fa fa-user-o fa-com2"></i><i class="fa fa-plus fa-com3"></i></i>\n' +
            '        <i class="fa fa-times" title="关闭&amp;取消"></i>\n' +
            '        <div class="mask"></div>\n' +
            '        <div class="box">\n' +
            '            <form id="'+n+'" method="POST">\n' +
            '                <input class="_token hide" name="_token" value="'+_CSRF+'">\n' +
            '                <input name="tid" type="hidden" value="'+_TID+'">\n' +
            '                <div class="doc-select-search-box">\n' +
            '                    <input name="ms" class="doc-select-search component-menu-search" type="text" placeholder="用户名、邮箱">\n' +
            '                    <i class="fa fa-search" title="搜索"></i>\n' +
            '                </div>\n'+
            '                <div class="doc-select">\n' +
            '                    <input class="doc-select-input" name="mid" value="'+_data+'">\n' +
            '                    <div class="doc-select-show">\n' +
            '                        <span class="title">友仔：</span>\n' +
            '                        <span class="text">暂无选择</span><span class="caret"></span></div>\n' +
            '                    <div class="doc-select-box">\n' +
            '                        <div class="doc-select-search-box">\n' +
            '                            <input class="doc-select-search" type="text" placeholder="搜索 / Search">\n' +
            '                            <i class="fa fa-search"></i>\n' +
            '                        </div>\n' +
            '                        <div class="doc-select-ul-box">\n' +
            '                            <ul class="doc-select-ul multiple" data-type="2">\n' + _d +
            '                            </ul>\n' +
            '                            <tips><b>多选/ 取消：</b>逐个单击 / 按住左键移动选择</tips>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <button class="but-a" type="submit">提交</button>\n' +
            '            </form>\n' +
            '        </div>\n' +
            '    </div>';
        $('body').prepend(_html);
        init_select();
        var _d = $('.'+n+' .doc-select .doc-select-input').val()
        $('.'+n).find('.doc-select-ul li').each(function () {
            var _ist = isNotNull($(this).children('a').attr('t'));
            var _lam = $(this).children('a').attr('m');
            var _ism = isNotNull(_lam);
            var _isi = isNotNull($(this).children('a').attr('i'));

            if (_ist || _isi){
                $(this).remove();
            }
            if (_ism && $.inArray(_lam,_DI)){
                $(this).children('a').addClass('active-s');
            }
        });
        setMH($('.'+n).find('.multiple'));
    }

    $(document).on('submit','#'+n,function() {
        if (!_is){
            tname = $('.'+n+' .name').val();
            if (!tname){
                tips_msg("请输入团队名");
                return false;
            }
            _is = true;
            tips_msg('稍等...',6000);
            var _data = new FormData($("#"+n)[0]);
            $.ajax({
                type:'post',
                url:"/team",
                data: _data,
                dataType:'json',
                // async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    tips_msg(data.msg);
                    if (data.code == 0){
                        teamTeamList();
                    }
                    _MemberTeam = '';
                    _TeamMember = '';
                },
                error:function(e){
                    hint(e);
                }
            });
            $('.'+n).remove();
            $('#'+n).remove();
        }

        return false;
    })
}
function aTeam(tid='',tn='',mid=''){
    var n = 'tips-aTeam'+ dateHMS();
    var _is = false;

    if (_TeamMember.length > 0){
        s_html(_TeamMember)
    }else {
        $.get('/team/mt', function (_d) {
            _d = teamMemberTeamFormat(_d);
            _TeamMember = _d;
            s_html(_d)
        });
    }

    function teamMemberTeamFormat(_d) {
        var h = '';
        try {
            $.each(_d,function (k,v) {
                if (isNotNull(v.list) || isNotNull(v.m_count) || v.m_count == 0){
                    h += '<li><a i="'+v.id+'"><m>'+v.m_count+'m</m><bg></bg><i class="fa fa-i fa-angle-down"></i><i class="fa fa-user-o fa-comc1"><i class="fa fa-user-o fa-com2"></i></i>'+ v.name + '</a><ul>';
                    $.each(v.list,function (_k,_v) {
                        h += '<li><a m="'+_v.id+'"><bg></bg><i class="fa fa-user-o"></i>'+ _v.email + '</a></li>';
                    });
                    h += '</ul></li>';
                } else {
                    h += '<li><a m="'+v.uid+'"><bg></bg><i class="fa fa-user-o"></i>'+ v.email + '</a></li>';
                }

            });
        }catch (e) {
            console.log('好友、团队：数据获取错误');
        }
        return h;
    }

    function s_html(_d) {
        $('.tips').remove();

        var _html = '<div class="tips tips-catalog '+n+'">\n' +
            '        <i class="fa fa-user-o fa-comc1" title="新增团队"><i class="fa fa-user-o fa-com2"></i><i class="fa fa-plus fa-com3"></i></i>\n' +
            '        <i class="fa fa-times" title="关闭&amp;取消"></i>\n' +
            '        <div class="mask"></div>\n' +
            '        <div class="box">\n' +
            '            <form id="'+n+'" method="POST">\n' +
            '                <input class="_token hide" name="_token" value="'+_CSRF+'">\n' +
            '                <input class="name" name="name" value="'+tn+'" type="text" placeholder="新团队名称">\n' +
            '                <input name="tid" type="hidden" value="'+tid+'">\n' +
            '                <div class="doc-select">\n' +
            '                    <input class="doc-select-input" name="mid" value="'+mid+'">\n' +
            '                    <div class="doc-select-show">\n' +
            '                        <span class="title">友仔：</span>\n' +
            '                        <span class="text">暂无选择</span><span class="caret"></span></div>\n' +
            '                    <div class="doc-select-box">\n' +
            '                        <div class="doc-select-search-box">\n' +
            '                            <input class="doc-select-search" type="text" placeholder="搜索 / Search">\n' +
            '                            <i class="fa fa-search"></i>\n' +
            '                        </div>\n' +
            '                        <div class="doc-select-ul-box">\n' +
            '                            <ul class="doc-select-ul multiple" data-type="2">\n' + _d +
            '                            </ul>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <button class="but-a" type="submit">提交</button>\n' +
            '            </form>\n' +
            '        </div>\n' +
            '    </div>';
        $('body').prepend(_html);
        init_select();
        var _d = $('.'+n+' .doc-select .doc-select-input').val();
    }

    $(document).on('submit','#'+n,function() {
        if (!_is){
            tname = $('.'+n+' .name').val();
            if (!tname){
                tips_msg("请输入团队名");
                return false;
            }
            _is = true;
            tips_msg('稍等...',6000);
            var _data = new FormData($("#"+n)[0]);
            $.ajax({
                type:'post',
                url:"/team",
                data: _data,
                dataType:'json',
                // async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    tips_msg(data.msg);
                    if (data.code == 0){
                        teamTeamList();
                    }
                    _MemberTeam = '';
                    _TeamMember = '';
                },
                error:function(e){
                    hint(e);
                }
            });
            $('.'+n).remove();
            $('#'+n).remove();
        }

        return false;
    })
}
function aItemMembers(elem){
    var fsuffix = dateHMS();
    var n = 'tips-aItemMembers'+ fsuffix;
    var fn = 'form-aItemMembers'+ fsuffix;
    if(elem in FL_ATM){
        var _p = FL_ATM[elem]
        _p['t'] = elem;
    }else{
        return false;
    }

    var _is = false;

    if (_MemberTeam.length > 0){
        s_html(_MemberTeam)
    }else {
        $.get('/team/mt', function (_d) {
            _d = itemMemberTeamFormat(_d);
            _MemberTeam = _d;
            s_html(_d)
        });
    }

    function itemMemberTeamFormat(_d) {
        var h = '';
        try {
            $.each(_d,function (k,v) {
                var _t = isNotNull(v.m_type) || v.m_type == 0 ? true : false;
                var i = 'fa-user-o';
                var it = _t ? '友仔':'团队';
                if (_t){
                    h += '<li><a m="'+v.uid+'"><bg></bg><i class="fa ' + i + '" title="'+it+'"></i>'+ v.email + '</a></li>';
                }else {
                    h += '<li><a t="'+v.id+'"><m>'+v.m_count+'m</m><bg></bg><i class="fa ' + i + ' fa-comc1" title="'+it+'"><i class="fa ' + i + ' fa-com2"></i></i>'+ v.name + '</a></li>';
                }
            });
        }catch (e) {
            console.log('好友、团队：数据获取错误');
        }
        return h;
    }

    function s_html(_d) {
        $('.tips').remove();

        var tn = '友仔/团队';
        if (elem == 1) tn = '友仔/Friend';
        if (elem == 2) tn = '团队/Team';

        var _html = '<div class="tips '+n+'">\n' + _p.n +
            '        <i class="fa fa-times" title="关闭&amp;取消"></i>\n' +
            '        <div class="mask"></div>\n' +
            '        <div class="box">\n' +
            '            <form id="'+fn+'" method="POST">\n' +
            '                <input class="_token hide" name="_token" value="' + _CSRF + '">\n' +
            '                <input class="iid hide" name="iid" type="text" value="' + _IID + '">\n';
        if (elem == 0){
            _html += '<div class="doc-select-search-box">\n' +
                '                    <input name="ms" class="doc-select-search component-menu-search" type="text" placeholder="用户名、邮箱">\n' +
                '                    <i class="fa fa-search" title="搜索"></i>\n' +
                '                </div>\n';
        }
        _html += '                <div class="doc-select">\n' +
            '                    <input class="doc-select-input" name="mid" value="">\n' +
            '                    <input class="doc-select-input-t" name="tid" value="">\n' +
            '                    <div class="doc-select-show">\n' +
            '                        <span class="title">'+tn+'：</span>\n' +
            '                        <span class="text">暂无选择</span><span class="caret"></span></div>\n' +
            '                    <div class="doc-select-box">\n' +
            '                        <div class="doc-select-search-box">\n' +
            '                            <input class="doc-select-search" type="text" placeholder="搜索 / Search">\n' +
            '                            <i class="fa fa-search"></i>\n' +
            '                        </div>\n' +
            '                        <div class="doc-select-ul-box">\n' +
            '                            <ul class="doc-select-ul multiple" data-type="2">\n' + _d +
            '                            </ul>\n' +
            '                            <tips><b>多选/ 取消：</b>逐个单击 / 按住左键移动选择</tips>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="permission">\n' +
            '                    <label class="list_null" for="m-permission-default"><input class="list_null" id="m-permission-default" type="radio" name="permissions" value="0" checked="">默认<i class="fa fa-question-circle" title="新增/编辑/删除"></i></label>\n' +
            '                    <label class="list_null" for="m-permission-read"><input class="list_null" id="m-permission-read" type="radio" name="permissions" value="1">只读</label>\n' +
            '                </div>\n' +
            '                <button class="but-a" type="submit">提交</button>\n' +
            '            </form>\n' +
            '        </div>\n' +
            '    </div>';
        $('body').prepend(_html);

        $('.'+n).find('.doc-select-ul li').each(function () {
            var _lat = $(this).children('a').attr('t');
            var _lam = $(this).children('a').attr('m');
            var _ist = isNotNull(_lat);
            if (_ist && $.inArray(_lat,_DTI) || $.inArray(_lat,_DI)){
                $(this).children('a').addClass('active-s');
            }
            if (elem == 1 && _ist){
                $(this).remove();
            }
            if (elem == 2 && isNotNull(_lam)){
                $(this).remove();
            }
        });
        setMH($('.'+n).find('.multiple'));
        init_select();

    }

    $(document).on('submit','#'+fn,function() {
        if (!_is){
            _is = true;
            tips_msg('稍等...',6000);
            var _data = new FormData($("#"+fn)[0]);
            $.ajax({
                type:'post',
                url:"/item/team",
                data: _data,
                dataType:'json',
                // async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    tips_msg(data.msg);
                    if (data.code == 0){
                        itemMemberList();
                    }
                    _MemberTeam = '';
                },
                error:function(e){
                    hint(e);
                }
            });
            $('.'+n).remove();
            $('#'+n).remove();
        }

        return false;
    })
}

function doc_file_up_t(elem){
    var n = 'tips-upload'+dateHMS();
    if(elem in FL){
        var _p = FL[elem]
        _p['t'] = elem;
    }else{
        return false;
    }

    var _is = false;
    var _sort = $('.component-menu .mCSB_container').children('li').length;
    var _isi = false;

    if (_MENU.length > 0){
        s_html(_MENU)
    }else {
        $.get('/doc/catalog/'+_IID, function (_d) {
            _MENU = _d
            s_html(_d)
        });
    }

    function s_html(_d) {
        $('.tips').remove();
        if(_d.indexOf("data-id") < 0 && elem != 0 ) {
            tips_msg('暂无文档、目录信息');
            _d = '';
        }
        var _html = '<div class="tips tips-upload '+n+'">\n' +
            '    <i class="fa '+_p.n+'" title="文件上传"></i>\n' +
            '    <i class="fa fa-times" title="关闭"></i>\n' +
            '    <div class="mask"></div>\n' +
            '    <div class="box">\n' +
            '        <form id="'+n+'" method="POST" action="" enctype="multipart/form-data">\n' +
            '            <input class="_token hide" name="_token" value="' + _CSRF + '">\n' +
            '            <input class="iid hide" name="iid" type="text" value="' + _IID + '"/>\n' +
            '            <input class="type" name="type" type="hidden" value="'+_p.t+'">\n' +
            '            <input class="name" name="name" type="text" placeholder="文档名称，默认文件内名称">\n';
        if (elem == 0){
            _html += '            <div class="doc-select">\n' +
                '                <input class="doc-select-input" name="type" value="5">\n' +
                '                <div class="doc-select-show"><span class="title">类型：</span><span class="text">PostMan</span><span class="caret"></span></div>\n' +
                '                <div class="doc-select-box">\n' +
                '                    <ul class="doc-select-ul select-menu" data-type="1">\n' +
                '                        <li><a data-id="5" class=""><bg></bg><i class="fa fa-postman"></i>PostMan</a></li>\n' +
                '                        <li><a data-id="6" class=""><bg></bg><i class="fa fa-swagger"></i>Swagger 2</a></li>\n' +
                '                        <li><a data-id="7" class=""><bg></bg><i class="fa fa-open-api"></i>OpenApi 3</a></li>\n' +
                '                        <li><a data-id="8" class=""><bg></bg><i class="fa fa-yaml"></i>yaml</a></li>\n' +
                '                        <li><a data-id="9" class=""><bg></bg><i class="fa fa-header"></i>har 1.2</a></li>\n' +
                '                    </ul>\n' +
                '                </div>\n' +
                '            </div>\n'+
                '            <div class="file-upload-api">\n' +
                '                <input name="file" type="file" class="file-input" style="opacity: 0;display: contents;" accept="'+_p.a+'"/>\n' +
                '                <input type="text" class="file-text" placeholder="上传：'+_p.a+'格式文件" readonly="readonly">\n' +
                '                <i class="fa fa-upload"></i>\n' +
                '            </div>\n';
        }else {
            _html += '            <div class="file-upload-api">\n' +
                '                <input name="file" type="file" class="file-input" style="opacity: 0;display: contents;" accept="'+_p.a+'"/>\n' +
                '                <input type="text" class="file-text" placeholder="上传：'+_p.a+'格式文件" readonly="readonly">\n' +
                '                <i class="fa fa-upload"></i>\n' +
                '            </div>\n' +
                '            <div class="doc-select">\n' +
                '                <input class="doc-select-input" name="pid" value="0">\n' +
                '                <div class="doc-select-show"><span class="title">所属：</span><span class="text">一级目录</span><span class="caret"></span></div>\n' +
                '                <div class="doc-select-box">\n' +
                '                    <ul class="doc-select-ul select-menu" data-type="1">\n' +
                '                        <li><a data-id="-1" class=""><bg></bg>新项目</a></li>\n' +
                '                        <li><a data-id="0" class=""><bg></bg>一级目录</a></li>\n' + _d +
                '                    </ul>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '            <div class="doc-input-number">\n' +
                '                <span class="title">排序：</span>\n' +
                '                <i class="fa fa-minus"></i>\n' +
                '                <input type="number" class="sort" name="sort" value="'+_sort+'">\n' +
                '                <i class="fa fa-plus"></i>\n' +
                '            </div>\n';
        }
        _html += '    <button class="but-a" type="submit">提交</button>\n' +
            '        </form>\n' +
            '    </div>\n' +
            '</div>';
        $('body').prepend(_html);
        init_select();

        if ($("."+n+" .doc-select-ul").find('.file').length > 0){
            tips_msg('文件文档的子文档、子目录不展示和移动',6000,300);
            $("."+n+" .doc-select-ul").find('.file').remove();
        }
    }

    $(document).on('click', '.'+n+' .doc-select .doc-select-box a', function () {
        if (!_isi){
            var _s = $(this).next('ul').find('li').length;
            if (_s == 0){
                _s = _sort
            }
            $('.'+n+' .doc-input-number .sort').val(_s);
        }
    });

    $(document).on('input propertychange','.'+n+' .doc-input-number .sort', function(){
        _isi = true;
    });

    $(document).on('click','.'+n+' .file-text',function() {
        $(".file-input").click();
    });
    $(document).on('click','.'+n+' .fa-upload',function() {
        $(".file-input").click();
    });
    $(document).on('click','.'+n+' .file-input',function() {
        var file = $('.file-input').val();
        $('.file-text').val(file);
    });
    $(document).on('change','.'+n+' .file-input',function() {
        var file = $('.file-input').val();
        $('.file-text').val(file);
    });

    $(document).on('submit','#'+n,function() {
        if (!_is){
            _is = true;
            tips_msg('稍等...',6000);
            var pid = $(this).find('.doc-select-input').val();
            var _data = new FormData($("#"+n)[0]);
            $.ajax({
                type:'post',
                url:"/doc/file",
                data: _data,
                dataType:'json',
                // async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    tips_msg(data.msg);
                    if (data.code == 0){
                        if (pid < 0){
                            window.location.href = data.data;
                        } else {
                            set_menu(data.data);

                        }
                    }
                },
                error:function(e){
                    hint(e);
                }
            });
            $('.tips').remove();
        }

        return false;
    })
}

function dropdownTransfer(_this){
    $('.dropdown-menu').hide();
    var i = $(_this).closest('.items-list').attr('i');
    var u = $(_this).closest('.items-list').attr('u');
    if (_Member.length > 0){
        s_html(_Member)
    }else {
        $.get('/team/user', function (_d) {
            _Member = _d;
            s_html(_d)
        });
    }

    function s_html(_d) {
        $('.tips').remove();
        var _html = '<div class="tips tips-transfer" >\n' +
            '    <i class="fa fa-refresh" title="转让"></i>\n' +
            '    <i class="fa fa-times" title="关闭&取消"></i>\n' +
            '    <div class="mask"></div>\n' +
            '    <div class="box">\n' +
            '        <form id="doc-transfer" method="POST">\n' +
            '            <input class="_token hide" name="_token" value="' + _CSRF + '">\n' +
            '            <input class="hide" name="uuid" value="' + u + '">\n' +
            '            <div class="doc-select">\n' +
            '                <input class="doc-select-input" name="uid" value="">\n' +
            '                <div class="doc-select-show"><span class="title">转让：</span><span class="text"></span><span class="caret"></span></div>\n' +
            '                <div class="doc-select-box">\n' +
            '                    <ul class="doc-select-ul select-menu" data-type="1">\n' + _d +
            '                    </ul>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <button class="but-a" type="submit">提交</button>\n' +
            '        </form>\n' +
            '    </div>\n' +
            '</div>';
        $('body').prepend(_html);
        init_select();
        var n = $('.tips-transfer .doc-select .doc-select-ul a').first().text();
        var i = $('.tips-transfer .doc-select .doc-select-ul a').first().attr('data-id');
        var i = $('.tips-transfer .doc-select .doc-select-ul a').first().addClass('active');
        $('.tips-transfer .doc-select .doc-select-input').val(i);
        $('.tips-transfer .doc-select .text').text(n);
    }

    $(document).on('submit','#doc-transfer',function() {
        if (!_is){
            _is = true;
            tips_msg('稍等...',6000);
            $.ajax({
                type:'post',
                url:"/item/transfer",
                cache: false,
                data: $("#doc-transfe").serialize(),
                dataType:'json',
                success: function (data) {
                    tips_msg(data.msg);
                    if (data.code == 0){
                        window.location.reload();
                    }
                },
                error:function(e){
                    hint(e);
                }
            });
        }
        return false;//阻止表单提交
    })
}
function dropdownBasic(_this){
    var _is = false;
    $('.dropdown-menu').hide();
    var t = $(_this).closest('.items-list').find('.il-title').text();
    var u = $(_this).closest('.items-list').attr('u');
    var i = $(_this).closest('.items-list').attr('i');
    s_html();
    function s_html() {
        $('.tips').remove();
        var _html = '<div class="tips tips-item-edit" >\n' +
            '    <i class="fa fa-edit" title="项目信息"></i>\n' +
            '    <i class="fa fa-times" title="关闭&取消"></i>\n' +
            '    <div class="mask"></div>\n' +
            '    <div class="box">\n' +
            '        <form id="item-basic" method="POST" >\n' +
            '            <input class="_token hide" name="_token" value="' + _CSRF + '">\n' +
            '            <input class="hide" name="uuid" value="' + u + '">\n' +
            '            <input class="name" name="name" type="text" placeholder="项目名称" value="'+t+'"/>\n' +
            '            <button class="but-a" type="submit">提交</button>\n' +
            '        </form>\n' +
            '    </div>\n' +
            '</div>';
        $('body').prepend(_html);
    }

    $(document).on('submit','#item-basic',function() {
        if (!_is) {
            _is = true;
            tips_msg('稍等...', 6000);
            $.ajax({
                type: 'post',
                url: "/item/edit",
                cache: false,
                data: $("#item-basic").serialize(),
                dataType: 'json',
                success: function (data) {
                    tips_msg(data.msg);
                    if (data.code == 0) {
                        $(_this).closest('.items-list').find('.il-title').text(data.data);
                        $(_this).closest('.items-list').find('.il-title').attr('title',data.data);
                        $('.tips').remove();
                    }
                },
                error: function (e) {
                    _is = false;
                    hint(e);
                }
            });
        }
        return false;//阻止表单提交
    })
}

function isRadio(p,v){
    if (p == v) return 'checked';

    return '';
}

$(document).on('click', '.item-team-list .team-list .fa-edit', function () {
    var _is = false;
    var tn = 'tips-item-member-edit'+dateHMS();
    var i = $(this).attr('i');
    var ti = $(this).attr('ti');
    var n = $(this).attr('n');
    var p = $(this).attr('p');
    s_html();

    function s_html() {
        $('.tips').remove();
        var _html = '<div class="tips '+tn+'">\n' +
            '        <i class="fa fa-edit"></i><i class="fa fa-times" title="关闭&amp;取消"></i>\n' +
            '        <div class="mask"></div>\n' +
            '        <div class="box">\n' +
            '            <form id="'+tn+'" method="POST">\n' +
            '                <input class="_token hide" name="_token" value="' + _CSRF + '">\n' +
            '                <input class="hide" name="id" type="text" value="' + i + '">\n' +
            '                <input class="tips-add-search" type="text" value="'+ n +'" readonly>\n' +
            '                <div class="permission">\n' +
            '                    <label class="list_null" for="m-permission-default"><input class="list_null" id="m-permission-default" type="radio" name="permissions" value="0" '+isRadio(p,0)+'>默认<i class="fa fa-question-circle" title="新增/编辑/删除"></i></label>\n' +
            '                    <label class="list_null" for="m-permission-read"><input class="list_null" id="m-permission-read" type="radio" name="permissions" value="1" '+isRadio(p,1)+'>只读</label>\n' +
            '                </div>\n' +
            '                <div class="tips-but">\n';
            if(ti>0) _html += '<a class="but-a2" href="/team/'+ti+'">团队管理</a>';

            _html += '<button type="submit" class="but-a">修改</button>\n' +
            '                </div>\n' +
            '            </form>\n' +
            '        </div>\n' +
            '    </div>';
        $('body').prepend(_html);
    }

    $(document).on('submit','#'+tn,function() {
        if (!_is){
            _is = true;
            tips_msg('稍等...',6000);
            $.ajax({
                type:'post',
                url:"/item/user/edit",
                cache: false,
                data: $("#"+tn).serialize(),
                dataType:'json',
                success: function (data) {
                    tips_msg(data.msg);
                    if (data.code == 0){
                        itemMemberList();
                        $('.tips').remove();
                    }
                },
                error:function(e){
                    hint(e);
                }
            });
        }
        return false;//阻止表单提交
    })
});
$(document).on('click', '.doc-new-item', function () {
    var _is = false;
    if (_ITEMS.length > 0){
        s_html(_ITEMS)
    }else {
        $.get('/doc/item/s', function (_d) {
            _ITEMS = _d;
            s_html(_d)
        });
    }

    function s_html(_d) {
        $('.tips').remove();
        if(_d.indexOf("data-id") < 0 ) {
            tips_msg('用户所持有项目数据错误');
            _d = '';
        }
        var _html = '<div class="tips tips-catalog" >\n' +
            '    <i class="fa fa-item-add" title="新建项目"></i>\n' +
            '    <i class="fa fa-times" title="关闭&取消"></i>\n' +
            '    <div class="mask"></div>\n' +
            '    <div class="box">\n' +
            '        <form id="doc-new-item" method="POST" action="/doc/item">\n' +
            '            <input class="_token hide" name="_token" value="' + _CSRF + '">\n' +
            '            <input class="name" name="name" type="text" placeholder="新项目名称"/>\n' +
            '            <div class="doc-select">\n' +
            '                <input class="doc-select-input" name="copy" value="0">\n' +
            '                <div class="doc-select-show"><span class="title">复制：</span><span class="text">不复制</span><span class="caret"></span></div>\n' +
            '                <div class="doc-select-box">\n' +
            '                    <ul class="doc-select-ul select-menu" data-type="1">\n' +
            '                        <li><a data-id="0" class=""><bg></bg>不复制</a></li>\n' + _d +
            '                    </ul>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <button class="but-a" type="submit">提交</button>\n' +
            '        </form>\n' +
            '    </div>\n' +
            '</div>';
        $('body').prepend(_html);
        init_select();
        if ($(".tips-catalog .doc-select-ul").find('.file').length > 0){
            tips_msg('文件文档的子文档、子目录不展示和移动',6000,300);
            $(".tips-catalog .doc-select-ul").find('.file').remove();
        }
    }

    $(document).on('submit','#doc-new-item',function() {
        if (!_is){
            _is = true;
            tips_msg('稍等...',6000);
            $.ajax({
                type:'post',
                url:"/doc/item",
                cache: false,
                data: $("#doc-new-item").serialize(),
                dataType:'json',
                success: function (data) {
                    tips_msg(data.msg);
                    if (data.code == 0){
                        window.location.href = data.data;
                    }
                },
                error:function(e){
                    hint(e);
                }
            });
        }
        return false;//阻止表单提交
    })
});
$(document).on('click', '.doc-catalog-sort', function () {
    if (_MENU.length <= 0){
        tips_msg('暂无文档数据!');
        return false;
    }
    var _is = false;
    var _im = false;
    $.when(
        $.getScript( "/assets/js/jquery-ui.min.js" ),
        $.getScript( "/assets/js/table.js" ),
        $.Deferred(function( deferred ){
            $( deferred.resolve );
        })).done(function() {
        if (_MENU.length > 0){
            s_html(_MENU)
        }else {
            $.get('/doc/catalog/'+_IID, function (_d) {
                _MENU = _d
                s_html(_d)
            });
        }

        function s_html(_d) {
            $('.tips').remove();
            var _html = '<div class="tips tips-sort">\n' +
                '<i class="fa fa-qiehuan" title="目录排序"></i><i class="fa fa-times" title="关闭&取消"></i>\n' +
                '    \n' +
                '    <div class="mask"></div>\n' +
                '    <div class="box">\n' +
                '        <ul class="doc-select-ul tips-sort-ul">'+_d+'</ul>\n' +
                '    </div>\n' +
                '    <button class="but-a" type="button">提交</button>\n' +
                '</div>';
            $('body').prepend(_html);
            tips_msg('请拖动排序<br>1、拖动的同时滚动鼠标并移动可扩大范围排序',6000,300);
            $(".tips-sort .doc-select-ul").find('a').attr('href','javascript:;');
            if ($(".tips-sort .doc-select-ul").find('.file').length > 0){
                tips_msg('文件文档的子文档、子目录不展示和移动',6000,300);
                $(".tips-sort .doc-select-ul").find('.file').remove();
            }

            scrollbar_s($(document).find(".tips-sort .doc-select-ul"));
            $(".tips-sort-ul").sortable({
                change: function(event, ui) {
                    _im = true;
                    sort_ul_status(event);
                },
                stop: function(event, ui) {
                    _im = true;
                    sort_ul_status(event);
                },
                update: function(event, ui) {
                    _im = true;
                    sort_ul_status(event);
                },

                cancel:".file,.file ul",
                items: "li",
                revert: true,
                dropOnEmpty : true,
                cursor: "move",
                connectWith: ".tips-sort-ul",
                animation: 150,
            }).disableSelection();

        }

        function get_tips_sort_l(_t,_p = 0){
            var _l = [];
            _t.children('li').each(function (k,v) {
                var _i = $(this).children('a').attr('data-id');
                _l.push({
                    '0':_i,
                    '1':k,
                    '2':_p
                });
                if ($(this).children('ul').find('li').length > 0) {
                    var __l = get_tips_sort_l($(this).children('ul'),_i);
                    $.each(__l,function (k,v) {
                        _l.push({
                            '0':v[0],
                            '1':v[1],
                            '2':v[2]
                        });
                    });
                }
            })
            return _l;
        }

        $(document).on('click','.tips-sort .but-a',function() {
            if (!_is){
                _is = true;
                if (!_im){
                    tips_msg('请拖动排序');
                    return false;
                }
                var _l = get_tips_sort_l($(".tips-sort .doc-select-ul .mCSB_container"));
                if (_l <= 0){
                    tips_msg('数据获取失败!');
                    return false;
                }
                $.ajax({
                    type:'post',
                    url:"/doc/catalog/sort",
                    cache: false,
                    data: {
                        '_token':_CSRF,
                        'sort':JSON.stringify(_l),
                        'iid':_IID,
                    },
                    dataType:'json',
                    success: function (data) {
                        tips_msg(data.msg);
                        if (data.code == 0){
                            set_menu(data.data);
                            $('.tips-sort').remove();
                        }
                    },
                    error:function(e){
                        hint(e);
                    }
                });
            }
            return false;//阻止表单提交
        })
    }).error(function(err){
        console.log('jquery-ui.min.js 加载失败')
    });
});
$(document).on('click', '.doc-new-catalog', function () {
    var _is = false;
    var _sort = $('.component-menu .mCSB_container').children('li').length;
    var _isi = false;

    if (_MENU.length > 0){
        s_html(_MENU)
    }else {
        $.get('/doc/catalog/'+_IID, function (_d) {
            _MENU = _d
            s_html(_d)
        });
    }

    function s_html(_d) {
        $('.tips').remove();
        var _html = '<div class="tips tips-catalog" >\n' +
            '    <i class="fa fa-catalog" title="新增目录"></i>\n' +
            '    <i class="fa fa-times" title="关闭&取消"></i>\n' +
            '    <div class="mask"></div>\n' +
            '    <div class="box">\n' +
            '        <form id="catalog" method="POST" action="/doc/catalog">\n' +
            '            <input class="_token hide" name="_token" value="' + _CSRF + '">\n' +
            '            <input class="iid hide" name="iid" type="text" value="' + _IID + '"/>\n' +
            '            <input class="name" name="name" type="text" placeholder="目录名称"/>\n' +
            '            <div class="doc-select">\n' +
            '                <input class="doc-select-input" name="pid" value="0">\n' +
            '                <div class="doc-select-show"><span class="title">所属：</span><span class="text">一级目录</span><span class="caret"></span></div>\n' +
            '                <div class="doc-select-box">\n' +
            '                    <ul class="doc-select-ul select-menu" data-type="1">\n' +
            '                        <li><a data-id="0" class=""><bg></bg>一级目录</a></li>\n' + _d +
            '                    </ul>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="doc-input-number">\n' +
            '                <span class="title">排序：</span>\n' +
            '                <i class="fa fa-minus"></i>\n' +
            '                <input type="number" class="sort" name="sort" value="'+_sort+'">\n' +
            '                <i class="fa fa-plus"></i>\n' +
            '            </div>\n' +
            '            <button class="but-a" type="submit">提交</button>\n' +
            '        </form>\n' +
            '    </div>\n' +
            '</div>';
        $('body').prepend(_html);
        init_select();

        if ($(".tips-catalog .doc-select-ul").find('.file').length > 0){
            tips_msg('文件文档的子文档、子目录不展示和移动',6000,300);
            $(".tips-catalog .doc-select-ul").find('.file').remove();
        }
    }

    $(document).on('click', '.tips-catalog .doc-select .doc-select-box a', function () {
        if (!_isi){
            var _s = $(this).next('ul').find('li').length;
            if (_s == 0){
                _s = _sort
            }
            $('.tips-catalog .doc-input-number .sort').val(_s);
        }
    });

    $(document).on('submit','#catalog',function() {
        if (!_is){
            _is = true;
            $.ajax({
                type:'post',
                url:"/doc/catalog",
                cache: false,
                data: $("#catalog").serialize(),
                dataType:'json',
                success: function (data) {
                    tips_msg(data.msg);
                    if (data.code == 0){
                        set_menu(data.data);
                        $('.tips-catalog').remove();
                    }
                },
                error:function(e){
                    hint(e);
                }
            });
        }
        return false;
    })
});

function set_menu(_d) {
    if (isNotNull(_d)) {
        _MENU = _d;
        if ($(".component-menu .mCSB_container").length > 0){
            $(".component-menu .mCSB_container").html(_d);
        } else {
            $(".component-menu").html(_d);
        }
        if ($(".select-menu .mCSB_container").length > 0){
            $(".select-menu .mCSB_container").html('<li><a data-id="0" class=""><bg></bg>一级目录</a></li>' + _d);
        } else {
            $(".select-menu").html('<li><a data-id="0" class=""><bg></bg>一级目录</a></li>' + _d);
        }

        if (_DID > -1) {
            $('.component-menu a').each(function () {
                var _aid = $(this).attr('data-id');
                if (isNotNull(_DID) && _DID == _aid){
                    _text = $(this).text();
                    $(this).addClass('active');
                    $(this).parents('ul').show();
                    $(this).parents('ul').siblings('a').find('.fa-i').toggleClass("fa-angle-down");
                    $(this).parents('ul').siblings('a').find('.fa-i').toggleClass("fa-angle-right");
                }
            });
        }

        if (parseInt(_init.pattern) > 1) {
            $(".component-menu .mCSB_container a").each(function () {
                var _h = $(this).attr('href');
                if (isNotNull(_h)){
                    $(this).attr('href',changeURLArg(_h,'pattern',_init.pattern));
                }
            });
        }

        setDocSelect($(".select-menu").closest('.doc-select'));
        if ($(".component-menu .mCSB_container").children('li').length <= 1){
            $(".component-menu .mCSB_container").children('li').each(function () {
                if ($(this).children('a').attr('form') == 2){
                    $(this).children('ul').show();
                }
            });
        }


        var _f = getQueryVariable('f');
        var _t = 0;
        if (_f) {
            $('.component-menu a').removeClass("active");
            $('.component-menu a').each(function () {
                var f = $(this).attr('f');
                if (isNotNull(f) && f == _f){
                    _t = $(this).attr('t');
                    $(this).parents('ul').show();
                    $(this).addClass("active");
                }
            });
            _f = decodeURIComponent(_f);
            $.get('/assets/file/'+_f, function (d) {
                showFileHtml(_t,d)
            });
        }

    }else {
        $(".select-menu .mCSB_container").html('<li><a data-id="0" class=""><bg></bg>一级目录</a></li>');
    }
}

function hints(e){
    try{
        if (isNotNull(e.responseJSON.message)) {
            tips_msg(e.responseJSON.message)
        }else {
            tips_msg('操作失败')
        }
    }catch (e) {

    }
    try{
        if (isNotNull(e.msg)) {
            tips_msg(e.msg)
        }else {
            tips_msg('操作失败')
        }
    }catch (e) {
        tips_msg('操作失败')
    }
}

$(document).on('click', '.copy,.del,.print', function () {
    if (!$(this).hasClass('disabled')){
        var _href = $(this).attr('data-href');
        window.location.href = _href;
    }
});

$(document).on('click', '#sidebar .nav-tabs li', function () {
    var _this = $(this);
    var _href = _this.children('a').attr('href');
    c_set(_s_sidebar_nav_key,_href);
});
$(document).on('click', '.share', function () {
    if (!$(this).hasClass('disabled')) {
        var _h = $(this).attr("data-h");
        _h = get_href(get_param(_h));
        if (isNotNull(_h)){
            share(_h)
        }
    }
});
$(document).on('click', '.backKeys', function () {
    cma(false)
});
$(document).on('click', '.forwardKeys', function () {
    cma(false)
});

/*localStorage 的存储格式都是字符串，任何其他类型都会转成字符串存储。*/
function c_set(_k,_v){
    /*判断浏览器是否支持 localStorage 属性*/
    if (window.localStorage) {
        var k = _k.toUpperCase();
        var str = 'C_' + k ;
        var _script='var C_'+ k +' =123;';
        eval(_script);
        str = _v;
        window.localStorage.setItem(_k,_v);
    } else {
        console.log('c_set This browser does NOT support');
    }
}

function c_get(_k){
    if (window.localStorage) {
        return window.localStorage.getItem(_k);
    } else {
        console.log('c_get This browser does NOT support');
    }
}

function c_r(_k){
    if (window.localStorage) {
        return window.localStorage.removeItem(_k);
    } else {
        console.log('c_r This browser does NOT support');
    }
}

function c_c(){
    if (window.localStorage) {
        return window.localStorage.clear();
    } else {
        console.log('c_c This browser does NOT support');
    }
}

function c_all(){
    if (window.localStorage) {
        var _l = [];
        for ( var i = 0, len = localStorage.length; i < len; ++i ) {
            _l.push({
                'key':localStorage.key( i ),
                'val':localStorage.getItem(localStorage.key( i ))
            })
        }
        return _l;
    } else {
        console.log('c_all This browser does NOT support');
    }
}

$(document).on('click', '#curl .fa-clone', function () {
    var _t = $(this);
    var str = _t.parent('#curl').children('p').text();
    var flag = copyText(str);
    tips_msg(flag ? "已复制" : "复制失败！");
});

$(document).on('click', '#view .text-content .fa-clone', function () {
    var _t = $(this);
    var str = _t.parent('.text-content').children('pre').text();
    var flag = copyText(str);
    tips_msg(flag ? "已复制" : "复制失败！");
});

function copyText(text) {
    var textarea = document.createElement("input");
    var currentFocus = document.activeElement;
    document.body.appendChild(textarea);
    textarea.value = text;
    textarea.focus();
    if(textarea.setSelectionRange)
        textarea.setSelectionRange(0, textarea.value.length);
    else
        textarea.select();
    try {
        var flag = document.execCommand("copy");
    } catch(eo) {
        var flag = false;
    }
    document.body.removeChild(textarea);
    currentFocus.focus();
    return flag;
}
function is_indexOf(str)
{
    if(str.indexOf('//') >= 0 ) {
        return true;
    }
    return false;
}

function  r_comment(str) {
    // var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;
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

function html_decode(str)
{
    if (str.length == 0) return "";
    var s = str;
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/<br>/g, "\n");
    s = s.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, "\t");
    return s;
}
function html_encode(str)
{
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
function html_encode_01(str)
{
    if (str.length == 0) return "";
    var s = str.replace(/&/g, ">");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, " ");
    s = s.replace(/\'/g, "'");
    s = s.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    return s;
}
function html_encode_02(str)
{
    if (str.length == 0) return "";
    var s = str;
    s = s.replace(/ /g, "");
    s = s.replace(/\r/g, "");
    s = s.replace(/\n/g, "");
    s = s.replace(/\t/g, "");
    return s;
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
function curl_s(s)
{
    if (s.length == 0) return "";
    var s = s;
    s = s.replace(/ -A /g, "\n-A ");
    s = s.replace(/ -b /g, "\n-b ");
    s = s.replace(/ -c /g, "\n-c ");
    s = s.replace(/ --data-urlencode /g, "\n--data-urlencode ");
    s = s.replace(/ -e /g, "\n-e ");
    s = s.replace(/ -F /g, "\n-F ");
    s = s.replace(/ -G /g, "\n-G ");
    s = s.replace(/ -H /g, "\n-H ");
    s = s.replace(/ -i /g, "\n-i ");
    s = s.replace(/ -I /g, "\n-I ");
    s = s.replace(/ -k /g, "\n-k ");
    s = s.replace(/ -L /g, "\n-L ");
    s = s.replace(/ --limit-rate /g, "\n--limit-rate ");
    s = s.replace(/ -o /g, "\n-o ");
    s = s.replace(/ -O /g, "\n-O ");
    s = s.replace(/ -s /g, "\n-s ");
    s = s.replace(/ -S /g, "\n-S ");
    s = s.replace(/ -u /g, "\n-u ");
    s = s.replace(/ -v /g, "\n-v ");
    s = s.replace(/ -x /g, "\n-x ");
    s = s.replace(/ -X /g, "\n-X ");
    s = s.replace(/ --compressed/g, "\n--compressed ");
    s = s.replace(/ --connect-timeout /g, "\n--connect-timeout ");
    return s;
}
$(function(){

    $(".submit_tpl").click(function () {
        $(".doc-tpl").val(1);
        $("#api-doc-create").submit();
    });

});
function Trim(str,is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"-");
    if(is_global.toLowerCase()=="g") {
        result = result.replace(/\s/g,"-");
    }
    return result;
}
function get_href(_h) {
    if (isNotNull(_h)){
        _h = _h.replace(/#/g,'');
    }

    if (!isNotNull(_h)){
        _h = window.location.href;
    }
    _h = _h.replace(/#/g,'');
    return _h;
}
//增加修改url参数
function changeURLArg(url,arg,arg_val){
    if (!isNotNull(url)) url = get_href();
    var pattern=arg+'=([^&]*)';
    var replaceText=arg+'='+arg_val;
    if(url.match(pattern)){
        if (arg_val.length > 0){
            var tmp='/('+ arg+'=)([^&]*)/gi';
            tmp=url.replace(eval(tmp),replaceText);
            return tmp;
        } else {
            var tmp='/('+ arg+'=)([^&]*)/gi';
            tmp=url.replace(eval(tmp),replaceText);

            return tmp;
        }
    }else{
        if(url.match('[\?]')){
            return url+'&'+replaceText;
        }else{
            return url+'?'+replaceText;
        }
    }
    return url+'\n'+arg+'\n'+arg_val;
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

function set_url_param(_u,_d){
    try{
        var __d = JSON.parse(_d);
        _u = set_url_param_t(_u,__d)
    }catch (e) {
    }
    return _u;
}

function set_url_param_t(_u,_d){
    $.each(_d,function (key,val) {
        if (!isNotNull(val.key)) $.error('null');
        $.each(val,function (k,v) {
            if ($.isArray(v)){
                _u = set_url_param_t(_u,v);
            } else {
                _u = changeURLArg(_u,k,v);
            }
        });
    });

    return _u;
}

function doc_select_hide() {
    $('.doc-select-box').hide();
    $('.doc-select').find('.doc-select-show').removeClass("doc-select-show-border");
}

// 滚动条样式
init_select();
function init_select(){
    // scrollbar_s($(".doc-select .doc-select-ul"));
}
function scrollbar_s(_t){
    // _t.mCustomScrollbar({
    //     axis:"yx",
    //     theme: "minimal",
    //     mouseWheelPixels: 100,
    //     callbacks: {
    //         onScrollStart: function () {
    //         },
    //         onScroll: function () {
    //         },
    //         onTotalScroll: function () {
    //             _t.removeClass("box-shadow-inset-top")
    //         },
    //         onTotalScrollBack: function () {
    //             _t.removeClass("box-shadow-inset-top")
    //         },
    //         whileScrolling: function () {
    //             _t.addClass("box-shadow-inset-top")
    //         },
    //         onTotalScrollOffset: 0,
    //         whileScrollingInterval: 30
    //     }
    // });
}

$(document).on('click','.doc-input-number i.fa-plus',function () {
    var _i = $(this).parent().children('input');
    _i.val(parseInt(_i.val())+1)
});
$(document).on('click','.doc-input-number i.fa-minus',function () {
    var _i = $(this).parent().children('input');
    _i.val(parseInt(_i.val())-1)
});

var docSelect = $('.doc-select');
var doc_search_box = $('.doc-select-search-box');

//搜索 start
$('.doc-select .doc-select-search-box .doc-select-search').val('');
var cms = $('.component-menu-search').val();
if (cms && cms.length > 0){
    serach_fun($('.component-menu-search'))
}else {
    url_search = getQueryVariable("search");
    if (url_search.length > 0) {
        searchText = decodeURI(getQueryVariable("search"));
        $('.component-menu-search').val(searchText);
        serach_fun($('.component-menu-search'))
    }
}

$(document).on('click','.doc-select-search-box .fa-times',function(){
    var _ul = $(this).parent('.doc-select-search-box').nextAll('.doc-select-ul');
    var _t = _ul.attr('data-type');
    $(this).prev(".doc-select-search").val('');
    _ul.find('li').show();
    if (_t > 0){
        _ul.find('li').show();
    }else {
        _ul.find('li').show();
        _ul.find('ul').hide();
    }

    $(this).addClass('fa-search');
    $(this).removeClass('fa-times');

    _ul.find('a').each(function () {
        if ($(this).attr("href")) {
            $(this).attr("href",changeURLArg($(this).attr("href"),'search',''));
        }
    });
    serach_fun(this)
});


$(document).on('input propertychange','.doc-select-search-box .doc-select-search', function () {
    serach_fun(this)
});
function serach_fun(obj){
    var _this = $(obj);
    var _v = _this.val();
    var _ul = _this.closest('.doc-select-box').find('.doc-select-ul');
    var _type = _ul.attr('data-type');


    if (_v.length > 0) {
        var arr = _v.split(' ');

        _ul.find('li').hide();
        $.each(arr, function (index, value) {
            _ul.find('a:contains(' + value + ')').parents("li").show();
            _ul.find('a:contains(' + value + ')').parents("li").find("ul").show();
        });

        _this.siblings(".fa-search").addClass('fa-times');
        _this.siblings(".fa-search").removeClass('fa-search');
        _this.siblings(".glyphicon-remove").show();

    }else {
        if (_type > 0){
            _ul.find('li').show();
        }else {
            _ul.find('li').show();
            _ul.find('ul').hide();
        }
        _this.siblings(".fa-times").addClass('fa-search');
        _this.siblings(".fa-times").removeClass('fa-times');
        _this.siblings(".glyphicon-remove").hide();
    }



}
//搜索 end

$('.doc-select').each(function () {
    setDocSelect($(this))
});

function setDocSelect(t){
    var _t = t.children('.doc-select-show').children('.text').html();
    var k =  t.children('.doc-select-input').val();
    var n =  t.children('.doc-select-input').attr("data-not");
    if (!isNotNull(n)) n = '';
    if (k > -1) {

        t.find('.doc-select-ul a').each(function () {
            var a = $(this).attr('data-id');
            if (k == a){
                _t = $(this).text();
                $(this).addClass('active')
            }

            if (n && a == n){
                $(this).addClass('disabled')
            }
        });
    }
    if (!_t){
        _t = '暂无选择'
    }

    t.children('.doc-select-show').children('.text').html(_t);
}

function initScrollBar(_obj){
    if (!isNotNull(_obj[0])) return false;
    var im = false;
    var sBoxUl = _obj.children('.doc-select-ul');
    var sBoxUlLi = sBoxUl.children("li:visible").length;
    var sBoxUlUl = sBoxUl.children("ul:visible").length;
    var sBoxsOH = sBoxUl.find("bg").first().height();
    var sBoxsOGH = sBoxUl.find("ul").first().height();
    var sBoxss = _obj.find(".scroll_slider");
    var sls = _obj.find('.scroll_slider');
    var sTop = _obj[0].scrollHeight;
    if (sTop == 0 &&  sBoxUlLi > 0) sTop = sBoxUlLi * sBoxsOH + sBoxUlUl * sBoxsOGH + sBoxsOH;
    sTop = Math.abs(sTop);
    if (sTop < 250) sBoxss.hide();
    var _sliderHTop = parseInt(sBoxss.css('top'));
    var sliderHTop = parseInt(sBoxss.css('top'));
    var sliderH = _obj.height();
    var scrollH = (sliderH/sTop*sliderH );/*滚动条高度*/
    sBoxss.css('height',scrollH+'px');
    var scrollTop = 0;
    _obj.on('scroll',function(){
        if (im) return;
        scrollTop = $(this).scrollTop();
        var sliderDistence = (scrollTop / (sTop/sliderH)) + sliderHTop;
        sliderDistence = sliderDistence + scrollTop;
        sBoxss.css('top',sliderDistence+'px');
    });

    sBoxss.mousedown(function(e){
        var sy = 0;
        var maxs = sTop-sliderH/(sTop/sliderH);
        scrollTop = _obj.scrollTop();
        $(document).mousemove(function(e){
            im = true;
            if (sy <= 0) sy = e.pageY;
            var _sTop = (scrollTop / (sTop/sliderH)) + sliderHTop;
            var _m = e.pageY - sy;
            var sliderDistence = _sTop > 0 ? _sTop + _m*(sTop/sliderH) : _m*(sTop/sliderH);
            if (sliderDistence > 0 && sliderDistence <= maxs){
                if (_m > 0 && _sTop > 0){
                    sliderDistence += _sTop;
                }else {
                    sliderDistence += _sTop;
                }

                _obj.animate({scrollTop: sliderDistence},1);

                var m = (e.pageY - sy)+sliderDistence;
                m += _sTop;
                if (m <= 0 || m > maxs) return false;
                sBoxss.css('top', m+'px');
            }else {
            }
        });
        $(document).mouseup(function(){
            im = false;
            $(document).off('mousemove');
        });
    });
}

function multipleSelect(_this,_f = ''){
    var ism = false
    var obj = _this.find('a');
    $(obj).on("click", function (e) {
        setMoveSelectBg($(this));
        setMH(_this);
    });
    $(obj).on("mousedown", function (e) {
        e.preventDefault();
        ism = true;
    });
    $(document).on("mouseup", function (e) {
        $(document).off('mousemove');
        $(obj).attr('_m',0);
        if (ism){
            setMH(_this);
        }
        ism = false;
    });
    $(obj).on("mousemove", function (e) {
        if (ism && (!$(this).attr('_m') || $(this).attr('_m') == 0)) {
            setMoveSelectBg($(this));
            $(this).attr('_m',1);
        }
    });
    $(obj).on("mouseout", function (e) {
        if (ism ) $(this).attr('_m',0);
    });
}

function setMH(_this) {
    var dm = [];
    var dt = [];
    var h = '';
    _this.closest('.doc-select').find('a.active-s').each(function (k,v) {
        dam = $(this).attr('m');
        dat = $(this).attr('t');
        if (isNotNull(dam) || isNotNull(dat)){
            var _text = '';
            try {
                _text = $(this)[0].childNodes[3].data;
            }catch (e) {
                _text = $(this).not('firstChild').text();
            }

            if (_text){
                var at = '';
                if (isNotNull(dam)){
                    at = 'm="'+ dam +'"';
                    dm.push(dam);
                }else {
                    at = 't="'+ dat +'"';
                    dt.push(dat);
                }
               if(_text.length <= 10 && k == 0 && C_STEP == 1){
                   h += '<m '+ at +'>'+_text+'<i class="fa fcx"></i>...</m>';
                }else {
                   h += '<m '+ at +'>'+_text+'<i class="fa fcx"></i></m>';
               }

            }
        }
    });

    var c = _this.closest('.doc-select').children('.doc-select-show').children('.caret').hide();
    var t = _this.closest('.doc-select').children('.doc-select-show').children('.text');
    _this.closest('.doc-select').children('.doc-select-input').val(dm.join(","));
    _this.closest('.doc-select').children('.doc-select-input-t').val(dt.join(","));
    if (h){
        c.hide();
        var _fs = t.find('.fa-step-forward').length > 0;
        t.html(h);

        var _t = _this.closest('.doc-select').children('.doc-select-show').children('.text');
        if (h.length > 40) {
            if (_fs || C_STEP == 1){
                _this.closest('.doc-select').children('.doc-select-show').addClass('dss-step');
                _t.append('<i class="fa fa-step-forward"></i>');
                var _tw = _t.width();
                _t.find('m').not(':first-child').hide();
            }else {
                _t.append('<i class="fa fa-step-backward"></i>');
            }
        }else {
            c.show();
        }
    }else {
        c.show();
        t.text('暂无选择');
    }
}

function setMoveSelectBg(_this){
    if (isNotNull(_this.attr('m')) || isNotNull(_this.attr('t'))){
        _this.toggleClass('active-s');
    }else {
        tips_msg('目录、缺少必要参数等不可选择')
    }
}

$(document).on('click','.doc-select-show',function(e){
    var dbox = $(this).closest('.doc-select').children('.doc-select-box');
    var iv = $(this).parents('.doc-select').children(".doc-select-input");
    var dboxUl = dbox.children(".doc-select-ul");
    var dboxUlB = dbox.children(".doc-select-ul-box");
    var dboxUlBSS = dboxUlB.children(".scroll_slider");
    var dboxUlBM = dboxUlB.children(".multiple");
    var _type = dboxUl.attr("data-type");

    if($(e.target).attr('class')=='fa fa-remove' || $(e.target).attr('class')=='fa fcx' || $(e.target).attr('class')=='fa fa-step-backward' || $(e.target).attr('class')=='fa fa-step-forward'){
        if ($(e.target).parent().find('m').length > 0 && ( $(e.target).attr('class')=='fa fa-step-backward' || $(e.target).attr('class')=='fa fa-step-forward')){
            $(e.target).parent().find('m').not(':first-child').toggle();
            $(e.target).toggleClass('fa-step-forward');
            $(e.target).toggleClass('fa-step-backward');
        }
        if ($(e.target).attr('class')=='fa fa-step-forward'){
            c_set('step',1);
            C_STEP = 1;
            $(this).addClass('dss-step');
            setMH(dboxUlBM)
        }
        if ($(e.target).attr('class')=='fa fa-step-backward'){
            c_set('step',0);
            C_STEP = 0;
            $(this).removeClass('dss-step');
            var _h = $(e.target).parent().find('m').first().html();
            $(e.target).parent().find('m').first().html(_h.replace('...',''))
        }
        if ($(e.target).attr('class')=='fa fa-remove' || $(e.target).attr('class')=='fa fcx'){
            var v = $(e.target).parent().text();
            var dm = $(e.target).parent().attr('m');
            var dt = $(e.target).parent().attr('t');
            $(e.target).parent().remove();
            $(this).closest('.doc-select').find('a.active-s').each(function (k,v) {
                if (isNotNull($(this).attr('m')) && dm == $(this).attr('m')){
                    $(this).removeClass('active-s');
                }
                if (isNotNull($(this).attr('t')) && dt == $(this).attr('t')){
                    $(this).removeClass('active-s');
                }
            });
            setMH(dboxUlBM);
        }
        return false;
    }

    if (dbox.is(':hidden') ) {
        $(this).toggleClass("doc-select-show-border");
        dbox.toggle();

        if(navigator.userAgent.indexOf("Chrome") <= 0){
            if (dboxUlBSS.length == 0 && dboxUlB.height() > 500){
                dboxUlB.css("width",dbox.width()+17 + 'px');
                dboxUlB.append('<div class="scroll_slider"></div>');
                initScrollBar(dboxUlB);
                if (_type == 6){
                }
            }
        }else {
            dboxUlBSS.remove()
        }


        if (dboxUlBM.length > 0 && dboxUlBM.attr('_m') != 1) {
            dboxUlBM.attr('_m',1);
            multipleSelect(dboxUlBM);
        }

        if (_type == 1 || _type == 3 || _type == 4 || _type == 6){
            dbox.find('a').removeAttr('href');
            dbox.find('ul').show();
        }
        if (_type == 2){
            dbox.find('ul').show();
        }

        var d = $(this).parents(docSelect);
        e.stopPropagation();//阻止左键点击冒泡事件
        dboxUl.mCustomScrollbar("scrollTo","left");
        dboxUl.mCustomScrollbar("scrollTo",0);
        $(document).find('.doc-select').not(d).children('.doc-select-box').hide();
        $(document).find('.doc-select').not(d).find('.doc-select-show').removeClass("doc-select-show-border");
    }else {
        $(this).toggleClass("doc-select-show-border");
        dbox.toggle();
    }
});

function showFileHtml(t,d){
    var _d = {};
    switch (parseInt(t)){
        case 5:
            _d = showPostMan(d);
            break;
        case 6:
            break;
        case 7:
            break;
        case 8:
            break;
        case 9:
            break;
        case 10:
            break;
        case 11:
            break;
        case 12:
            break;
        default:
            tips_msg('数据类型错误');
            break;
    }

    var _h = _d.h;
    var _c = _d.c;

    $('#view').html(_h);
    set_ToC_arr();
    $('#curl').children('p').html(_c);
    $('#curl .fa').show();
    setSidebarNavTabs();
    set_doc_show_table();
    $('#view pre').each(function () {
        try {
            var pre = eval('(' + $(this).text() + ')');
            $(this).jsonViewer(pre, {
                collapsed: 0,
                withQuotes: 1
            });
        }
        catch (e) {
        }
    });
}


function set_doc_show_table(){
    $("#view table").each(function () {
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
                if (i >= 3 && thlen-1 == i){
                    if (_tw > 0){
                        __tw = (_tw - 13*thlen);
                        $(this).find("td").eq(i).width(__tw);
                    }
                    continue
                }

                _w = width["w_"+i]+20;

                if (i >= 3 && _w > gw){
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
}
    function showPostMan(d){
        var _h = '';
        var _c = '';
        try{
            _h += '<h1>'+d.name+'</h1>';
        }catch (e) {

        }
        try{
            _h += '<h3>请求URL</h3>';
            _h += '<method>'+d.request.method+'</method><code>'+d.request.url.raw+'</code>';
            _c += 'curl "'+d.request.url.raw+'" -X '+d.request.method+' ';
        }catch (e) {

        }
        try{
            if (isNotNull(d.request.description)) {
                _h += '<h3>简述</h3>';
                _h += '<p>'+d.request.description+'</p>';
                _c += ' -description "'+d.request.description+'" ';
                _c += ' -name "'+d.name+'" ';
            }
        }catch (e) {
        }
        try{
            if (d.request.header.length > 0){
                _h += '<h3>Headers</h3>';
                _h += '<table class="s-t"><thead><tr><th>参数名</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>';
                $.each(d.request.header,function (k,v) {
                    _h += '<tr><td>'+v.key+'</td><td>'+v.type+'</td><td>'+get_param(v.value)+'</td><td>'+get_param(v.description)+'</td></tr><tr>';
                    _c += ' -H "'+v.key+':'+v.value+'" ';
                });
                _h += '</tbody></table>';
            }
        }catch (e) {
        }
        try{
            if (d.request.url.query.length > 0) {
                _h += '<h3>Params</h3>';
                _h += '<table class="s-t"><thead><tr><th>参数名</th><th>必选</th><th>默认值</th><th>说明</th></tr></thead><tbody>';
                $.each(d.request.url.query,function (k,v) {
                    _h += '<tr><td>'+v.key+'</td><td>'+(v.disabled == true?'否':'是')+'</td><td>'+get_param(v.value)+'</td><td>'+get_param(v.description)+'</td></tr><tr>';
                });
                _h += '</tbody></table>';
            }


        }catch (e) {
        }
        try{
            var mode = get_param(d.request.body.mode);
            _h += '<h3>Body mode:'+mode+'</h3>';
            if (mode == 'graphql'){
                _h += '<p>query:'+d.request.body.graphql.query+'</p>';
                _h += '<p>variables:'+d.request.body.graphql.variables+'</p>';
            }else if (mode == 'raw'){
                try {
                    _h += '<b>raw('+d.request.body.options.raw.language+'):</b>';
                }catch (e) {
                    _h += '<b>raw:</b>';
                }

                _h += '<div class="text-content"><i class="fa fa-clone" title="复制"></i><pre>'+d.request.body.raw+'</pre></div>';

                try {
                    JSON.parse(d.request.body.raw);
                    _c += '-H "Content-Type: application/json" ';
                    _c += "--data '"+d.request.body.raw+"'";
                }catch (e) {
                    _c += '-H "Content-Type: text/plain" ';
                    _c += "--data '"+html_encode(r_comment(d.request.body.raw))+"'";
                }
            }else if (mode == 'file'){
                _h += '<p>src:'+d.request.body.file.src+'</p>';
            }else if (mode == 'urlencoded'){
                if (d.request.body.urlencoded.length > 0) {
                    _h += '<table class="s-t"><thead><tr><th>参数名</th><th>必选</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>';
                    $.each(d.request.body.urlencoded,function (k,v) {
                        _h += '<tr><td>'+v.key+'</td><td>'+(v.disabled == true?'否':'是')+'</td><td>'+get_param(v.type)+'</td><td>'+get_param(v.value)+'</td><td>'+get_param(v.description)+'</td></tr><tr>';
                        _c += ' -d "'+v.key+'='+v.value+'" ';
                    });
                    _h += '</tbody></table>';
                }
            }else {
                if (d.request.body.formdata.length > 0) {
                    _h += '<table class="s-t"><thead><tr><th>参数名</th><th>必选</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>';
                    $.each(d.request.body.formdata,function (k,v) {
                        _h += '<tr><td>'+v.key+'</td><td>'+(v.disabled == true?'否':'是')+'</td><td>'+get_param(v.type)+'</td><td>'+get_param(v.value)+'</td><td>'+get_param(v.description)+'</td></tr><tr>';
                        _c += ' -d "'+v.key+'='+v.value+'" ';
                    });
                    _h += '</tbody></table>';
                }
            }
        }catch (e) {
        }

        if (d.response.length > 0) {
            _h += '<h3>Response</h3>';
            $.each(d.response,function (k,v) {
                _h += '<span>Examples '+(k+1)+'<small>(status:'+v.code+')</small></span><div class="text-content"><i class="fa fa-clone" title="复制"></i><pre>'+v.body+'</pre></div>';
            });
        }

        return {"h":_h,"c":_c};
    }
    $(document).on('click','.doc-select-ul a',function(event){
        var _type = $(this).parents(".doc-select-ul").attr("data-type");
        var _is_d = $(this).hasClass('disabled');
        var _form = $(this).attr("form");

        if ((_type == 1 || _type == 3 || _type == 4 || _type == 5) && !_is_d){
            var _li_l = $(this).parent("li").children('ul').find('li').length;
            var _li_t = get_param($(this).attr("type"),0);
            var _id = $(this).attr("data-id");

            if (_li_l == 0 && _li_t == 0 && _id != 0 && _form == 0) tips_msg('所选文档提交后将转换为目录',3000,300);

            $(this).parents(".doc-select-ul").find('a').removeClass('active');
            $(this).addClass('active');

            var _text = $(this).text();
            var data_id = 0;
            if (_type == 4){
                data_id = $(this).attr('data-sort');
            } else {
                data_id = $(this).attr('data-id');
            }
            $(this).parents('.doc-select').children(".doc-select-input").val(data_id);
            $(this).parents('.doc-select').children(".doc-select-show").children(".text").html(_text);
            $(this).parents('.doc-select').children(".doc-select-show").children(".text").val(_text);
            if (_type == 3){
                try {
                    setTdlPath(data_id)
                }catch (e) {
                }
            }

            if (_type == 5){
                setHtmlTdlPath(data_id)
            }
            if (_type == 1 || _type == 3){
                $(document).find('.doc-select').children('.doc-select-box').hide();
                $(document).find('.doc-select').find('.doc-select-show').removeClass("doc-select-show-border");
            }
        }else{
            if (_form == 1 && $(this).next('ul').find('li').length <= 0) tips_msg('该目录下暂无文档');

            event.stopPropagation();
            var _this = $(this).parents(docSelect);
            docSelect.not(_this).find('ul li ul').hide();
            $(this).next('ul').toggle();
            $(_this).children('.fa-i').toggleClass("fa-angle-right");
            $(_this).children('.fa-i').toggleClass("fa-angle-down");
        }
    });

    // 滚动条样式
    scrollbar_s($(".component-menu"));


$(function () {

    sTime = 200;

    $("#menu").mouseleave(function(){
        $('.split-pane-divider').show();
    });

    var _pattern = $(".pattern").attr("data-pattern");
    if (_pattern){
        var _href = window.location.href;
        _href = _href.replace(/#/g,'');
        var _h = changeURLArg(_href,'pattern',_pattern);
        $(".pattern").attr("href",_h);
    }


    //获取我们自定义的右键菜单
    function rigthKyeMenu(xx, yy) {
        var menu = document.querySelector("#menu");
        var menu_ul = document.querySelector("#menu ul");

        menu.style.left = xx + 'px';
        menu.style.top = yy + 'px';
        menu.style.display = 'block';
        menu_ul.style.display = 'block';
    }

    //右键菜单
    window.oncontextmenu = function (e) {
        if (_M != 1){
            var target = e.target;
            var controls = ["INPUT","TEXTAREA" ];
            if (is_array(controls,target.tagName)){
                $(target).addClass('controls')
            }

            var _id = $(target).parents("#right-component").attr("data-id");
            var _uuid = $(target).parents("#right-component").attr("data-uuid");
            var _href = $(target).attr("href");

            if (isNotNull(_href)){
                $("#menu").find(".share").attr("data-h",_href);
                $("#menu").find(".d-null").removeClass("disabled");
                $("#menu").find(".d-null").next('.dropdown-menu-s').removeClass('hide');
            }else {
                $("#menu").find(".d-null").addClass("disabled");
                $("#menu").find(".d-null").next('.dropdown-menu-s').addClass('hide');
            }

            if (!isNotNull(_id)){
                _id = $(target).parent("li").attr("data-id");
                _uuid = $(target).attr("data-uuid");
            }
            if (!isNotNull(_id)){
                _id = $(target).attr("data-id");
            }

            if (!isNotNull(_id) || _F){
                $("#menu").find(".d-null").addClass("disabled");
                __id = $(target).attr("data-id");
                if (_F && __id){
                    $("#menu .del").removeClass("disabled");
                }
            }else {
                $("#menu").find(".d-null").removeClass("disabled");
                $("#menu").find(".d-null").next('.dropdown-menu-s').removeClass('hide');
            }

            //取消默认的浏览器自带右键 很重要！！
            e.preventDefault();
            rigthKyeMenu(e.clientX, e.clientY);

            set_new_win(_href);
            set_copy(_href,_id);
            set_del(_id)
            set_print(_uuid)

            doc_select_hide();//关闭下拉菜单
        }
    };

    //关闭右键菜单 & 左键
    window.onclick = function (e) {
        i = e.target;
        if (e.button == 0) {
            if (i.id && i.id == "but-ellipsis") {
            } else {
                $("#menu").hide();
                $('.split-pane-divider').show();
            }

        }
    };

    //功能图标点击
    var dropdown = true;
    $('.data-toggle-dropdown').click(function () {
        if (dropdown || !$('#menu .dropdown-menu').is(':visible')){
            var xx = $(this).offset().left;
            var yy = $(this).offset().top + 20;
            rigthKyeMenu(xx, yy);
            $('.split-pane-divider').hide();
            $("#menu").find(".d-null").removeClass("disabled");
            if (!isNotNull(_DID)){
                $("#menu").find(".d-null").addClass("disabled");
                $("#menu").find(".d-null").next('.dropdown-menu-s').addClass('hide');
            }else {
                $("#menu").find(".d-null").removeClass("disabled");
                $("#menu").find(".d-null").next('.dropdown-menu-s').removeClass('hide');
            }
            dropdown = false;
        }else {
            $('.split-pane-divider').show();
            $("#menu").toggle();
            dropdown = true;
        }
    });

    if ($('.split-pane').length > 0){
        /*// 分割布局*/
        $('div.split-pane').splitPane();
        $("body").on("mouseup", function(event){
            c_set('w',parseInt($('#left-component').css('width')))
            /*//event.which可以返答回对应鼠标按键的键内值
            //1:左键  2:中键  3:右键*/
        });
    }


    /*//右边布局滚动条*/
    $("#right-component").mCustomScrollbar({
        theme: "minimal-dark",
        mouseWheelPixels: 300,
        scrollButtons: {
            enable: false,
            scrollType: "continuous",
            scrollSpeed: 100,
            scrollAmount: 40
        },
        mouseWheel: {preventDefault: true}
    });
});

function set_new_win(_h) {
    if (isNotNull(_h)){
        $("#menu").find(".new-win").attr('href',_h);
    }else {
        $("#menu").find(".new-win").attr('href',_h);
    }
}

function set_copy(_h,_id) {
    if (!isNotNull(_h)){
        _h = get_href();
    }

    if (isNotNull(_h)){
        _h = changeURLArg(_h,'copy',_id);
        _h = changeURLArg(_h,'pattern',2);
        $("#menu").find(".copy").attr('data-href',_h);
    }else {
    }
}

function set_del(_id) {
    if (isNotNull(_id)){
        var _h = $("#menu").find(".del").attr("href");
        if (!isNotNull(_h)) _h = $("#menu").find(".del").attr("data-href");
        if (!isNotNull(_h)) _h = get_href();
        _h = changeURLArg(_h,'id',_id);
        $("#menu").find(".del").attr('data-href',_h);
    }else {
        $("#menu").find(".del").addClass("disabled");
    }
}
function set_print(_id) {
    if (isNotNull(_id)){
        var _h = $("#menu").find(".print").attr("href");
        if (!isNotNull(_h)) _h = $("#menu").find(".print").attr("data-href");
        if (!isNotNull(_h)) _h = get_href();
        _h = changeURLArg(_h,'uuid',_id);
        $("#menu").find(".print").attr('data-href',_h);
    }else {
        $("#menu").find(".print").addClass("disabled");
    }
}

function share(_h) {
    if (!_h){
        _h = get_href();
    }
    var flag = copyText(_h);
    tips_msg(flag ? "复制成功！" : "复制失败！");
}

function isNotNull(str) {
    if (str != '' && str != null && typeof(str) != "undefined" && str != "javascript:;"){
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

function copyText(text) {
    var textarea = document.createElement("textarea");
    var currentFocus = document.activeElement;
    document.body.appendChild(textarea);
    textarea.value = text;
    textarea.focus();
    if (textarea.setSelectionRange)
        textarea.setSelectionRange(0, textarea.value.length);
    else
        textarea.select();
    try {
        var flag = document.execCommand("copy");
    } catch(eo){
        var flag = false;
    }
    document.body.removeChild(textarea);
    currentFocus.focus();
    return flag;
}

// NEW selector
jQuery.expr[':'].Contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
};
// OVERWRITES old selecor
jQuery.expr[':'].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
};
//Update to work for jQuery 1.8
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

$(window).scroll(function () {
    var _stop = $(window).scrollTop();
    if (_stop >= 100) {
        $(".go-top").fadeIn();
        if ($("#htmlfeedback-container").length) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            } else {
                $("#htmlfeedback-container").show()
            }
        }
    } else {
        $(".go-top").fadeOut()
    }
});

$(".go-top").click(function (event) {
    $("html,body").animate({scrollTop: 0}, 100);
    return false
});
$(window).resize(function () {
    var viewportWidth = $(window).width();
    if (window.location.href.indexOf("w3cnote") != -1) {
    } else {
        if (viewportWidth > 768) {
            $(".left-column").show()
        }
    }
    if (viewportWidth < 568) {
        $("#index-nav li").each(function (index) {
            if (index > 2) {
                $(this).hide()
            }
        })
    } else {
        $("#index-nav li").show()
    }
});
