<?php

namespace App\Http\Controllers\V1\Doc;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DocFileService;
use App\Models\Doc;
use App\Models\Items;
use App\Models\ItemsUsers;
use App\Models\Users;

class ItemsController extends Controller
{
    /**
     * 项目列表
     * @param Request $request
     * @throws \Exception
     */
    public function all(Request $request)
    {
        !empty($data = ItemsUsers::all()) &&
        throwSucceed($data);

        throwException(lang('msg.no_related_project'));
    }
    public function list(Request $request)
    {
        !empty($data = ItemsUsers::UIList($request->input('p',''))) &&
        throwSucceed($data);

        throwException(lang('msg.no_related_project'));
    }
    public function index(Request $request)
    {
        !empty($data = ItemsUsers::UIList($request->input('p',''))) &&
        ($iid = getIID($data, $request->input('iid'))) >= 0 &&
        ($data = array_merge($data->toArray(), ['catalog' => Doc::catalog($iid), 'iid' => $iid])) &&
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
     * 创建或更新项目
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'id' => 'nullable|integer',
            'name' => 'required|string|max:100',
            'info' => '',
            'open' => 'nullable|integer',
            'copy' => 'nullable|integer',
            'file' => 'nullable|file',
        ]);
        $data = $request->only((new Items)->getFillable());
        $id = $request->input('id');

        !empty($id) && !ItemsUsers::permission($id, app('auth')->id(), 1) && throwException(lang('msg.permissions_not_exist'));

        if ($resource = Items::updateOrCreate(['id' => $id], $data)) {
            empty($id) && ItemsUsers::insert(['iid' => $resource->id, 'uid' => app('auth')->id()]);
            ItemsUsers::permission($request->input('copy'), self::$uid , 1) && Doc::copy($resource->id, $request->input('copy'));
            $request->hasFile('file') && DocFileService::upload($request->merge(['iid' => $resource->id]));
            ItemsUsers::list('',false);
            throwSucceed(['id'=>$resource->id]);
        }

        throwException();
    }

    /**
     * 获取项目数据
     * @param $id
     * @throws \Exception
     */
    public function show($id)
    {
        is_numeric($id) && !empty($data = Items::finds($id)) &&
        ItemsUsers::permission($data->id, app('auth')->id()) &&
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
        $p=5;//删除
        is_numeric($id) && ItemsUsers::permission($id, app('auth')->id(), 0) &&
        (ItemsUsers::permission($id, app('auth')->id(), 2)? Items::destroy($id) && Doc::where('iid',$id)->delete() : true && ($p=7)) &&
        Items::finds($id, false) &&
        ItemsUsers::where('iid',$id)->where('uid',self::$uid)->update(['permission'=>$p]) &&
        ItemsUsers::list('', false);
        throwSucceed();

        throwException(lang('msg.failed'));
    }
}
