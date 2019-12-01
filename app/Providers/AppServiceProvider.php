<?php

namespace App\Providers;

use DB;
use Log;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //将执行的sql写到日志中
        DB::listen(function ($query) {
            $sql = str_replace('?', '"' . '%s' . '"', $query->sql);
            $sql = vsprintf($sql, $query->bindings);
            $sql = str_replace("\\", "", $sql);
            $tmp = "SQL语句执行：{$sql}，耗时：{$query->time}ms" . "\n\t";
            Log::channel('sql')->info($tmp);
        });
        Schema::defaultStringLength(191);

    }
}
