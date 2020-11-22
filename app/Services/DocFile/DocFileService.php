<?php

namespace App\Services\DocFile;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Doc;

class DocFileService
{
    static $doc_path = 'file';
    static $title = '';
    static $ext = '';
    static $filename = '';
    static $storage_path = '';

    public static function upload(Request $request)
    {
        if(!$request->hasFile('file')) return true;
        (!$request->hasFile('file') || !$request->input('iid') || !$request->input('did')) && throwException(lang('msg.error_file_data'));

        $did = $request->input('did');

        $content = [];
        self::$storage_path = '/file/' . md5(Auth::id()) . '/';
        self::mkdir($did);//文件文档目录
        $file_contents = file_get_contents(self::save($request));//文档内容
        //文件上传 & 文件文档生成
        $file_data = json_decode($file_contents, true);
        $parameter = [self::$title, self::$ext];

        $type = 0;
        $name = $request->input('name');
        if (!empty($file_data['info']['name'])){
            $name = $file_data['info']['name'];
            $type = 4;
        }
        if (!empty($file_data['info']['title']) && !empty($file_data['swagger'])){
            $name = $file_data['info']['title'];
            $type = 5;
        }
        ($type == 0 || $name == '') && Doc::deleted($did) && (lang('msg.type_failed'));

        //存储文件
        $source = date('Ymd') .'/'.Auth::id().'/'. $name.date('YmdHim') .'.'.self::$ext;
        Storage::disk('public')->delete($request->input('source'));
        Storage::disk('public')->put($source, $file_contents);

        switch ($type) {
            case 4:
                $content = PostMan::init($file_data, $parameter);
                break;
            case 5:
                $content = Swagger::init($file_data, $parameter);
                break;
            default:
                Doc::deleted($did) && throwException(lang('msg.error_file_data_type'));
                break;
        }
        !$content && Doc::deleted($did) && throwException(lang('msg.error_file_data'));
        $data = [
            "name" => $name,
            "source" => $source,
            "content" => $content,
            "form" => 2,
            "type" => $type
        ];
        return Doc::updateOrCreate(['id' => $did], $data);
    }

    public static function save(Request $request)
    {
        ($fileCharater = $request->file('file')) && !$fileCharater->isValid() && throwException(lang('msg.update_failed'));
        self::$ext = $ext = $fileCharater->getClientOriginalExtension();//获取文件的扩展名
        !in_array('.' . $ext, config('filesystems.ext')) && throwException(lang('msg.type_failed'));
        return $fileCharater->getRealPath();//获取文件的绝对路径
    }

    private static function mkdir($path)
    {
        self::$title = $path;
        $api_path = self::$doc_path . '/' . self::$title;
        removeDir($api_path);
        mkdirDir($api_path);
        mkdirDir($api_path . '/mock/');
    }
}
