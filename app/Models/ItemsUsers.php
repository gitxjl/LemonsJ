<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use DB;

/**
 * App\Models\ItemsUsers
 *
 * @property int $id
 * @property int|null $iid 项目id
 * @property int $uid 用户ID
 * @property int $tid 团队ID
 * @property int $permission 权限 0：创建人； 1：默认；2：只读；
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ItemsUsers newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ItemsUsers newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ItemsUsers query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ItemsUsers whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ItemsUsers whereIid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ItemsUsers wherePermission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ItemsUsers whereTid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ItemsUsers whereUid($value)
 * @mixin \Eloquent
 */
class ItemsUsers extends Model
{
    protected $table = 'items_users';
    protected $primaryKey = 'id';
    public $timestamps = false;
    protected $fillable = ['iid', 'uid', 'tid', 'permission'];

    /**
     * @param string $p
     * @param bool $cache
     * @return bool|mixed
     */
    public static function all($p = '', $cache = true)
    {
        $uid = app('auth')->id();
        $d = [0, 1, 2];
        $p = $p!='' ? explode(',', $p) : $d;
        $k = __METHOD__ . '_' . implode('_', $p) . '_' . $uid;
        !$cache && Cache::has($k) && Cache::forget($k);
        if (!$cache) {
            foreach ($d as $key => $val) {
                $k = __METHOD__ . '__' . $val . '_' . $uid;
                !$cache && Cache::has($k) && Cache::forget($k);
            }
            return true;
        }

        Cache::forget($k);
        return Cache::remember($k, config('cache.times.most'), function () use ($p, $uid) {
            $data = ItemsUsers::from('items_users AS T1')
                ->select('T2.id', 'T2.name', 'T2.info', 'T2.open', 'T1.permission', 'T2.created_at')
                ->leftJoin('items AS T2', 'T1.iid', '=', 'T2.id')
                ->where('T1.uid', $uid)
                ->whereNull('T2.deleted_at')
                ->where('T1.permission', 0)
                ->groupBy('T1.iid')
                ->orderBy('T1.permission', 'ASC')
                ->orderBy('T2.created_at', 'DESC')
                ->get();
            return $data;
        });
    }
    /**
     * @param string $p
     * @param bool $cache
     * @return bool|mixed
     */
    public static function UIList($p = '', $cache = true)
    {
        $uid = app('auth')->id();
        $d = [0, 1, 2];
        $p = $p!='' ? explode(',', $p) : $d;
        $k = __METHOD__ . '_' . implode('_', $p) . '_' . $uid;
        !$cache && Cache::has($k) && Cache::forget($k);
        if (!$cache) {
            foreach ($d as $key => $val) {
                $k = __METHOD__ . '__' . $val . '_' . $uid;
                !$cache && Cache::has($k) && Cache::forget($k);
            }
            return true;
        }

        Cache::forget($k);
        return Cache::remember($k, config('cache.times.most'), function () use ($p, $uid) {
            $data = ItemsUsers::from('items_users AS T1')
                ->select('T2.id', 'T2.name', 'T2.info', 'T2.open', 'T1.permission', 'T2.created_at')
                ->leftJoin('items AS T2', 'T1.iid', '=', 'T2.id')
                ->where('T1.uid', $uid)
                ->where('T1.permission','<', 5)
                ->whereNull('T2.deleted_at')
                ->whereIn('T1.permission', $p)
                ->groupBy('T1.iid')
                ->orderBy('T1.permission', 'ASC')
                ->orderBy('T2.created_at', 'DESC')
                ->paginate(20);
            return $data;
        });
    }

    /**
     * @param string $p
     * @param bool $cache
     * @return bool|mixed
     */
    public static function list($iid = '', $p = '', $cache = true)
    {
        $uid = app('auth')->id();
        $d = [0, 1, 2];
        $p = $p!='' ? explode(',', $p) : $d;
        $k = __METHOD__ . '_' . implode('_', $p) . '_' . $uid;
        !$cache && Cache::has($k) && Cache::forget($k);
        if (!$cache) {
            foreach ($d as $key => $val) {
                $k = __METHOD__ . '__' . $val . '_' . $uid;
                !$cache && Cache::has($k) && Cache::forget($k);
            }
            return true;
        }

        Cache::forget($k);
        return Cache::remember($k, config('cache.times.most'), function () use ($iid, $p, $uid) {
            $data = ItemsUsers::from('items_users AS T1')
                ->select('T1.id','T1.tid', 'T2.name AS tname', 'T3.name AS uname', 'T3.email AS uemail', 'T1.permission')
                ->leftJoin('teams AS T2', 'T1.tid', '=', 'T2.id')
                ->leftJoin('users AS T3', 'T1.uid', '=', 'T3.id')
                ->where('T1.uid','!=', $uid)
                ->where('T1.iid', $iid)
                ->whereIn('T1.permission', $p)
                ->orderBy('T1.permission', 'ASC')
                ->orderBy('T2.created_at', 'DESC')
                ->paginate(20);
            return $data;
        });
    }

    function listCacheForget($d, $uid, $cache)
    {
        foreach ($d as $key => $val) {
            $k = __METHOD__ . '_' . implode('_', $val) . '_' . $uid;
            !$cache && Cache::has($k) && Cache::forget($k);
        }
        return true;
    }

