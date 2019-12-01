<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('apiDoc.index');
});
Route::get('/api/create/{apiName}', 'ApiDocController@index');
Route::get('/api/mock/{apiName}/{slashName?}', 'ApiDocController@mock')
    ->where('slashName', '(.*)');
