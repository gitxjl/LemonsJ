<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Lang;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Throwable $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable  Exception
     */
    public function render($request, Throwable $e)
    {
        if ($request->is("api/*")) {
            $code = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : $e->getCode();
            $msg = method_exists($e, 'getMessage') ? $e->getMessage() : '不知名错误';
            $response = ['code' => $code, 'msg' => $msg];

            if (in_array($code, [403]))
                return new JsonResponse($response, $code);

            $class = get_class($e);

            switch ($class) {
                case 'Dingo\Api\Exception\ValidationHttpException':
                    if ($request->expectsJson())
                        return $this->errorRespond($e->getErrors()->first(), $e->getStatusCode());
                    break;

                case 'Illuminate\Validation\ValidationException':
                    //validator 验证错误解析 $e->validator->getMessageBag()->first()：取第一条
                    //"msg"=>array_values($e->errors())[0][0],//这里 ValidationException 异常的格式通常是数组的形式，如果不确定如何取值可以打印下看下结构
                    $response = ['code' => $e->status, 'msg' => Lang::get('msg.submit_failed'), 'error' => $e->validator->getMessageBag()];
                    break;

                case 'Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException':
                    $response = ['code' => 401, 'msg' => 'token已过期!'];
                    break;
                case 'Illuminate\Auth\AuthenticationException':
                    $response = ['code' => 401, 'msg' => 'token已过期'];
                    break;

                default:
                    $response = ['code' => $code, 'msg' => $msg];
                    $code === 500 && $response['code'] = $code;
                    if ($code != 500 && $code != 200 && $code != 422) {
                        Log::error($msg . ' at' . time());
                        $response = ['code' => 502, 'msg' => Lang::get('msg.bug_client')];
                        if (env('API_DEBUG')) {
                            $response = [
                                'code' => $code == 0 ? 502 : $code,
                                'msg' => Lang::get('msg.bug_system'),
                                'line' => $e->getLine(), 'file' => $e->getFile(), 'error' => $msg,
                                'trace' => array_slice($e->getTrace(), 0, 1)
                            ];
                        }
                    }

                    break;
            }
            !empty($data = \Session::pull('responses')) && $response['data'] = $data;
            $response['code'] > 500 && $response['code'] = 500;
            return new JsonResponse($response, $response['code']);


        }

        return parent::render($request, $e);
    }
}