    /**
     * @param $d
     * @return bool
     * @throws \Throwable
     */
    public static function transfer($d)
    {
        DB::transaction(function () use ($d) {
            $data = ItemsUsers::where('iid', $d['iid'])
                ->where('uid', app('auth')->id())
                ->where('tid', 0)
                ->where('permission', 0)
                ->first();
            if (!$data) return false;
            $clone = $data->replicate();

            $data->permission = 1;
            $data->save();

            $clone->uid = $d['uid'];
            $clone->save();
        });
        return true;
    }

    /**
     * @param $iid
     * @param $uid
     * @param int $p
     * @param bool $cache
     * @return bool|mixed
     */
    public static function permission($iid, $uid, $p = 0, $cache = true)
    {
        if (!$iid) return false;
        $k = __METHOD__ . '_' . $iid . '_' . $uid;
        if (!$cache && (Cache::has($k) ? Cache::forget($k) : true)) return true;
        $data = Cache::remember($k, config('cache.times.most'), function () use ($iid, $uid) {
            return ItemsUsers::select('tid', 'permission')
                ->where('iid', $iid)
                ->where('uid', $uid)
                ->orderBy('permission', 'ASC')
                ->first();
        });
        if (!empty($data)) {
            if ($p === 0) return true;
            if ($p === 1 && in_array($data->permission, [0, 1])) return true;
            if ($p === 2 && $data->permission == 0) return true;
            if ($p === 4) return $data;
        }

        return false;
    }

    /**
     * @param bool $cache
     * @return bool|mixed
     */
    public static function users($cache = true)
    {
        $k = __METHOD__;
        if (!$cache && (Cache::has($k) ? Cache::forget($k) : true)) return true;
        return Cache::remember($k, config('cache.times.most'), function () {
            return ItemsUsers::from('items_users AS T1')
                ->select('T1.iid', 'T1.uid', 'T1.tid', 'T2.user_name', 'T2.email', 'T1.permission')
                ->leftJoin('users AS T2', 'T1.uid', '=', 'T2.id')
                ->where('T1.uid', '!=', app('auth')->id())
                ->whereIn('T1.iid', function ($query) {
                    $query->select('iid')->from('items_users')->where('uid', app('auth')->id())->whereIn('permission', [0, 1]);
                })
                ->orderBy('T1.id')
                ->orderBy('T1.tid')
                ->get()->toArray();
        });

    }


    static $getTDLKey = __CLASS__ . '_getUserItems';
    static $getUserItems = __CLASS__ . '_getUserItems';


    public static function getBeItemUUID($uid, $i_uuid)
    {
//        return Cache::remember(self::$getTDLKey.$uid, config('cache.times.most'), function () use ($uid) {
        $data = ItemsUsers::from('items_users AS T1')
            ->select('T2.*', 'T1.permission as u_permission', 'T1.type as u_type')
            ->leftJoin('items AS T2', 'T1.i_uuid', '=', 'T2.uuid')
            ->where('T1.uid', $uid)
            ->where('T1.i_uuid', $i_uuid)
            ->groupBy('T2.id')
            ->orderBy('T2.id', 'DESC')
            ->first();
        return $data;
//        });
    }

    public static function getItemslist($uid, $type = '')
    {
//        return Cache::remember(self::$getTDLKey.$uid, config('cache.times.most'), function () use ($uid) {
        $type_arr = strlen($type) > 0 ? explode(',', $type) : [];
        $data = ItemsUsers::from('items_users AS T1')
            ->select('T1.id', 'T1.uid', 'T1.permission', 'T1.type', 'T2.id as iid', 'T2.uuid as i_uuid', 'T2.uid as i_uid', 'T2.name', 'T2.url', 'T2.type as i_type')
            ->leftJoin('items AS T2', 'T1.i_uuid', '=', 'T2.uuid')
            ->whereNull('T2.deleted_at')
            ->where('T1.uid', $uid)
            ->whereNotNull('T2.id');
        if (count($type_arr) > 0) {
            $data->whereIn('T1.type', $type_arr);
        }
        $data = $data->groupBy('T2.id')
            ->orderBy('T2.id', 'DESC')
            ->get()->toArray();
        return items_list($data);
//        });
    }


    public static function getUserItems($uid, $is_a = 0, $_c = false)
    {
        if ($_c) Cache::forget(self::$getUserItems . $uid);
//        return Cache::remember(self::$getTDLKey.$uid, config('cache.times.most'), function () use ($uid) {
        $data = ItemsUsers::from('items_users AS T1')
            ->select('T1.id', 'T1.uid', 'T1.permission', 'T1.type', 'T2.id as iid', 'T2.uuid as i_uuid', 'T2.uid as i_uid', 'T2.name', 'T2.url', 'T2.type as i_type')
            ->leftJoin('items AS T2', 'T1.i_uuid', '=', 'T2.uuid')
            ->whereNull('T2.deleted_at')
            ->where('T1.uid', $uid)
            ->groupBy('T2.id')
            ->orderBy('T2.id', 'DESC')
            ->get()->toArray();

        return items($data, $is_a);
//        });
    }

    public function updateOrInsertBatch($team)
    {
        return ModelsService::updateOrInsertBatch($this->table, $this->fillable, $team);
    }
}
