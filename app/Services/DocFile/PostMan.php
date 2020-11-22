<?php

namespace App\Services\DocFile;

class PostMan
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

        $file_path = self::$doc_path . '/' . self::$title.'/-1' . self::$ext;
        $desc = empty($file_data['info']['description'])?'':$file_data['info']['description'];
        $file_data['item'] = array_merge([['name'=>'文档简述','desc'=>$desc,'data'=>$file_data]],$file_data['item']);
        file_put_contents($file_path, json_encode($file_data['info']));

        return json_encode(self::menus($file_data['item']));
    }

    /**
     * 列表
     * @param $data
     * @param string $n
     * @return array
     */
    private static function menus($data,$n='')
    {
        $d = [];
        foreach ($data as $key => $value) {
            $file_path = self::$doc_path . '/' . self::$title.'/'. $n.$key. '.' . self::$ext;
            $_d = [];
            if (isset($value['item'])) $_d = self::menus($value['item'],$n.$key);
            $d[] = ['name'=>$value['name'],'data'=>$file_path,'list'=>$_d];
            unset($value['item']);
            file_put_contents($file_path, json_encode($value));
        }
        return $d;
    }
}
