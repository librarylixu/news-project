/*
AngularService层的公用方法
*/
/*
通用的数据源操作
@ $http         :Service中的 $http(第一个参数)
@ $q         :Service中的 $q(第二个参数)
@ sthis      :Service中的 this
@ $uibModal  :模态框对象
*/
function publicDataService($http,$q, sthis, $uibModal, $aside) {
    //先判断当前页面是否是在父页面中打开的，如果不是直接给parent赋值一个空对象，然后去组建该数据
    if (parent == undefined||parent.authRefPage == undefined) {
        parent = this;
        parent.authRefPage =parent.authRefPage?parent.authRefPage:{};
        parent.privateDateObj = parent.privateDateObj ? parent.privateDateObj : {};
    }  
    //将私有变量赋值
    sthis.privateDateObj = parent.privateDateObj;
    //当前选中的项
    sthis.selectItem = {};
    //操作状态 0新增 1修改
    sthis.Action = 0;
    //存储用户id（给每个页面使用：编辑和删除按钮/客户中使用了判断是否是管理员等)
    sthis.userid = _USERID;
    //存储用户组id（给每个页面使用)
    sthis.usergroupid = _USERGROUPID;
    /*
    service私有更新方法,仅内部使用
    */
    var privateUpdate = function (data, item) {
        if (Object.prototype.toString.call(data) == '[object Array]') {
            delete item._kid;
            var i = data.indexOf(sthis.selectItem);
            if (i > -1) {
                data[i] = item;
            }
        } else if (Object.prototype.toString.call(data) == '[object Object]' && item._kid != undefined) {
            data[item._kid] = item;
        }
        return data;
    }
    /*
    更新选中项信息
    @objname 要处理的对象名称
    @item要更新的数据
    */
    sthis.updateData = function (objname, item) {
        if (sthis.privateDateObj[objname] != undefined) {
            //数据源放到了parent池里
            sthis.privateDateObj[objname] = privateUpdate(sthis.privateDateObj[objname], item);
        } else {
            //数据源在本页面service里
            sthis[objname] = privateUpdate(sthis[objname], item);
        }
    }
    /*
   service私有删除方法,仅内部使用
   */
    var privateDeldate = function (data,item) {
        if (Object.prototype.toString.call(data) == '[object Array]') {
            delete item._kid;
            var i = data.indexOf(item);
            if (i > -1) {
                data.splice(i, 1);
            }
        } else if (Object.prototype.toString.call(data) == '[object Object]') {
            delete data[item._kid];
        }
        return data;
    }
    
    /*
    删除选中项信息
    @objname 要处理的对象名称
    @item 要删除的数据
    */
    sthis.delData = function (objname, item) {
        if (sthis.privateDateObj[objname] != undefined) {
            //数据源放到了parent池里
            sthis.privateDateObj[objname] = privateDeldate(sthis.privateDateObj[objname], item);
        } else {
            //数据源在本页面service里
            sthis[objname] = privateDeldate(sthis[objname], item);
        }
    }
   
    //通用post方法
    sthis.postData = function (url, parameters) {
        var defer = {};//延迟处理
        try {
            defer = $q.defer();//延迟处理
        } catch (e) {
            console.log(e);
        }
        if (parameters.__proto__.append) {
            axios.post(url, parameters)
             .then(function (response) {
                 //处理正常结果
                 defer.resolve(response.data);
             })
             .catch(function (error) {
                 //处理异常结果
                 defer.reject(error);
             });
        } else {
            $http({
                method: 'post',
                url: url,
                data: parameters,
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).then(function (response) {
                //处理正常结果
                defer.resolve(response.data);
            })
        .catch(function (error) {
            //处理异常结果
            defer.reject(error);
        });
        }
        return defer.promise;
    }
    //通用get方法
    /*parameters参数是一个通用的对象
    {
        params: { ID: 12345 } 
    }
    */
    sthis.getData = function (url, parameters) {
        var defer = $q.defer();//延迟处理
        $http({
            method: 'get',
            url: url,
            parameter: parameters,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        }).then(function (response) {
            //处理正常结果
            defer.resolve(response.data);
        })
         .catch(function (error) {
             //处理异常结果
             defer.reject(error);
         });
        return defer.promise;
    }


    /*
   service私有新增方法,仅内部使用
   */
    var privateAdddate = function (data, item) {
        if (Object.prototype.toString.call(data) == '[object Array]') {
            data.push(angular.copy(item));
        } else if ((Object.prototype.toString.call(data) == '[object Object]' || Object.prototype.toString.call(data) == '[object String]') && item._kid != undefined) {
            data[item._kid] = angular.copy(item);
        }
        return data;
    }

    /*通用方法,给数据源添加一个数据
    @objname 要处理的对象名称
    @data 要给对象追加的数据
    */
    sthis.addData = function (objname, data) {
        if (sthis.privateDateObj[objname]) {
            //数据源放到了parent池里
            sthis.privateDateObj[objname] = privateAdddate(sthis.privateDateObj[objname], data);
        } else {
            //数据源在本页面service里
            sthis[objname] = privateAdddate(sthis[objname], data);
        }        
    }
    /*
    打开模态框
    @templateUrl 模态框内容的url地址 
    @controller  模态框绑定的控制器名称
    */
    sthis.openModal = function (templateUrl, controller ) {
        var defer = $q.defer();
        $temp_modal = $uibModal;
        $modalObj={
            templateUrl: templateUrl,
            controller: controller,
            animation: true,
            keyboard: true,
            backdrop: "static"
        };
        if (sthis.modalPlacement!=undefined) {
            $temp_modal = $aside;
            $modalObj.placement = sthis.modalPlacement;
            $modalObj.size = sthis.modalSize;            
        }
        $temp_modal.open($modalObj).result.then(function (value) {
            defer.resolve(value);
        }, function (error) {
            defer.reject(error);
        });
        delete sthis.modalPlacement;
        delete sthis.modalSize;
        return defer.promise;
    }
    
    /*
    从数据库获取到的原始的数据源
    @分级、分组的时候用到，因为这里返回的结果是一个{}对象,带着key value,然而表格需要的是一个[],后面又要去用key的方式来取value.所有这里就保存了一下原始的数据源,不需要再去刷新数据库了。
    */
    sthis.oldData = {}
    //当前页面是否允许删除、修改
    if(sthis.refdel != true){
        sthis.refdel = false;    
    }
    if (sthis.refedit != true) {
        sthis.refedit = false;
    }

    //查询权限与页面的关系
    refauthapp(sthis);



    //时间戳转时间字符串
    sthis.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, T);
    }
}


