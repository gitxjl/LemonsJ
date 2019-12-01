<div class="ant_side">
    <div class="logo">
        <span><a href="">{{$data['info']['name']}}</a></span>
    </div>
    <div class="search">
        <div style="display:inline-block;position:relative;width: 100%;">
            <div style="position:absolute;right:2px;top:-2px;cursor:pointer;display:none;" class="input_clear">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                    ×
                </button>
            </div>
            <input type="search" placeholder="请输入" class="input-text w200 form-control" aria-describedby="basic-addon1" name="keyword" id="keyword" >
        </div>
    </div>
    <ul class="btn1">
        {!! $menusList !!}
    </ul>
</div>
