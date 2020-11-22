<?php

namespace App\Services;

use Mail;
use URL;

class Common
{

    public function __construct()
    {
    }

    public static function send($user)
    {
        $to = $user->email;
        $name = config('app.name');
        $url = URL::secureAsset('verify'.$user->verification);
        $subject = '激活邮件-注册成功';
        $content = '恭喜你注册成功，激活地址：<a href="'.$url.'">'.$url.'</a>';

        if ($user->verified == 1 || $user->verified == 2){
            $url = URL::secureAsset('verify/changed'.$user->verification);
            $subject = '更换邮箱';
            $content = '更换邮箱地址：<a href="'.$url.'">'.$url.'</a>';
        }
        return Mail::send('emails.send',['content' => $content,'subject' => $subject],function($message) use ($to, $subject){
            $message->to($to)->subject($subject);
        });
    }
}