/*
  查询全部权限与页面的关系
 */
var refauthapp = function (service) {
    //先判断当前页面是否是在父页面中打开的，如果不是直接给parent赋值一个空对象，然后去组建该数据
    if (parent == undefined) {
        parent = {};
        parent.authRefPage = {};
        parent.privateDateObj = {};
    }
    //当当前权限数据中已包含数据，那么证明此时权限数据已经缓存过了，直接把缓存的数据拿到并赋值即可
    if (Object.keys(parent.authRefPage).length > 0) {
        service.refauthapp = parent.authRefPage;
        return;
    }
    service.postData(__URL + 'Crmuser/RefauthRefapp/select_page_data', {}).then(function (data) {
        /*
        权限id:{页面id:{关系表数据行}}
        3:{
            1:'1,2'
          }
        */
        //循环获取到的权限和页面的关系数据
        for (var i = 0; i < data.length; i++) {
            //获取到当前数据中的权限id,页面id,还有所有已选中的按钮的集合
            var temp_authid = data[i]['authid'];
            var temp_appid = data[i]['appid'];
            var temp_btns = data[i]['btns'];
            //当已组建好的权限数据中不包含此权限时，给此权限赋值为一个空对象以便后续存值
            if (parent.authRefPage[temp_authid] == undefined) {
                parent.authRefPage[temp_authid] = {};
            }
            //给该权限赋值，把当前数据赋值给组建好的权限数据的appid中
            parent.authRefPage[temp_authid][temp_appid] = data[i];
        }
        //给当前页面所需要的权限数据进行赋值
        service.refauthapp = parent.authRefPage;       
    }, function (error) {
        console.log(error);
    });
}




/*
 定义一个弹出模态框的服务
 alert属于一个公用的弹出层,其html模板为固定名称叫alert.html

 @$uibModal ：模态框对象
*/
var publicAlertService = function ($uibModal) {
    function show(message, title) {
        return $uibModal.open({
            templateUrl: __URL + 'Home/Alert/Index',
            controller: function () {
                var vm = this;
                vm.title = title;
                vm.message = message;
               
            },
            controllerAs: 'vm'
        })
    }
    return {
        show: show
    };
}

var publicConfirmService = function ($http,$uibModal, $q) {
    function confirm(message, title) {
        var defer = $q.defer();//延迟处理
        return $uibModal.open({
            templateUrl: __URL + 'Home/Alert/confirm',
            controller: function ($uibModalInstance) {
                var vm = this;
                vm.title = title;
                vm.message = message;
                vm.close = function () {
                    $uibModalInstance.close('ok');
                };
                vm.cancel = function () {
                    $uibModalInstance.close('cancel');

                }
            },
            controllerAs: 'vm'
        }).result.then(function (value) {
            defer.resolve(value);
            return defer.promise;
        }, function () {
            defer.reject('Error!');
            return defer.promise;
        });
        
    }
    return {
        show: confirm
    };
}
/*
    过滤附件名称
    */
var publicFilterAnnexName = function (itemName) {
    var path = '../../../DPMS/public/images/gallery/';
    var name = itemName.slice((itemName.lastIndexOf('.') + 1));
    if (name == 'jpg' || name == 'jpeg' || name == 'png' || name == 'gif') {
        name = 'png';
    } else if (name == 'pdf') {
        name = 'pdf';
    } else if (name == 'txt') {
        name = 'txt';
    } else if (name == 'doc' || name == 'docx') {
        name = 'doc';
    } else if (name == 'xls' || name == 'xlsx') {
        name = 'xls';
    } else if (name == 'ppt' || name == 'pptx') {
        name = 'ppt';
    } else {
        name = 'file';
    }
    return path + name + '.png';

}



