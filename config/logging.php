<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that gets used when writing
    | messages to the logs. The name specified in this option should match
    | one of the channels defined in the "channels" configuration array.
    |
    */

    'default' => env('LOG_CHANNEL', 'stack'),

    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Out of
    | the box, Laravel uses the Monolog PHP logging library. This gives
    | you a variety of powerful log handlers / formatters to utilize.
    |
    | Available Drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "custom", "stack"
    |
    */

    'channels' => [
        'stack' => [
            'driver' => 'stack',
            'name' => env('APP_ENV'),
            'channels' => ['error'],
        ],

        'slack' => [
            'driver' => 'slack',
            'url' => env('APP_URL'),
            'username' => 'crm log',
            'emoji' => ':boom:',
            'level' => 'critical',
        ],

        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/daily.log'),
            'level' => 'debug',
            'days' => 7,
        ],

        'syslog' => [
            'driver' => 'syslog',
            'path' => storage_path('logs/syslog.log'),
            'level' => 'debug',
        ],

        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => 'debug',
        ],

        'error' => [
            'driver' => 'single',
            'path' => storage_path('logs/error/' . Date('Ym') . '.log'),
            'level' => 'debug',
        ],

        'sql' => [
            'driver' => 'single',
            'path' => storage_path('logs/sql/' . Date('Ymd') . '.log'),
            'level' => 'debug',
        ],

        // 脚本与业务，相关日志
        'script' => [
            'driver' => 'single',
            'path' => storage_path('logs/script/' . Date('Ym') . '.log'),
            'level' => 'debug',
        ],

        // 定时任务日志
        'cron_task' => [
            'driver' => 'single',
            'path' => storage_path('logs/cron_task/' . Date('Ymd') . '.log'),
            'level' => 'debug',
        ],

        // 代理商和掌心宝贝利润分账日志（视频服务费和信息服务费）
        'profit_task' => [
            'driver' => 'single',
            'path' => storage_path('logs/profit_task/' . Date('Ym') . '.log'),
            'level' => 'debug',
        ],

        // 报备幼儿园日志（转正、过期）
        'declared_task' => [
            'driver' => 'single',
            'path' => storage_path('logs/declared_task/' . Date('Ym') . '.log'),
            'level' => 'debug',
        ],

        // 推送日志
        'push_task' => [
            'driver' => 'single',
            'path' => storage_path('logs/push_task/' . Date('Ymd') . '.log'),
            'level' => 'debug',
        ],

        // 极光标签日志
        'label_task' => [
            'driver' => 'single',
            'path' => storage_path('logs/label_task/' . Date('Ymd') . '.log'),
            'level' => 'debug',
        ],

        // 极光标签详细日志
        'label_detail_task' => [
            'driver' => 'single',
            'path' => storage_path('logs/label_detail_task/' . Date('Ymd') . '.log'),
            'level' => 'debug',
        ],

    ],

];
