<?php

namespace App\Http\Controllers\V1\Doc;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DocFile\DocFileService;
use App\Models\ModelsService;
use App\Models\Doc;
use App\Models\ItemsUsers;

class IndexController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
     * 创建或更新文档
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'iid' => 'required|integer',
            'name' => 'nullable|string|max:100',
            'pid' => 'required|integer',
            'sort' => 'required|integer',
            'tdl' => 'required|integer',
            'type' => 'required|integer',
            'content' => '',
            'file' => 'file',
        ]);
        $data = $request->only((new Doc)->getFillable());

        !$request->hasFile('file') && !$request->input('name') && throwException(lang('msg.name_cannot_empty'));
        !ItemsUsers::permission($data['iid'], app('auth')->id(), 1) && throwException(lang('msg.permissions_not_exist'));
        ($resource = Doc::updateOrCreate(['id' => $request->input('id')], $data)) &&
        ($resource_up = DocFileService::upload($request->merge(['iid' => $resource['iid'], 'did' => $resource['id'], 'source' => $resource['source']]))) &&
        Doc::finds($resource['id'], false) &&
        throwSucceed(['id' => $resource->id, 'name' => $resource->name ? $resource->name : $resource_up->name, 'pid' => $resource->pid, 'sort' => $resource->sort, 'type' => empty($resource_up->type)?$resource->type:$resource_up->type], lang('msg.save_succeed'));

        throwException();
    }

    /**
     * 获取文档数据
     * @param Request $request
     * @param $id
     * @throws \Exception
     */
    public function show(Request $request, $id)
    {
        is_numeric($id) && !empty($data = Doc::finds($id)) &&
        ItemsUsers::permission($data->iid, app('auth')->id()) &&
        throwSucceed($data);
        throwException(lang('msg.data_permissions_not_exist'), 403);
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
        is_numeric($id) && ($data = Doc::finds($id)) &&
        ItemsUsers::permission($data->iid, app('auth')->id(), 1) &&
        Doc::is_destroy($data->form, $data->id) &&
        Doc::destroy($id) &&
        Doc::finds($id, false) && throwSucceed();

        throwException();
    }


    /**
     * 文档目录
     * @param $iid
     * @throws \Exception
     */
    public function catalog($iid)
    {
        $data = [];
        is_numeric($iid) && ($data = Doc::catalog($iid));
        throwSucceed($data);
    }

    /**
     * 文档目录排序
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function catalogSort(Request $request)
    {
        $this->validate($request, [
            'iid' => 'required|integer',
            'sort' => 'required',
        ]);
        $sort = json_decode($request->input('sort'), true);

        $field = array('id', 'sort', 'pid');
        $data = [];
        foreach ($sort as $key => $val) {
            $data[] = array_combine($field, $val);
        }
        ModelsService::updateBatch('doc', $data)>=0 && Doc::catalog($request->input('iid'), false) && throwSucceed(Doc::catalog($request->input('iid')));

        throwException();
    }

    /**
     * 创建或更新目录
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function catalogStore(Request $request)
    {
        $this->validate($request, [
            'iid' => 'required|integer',
            'id' => '',
            'name' => 'required|string|max:100',
            'pid' => 'required|integer',
        ]);

        $data = $request->only((new Doc)->getFillable());
        $data['form'] = 1;
        !ItemsUsers::permission($data['iid'], app('auth')->id(), 1) && throwException(lang('msg.permissions_not_exist'));

        ($resource = Doc::updateOrCreate(['id' => $request->input('id')], $data)) &&
        Doc::catalog($data['iid'], false) &&
        throwSucceed(Doc::catalog($data['iid']));

        throwException();
    }

    /**
     * 模板文档目录
     * @param $iid
     * @throws \Exception
     */
    public function tdl($type)
    {
        is_numeric($type) && trues($data = Doc::tdl($type)) &&
        throwSucceed($data);
        throwException(lang('msg.failed'));
    }

    /**
     * 文件文档mock
     * @param $name
     * @param $path
     * @throws \Exception
     */
    public function mock($name, $path)
    {
        $url_path = md5($path . '?' . urldecode($_SERVER["QUERY_STRING"]));
        $file_path = config('filesystems.file_path') . '/' . $name . '/mock/' . $url_path . '.txt';
        if (is_file($file_path)) {
            $content = file_get_contents($file_path);
            throwSucceed($content);
        }
        throwException();
    }
}
