if (window.localStorage) {
    var mx = window.localStorage.getItem('MX');

    var t = 0;//window.localStorage.getItem('TAB');
    var _token = window.localStorage.getItem('TOKEN');
    var s = '';
    if (!_token){
        s += '#split{left:0px;}#sidebar{width:0px;}#container{left:0px;}';
        insertStyles(document,s);
    }else {
        s += '#split{left:'+mx+'px;}#sidebar{width:'+mx+'px;}#container{left:'+mx+'px;}';
        if (mx && mx >= 0) insertStyles(document,s);
    }
}
function insertStyles(){
    var doc,cssCode=[],cssText;
    var len = arguments.length;
    var head,style,firstStyle;

    if(len == 1){
        doc = document;
        cssCode.push(arguments[0])
    }else if(len == 2){
        doc = arguments[0];
        cssCode.push(arguments[1]);
    }else{
        console.log("The function takes at most two arguments！");
    }
    head = doc.getElementsByTagName("head")[0];
    styles= head.getElementsByTagName("style");
    if(styles.length == 0){
        if(doc.createStyleSheet){//ie
            doc.createStyleSheet();
        }else{
            var tempStyle = doc.createElement("style");
            tempStyle.setAttribute("type","text/css");
            head.appendChild(tempStyle);
        }
    }
    firstStyle = styles[0];
    cssText=cssCode.join("\n");
    if(!+"\v1"){//opacity compatibility
        var str = cssText.match(/opacity:(\d?\.\d+);/);
        if(str!=null){
            cssText = cssText.replace(str[0],"filter:alpha(opacity="+pareFloat(str[1])*100+")");
        }
    }
    if(firstStyle.styleSheet){
        firstStyle.styleSheee.cssText += cssText;
    }else if(doc.getBoxObjectFor){
        firstStyle.innerHTML += cssText;
    }else{
        firstStyle.appendChild(doc.createTextNode(cssText));
    }
}