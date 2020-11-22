function set_doc_text_data(_d) {
    if (_d){
        try{
            var _d = JSON.parse(_d);
            if (isNotNull(_d.content)) $('.content').val(_d.content);
            if (isNotNull(_d.intro)) $('.intro').val(_d.intro);
        }catch (e) {
            hint('数据解析错误!');
        }
    }else {
        $('.intro').val('');
        $('.bulk_edit').val('');
    }
}