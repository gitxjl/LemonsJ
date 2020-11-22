$(function(){
    //右键菜单
    window.oncontextmenu = function (e) {
        e.preventDefault();
        window.parent.fuMenu({'x':e.screenX, 'y': e.clientY + window.parent.tabH()});

    };
});
