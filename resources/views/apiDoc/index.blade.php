@extends('apiDoc.layouts.index')

@section('title', $value['title'])

@section('menus')
    {!! $menus !!}
@endsection
{{--@section('title', $data['name'])--}}

@section('content')
    <div class="ant_layout">
        <div class="layout_content">
            <div class="row1">

                <table class="table01">
                    <tr>
                        <th>基本信息</th>
                    </tr>
                    <tr>
                        <td>接口名称: {{$value['name']}}</td>
                    </tr>
                    <tr>
                        <td>请求方法: {{@$value['request']['method']}}</td>
                        <td>数据类型: 请查看[Headers][Content-Type]</td>
                        <td>响应类型: 请查看[Response]或[结果返回-例子-Moke]</td>
                    </tr>
                    <tr>
                        <td>接口状态: 请查看[接口描述]</td>
                        <td>Moke地址: 请查看[Response Example 结果返回-例子-Moke][Moke地址]</td>
                    </tr>
                </table>

                <table class="table01">
                    <tr>
                        <th>接口地址</th>
                    </tr>
                    <tr>
                        <td>{{@$value['request']['url']['raw']}}</td>
                    </tr>
                </table>

                <table class="table01">
                    <tr>
                        <th>接口描述</th>
                    </tr>
                    <tr>
                        <td>{{@$value['request']['description']}}</td>
                    </tr>
                </table>

                @if (!empty($value['request']['header']))
                    <h4>Headers</h4>
                    <table class="table02">
                        <tr>
                            <td>参数名称</td>
                            <td>是否必须</td>
                            <td>类型</td>
                            <td>默认值</td>
                            <td>描述</td>
                        </tr>
                        @foreach ($value['request']['header'] as $val)
                            <tr>
                                <td>{{@$val['key']}}</td>
                                <td>{{@$val['disabled']?'否':'是'}}</td>
                                <td>{{@$val['type']}}</td>
                                <td>{{@$val['value']}}</td>
                                <td>{{@$val['description']}}</td>
                            </tr>
                        @endforeach
                    </table>
                @endif

                @if (!empty($value['request']['url']['query']))
                    <h4>Params GET 请求参数</h4>
                    <table class="table02">
                        <tr>
                            <td>参数名称</td>
                            <td>是否必须</td>
                            <td class="tableHidden">类型</td>
                            <td>默认值</td>
                            <td>描述</td>
                        </tr>

                        @foreach ($value['request']['url']['query'] as $val)
                            <tr>
                                <td>{{@$val['key']}}</td>
                                <td>{{@$val['disabled']?'否':'是'}}</td>
                                <td class="tableHidden">{{@$val['type']}}</td>
                                <td>{{@$val['value']}}</td>
                                <td>{{@$val['description']}}</td>
                            </tr>
                        @endforeach
                    </table>
                @endif

                @if (!empty($value['request']['body']))
                    <h4>Body POST 请求参数</h4>
                    <p>Boby类型：{{$value['request']['body']['mode']}}</p>
                    @if (!empty($value['request']['body']['mode']) && in_array($value['request']['body']['mode'],['formdata','urlencoded']))
                        <?php
                        if (!empty($value['request']['body']['urlencoded'])) {
                            $value['request']['body']['formdata'] = $value['request']['body']['urlencoded'];
                        }
                        ?>
                        <table class="table02">
                            <tr>
                                <td>参数名称</td>
                                <td>是否必须</td>
                                <td>类型</td>
                                <td>默认值</td>
                                <td>描述</td>
                            </tr>
                            @if (!empty($value['request']['body']['formdata']))
                                @foreach ($value['request']['body']['formdata'] as $val)
                                    <tr>
                                        <td>{{@$val['key']}}</td>
                                        <td>{{@$val['disabled']?'否':'是'}}</td>
                                        <td>{{@$val['type']}}</td>
                                        <td>{{@$val['value']}}</td>
                                        <td>{{@$val['description']}}</td>
                                    </tr>
                                @endforeach
                            @endif
                        </table>
                    @endif

                    @if (!empty($value['request']['body']['mode']) && in_array($value['request']['body']['mode'],['raw']))
                        @if (!empty($value['request']['body']['options']))
                            <table class="table03">
                                <tr>
                                    <td>参数名称</td>
                                    <td>值</td>
                                </tr>

                                @foreach ($value['request']['body']['options'] as $key => $val)
                                    <tr>
                                        <td width="100px">{{@$key}}</td>
                                        <td width="100px">
                                            @foreach ($val as $k => $v)
                                                <p>{{$k}}:{{$v}}</p>
                                            @endforeach
                                        </td>
                                    </tr>
                                @endforeach
                            </table>
                        @endif
                        <pre class="json-renderer">{{@$value['request']['body']['raw']}}</pre>
                    @endif

                    @if (!empty($value['request']['body']['mode']) && in_array($value['request']['body']['mode'],['file']))
                        <p><strong>file:</strong>{{@$value['request']['body']['file']['src']}}</p>
                    @endif

                    @if (!empty($value['request']['body']['mode']) && in_array($value['request']['body']['mode'],['graphql']))
                        @if (!empty($value['request']['body']['graphql']))
                            <p>graphql</p>
                            @if (!empty($value['request']['body']['graphql']['query']))
                                <pre class="json-renderer">{{@$value['request']['body']['graphql']['query']}}</pre>
                            @endif
                            @if (!empty($value['request']['body']['graphql']['variables']))
                                <pre class="json-renderer">{{@$value['request']['body']['graphql']['variables']}}</pre>
                            @endif
                        @endif
                    @endif
                @endif

                {{--Response Example 结果返回-例子-Moke--}}
                @include("apiDoc.layouts.response_example" , ["value" => $value])
            </div>
        </div>

    </div>

@endsection
