<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Doc
 *
 * @property int $id
 * @property int $iid 项目ID
 * @property int $pid 所属/层级/目录级别
 * @property string $name 项目名称
 * @property string|null $content 内容
 * @property int $tdl 是否模板 0：否； 1：是
 * @property int|null $type 文档类型：0：富文本；1：表格文档；2：markdown；3：curl; 4 : postman ; 5 :f iddler ; 6 : word; 7 : excel; 8 : pdf
 * @property int|null $sort 排序
 * @property int|null $form 文档构成： 0：普通文档，1：目录
 * @property string|null $source 源文件
 * @property string|null $param 预留参数
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc newQuery()
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Doc onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereForm($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereIid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereParam($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc wherePid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereSort($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereTdl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Doc whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Doc withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Doc withoutTrashed()
 * @mixin \Eloquent
 */
class Doc extends Model
{
    use SoftDeletes;
    protected $table = 'doc';
    public $primaryKey = 'id';
    public $timestamps = true;
    protected $dates = ['delete_at'];
    protected $fillable = ['iid','name','pid','sort','tdl','type','form','content','source'];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = urlencode($value);
    }
    public function getNameAttribute($value)
    {
        return urldecode($value);
    }

    public function setContentAttribute($value)
    {
        $this->attributes['content'] = $value ?urlencode($value):$value;
    }

    public function getContentAttribute($value)
    {
        return urldecode($value);
    }

    public static function is_destroy($form,$id){
        if ($form == 0) return true;
        $docs = Doc::where('pid',$id)->first();
        if ($docs){
            throwException(lang('msg.destroy_failed_have'));
            return false;
        }
        return true;
    }

    public static function copy($iid,$copy){
        $docs = Doc::where('iid',$copy)
            ->orderBy('sort','ASC')
            ->orderBy('created_at','DESC')
            ->get()->toArray();
        $new_data = [];
        foreach ($docs as $key => $val){
            unset($val['updated_at']);
            unset($val['created_at']);
            $val['iid'] = $iid;
            $val['tdl'] = 0;
            $new_data[] = $val;

        }
        $new_data && self::copy_menus($new_data);
    }
    public static function copy_menus($menus,$pid = 0,$id = 0){
        foreach ($menus as $key => $val){
            if ($val['pid'] == $pid){
                $_pid = $val['id'];
                $val['pid'] = $id;
                unset($val['id']);
                $menus_id = Doc::insertGetId($val);
                unset($menus[$key]);
                self::copy_menus($menus,$_pid,$menus_id);
            }
        }
    }

    /**
     * @param $id
     * @param bool $cache
     * @return mixed
     */
    public static function finds($id,$cache = true){
        $k = __METHOD__.'_'.$id;
        if (!$cache && (Cache::has($k)?Cache::forget($k):true)) return true;
        Cache::forget($k);
        return Cache::rememberForever($k, function() use ($id) {
            return Doc::select('id','iid','pid','name','content','tdl','type','sort','form','source','param','updated_at','created_at')
                ->whereNull('deleted_at')
                ->where('id', $id)->first();
        });
    }

    public static function tdl($type,$cache = true){
        if ($type <= 0) return [];
        $k = __METHOD__.'_'.$type;
        if (!$cache && (Cache::has($k)?Cache::forget($k):true)) return true;
        Cache::forget($k);
        return Cache::rememberForever($k, function() use ($type) {
            return Doc::select('doc.id','doc.name','doc.pid','doc.type','doc.param','doc.form','doc.sort')
                ->leftJoin('items_users AS T2', 'doc.iid', '=', 'T2.iid')
                ->where('T2.uid', app('auth')->id())
                ->whereIn('T2.permission', [0,1,2])
                ->where('doc.type', $type)
                ->where('doc.tdl', 1)
                ->whereNull('doc.deleted_at')
                ->orderBy('doc.updated_at','DESC')
                ->get();
        });
    }

    public static function catalog($iid,$cache = true){
        if ($iid <= 0) return [];
        $k = __METHOD__.'_'.$iid;
        if (!$cache && (Cache::has($k)?Cache::forget($k):true)) return true;
        Cache::forget($k);
        return Cache::rememberForever($k, function() use ($iid) {
            $data = Doc::select('id','name','pid','type','param','form','sort','content')
                ->where('iid', $iid)
                ->whereNull('deleted_at')
                ->orderBy('sort','ASC')
                ->orderBy('created_at','DESC')
                ->get();
            return $data;
        });
    }

    public static function docs($iid,$did,$cd){
        $mode = Doc::where('iid', $iid);
        $cd > 0 && $mode->whereIn('id', $did);
        return $mode->whereNull('deleted_at')
            ->orderBy('sort', 'ASC')
            ->orderBy('created_at', 'DESC')
            ->get()->toArray();
    }

    public static function getTDL($uid,$type){
//        return Cache::remember(self::$getTDLKey.$uid, config('cache.times.most'), function () use ($uid) {
        $data = (new Doc())
            ->setTable('T1')->from('doc AS T1')
            ->select('T1.id','T1.uuid','T1.name','T1.alias','T1.pid','T1.type','T1.param')
            ->leftJoin('items AS T2','T1.iid','=','T2.id')
            ->whereNull('T2.deleted_at')
            ->whereNull('T1.deleted_at')
            ->where('T2.uid', $uid)
            ->where('T1.is_tdl', 1)
            ->where('T1.type', $type)
            ->get()->toArray();
        return tdl($data);
//        });
    }

    public static function getDocs($iid,$_c = false){
        if ($_c) Cache::forget(self::$getDocsKey.$iid);
//        return Cache::forever(self::$getDocsKey.$iid, config('cache.times.most'), function () use ($uid) {
        //->orderBy('updated_at','ASC')
        $data = Doc::select('id','uuid','name','alias','pid','type','param','sort','form','content')
            ->where('iid', $iid)
            ->orderBy('sort','ASC')->orderBy('created_at','DESC')->get()->toArray();

        return docs($data);
//        });
    }

    public static function getBeUUID($uuid){
//        return Cache::remember(self::$getBeUUIDKey.$uuid, config('cache.times.most'), function () use ($uid) {
        return Doc::where('uuid', $uuid)->first();
//        });
    }



    public static function getBeIIDFirst($iid){
//        return Cache::remember(self::$getBeUUIDKey.$uuid, config('cache.times.most'), function () use ($uid) {
        return Doc::where('iid', $iid)->orderBy('sort','ASC')->first();//->orderBy('updated_at','ASC')
//        });
    }
}
