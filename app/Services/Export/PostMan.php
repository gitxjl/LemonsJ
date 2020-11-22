<?php

namespace App\Services\Export;
use Illuminate\Support\Facades\Storage;
class PostMan
{

    public function __construct()
    {
    }

    public static function export($n,$docs)
    {
        return [
            'info' =>
                [
                    '_postman_id' => '',
                    'name' => $n,
                    'schema' => 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
                ],
            'item' => self::postMan($docs),
            'ext' => '.json',
        ];
    }

    static function postMan($d, $pid = 0)
    {
        $e = [];
        foreach ($d as $k => $v) {
            if ($v['pid'] != $pid) continue;

            if ($v['type'] > 3) {
                if ($v['source']){
                    $source = Storage::disk('public')->get($v['source']);
                    if ($source){
                        $source = json_decode($source,true);
                        if ($v['type'] == 4) {
                            $e = array_merge($e, $source['item']);
                        }
                    }
                }
                continue;
            }

            $content = [];
            $header = $body = $query = '';
            if ($v['type'] == 1) {
                $content = json_decode($v['content'], true);
                $v['content'] = '';
                if (is_array($content) && array_key_exists('parameter', $content)) {
                    $header = parameterExport($content['parameter'], 'Headers');
                    $body = parameterExport($content['parameter'], 'Body');
                    $query = parameterExport($content['parameter'], 'Params');
                }
            }
            $v['content'] = $v['content'] . values($content, 'intro');
            $v['name'] = $v['type'] == 1 || strlen($v['content'])<=0 ? $v['name'] : $v['name'] . '-（unfold description）';
            $item = [
                'name' => $v['name'],
                'dType' => $v['type'],
                'response' => '',
                'request' => [
                    'method' => values($content, 'method'),
                    'header' => $header,
                    'body' => [
                        'mode' => 'formdata',
                        'formdata' => $body,
                    ],
                    'url' => [
                        'raw' => values($content, 'url'),
                        'query' => $query,
                    ],
                    'description' => $v['content'],
                ],
                'item' => self::postMan($d, $v['id']),
            ];

            if ($v['form'] == 0) unset($item['item']);

            $e[] = $item;
            unset($d[$k]);
        }
        return $e;
    }
}
