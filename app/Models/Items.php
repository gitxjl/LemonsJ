<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Items
 *
 * @property int $id
 * @property int $uid 所属用户ID
 * @property string $name 项目名
 * @property string $info 信息/描述
 * @property int $open 是否公开 0：否；1：是
 * @property string|null $source 源文件
 * @property string $url 项目地址
 * @property string $path 项目路径
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property \Illuminate\Support\Carbon $created_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items newQuery()
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Items onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereInfo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereOpen($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereUid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Items whereUrl($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Items withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Items withoutTrashed()
 * @mixin \Eloquent
 */
class Items extends Model
{
    use SoftDeletes;
    protected $table = 'items';
    public $primaryKey = 'id';
    public $timestamps = true;
    protected $dates = ['delete_at'];
    protected $fillable = ['name','info','open'];

    static $ItemTDLKey = __CLASS__.'getItemTDL';
    static $ItemBeUUIDKey = __CLASS__.'getItemBeUUID';

    /**
     * @param $id
     * @param bool $cache
     * @return mixed
     */
    public static function finds($id,$cache = true){
        $k = __METHOD__.'_'.$id;
        if (!$cache && (Cache::has($k)?Cache::forget($k):true)) return true;
        return Cache::rememberForever($k, function() use ($id) {
            return Items::select('id','name','info','open','created_at')
                ->where('id', $id)->first();
        });
    }


    public static function getList($uid){
        return Cache::remember(self::$ItemTDLKey.$uid, config('cache.times.most'), function () use ($uid) {
            return Items::from('menus AS T1')->select('T1.id','T1.name','T1.aliss','T1.pid','T1.type','T1.param')
                ->leftJoin('items AS T2','T1.iid','=','T2.id')
                ->where('T2.uid', $uid)
                ->where('T1.is_tdl', 1)
                ->get()->toArray();
        });
    }


    public static function getBeUUID($uuid){
//        return Cache::remember(self::$ItemBeUUIDKey.$uuid, config('cache.times.most'), function () use ($uid) {
        return Items::where('uuid', $uuid)->first();
//        });
    }

    public static function getBeID($id){
//        return Cache::remember(self::$ItemBeUUIDKey.$uuid, config('cache.times.most'), function () use ($uid) {
        return Items::find($id);
//        });
    }
}
