<?php

namespace App\Http\Controllers\Api;

use Dingo\Api\Routing\Helpers;
//use Illuminate\Routing\Controller;
use App\Http\Controllers\Controller;
use App\Models\User;

class UsersController extends Controller
{
    use Helpers;

    public function __construct()
    {
        $this->middleware('api.auth');
    }
    public function index(){
//        throw new \Exception('测试-触发错误', -1001);
//        return User::all();
//        return ['code' => 1, 'msg' => 1, 'data' => User::all()];
//        return $this->response->array(User::all());
//        var_dump(User::all());exit;
        $user = $this->success(User::all());

        return $user;
    }
}
