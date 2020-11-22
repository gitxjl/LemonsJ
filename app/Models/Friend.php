<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Friend extends Model
{
    protected $table = 'friend';
    protected $primaryKey = 'id';
    public $timestamps = true;
    protected $dates = ['delete_at'];
    protected $fillable = ['uid','fid'];


    /**
     * @param $id
     * @param bool $cache
     * @return mixed
     */
    public static function finds($id,$cache = true){
        $k = __METHOD__.'_'.$id;
        if (!$cache && (Cache::has($k)?Cache::forget($k):true)) return true;
        return Cache::rememberForever($k, function() use ($id) {
            return Friend::select('id','uid','fid')
                ->where('id', $id)
                ->where('uid', app('auth')->id())
                ->first();
        });
    }

    /**
     * @param $p
     * @param bool $cache
     * @return mixed
     */
    public static function list($cache = true)
    {
        return Friend::from('friend AS T1')
            ->select('T1.id', 'T1.fid', 'T2.name', 'T2.email')
            ->leftJoin('users AS T2', 'T1.fid', '=', 'T2.id')
            ->where('T1.uid', app('auth')->id())
            ->orderBy('id', 'DESC')
            ->get();
    }

    public static function all($cache = true){
        $k = __METHOD__;
        if (!$cache && (Cache::has($k)?Cache::forget($k):true)) return true;
        return Cache::remember($k,config('cache.times.most'), function () {
            return Friend::select('id','uid','fid')
                ->where('uid', app('auth')->id())
                ->orderBy('id')
                ->get()
                ->keyBy('id')
                ->toArray();
        });
    }

    public static function updateCreate($data){
        return Friend::updateOrCreate($data,$data);
    }


    public function updateOrInsertBatch($data){
        return ModelsService::updateOrInsertBatch($this->table,$this->fillable,$data);
    }
}
