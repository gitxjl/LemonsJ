<?php
$api = app('Dingo\Api\Routing\Router');
$api->version('v1', ['namespace' => 'App\Http\Controllers\V1'], function ($api) {
    $api->post('register', 'AuthController@register');// 注册
    $api->post('login', 'AuthController@login')->name('login'); // 登录

    $api->group(['middleware' => 'auth.jwt'], function ($api) {
        $api->get('logout', 'AuthController@logout'); // 退出
        $api->get('info', 'AuthController@info'); // 用户信息
        $api->get('refresh', 'AuthController@refresh'); // 刷token

        //用户账号相关管理
        $api->get('/resend', 'UserController@resend'); // resend
        $api->get('/send', 'UserController@send'); // 模板文档目录
        $api->post('icon', 'UserController@icon');// 修改用户icon
        $api->post('name', 'UserController@name');// 修改用户名

    });

    $api->group(['namespace' => 'Doc', 'middleware' => 'auth:api'], function ($api) {
        // 文档管理
        $api->resource('/doc', 'IndexController');
        $api->get('/tdl/{type}', 'IndexController@tdl'); // 模板文档目录
        $api->post('/catalog', 'IndexController@catalogStore'); // 文档目录
        $api->get('/catalog/{iid}', 'IndexController@catalog'); // 文档目录
        $api->post('/catalog/sort', 'IndexController@catalogSort'); // 文档目录排序
        $api->get('/mock/{apiName}/{slashName?}', 'IndexController@mock')->where('slashName', '(.*)');// 文件文档mock

        // 项目管理
        $api->get('/item/all', 'ItemsController@all'); // 转让项目
        $api->get('/item/list', 'ItemsController@list'); // 转让项目
        $api->resource('/item', 'ItemsController');
        $api->post('/item/transfer', 'ItemsUsersController@transfer'); // 转让项目

        // 项目用户管理
        $api->resource('/item_user', 'ItemsUsersController');
        $api->post('/item_user/batch', 'ItemsUsersController@batchStore'); // 批量创建或更新项目成员

        // 团队管理
        $api->get('/team/all', 'TeamsController@all'); // 所有团队
        $api->resource('/team', 'TeamsController');

        // 团队用户管理
        $api->resource('/team_user', 'TeamsUsersController');
        $api->post('/team_user/batch', 'TeamsUsersController@batchStore'); // 批量创建或更新团队成员
        $api->post('/team_user/sortable', 'TeamsUsersController@sortableStore'); // sortable更新团队成员

        // 用户好友管理
        $api->resource('/friend', 'FriendController');

        $api->resource('/export', 'ExportController');
    });
});

$api->version('v2', function ($api) {
    $api->get('test', function () {
        return 'this is test dingo api 切换版本';
    });

    $api->get('test2', function () {
        return 'this is test dingo test2 切换版本';
    });
});