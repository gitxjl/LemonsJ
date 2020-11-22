<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\Request;
use App\Models\Users;
use JWTAuth;
use App\Services\Common;

class UserController extends Controller
{
    public function __construct()
    {
    }

    public function changed(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email|unique:users,email',
            'verification' => 'required',
        ]);
        $user = Users::where('verification', $request->verification)->first();
        if ($user) {
            $user->verification = verification();
            $user->verified = 0;
            $user->email = $request->email;
            $user->save();
            return abort(200, '更换成功');
        }

        return abort(401);
    }

    public function verify($token)
    {
        $user = Users::where('verification', $token)->first();
        if ($user) {
            $user->verification = verification();
            $user->verified = 1;
            $user->save();
            return abort(200, '激活成功');
        }

        return abort(401);
    }

    public function resend()
    {
        $user = JWTAuth::user();
        $email = $user->email;
        $user->verification = verification();
        $verified = $user->verified;
        $user->save();
        Common::send($user);
        throwSucceed(['email' => $email, 'verified' => $verified]);
    }

    public function send()
    {
        $user = JWTAuth::user();
        $email = $user->email;
        $verification = $user->verification;
        $verified = $user->verified;

        if ($verified == 1) {
            $user->verified = $verified = 2;
            $user->save();
            Common::send($user);
        }

        throwSucceed(['email' => $email, 'verified' => $verified]);
        throwException();
    }

    public function icon(Request $request)
    {
        $this->validate($request, [
            'icon' => 'required',
        ]);
        Users::where('id', app('auth')->id())->update(['icon' => $request->icon]) &&
        throwSucceed();
        throwException();
    }

    public function name(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|alpha_dash|unique:users,name',
        ]);
        Users::where('id', app('auth')->id())->update(['name' => $request->name]) &&
        throwSucceed(['name' => $request->name]);
        throwException();
    }
}