<?php

namespace App\Http\Controllers\V1\Doc;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Teams;
use App\Models\TeamsUsers;

class TeamsController extends Controller
{
    /**
     * 团队列表
     * @throws \Exception
     */
    public function index()
    {
        !empty($data = Teams::list()) &&
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
     * 创建或更新团队
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'id' => 'integer',
            'name' => 'nullable|string|max:100',
            'oname' => 'nullable|string|max:100',
            'cid' => 'nullable|integer',
        ]);
        $data = $request->only((new Teams)->getFillable());
        $data['uid'] = self::uid();
        $data['name'] = $data['name'] ?? $request->input('oname');

        ($resource = Teams::updateOrCreate(['id' => $request->input('id')], $data)) &&
        (new TeamsUsers())->copy($request->input('cid'), $resource->id) &&
        throwSucceed(['id' => $resource->id]);

        throwException(lang('msg.failed'));
    }

    /**
     * 获取团队数据
     * @param $id
     * @throws \Exception
     */
    public function show($id)
    {
        is_numeric($id) && !empty($data = Teams::finds($id)) &&
        throwSucceed($data);
        throwException(lang('msg.data_permissions_not_exist'));
    }

    /**
     * @throws \Exception
     */
    public function all()
    {
        throwSucceed(Teams::all());
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
        Teams::finds($id, false) &&
        Teams::destroy($id) &&
        TeamsUsers::where('tid', $id)->delete() &&
        throwSucceed();

        throwException(lang('msg.failed'));
    }
}
