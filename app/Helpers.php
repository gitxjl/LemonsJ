<?php

function mkdirDir($path)
{
    if (!is_dir($path)) mkdir($path, 0777, true);
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

// php 获取当前访问的完整url
function get_server_host()
{
    $url = 'http://';
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
        $url = 'https://';
    }

    // 判断端口
    if ($_SERVER['SERVER_PORT'] != '80') {
        $url .= $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
    } else {
        $url .= $_SERVER['SERVER_NAME'];
    }

    return $url;
}


// php 获取当前访问的完整url
function GetCurUrl()
{
    $url = 'http://';
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
        $url = 'https://';
    }

    // 判断端口
    if ($_SERVER['SERVER_PORT'] != '80') {
        $url .= $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . ':' . $_SERVER['REQUEST_URI'];
    } else {
        $url .= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
    }

    return $url;
}
