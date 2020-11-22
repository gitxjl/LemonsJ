<?php

namespace App\Http\Controllers\V1\Doc;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Doc;
use App\Models\ItemsUsers;
use App\Models\Items;
use App\Services\Export\PostMan;

class ExportController extends Controller
{
    static $item = [];

    /**
     * 创建或更新团队
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'iid' => 'required|integer',
            'type' => 'required|integer|between:4,8',
            'screen' => 'required|integer|in:1,0',
            'did' => 'nullable|json',
        ]);
        $data = $request->only(['iid', 'type', 'screen', 'did']);

        !ItemsUsers::permission($data['iid'], self::uid(), 1) && throwException(lang('msg.permissions_not_exist'));

        $cd = count($did = isset($data['did']) ? json_decode($data['did']) : []);
        $data['screen'] == 0 && $cd = 0;

        self::$item = Items::finds($data['iid'])->toArray();

        return throwSucceed(self::exportType(Doc::docs($data['iid'], $did, $cd), $data['type']));
    }

    static function exportType($docs, $t)
    {
        $d = [];
        switch ($t) {
            case 4:
                $d = PostMan::export(self::$item['name'],$docs);
                break;
            case 5:
                break;
            default:
                throwException(lang('msg.type_failed'));
                break;
        }

        empty($d) && throwException(lang('msg.get_data_failed'));

        return self::exportDataSave($d);
    }

    static function exportDataSave($d)
    {
        $file = self::$item['name'] . '_' . uuid() . '_' . date('y-m-d_H.i') . $d['ext'];
        file_put_contents('export/' . $file, json_encode($d));
        return $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['SERVER_NAME'] . '/download/' . $file;
    }




}
