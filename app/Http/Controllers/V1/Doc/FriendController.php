<?php

namespace App\Http\Controllers\V1\Doc;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Friend;

class FriendController extends Controller
{
    /**
     * 好友列表
     * @throws \Exception
     */
    public function index()
    {
        !empty($data = Friend::list()) &&
        throwSucceed($data);
        throwException(lang('msg.no_friend'));
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
            'fid' => 'required|integer',
            'uid' => 'required|integer',
        ]);
        $data = $request->only((new TeamsUsers)->getFillable());

        Friend::updateOrCreate(['id'=>$data['id']],$data) && throwSucceed();

        throwException(lang('msg.failed'));
    }

    /**
     * @param $id
     * @throws \Exception
     */
    public function show()
    {
        !empty($data = Friend::list()) &&
        throwSucceed($data);
        throwException(lang('msg.no_friend'));
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
        Friend::finds($id,false) &&
        Friend::destroy($id) && throwSucceed();

        throwException(lang('msg.failed'));
    }
}
