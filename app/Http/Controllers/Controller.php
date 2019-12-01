<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    //成功返回
    public function successMock($data){
        $this->parseNull($data);
        return response()->json($data,200);
    }

    //成功返回
    public function success($data,$msg="ok"){
        $this->parseNull($data);
        $result = [
            "code"=>0,
            "msg"=>$msg,
            "data"=>$data,
        ];
        return response()->json($result,200);
    }

    //失败返回
    public function error($code="422",$data="",$msg="fail"){
        $result = [
            "code"=>$code,
            "msg"=>$msg,
            "data"=>$data
        ];
        return response()->json($result,200);
    }

    //如果返回的数据中有 null 则那其值修改为空 （安卓和IOS 对null型的数据不友好，会报错）
    private function parseNull(&$data){
        if(is_array($data)){
            foreach($data as &$v){
                $this->parseNull($v);
            }
        }else{
            if(is_null($data)){
                $data = "";
            }
        }
    }
}
