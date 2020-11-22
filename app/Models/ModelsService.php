<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Support\Facades\Cache;
/**
 * App\Models\ModelsService
 *
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ModelsService newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ModelsService newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\ModelsService query()
 * @mixin \Eloquent
 */
class ModelsService extends Model
{

    /*
     * ----------------------------------
     * update or insert batch
     * ----------------------------------
     *
     * multiple update or insert in one query
     *
     * replace into means to insert the replacement data. The requirement table has either a PrimaryKey or a unique index. If the data already exists in the database, it is replaced with the new data
     * replace into表示插入替换数据，需求表中有PrimaryKey，或者unique索引，如果数据库已经存在数据，则用新数据替换，如果没有数据效果则和insert into一样
     *
     * tablename( required | string )
     * fields ( required | array )
     * multipleData ( required | array of array )
     */
    static function updateOrInsertBatch($tableName = "", $fields = array(), $multipleData = array()){
        if( $tableName && !empty($multipleData) && !empty($fields) ) {
            $q = "REPLACE INTO ".$tableName." (" . implode(',',$fields). ")VALUES";
            foreach ( $multipleData as $v ) {
                $q .= "(" . implode(',',$v). "),";
            }
            $q = rtrim($q, ",");
            return DB::insert(DB::raw($q));
        } else {
            return false;
        }
    }

    /*
     * ----------------------------------
     * update batch
     * ----------------------------------
     *
     * multiple update in one query
     *
     * tablename( required | string )
     * multipleData ( required | array of array )
     */
    static function updateBatch($tableName = "", $multipleData = array()){
        if( $tableName && !empty($multipleData) ) {
            // column or fields to update
            $updateColumn = array_keys($multipleData[0]);
            $referenceColumn = $updateColumn[0]; //e.g id
            unset($updateColumn[0]);
            $whereIn = "";
            $q = "UPDATE ".$tableName." SET ";
            foreach ( $updateColumn as $uColumn ) {
                $q .=  $uColumn." = CASE ";
                foreach( $multipleData as $data ) {
                    $q .= "WHEN ".$referenceColumn." = ".$data[$referenceColumn]." THEN '".$data[$uColumn]."' ";
                }
                $q .= "ELSE ".$uColumn." END, ";
            }
            foreach( $multipleData as $data ) {
                $whereIn .= "'".$data[$referenceColumn]."', ";
            }
            $q = rtrim($q, ", ")." WHERE ".$referenceColumn." IN (".  rtrim($whereIn, ', ').")";
            return DB::update(DB::raw($q));
        } else {
            return false;
        }
    }

    static function insertBatch($tableName = "", $multipleData = array()){
        if( $tableName && !empty($multipleData) ) {
            return DB::table($tableName)->insert($multipleData);;
        } else {
            return false;
        }
    }

    //分类的前N条记录
    static function teamsUsersGrouping($d = array()){
        if(!empty($d)) {
            $q = '';
            $m = count($d['d']);
            foreach ($d['d'] as $k=>$v){
                $q .= "(SELECT T1.id,T1.tid,T1.uid,T2.name,T2.email FROM teams_users AS T1 LEFT JOIN users AS T2 ON T1.uid = T2.id WHERE tid=".$v." ORDER BY T1.id DESC LIMIT ".$d['limit'].")";
                if ($k < ($m-1)) $q .= " UNION ";

            }
            $data = DB::select(DB::raw($q));
            return array_map('get_object_vars', $data);
        } else {
            return false;
        }
    }
    static function teamsUsersGroupingTotal($d = array()){
        if(!empty($d)) {
            $q = '';
            $m = count($d['d']);
            foreach ($d['d'] as $k=>$v){
                $q .= "(SELECT T1.tid,COUNT(T1.id) total FROM teams_users AS T1 LEFT JOIN users AS T2 ON T1.uid = T2.id WHERE tid=".$v." ORDER BY T1.id DESC LIMIT ".$d['limit'].")";
                if ($k < ($m-1)) $q .= " UNION ";

            }
            $data = DB::select(DB::raw($q));
            return array_map('get_object_vars', $data);
        } else {
            return false;
        }
    }
    static function copy($tableName,$oid,$in,$fr,$k='tid'){
        if( $tableName && !empty($oid) && !empty($fr) ) {
            $q = 'INSERT INTO '.$tableName.' ('.$in.') SELECT '.$fr.' FROM '.$tableName.' WHERE '.$k.'='.$oid;
            return DB::insert(DB::raw($q));
        } else {
            return false;
        }
    }
    static function sortableInsert($data){
        $sql = '';
        foreach ($data['list'] as $key => $val){
            $sql.='REPLACE INTO '.$data['table'].' (tid,uid) SELECT '.$val['tid'].',uid FROM '.$data['table'].' WHERE '.$data['k'].' IN ('.$val['plus'].');';
        }
        DB::insert(DB::raw($sql));
        count($data['minus']) > 0 && TeamsUsers::whereIn('id',$data['minus'])->delete();

        return true;
    }
}
