<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title') - Api Doc </title>
    <link rel="stylesheet" type="text/css" href="/apiDocAssets/css/htmleaf-demo.css">
    <link href="/apiDocAssets/css/jquery.json-viewer.css" type="text/css" rel="stylesheet"/>
</head>
<body>
<div class="wrapper">
    @yield('menus')
    @yield('content')
</div>
<script src="/apiDocAssets/js/jquery-2.1.1.min.js"></script>
<script>window.jQuery || document.write('<script src="/apiDocAssets/js/jquery-1.11.0.min.js"><\/script>')</script>
<script src="/apiDocAssets/js/jquery.json-viewer.js"></script>
<script src="/apiDocAssets/js/index.js"></script>
<script type="text/javascript">
    $(function () {

    });
</script>
</body>
</html>
