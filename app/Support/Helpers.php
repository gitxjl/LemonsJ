<?php

use Illuminate\Support\Facades\Redis;

function gPathLastName($p){
    $info = isset($p)?pathinfo($p):'';
    return $info?$info['basename']:$p;
}
function gDefinitions($a,$d){
    if (!is_array($a)) return $a;
    foreach ($a as $k => $v){
        if($k === '$ref'){
            $n = isset($v)?gPathLastName($v):$v;
            if (!empty($d[$n])) {
                $a['properties'] = gDefinitionsData($d[$n]);
                unset($a[$k]);
            }
        }else{
            $v && $a[$k] = gDefinitions($v,$d);
        }
    }
    return $a;
}
function gDefinitionsData($d){
    if (!empty($d['properties'])){
        return gDefinitionsDataEach($d['properties']);
    }

    return gDefinitionsDataEach($d);
}
function gDefinitionsDataEach($d){
    $_d = [];
    if (!is_array($d) || count($d)<=0)return ;
    foreach ($d as $k => $v){
        if (!empty($v['type'])){
            $_d[$k] = $v['type']=='integer'?0:$v['type'];
        }else{
            $_d[$k] = gDefinitionsDataEach($v);
        }
    }
    return $_d;
}
function trues(){
    return true;
}
function changed_email(){
    return token(6).'-'.uuid();
}
function verification(){
    return token(6).'-'.uuid();
}
function token($length){
    $str = md5(time());
    $token = substr($str,5,$length);
    return $token;
}
function parameterExport($d, $ks)
{
    foreach ($d as $key => $val) {
        if (empty($val) || $val == null) continue;
        foreach ($val as $k => $v) {
            if ($k == $ks) {
                foreach ($v as $_k => $_v) {
                    !empty($v[$_k]['item']) && $v[$_k]['description'] = $v[$_k]['description'] . '-' . json_encode($v[$_k]['item']);
                    unset($v[$_k]['item']);
                }
                return $v;
            }
        }
    }
    return [];
}

