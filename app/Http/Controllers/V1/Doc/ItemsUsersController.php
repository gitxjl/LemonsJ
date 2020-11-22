<?php

namespace App\Http\Controllers\V1\Doc;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Users;
use App\Models\Items;
use App\Models\ItemsUsers;
use App\Models\Friend;

class ItemsUsersController extends Controller
{
    /**
     * 项目成员列表
     * @param Request $request
     * @throws \Exception
     */
    public function index(Request $request)
    {
        !empty($data = ItemsUsers::list($request->input('p'))) && throwSucceed($data);
        throwException(lang('msg.no_related_project'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * 创建或更新项目成员
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'id' => 'integer',
            'iid' => 'required|integer',
            'permission' => 'required|integer',
            'uid' => 'nullable|string',
            'tid' => 'nullable|string',
            'name' => 'nullable|string|max:100',
        ]);
        $data = $request->only((new ItemsUsers)->getFillable());
        $user = isset($data['uid']) ? array_unique(explode(',', $data['uid'])) : [];
        $tid = isset($data['tid']) ? array_unique(explode(',', $data['tid'])) : [];
        $friend = [];

        if ($email = $request->input('email')) {
            !($users = Users::where('email', $email)->first()) && throwException(lang('msg.no_user'));
            $user[] = $users->id;
            $friend[] = [self::uid(), $users->id];
        }

        count($user) <= 0 && throwException(lang('msg.no_user'));

        $itemUsers = [];
        foreach ($user as $k => $v) {
            $itemUsers[] = [$data['iid'], $v,0,$data['permission']];
        }
        foreach ($tid as $k => $v) {
            $itemUsers[] = [$data['iid'],0, $v,$data['permission']];
        }

        count($itemUsers) > 0 &&
        (new ItemsUsers())->updateOrInsertBatch($itemUsers) &&
        (new Friend())->updateOrInsertBatch($friend) &&
        throwSucceed();

        throwException(lang('msg.failed'));
    }

    public function storeTest(Request $request)
    {
        $this->validate($request, [
            'id' => 'integer',
            'iid' => 'required|integer',
            'uid' => 'required|string',
            'tid' => 'required|integer',
            'permission' => 'required|integer',
        ]);
        $data = $request->only((new Items)->getFillable());

        !empty($data['id']) &&!ItemsUsers::permission($data['id'], self::uid(),1) && throwException(lang('msg.permissions_not_exist'));
        ItemsUsers::updateOrCreate(['id'=>$data['id']],$data) && throwSucceed();

        throwException(lang('msg.failed'));
    }

    /**
     * 获取项目成员数据
     * @param $id
     * @throws \Exception
     */
    public function show($id)
    {
        !empty($data = ItemsUsers::list($id)) && throwSucceed($data);
        throwException(lang('msg.no_related_project'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param $id
     * @throws \Exception
     */
    public function destroy($id)
    {
        is_numeric($id) &&
        ItemsUsers::destroy($id) && throwSucceed();

        throwException(lang('msg.failed'));
    }

    /**
     * 批量创建或更新项目成员
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function batchStore(Request $request)
    {
        $this->validate($request, [
            'iid' => 'required|integer',
            'search' => 'email|max:100',
            'users' => 'required|json',
            'permissions' => 'required|integer',
        ]);
        $data = $request->only(['iid','search','users','permissions']);

        $itemUsers = [];
        foreach ($data['users'] as $k => $v){
            if (!empty($v)) $itemUsers[] = [$data['iid'],$v[0],$v[2],$data['permissions']];
        }

        if ($data['search']){
            !($user = Users::select('id')->where('email',$data['search'])->first()) && throwException(lang('msg.search_not'));
            $itemUsers[] = [$data['iid'],$user->id,0,$data['permissions']];
            Friend::updateCreate(['fid'=>$user->id,'uid'=>self::uid()]);
        }

        count($itemUsers) > 0 && (new ItemsUsers())->updateOrInsertBatch($itemUsers) && throwSucceed();

        throwException();
    }


    public function transfer(Request $request)
    {
        $this->validate($request, [
            'iid' => 'required|integer',
            'uid' => 'integer',
            'email' => 'nullable|email|max:100',
        ]);
        $data = $request->only((new ItemsUsers)->getFillable());

        !empty($data['iid']) && !ItemsUsers::permission($data['iid'], self::uid(), 1) && throwException(lang('msg.permissions_not_exist'));

        if($email = $request->input('email')){
            !($user = Users::where('email',$email)->first()) && throwException(lang('msg.no_user'));
            $data['uid'] = $user->id;
        }

        !ItemsUsers::updateOrCreate(['iid'=>$data['iid'],'uid'=>self::uid()],['tid'=>0,'permission'=>1]) && throwException(lang('msg.transfer_failed'));
        ItemsUsers::updateOrCreate(['iid'=>$data['iid'],'uid'=>$data['uid']],['tid'=>0,'permission'=>0]) && ItemsUsers::list('',false) && throwSucceed();

        throwException(lang('msg.failed'));
    }
}
