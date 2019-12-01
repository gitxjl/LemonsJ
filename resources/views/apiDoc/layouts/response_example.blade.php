@if (!empty($value['response']))
    <h4>Response Example 结果返回-例子-mock </h4>

    <table class="table01">


        @foreach ($value['response'] as $key => $val)
            <tr>
                <td valign="top" style="width: 150px;text-indent: 0px;"><strong>Examples {{$key+1}}</strong></td>
                <td>
                    <p><strong>Name(Examples名称):</strong>{{@$val['name']}}</p>
                    <p><strong>Mock地址:</strong></p>
                    @if (!empty($val['mock_url']))
                        <table class="table02">
                            <tr>
                                <td>host:</td>
                                <td>{{$val['mock_url']['host']}}</td>
                            </tr>
                            <tr>
                                <td>path:</td>
                                <td>{{$val['mock_url']['path']}}</td>
                            </tr>
                        </table>
                    @endif
                    <p class="requestDatabase">...</p>
                    <p class="showRequest">已隐藏其他Request数据 [查看]</p>
                    <p class="showRequestTip">...... ... .</p>
                    <div class="requestDatabase">

                        <p><strong>Original Request:</strong></p>
                        @if (!empty($val['originalRequest']))
                            <table class="table01">
                                <tr>
                                    <td>method:</td>
                                    <td>{{$val['originalRequest']['method']}}</td>
                                </tr>
                                <tr>
                                    <td>url:</td>
                                    <td>
                                        <table class="table02">
                                            <tr>
                                                <td>{{@$val['originalRequest']['url']['raw']}}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>header:</td>
                                    <td>
                                        @if (!empty($val['originalRequest']['header']))
                                            <p>&nbsp;</p>
                                            <table class="table02">
                                                <tr>
                                                    <td>参数名称</td>
                                                    <td>是否必须</td>
                                                    <td>类型</td>
                                                    <td>默认值</td>
                                                    <td>描述</td>
                                                </tr>
                                                @foreach ($val['originalRequest']['header'] as $v)
                                                    <tr>
                                                        <td>{{@$v['key']}}</td>
                                                        <td>{{@$v['disabled']?'否':'是'}}</td>
                                                        <td>{{@$v['type']}}</td>
                                                        <td>{{@$v['value']}}</td>
                                                        <td>{{@$v['description']}}</td>
                                                    </tr>
                                                @endforeach
                                            </table>
                                        @endif
                                    </td>
                                </tr>
                                <tr>
                                    <td>body:</td>
                                    <td>
                                        @if (!empty($val['originalRequest']['body']))
                                            <h4>Body POST 请求参数</h4>
                                            <p>Boby类型：{{$val['originalRequest']['body']['mode']}}</p>
                                            @if (!empty($val['originalRequest']['body']['mode']) && in_array($val['originalRequest']['body']['mode'],['formdata','urlencoded']))
                                                <?php
                                                if (!empty($val['originalRequest']['body']['urlencoded'])) {
                                                    $val['originalRequest']['body']['formdata'] = $val['originalRequest']['body']['urlencoded'];
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
                                                    @if (!empty($val['originalRequest']['body']['formdata']))
                                                        @foreach ($val['originalRequest']['body']['formdata'] as $v)
                                                            <tr>
                                                                <td>{{@$v['key']}}</td>
                                                                <td>{{@$v['disabled']?'否':'是'}}</td>
                                                                <td>{{@$v['type']}}</td>
                                                                <td>{{@$v['value']}}</td>
                                                                <td>{{@$v['description']}}</td>
                                                            </tr>
                                                        @endforeach
                                                    @endif
                                                </table>
                                            @endif

                                            @if (!empty($val['originalRequest']['body']['mode']) && in_array($val['originalRequest']['body']['mode'],['raw']))
                                                @if (!empty($val['originalRequest']['body']['options']))
                                                    <table class="table03">
                                                        <tr>
                                                            <td>参数名称</td>
                                                            <td>值</td>
                                                        </tr>

                                                        @foreach ($val['originalRequest']['body']['options'] as $key => $v)
                                                            <tr>
                                                                <td width="100px">{{@$key}}</td>
                                                                <td width="100px">
                                                                    @foreach ($v as $k => $vs)
                                                                        <p>{{$k}}:{{$vs}}</p>
                                                                    @endforeach
                                                                </td>
                                                            </tr>
                                                        @endforeach
                                                    </table>
                                                @endif
                                                <pre
                                                    class="json-renderer">{{@$val['originalRequest']['body']['raw']}}</pre>
                                            @endif

                                            @if (!empty($val['originalRequest']['body']['mode']) && in_array($val['originalRequest']['body']['mode'],['file']))
                                                <p>
                                                    <strong>file:</strong>{{@$val['originalRequest']['body']['file']['src']}}
                                                </p>
                                            @endif

                                            @if (!empty($val['originalRequest']['body']['mode']) && in_array($val['originalRequest']['body']['mode'],['graphql']))
                                                @if (!empty($val['originalRequest']['body']['graphql']))
                                                    <p>graphql</p>
                                                    @if (!empty($val['originalRequest']['body']['graphql']['query']))
                                                        <pre
                                                            class="json-renderer">{{@$val['originalRequest']['body']['graphql']['query']}}</pre>
                                                    @endif
                                                    @if (!empty($val['originalRequest']['body']['graphql']['variables']))
                                                        <pre
                                                            class="json-renderer">{{@$val['originalRequest']['body']['graphql']['variables']}}</pre>
                                                    @endif
                                                @endif
                                            @endif
                                        @endif
                                    </td>
                                </tr>

                                <tr>
                                    <td>url query:</td>
                                    <td>
                                        @if (!empty($val['originalRequest']['url']['query']))
                                            <h4>Params GET 请求参数</h4>
                                            <table class="table02">
                                                <tr>
                                                    <td>参数名称</td>
                                                    <td>是否必须</td>
                                                    <td class="tableHidden">类型</td>
                                                    <td>默认值</td>
                                                    <td>描述</td>
                                                </tr>

                                                @foreach ($val['originalRequest']['url']['query'] as $v)
                                                    <tr>
                                                        <td>{{@$v['key']}}</td>
                                                        <td>{{@$v['disabled']?'否':'是'}}</td>
                                                        <td class="tableHidden">{{@$v['type']}}</td>
                                                        <td>{{@$v['value']}}</td>
                                                        <td>{{@$v['description']}}</td>
                                                    </tr>
                                                @endforeach
                                            </table>
                                        @endif
                                    </td>
                                </tr>

                            </table>

                        @endif
                        <p><strong>Status:</strong>{{@$val['status']}}</p>
                        <p><strong>Code:</strong>{{@$val['code']}}</p>
                        <p><strong>Postman Preview Language:</strong>{{@$val['_postman_previewlanguage']}}</p>

                        <p><strong>Header:</strong></p>
                        @if (!empty($val['header']))
                            <table class="table01">
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                    <td>
                                        <table class="table02">
                                            <tr>
                                                <td>参数名称</td>
                                                <td>是否必须</td>
                                                <td>类型</td>
                                                <td>默认值</td>
                                                <td>描述</td>
                                            </tr>
                                            @foreach ($val['header'] as $v)
                                                <tr>
                                                    <td>{{@$v['key']}}</td>
                                                    <td>{{@$v['disabled']?'否':'是'}}</td>
                                                    <td>{{@$v['type']}}</td>
                                                    <td>{{@$v['value']}}</td>
                                                    <td>{{@$v['description']}}</td>
                                                </tr>
                                            @endforeach
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        @endif

                        <p><strong>Cookie:</strong></p>
                        @if (!empty($val['cookie']))
                            <table class="table01">
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                    <td>
                                        <table class="table02">
                                            <tr>
                                                <td>参数名称</td>
                                                <td>是否必须</td>
                                                <td>类型</td>
                                                <td>默认值</td>
                                                <td>描述</td>
                                            </tr>
                                            @foreach ($val['cookie'] as $v)
                                                <tr>
                                                    <td>{{@$v['key']}}</td>
                                                    <td>{{@$v['disabled']?'否':'是'}}</td>
                                                    <td>{{@$v['type']}}</td>
                                                    <td>{{@$v['value']}}</td>
                                                    <td>{{@$v['description']}}</td>
                                                </tr>
                                            @endforeach
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        @endif
                    </div>
                    <p><strong>Body:</strong></p>
                    <pre class="json-renderer">{{empty($val['body']) ? 'NULL': $val['body']}}</pre>
                </td>
            </tr>

        @endforeach
    </table>
@endif
