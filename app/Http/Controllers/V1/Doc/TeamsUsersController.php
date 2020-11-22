<?php

namespace App\Http\Controllers\V1\Doc;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Doc;
use App\Models\Items;
use App\Models\ItemsUsers;
use App\Models\Teams;
use App\Models\TeamsUsers;
use App\Models\Friend;
use App\Models\Users;

class TeamsUsersController extends Controller
{
    /**
     * 团队成员列表
     * @param Request $request
     * @throws \Exception
     */
    public function index(Request $request)
    {
        !empty($data = TeamsUsers::list($request->input('tid'))) &&
        throwSucceed($data);
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
     * 批量创建或更新团队成员
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'id' => 'integer',
            'tid' => 'required|integer',
            'uid' => 'nullable|string',
            'name' => 'nullable|string|max:100',
        ]);
        $data = $request->only((new TeamsUsers)->getFillable());
        $user = isset($data['uid']) ? array_unique(explode(',', $data['uid'])) : [];

        if ($email = $request->input('email')) {
            !($users = Users::where('email', $email)->first()) && throwException(lang('msg.no_user'));
            $user[] = $users->id;
        }

        count($user) <= 0 && throwException(lang('msg.no_user'));

        $teamUsers = [];
        $friend = [];
        foreach ($user as $k => $v) {
            $teamUsers[] = [$data['tid'], $v];
            $friend[] = [self::uid(), $v];
        }

        count($teamUsers) > 0 &&
        (new TeamsUsers())->updateOrInsertBatch($teamUsers) &&
        (new Friend())->updateOrInsertBatch($friend) &&
        throwSucceed();

        throwException(lang('msg.failed'));
    }

    /**
     * 获取团队成员数据
     * @param $id
     * @throws \Exception
     */
    public function show($id)
    {
        is_numeric($id) && !empty($data = TeamsUsers::find($id)) &&
        throwSucceed($data);
        throwException(lang('msg.data_permissions_not_exist'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
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
        TeamsUsers::destroy($id) && throwSucceed();

        throwException(lang('msg.failed'));
    }

    /**
     * 好友&团队
     * @throws \Exception
     */
    public function users()
    {
        !empty($data = TeamsUsers::usersTeams()) &&
        throwSucceed($data);
        throwException(lang('msg.data_not'));
    }

    /**
     * 批量创建或更新团队成员
     * @param Request $request
     * @throws \Exception
     */
    public function sortableStore(Request $request)
    {
        count($list = json_decode($request->input('list'), true)) <= 0 && throwException(lang('msg.error_data'));
        count($minus = array_filter(array_unique(explode(',', $request->input('minus'))))) <= 0 && throwException(lang('msg.error_data'));

        (new TeamsUsers())->sortableInsert($list, $minus) && throwSucceed();
        throwException();
    }

    /**
     * 批量创建或更新团队成员
     * @param Request $request
     * @throws \Exception
     */
    public function batchStore(Request $request)
    {
        count($list = json_decode($request->input('list'))) <= 0 && throwException(lang('msg.error_data'));

        $teamUsers = [];
        foreach ($list as $key => $val) {
            count($user = array_filter(array_unique(explode(',', $val['uid'])))) <= 0 && throwException(lang('msg.error_data'));
            (!$val['tid'] || !$val['name']) && throwException(lang('msg.error_data'));

            if (!$val['tid'] && $val['name']) {
                $teams = new Teams([
                    "uid" => self::uid(),
                    "name" => $data['name']
                ]);
                $teams->save();
                $val['tid'] = $teams->id;
            }
            if ($val['tid'] && $val['name']) {
                Teams::where('id', $val['tid'])
                    ->update([
                        "name" => $val['name']
                    ]);
            }
            if (!$val['tid'] || $val['tid'] <= 0) throwException(lang('msg.data_not_exist'));

            foreach ($user as $k => $v) {
                if (!empty($v)) $teamUsers[] = [$val['tid'], $v];
            }
        }

        count($teamUsers) > 0 && (new TeamsUsers())->updateOrInsertBatch($teamUsers) && throwSucceed();

        throwException();
    }

    public function batchStoreTest(Request $request)
    {
        $this->validate($request, [
            'id' => 'nullable|integer',
            'name' => 'nullable|string|max:100',
            'tid' => 'nullable|integer',
            'uid' => 'required|string',
        ]);
        $data = $request->only('id', 'name', 'tid', 'uid');
        $user = array_unique(explode(',', $data['uid']));

        if (!$data['tid'] && $data['name']) {
            $teams = new Teams([
                "uid" => self::uid(),
                "name" => $data['name']
            ]);
            $teams->save();
            $data['tid'] = $teams->id;
        }
        if ($data['tid'] && $data['name']) {
            Teams::where('id', $data['tid'])
                ->increment('i_num', 1)
                ->increment('u_num', count($user), [
                    "name" => $data['name']
                ]);
        }
        if (!$data['tid'] || $data['tid'] <= 0) throwException();

        $teamUsers = [];
        foreach ($user as $k => $v) {
            if (!empty($v)) $teamUsers[] = [$data['tid'], $v];
        }

        count($teamUsers) > 0 && (new TeamsUsers())->updateOrInsertBatch($teamUsers) && throwSucceed();

        throwException();
    }
}
