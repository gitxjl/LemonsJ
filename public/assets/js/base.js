$(function(){
    $(document).on('click','.combobox-dl dd a',function (e) {
        var _this = $(this);
        var dl = $(this).next('dl');
        _this.closest('.combobox-dl').find('a').removeClass('active');
        _this.addClass('active');
        if (dl.length > 0){
            dl.slideToggle(300);
            _this.children('i.bi-right').toggleClass('bi-down');
        }
    });
    $(document).on('click','.combobox-t',function (e) {
        var _this = $(this);
        var box = $(this).next('.combobox-box');
        if (box.length > 0){
            $('.combobox-t').not($(this)).removeClass('combobox-show');
            $('.combobox').not($(this).parent('.combobox')).find('.combobox-box').hide();
            box.slideToggle(300);

            if (_this.hasClass('combobox-show')) {
                setTimeout(function(){
                    _this.removeClass('combobox-show')
                },300);
            }else {
                _this.addClass('combobox-show');
            }


        }
    });

    //右键菜单 start
    //关闭右键菜单 & 左键
    window.onclick = function (e) {
        var _con = $('.combobox');
        if(!_con.is(e.target) && _con.has(e.target).length===0){
            $('.combobox-t').removeClass('combobox-show');
            $('.combobox').find('.combobox-box').hide();
        }
    };

    //右键菜单
    window.oncontextmenu = function (e) {
        e.preventDefault();
        window.parent.fuMenu({'x':e.clientX, 'y': e.clientY + window.parent.tabH()});
        // window.parent.fuMenu({'x':e.screenX, 'y': e.clientY + window.parent.tabH()});

    };
    //关闭右键菜单 & 左键
    window.onclick = function (e) {
        window.parent.closeFuMenu(e);
    };
    //右键菜单 end
});
