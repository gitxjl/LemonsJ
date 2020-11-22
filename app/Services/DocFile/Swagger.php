<?php

namespace App\Services\DocFile;

class Swagger
{
    static $doc_path = 'file';
    static $menus = '';
    static $title = '';
    static $ext = '';

    public function __construct()
    {
    }


    /**
     * 文档文件/目录生成
     * @param $file_data
     * @param $parameter
     * @return array
     */
    public static function init($file_data, $parameter)
    {
        self::$doc_path = config('filesystems.file_path');
        self::$title = $parameter[0];
        self::$ext = $parameter[1];
        $d = [];

        empty($file_data['tags']) && throwException(lang('msg.error_file_data'));

        $tags = $file_data['tags'];
        $paths = $file_data['paths'];
        $definitions = $file_data['definitions'] = gDefinitions($file_data['definitions'],$file_data['definitions']);
        unset($file_data['tags'],$file_data['paths'],$file_data['definitions']);

        $file_path = self::$doc_path . '/' . self::$title.'/-1.' . self::$ext;
        $d[] = ['name'=>'文档简述','desc'=>$file_data['info']['description'],'data'=>$file_path];

        file_put_contents($file_path, json_encode($file_data));

        unset($file_data);

        $kk=0;
        foreach ($tags as $key => $val) {
            $_d = [];
            foreach ($paths as $k => $v) {
                $is = 0;
                foreach ($paths as $_k => $_v) {

                    foreach ($_v as $__k => $__v) {
                        foreach ($__v['tags'] as $___k => $___v) {
                            if($___v == $val['name']){
                                $__v['url'] = $_k;
                                $__v['method'] = $__k;
                                $file_path = self::$doc_path . '/' . self::$title.'/'. $key.$kk.$___k. '.' . self::$ext;
                                $_d[] = ['name'=>$__v['summary'],'data'=>$file_path];
                                file_put_contents($file_path, json_encode(gDefinitions($__v,$definitions)));
                                $is = 1;
                                unset($__v['tags'][$___k]);
                                unset($paths[$_k][$__k][$___k]);
                                $kk++;
                            }
                            if (count($__v['tags'])==0) unset($paths[$_k][$__k]);
                        }
                    }
                }
                if($is == 1) unset($paths[$k]);
            }
            $d[] = ['name'=>$val['name'],'desc'=>$val['description'],'content'=>json_encode($val),'list'=>$_d];
        }
        return json_encode($d);
    }

}
