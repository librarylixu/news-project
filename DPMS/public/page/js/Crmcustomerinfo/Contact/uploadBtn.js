appModule.controller('modaluploadfileController', ['$scope', 'dataService', "$uibModalInstance", 'alert', 'FileUploader', function ($scope, dataService, $uibModalInstance, alert, FileUploader) {
    $scope.service = dataService;
    $scope.uploadStatus = false; //定义两个上传后返回的状态，成功获失败
    $scope.fileid = "";
    var uploader = $scope.uploader = new FileUploader({
        url: __URL + 'Crmsetting/Annex/upload_file',
        queueLimit: 1,     //文件个数 
        removeAfterUpload: true   //上传后删除文件
    });

    $scope.clearItems = function () {    //重新选择文件时，清空队列，达到覆盖文件的效果
        uploader.clearQueue();
    }

    uploader.onAfterAddingFile = function (fileItem) {
        $scope.fileItem = fileItem._file;    //添加文件之后，把文件信息赋给scope
    };

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        if (response.status) {
            $scope.uploadStatus = true;   //上传成功则把状态改为true
            $scope.fileid = response.fileid;


        } else {
            $scope.uploadStatus = false;
        }

    };

    $scope.UploadFile = function () {
        uploader.uploadAll();
    }
    $scope.preview = function () {
        var url = __URL + 'Crmcustomerinfo/Contact/preview?fileid=' + $scope.fileid;
        var title = "查看预览";
        window.Win10_child.openUrl(url, title);

    }
    //模板下载
    $scope.UploadTemplate = function () {
        window.open(__URL + 'Crmsetting/Annex/downLoadtemplate?name=' + $scope.service.type);
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //完成
    $scope.complete = function () {
        if ($scope.service.refAnnex) {
            $scope.service.refAnnex($scope.fileid, 0);
        }

        $scope.cancel();
    }

}])