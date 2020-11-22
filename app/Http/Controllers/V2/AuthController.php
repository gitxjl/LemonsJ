<?php

namespace App\Http\Controllers\V2;

use Illuminate\Http\Request;
use App\Models\Users;
use JWTAuth;

class AuthController extends Controller
{
    public $loginAfterSignUp = true;

    public function __construct()
    {
    }

    /**
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|alpha_dash|unique:users,name',
            'password' => 'required|alpha_dash|min:6|max:18',
            'email' => 'required|email|unique:users,email',
        ]);

        $user = new Users;
        $user->name = $request->name;
        $user->password = bcrypt($request->password);
        $user->email = $request->email;
        !$user->save() && throwException(lang('msg.register_failed'));

        if ($this->loginAfterSignUp) return $this->login($request);

        throwSucceed();
    }

    /**
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|alpha_dash',
            'password' => 'required|alpha_dash|min:6|max:18'
        ]);

        ($token = JWTAuth::attempt($request->only('name', 'password'))) &&
        throwSucceed([
            'token' => $token,
            'expires' => JWTAuth::factory()->getTTL() * 60
        ], lang('msg.login_succeed'));

        throwException(lang('msg.auth_failed'));
    }

    /**
     * @param Request $request
     * @throws \Exception
     *
     */
    public function info()
    {
        throwSucceed(JWTAuth::user());
    }

    /**
     * @throws \Exception
     */
    public function logout()
    {
        JWTAuth::invalidate() && throwSucceed();
        throwException();
    }

    /**
     * @param Request $request
     * @throws \Exception
     */
    public function refresh()
    {
        ($token = JWTAuth::parseToken()->refresh()) &&
        throwSucceed([
            'token' => $token,
            'expires' => JWTAuth::factory()->getTTL() * 60
        ]);
        throwException();
    }
}