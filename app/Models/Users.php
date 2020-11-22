<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * App\Models\Users
 *
 * @property int $id
 * @property string $name
 * @property string $password
 * @property string $email
 * @property string $api_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users whereApiToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Users whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Users extends authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'icon', 'verification', 'verified',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'verification',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Log in to get user information
     * 登录获取用户信息
     * @param $n
     * @param $p
     * @return mixed
     */
    public static function login($n,$p)
    {
        return Users::whereName($n)# 魔术方法查询user_name字段
        ->wherePassword(sha1(SALT . $p))# 魔术方法查询password字段
        ->first();
//        ->firstOrFail(); //查询无返回就直接抛出异常，但提示信息(error)不能直接使用
    }
}