function uuid()
{
    if (function_exists('com_create_guid')) {
        return com_create_guid();
    } else {
        mt_srand((double)microtime() * 10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = substr($charid, 0, 8) . $hyphen
            . substr($charid, 8, 4) . $hyphen
            . substr($charid, 12, 4) . $hyphen
            . substr($charid, 16, 4) . $hyphen
            . substr($charid, 20, 12);// "}"
        return $uuid;
    }
}
function getIdArr($data){
    $a = [];
    foreach ($data as $v){
        $a[] = $v['id'];
    }
    return $a;
}

function getIID($data,$iid){
    if($iid > 0) return $iid;
    return count($data) > 0 ? $data->first()->id : 0;
}

//Examples
function getOriginalRequestUrlByQuery($data)
{
    $urlPath = '';

    if (isset($data['path'])) {
        $urlPath .= implode('/', $data['path']);
    }
    if (isset($data['raw'])) {
        $arr = parse_url($data['raw']);
        $urlPath .= isset($arr['query']) ? '?' . $arr['query'] : '';
    }
    return $urlPath;
}

function removeDir($dirName)
{
    if (!is_dir($dirName)) {
        return false;
    }
    $handle = @opendir($dirName);
    while (($file = @readdir($handle)) !== false) {
        if ($file != '.' && $file != '..') {
            $dir = $dirName . '/' . $file;
            is_dir($dir) ? removeDir($dir) : @unlink($dir);
        }
    }
    closedir($handle);

    return rmdir($dirName);
}

function mkdirDir($path)
{
    if (!is_dir($path)) mkdir($path, 0777, true);
}

function docs($data, $pid = 0)
{
    $html = '';
    foreach ($data as $key => $val) {
        if ($val['pid'] == $pid) {
            if (in_array($val['type'],[5,6,7,8,9])){
                $menus_list = file_content_menus($val['content'],$val['type']);
            }else{
                $menus_list = docs($data, $val['id']);
            }
            if (strlen($menus_list) > 0 || $val['form'] == 1) {
                $html .= '<li ><a form="' . $val['form'] . '" data-id="' . $val['id'] . '"><i class="fa fa-i fa-angle-right"></i><i class="fa fa-folder-o"></i><bg></bg>' . $val['name'] . '</a>';
                $html .= '<ul>';
                $html .= $menus_list;
                $html .= '</ul>';
            } else {
                $fa = type_i($val['type']);
                $html .= '<li data-id="' . $val['id'] . '"><a form="' . $val['form'] . '" data-id="' . $val['id'] . '" data-uuid="' . $val['uuid'] . '" class="cma ' . $val['uuid'] . '">' . $fa . '<bg></bg>' . $val['name'] . '</a>';
            }
            unset($data[$key]);
            $html .= '</li>';
        }
    }
    return $html;
}

function get_content_menus($d,$t,$p=''){
    $h = '';
    if (empty($d)) return '';
    if ($p) $h .= '<ul>';
    foreach ($d as $k => $v){
        $_p = $p . $k;
        $h .= '<li>';
        if (isset($v['i'])) {
            $_m = get_content_menus($v['i'],$t, $_p);
            $h .= '<a><i class="fa fa-i fa-angle-down"></i><i class="fa fa-folder-o"></i><bg></bg>' . $v['n'] . '</a>';
            $h .= $_m;
        } else {
            $h .= '<a class="cma" href="' . $v['h'] .'" f="' . $v['f'] . '" t="' . $t . '">'.type_i($t).'<bg></bg>' . $v['n'] . '</a>';
        }
        $h .= '</li>';

    }
    if ($p) $h .= '</ul>';
    return $h;
}

function file_content_menus($d,$t){
    $d = json_decode($d,true);
    return get_content_menus($d,$t);
}
//文档类型：0：富文本；1：表格文档；2：markdown；3：文件文档
function type_i($type)
{
    $iList = [
        0 => '<i class="fa fa-code"></i>',
        1 => '<i class="fa fa-th-large"></i>',
        2 => '<i class="editormd-logo editormd-logo-color"></i>',
        3 => '<i class="fa fa-curl"></i>',
        4 => '<i class="fa fa-hjson"></i>',
        5 => '<i class="fa fa-postman"></i>',
        6 => '<i class="fa fa-swagger"></i>',
        7 => '<i class="fa fa-open-api"></i>',
        8 => '<i class="fa fa-yaml"></i>',
        9 => '<i class="fa fa-header"></i>',
        10 => '<i class="fa fa-file-word-o"></i>',
        11 => '<i class="fa fa-file-excel-o"></i>',
        12 => '<i class="fa fa-file-pdf-o"></i>',
    ];

    if (isset($iList[$type]))
        return $iList[$type];

    return $iList[0];
}


function lang($key){
    return Illuminate\Support\Facades\Lang::get($key);
}
/**
 * 抛出异常 用于三元运算
 * throwException('msg!') 与 throw new \Exception('msg!') 的区别：
 *      throwException('msg!')：常规错误消息，msg展示在response 'msg'
 *      throw new \Exception('msg!')：常规错误消息，msg展示在response 'error',response 'msg' 用来显示，'error'为系统错误
 * @param string $msg
 * @param int $code
 * @throws Exception
 */
function throwException($msg=null,$code=CODE_FAILURE, $data = []){
    !$msg && $msg = lang('msg.failed');
    Session::put('responses',$data);
    throw new \Exception($msg, $code);
}

function throwSucceed($data = [],$msg=null){
    !$msg && $msg = lang('msg.succeed');
    Session::put('responses',$data);
    throw new \Exception($msg, CODE_SUCCESS);
}

/**
 * 获取数组key指定获取值
 * @param $a
 * @param $k
 */
function values($a,$k){
    try{
        return $a[$k];
    }catch(\Exception $e) {
        return;
    }
}

