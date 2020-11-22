<?php

use Illuminate\Support\Facades\Route;

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
Route::get('/', function (){
    return view()->file(public_path().'/index.html');
});
Route::group(['prefix'=>'verify','namespace' => 'V1'],function(){
    Route::get('/changed{token}', function ($token){
        return abort(210,$token);
    });
    Route::post('/changed', 'UserController@changed');
    Route::get('{token}', 'UserController@verify');
});

Route::get('download/{file}',function($file){
    return response()->download(realpath(base_path('public')).'/export/'.$file, $file);
});