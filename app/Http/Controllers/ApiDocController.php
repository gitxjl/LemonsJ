<?php

namespace App\Http\Controllers;

class ApiDocController extends Controller
{
    static $api_path_name = 'apiDoc';
    static $menus = '';
    static $title = '';
    static $host = '';
    static $api_doc_url = '';

    public function index($apiName)
    {
        $jsonData = file_get_contents('file/' . $apiName);
        $data = json_decode($jsonData, true);
        self::$title = $data['info']['name'];
        $api_path = self::$api_path_name . '/' . self::$title;
        removeDir($api_path);
        mkdirDir($api_path);
        mkdirDir(self::$api_path_name . '/' . self::$title . '/mock/');

        $menusList = self::getMenus($data['item']);
        self::$menus = view('apiDoc.layouts.menu', compact('data', 'menusList'))->__toString();
        self::$host = get_server_host();

        self::set_html($data['item'], $api_path);
        return $this->success(["doc_url" => self::$host . '/' . self::$api_doc_url]);
    }

    //菜单列表
    static function getMenus($data, $path = null)
    {
        $html = '';
        if ($path) $html .= '<ul class="hidden">';
        if (!$path) {
            $path = self::$api_path_name . '/' . self::$title;
            $in_path = self::$api_path_name . '/' . self::$title;
        } else {
            $in_path = $path;
        }

        foreach ($data as $key => $value) {
            $path = $path . '/' . $key;
            $html .= '<li>';
            if (isset($value['item'])) {
                $html .= '<a href="javaScript:;">
                <span>' . $value['name'] . '</span>
                <span class="pull_down">∨</span>
            </a>';
                $html .= self::getMenus($value['item'], $path);
            } else {
                $md5Path = md5($path);
                $_url = $path . '.html?path=' . $md5Path;
                $html .= '<a href="/' . $_url . '" class="' . $md5Path . '"><span>' . $value['name'] . '</span></a>';
            }
            $html .= '</li>';
            $path = $in_path;
        }
        if ($path) $html .= '</ul>';
        return $html;
    }

    //生成静态文档
    static function set_html($data, $path = null)
    {
        if (!$path) {
            $path = self::$api_path_name;
            $in_path = self::$api_path_name;
        } else {
            $in_path = $path;
        }
        foreach ($data as $key => $value) {
            $path = $path . '/' . $key;
            if (isset($value['item'])) {
                mkdirDir($path);
                self::set_html($value['item'], $path);
            } else {
                // 生成mock文件
                foreach ($value['response'] as $key => $val) {
                    if (empty($val['body']['originalRequest']['url']) && empty($val['originalRequest']['url'])) continue;
                    $urlPath = getOriginalRequestUrlByQuery($val['originalRequest']['url']);
                    if (isset($urlPath)) {
                        $value['response'][$key]['mock_url']['host'] = self::$host . '/api/mock/' . self::$title . '/';
                        $value['response'][$key]['mock_url']['path'] = $urlPath;
                        $responseFile = self::$api_path_name . '/' . self::$title . '/mock/' . md5($urlPath) . '.txt';
                        file_put_contents($responseFile, $val['body']);
                    }
                }

                // 生成html文件
                $file = $path . '.html';
                $menus = self::$menus;
                $value['title'] = self::$title;
                if (empty(self::$api_doc_url)) self::$api_doc_url = $file;

                $blade = view('apiDoc.index', compact('menus', 'value'))->__toString();
                file_put_contents($file, $blade);
            }
            $path = $in_path;
        }
    }

    //接口mock
    public function mock($apiName, $slashName)
    {
        $url_path = md5($slashName . '?' . urldecode($_SERVER["QUERY_STRING"]));
        $file_path = self::$api_path_name . '/' . $apiName . '/mock/' . $url_path . '.txt';
        if (is_file($file_path)) {
            $txt = file_get_contents($file_path);
            return $this->successMock($txt);
        }

    }


}
