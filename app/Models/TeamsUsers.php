<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * App\Models\TeamsUsers
 *
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TeamsUsers newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TeamsUsers newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TeamsUsers query()
 * @mixin \Eloquent
 */
class TeamsUsers extends Model
{
    protected $table = 'teams_users';

    protected $primaryKey = 'id';
    public $timestamps = false;
    protected $fillable = ['tid', 'uid'];
    static $paginate = 2;

    /**
     * @param $tid
     * @param bool $cache
     * @return mixed
     */
    public static function list($tid, $cache = true)
    {
//        return Cache::rememberForever(__METHOD__ . '_' . $tid, function () use ($p) {
        return TeamsUsers::from('teams_users AS T1')
            ->select('T1.id', 'T1.tid', 'T1.uid', 'T2.name', 'T2.email')
            ->leftJoin('users AS T2','T1.uid','=','T2.id')
            ->where('T1.tid', $tid)
            ->orderBy('T1.id', 'DESC')
            ->paginate(self::$paginate);
//        });
    }


    public static function usersTeams(){
        $teamsUsers = TeamsUsers::select('id', 'tid', 'uid')
            ->where('uid', app('auth')->id())
            ->orderBy('id', 'DESC')
            ->get()->toArray();
        $teams = Teams::all();
        $users = [];
        foreach ($teamsUsers as $k => $v){
            if (empty($teams[$v['tid']])){
                $users[] = $v;
            }else{
                $teams[$v['tid']]['tid'] = $teams[$v['tid']]['id'];
                $teams[$v['tid']]['list'][] = $v;
                unset($teams[$v['tid']]['id']);
            }
        }
        return array_merge($users,$teams);
    }


    static $getTDLKey = __CLASS__.'_getUserItemsPermission';

    public static function getUserItemsPermission($uid){
//        return Cache::remember(self::$getTDLKey.$uid, config('cache.times.most'), function () use ($uid) {
            return TeamsUsers::from('team_member AS T1')
                ->select('T2.permission AS pPermission','T2.type AS pType','T3.id AS iid','T3.uid AS i_uid','T3.name AS iName','T3.url AS iUrl','T3.uuid AS iUuid','T3.type AS i_type')
                ->leftJoin('items_permission AS T2','T1.tid','=','T2.uid')
                ->leftJoin('items AS T3','T2.iid','=','T3.id')
                ->where('T1.uid', $uid)
                ->where('T3.uid', '!=' , $uid)
                ->whereNotNull('T2.iid')
                ->groupBy('T2.iid')
                ->get();
//        });
    }

    public function updateOrInsertBatch($team){
        return ModelsService::updateOrInsertBatch($this->table,$this->fillable,$team);
    }

    public function grouping($d){
        return ModelsService::teamsUsersGrouping([
            'd'=>$d,
            'field'=>'tid',
            'limit'=>self::$paginate
        ]);
    }
    public function groupingTotal($d){
        return ModelsService::teamsUsersGroupingTotal([
            'd'=>$d,
            'field'=>'tid',
            'limit'=>self::$paginate
        ]);
    }

    public function copy($oid,$tid){
        if (!$oid) return true;
        return ModelsService::copy($this->table,$oid,'tid,uid',$tid.',uid');
    }

    public function sortableInsert($list,$minus){

        return ModelsService::sortableInsert([
            'minus'=>$minus,
            'table'=>$this->table,
            'list'=>$list,
            'in'=>'tid,uid',
            'fr'=> ',uid',
            'k'=> 'id'
            ]
        );
    }
}
