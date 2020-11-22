<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * App\Models\Teams
 *
 * @property int $id
 * @property int $uid 所属用户ID
 * @property string $name 团队名称
 * @property int $u_num 成员数
 * @property int $i_num 项目数
 * @property string|null $deleted_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams whereINum($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams whereUNum($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams whereUid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Teams whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Teams extends Model
{
    protected $table = 'teams';
    protected $primaryKey = 'id';
    public $timestamps = true;
    protected $dates = ['delete_at'];
    protected $fillable = ['uid', 'name', 'u_num', 'i_num'];
    protected $casts = [
        'created_at' => 'date:Y-m-d H:i',
    ];


    /**
     * @param $id
     * @param bool $cache
     * @return mixed
     */
    public static function finds($id, $cache = true)
    {
        $k = __METHOD__ . '_' . $id;
        if (!$cache && (Cache::has($k) ? Cache::forget($k) : true)) return true;
        return Cache::rememberForever($k, function () use ($id) {
            return Teams::select('id', 'name', 'u_num', 'i_num')
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
        $data = Teams::select('id', 'name', 'created_at')
            ->where('uid', app('auth')->id())
            ->orderBy('created_at', 'DESC')
            ->paginate(10)->toArray();
        $teamsUsers = new TeamsUsers();
        $teamsUsersGrouping = $teamsUsers->grouping(getIdArr($data['data']));
        $teamsUsersGroupingTotal = $teamsUsers->groupingTotal(getIdArr($data['data']));
        foreach ($data['data'] as $key => $val) {
            foreach ($teamsUsersGrouping as $k => $v) {
                if ($val['id'] == $v['tid']) {
                    $data['data'][$key]['list'][] = $v;
                    unset($teamsUsersGrouping[$k]);
                }
            }
            foreach ($teamsUsersGroupingTotal as $k => $v) {
                if ($val['id'] == $v['tid']) {
                    $data['data'][$key]['total'] = $v['total'];
                    unset($teamsUsersGroupingTotal[$k]);
                }
            }
        }
        return $data;
    }

    public static function all($cache = true)
    {
        $k = __METHOD__;
        if (!$cache && (Cache::has($k) ? Cache::forget($k) : true)) return true;
        return Cache::remember($k, config('cache.times.most'), function () {
            return Teams::select('id', 'name', 'u_num', 'i_num')
                ->where('uid', app('auth')->id())
                ->orderBy('id')
                ->get()
                ->keyBy('id')
                ->toArray();
        });
    }
}
