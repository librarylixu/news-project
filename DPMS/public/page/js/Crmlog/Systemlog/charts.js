/**
*create by zhangs
*2018-06-01
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap']);
//主控制器
appModule.controller('crmChartsController', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.workorderData == undefined || Object.keys($scope.service.privateDateObj.workorderData).length < 1) {
        parent.layer.load(1, {
            shade: [0.6, '#fff']
        });
    }
    var dom = document.getElementById("container");
    //图标实例的默认显示
    $scope.selected = {
        '客户': true, '项目': true, '工单': true, '跟进记录': false, '出差': false
    };
    /*月份数据*/
    //客户数据源
    $scope.service.customernum = {};
    //项目数据源
    $scope.service.projectnum = {};
    //工单数据源
    $scope.service.workordernum = {};
    //记录数据源
    $scope.service.recordnum = {};
    //出差数据源
    $scope.service.businessnum = {};
    //查询需要的数据
    $scope.select = function () {
        //项目
        var params = new URLSearchParams();
        params.append('$json', true);
        select_project(params).then(function (res) {
            //客户
            select_customerinfo(params).then(function (res) {
                //工单
                select_workorder(params).then(function (res) {
                    //记录
                    select_record(params).then(function (res) {
                        //出差
                        select_business(params).then(function (res) {
                            var params = new URLSearchParams();
                            params.append('$in', true);
                            params.append('utypeid', '6,7');
                            $scope.service.postData(__URL + 'Crmuser/RefuserRefutype/select_page_data', params).then(function (refusertype) {
                                var userid = [];
                                for (var i = 0; i < refusertype.length; i++) {
                                    if (userid.indexOf(refusertype[i].userid) == -1) {
                                        userid.push(refusertype[i].userid);
                                    }
                                }
                                var userparams = new URLSearchParams();
                                userparams.append('$json', true);
                                userparams.append('$in', true);
                                userparams.append('idusers', userid.join(','));
                                //用户数据
                                select_user(userparams, { 'index': 'returndata', 'status': 1 }).then(function (usersdata) {
                                    $scope.service.usersreftypedata = usersdata;
                                    $scope.getchartusersData();
                                    //db.getCollection('customerlog').find({'time':{'$gt':1533484800,'$lt':1536163200},'userid':8}).count()
                                    //查询并组建chat表数据
                                    $scope.selectcharts();
                                });
                            });
                        })
                    })
                })
            })
        })
    }
    //组件X轴数据
    $scope.getchartusersData = function () {
        var num = 0;
        $scope.chartusersData = [];
        for (key in $scope.service.usersreftypedata) {
            var description = $scope.service.usersreftypedata[key].description;
            //num = num + 1;
            //判断是2的倍数
            //if (num % 2 == 0) {
            //    description = "\n" + description;
            //}
            $scope.chartusersData.push(description);
        }
    }
    /*
        查询并组建chat表数据
        where 参数如果存在就会传过来时间的数组，如果是第一次查询那么是个空array
    */
    $scope.selectcharts = function (where) {
        var cusparams = new URLSearchParams();
        var proparams = new URLSearchParams();
        var workparams = new URLSearchParams();
        var recordparams = new URLSearchParams();
        var businessparams = new URLSearchParams();
        //如果没传where的话是null或undefined
        if (where) {
            cusparams.append('stime', where['stime']);
            proparams.append('stime', where['stime']);
            workparams.append('stime', where['stime']);
            recordparams.append('stime', where['stime']);
            businessparams.append('stime', where['stime']);
            cusparams.append('etime', where['etime']);
            proparams.append('etime', where['etime']);
            workparams.append('etime', where['etime']);
            recordparams.append('etime', where['etime']);
            businessparams.append('etime', where['etime']);
            //这里给selecttimedata从新付一下值，这个是数据源的key"1809"  最好用service接住它，因为下面的方法还要用呢
            $scope.service.selecttimedata = where['selecttimedata'];
        }
        // - 1 - 组建客户数据源
        cusparams.append('tablename', 'customer');
        select_charts(cusparams, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            //公共循环方法，用于将数据补全
            $scope.foreachcharts(data, 'customernum');
            // - 2 - 成功之后组建项目数据源
            proparams.append('tablename', 'project');
            select_charts(proparams, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                //公共循环方法，用于将数据补全
                $scope.foreachcharts(data, 'projectnum');
                // - 3 - 组建工单数据源
                workparams.append('tablename', 'workorder');
                select_charts(workparams, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                    //公共循环方法，用于将数据补全
                    $scope.foreachcharts(data, 'workordernum');
                    // - 4 - 组建记录数据源
                    recordparams.append('tablename', 'record');
                    select_charts(recordparams, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                        //公共循环方法，用于将数据补全
                        $scope.foreachcharts(data, 'recordnum');
                        // - 5- 组建出差数据源
                        businessparams.append('tablename', 'business');
                        select_charts(businessparams, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                            //公共循环方法，用于将数据补全
                            $scope.foreachcharts(data, 'businessnum');
                            //渲染柱状图
                            $scope.personalLoadChart();

                            //关闭加载层
                            parent.layer.closeAll('loading');
                        })
                    })
                })
            })
        })
    }
    //公共循环方法，用于将数据补全
    //type 区分是给哪个赋值
    //selecttimedata这个参数是数据源的key 1809
    $scope.foreachcharts = function (item, type) {
        //组建key时间
        var myDate = new Date();//获取系统当前时间
        var chartyear = myDate.getYear();
        var chartyear = chartyear < 2000 ? chartyear + 1900 : chartyear;
        var yy = chartyear.toString().substr(2, 2);
        var month = myDate.getMonth() + 1;
        month = month < 10 ? '0' + month : '' + month; // 如果是1-9月，那么前面补0
        //判断一下是否有$scope.service.selecttimedata这个参数，如果没有切记要给付个值，相当于是默认值的作用了。因为下面要用
        if (!$scope.service.selecttimedata) {
            $scope.service.selecttimedata = yy + month;
            //再初始化一个值。正规的时间 2018-09
            $scope.service.time = '20' + yy + "-" + month;
        }
        $scope.service[type][$scope.service.selecttimedata] = [];
        //这里循环，把传过来的数据组建成想要的数据格式，并且判断如果没有就是0
        angular.forEach($scope.service.usersreftypedata, function (value) {
            if (!item.hasOwnProperty(value.idusers)) {
                $scope.service[type][$scope.service.selecttimedata].push(0);
            } else {
                $scope.service[type][$scope.service.selecttimedata].push(item[value.idusers]);
            }
        })
    }
    //事件轴数据源
    $scope.timelineDataFunction = function () {
        var timelineData = [];
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        for (var i = 0; i < 12; i++) {
            timelineData.push(year + '-' + month);
            month--;
            if (month < 1) {
                month = 12;
                year--;
            }
        }
        $scope.timelineData = timelineData;
    };
    $scope.timelineDataFunction();
    //以下是加载个人柱状图
    $scope.personalLoadChart = function () {
        var myChart;
        if ($scope.myChart != null) {
            echarts.dispose($scope.myChart);
        }
        myChart = echarts.init(dom);
        $scope.myChart = myChart;


        var app = {};
        option = null;
        var dataMap = {};
        //页面饼图
        function dataFormatter(obj) {
            //未知
            var max = 0;
            //总量
            var sum = 0;
            for (var i = 0; i < obj[$scope.service.selecttimedata].length; i++) {
                max = max + parseInt(obj[$scope.service.selecttimedata][i]);
            }
            obj[$scope.service.selecttimedata + 'max'] = max;
            obj[$scope.service.selecttimedata + 'sum'] = max;
            return obj;
        }
        dataFormatter($scope.service.customernum);
        dataFormatter($scope.service.projectnum);
        dataFormatter($scope.service.workordernum);
        dataFormatter($scope.service.recordnum);
        dataFormatter($scope.service.businessnum);
        // - 4 - 给渲染的页面赋值
        /*
            组件数据
            {
                series: [
                        { data: $scope.service.customernum['1809'] },
                        { data: $scope.service.projectnum['1809'] },
                        { data: $scope.service.workordernum['1809'] },
                        {
                            data: [
                               { name: '客户', value: $scope.service.customernum['1809sum'] },
                               { name: '项目', value: $scope.service.projectnum['1809sum'] },
                               { name: '工单', value: $scope.service.workordernum['1809sum'] }
                            ]
                        }
                ],
            }
        */
        //页面的数据源（页面）
        var options = {};
        //页面的数据源（页面）--- 里面的二维
        var series = [
                        { data: $scope.service.customernum[$scope.service.selecttimedata] },
                        { data: $scope.service.projectnum[$scope.service.selecttimedata] },
                        { data: $scope.service.workordernum[$scope.service.selecttimedata] },
                        { data: $scope.service.recordnum[$scope.service.selecttimedata] },
                        { data: $scope.service.businessnum[$scope.service.selecttimedata] },
                        {
                            data: [
                               { name: '客户', value: $scope.service.customernum[$scope.service.selecttimedata + 'sum'] },
                               { name: '项目', value: $scope.service.projectnum[$scope.service.selecttimedata + 'sum'] },
                               { name: '工单', value: $scope.service.workordernum[$scope.service.selecttimedata + 'sum'] },
                               { name: '跟进记录', value: $scope.service.recordnum[$scope.service.selecttimedata + 'sum'] },
                               { name: '出差', value: $scope.service.businessnum[$scope.service.selecttimedata + 'sum'] }
                            ]
                        }
        ];
        //这里组件它
        options['series'] = series;
        $scope.service.options = $scope.service.options ? $scope.service.options : [];
        //这里用push，就会有多个页面的数据源
        $scope.service.options.push(options);
        console.log($scope.service.options);
        option = {
            baseOption: {
                timeline: {
                    //时间轴的类型
                    axisType: 'category',
                    //显示当前月份的日志
                    //currentIndex: new Date().getMonth(),
                    currentIndex: $scope.service.currentIndex ? $scope.service.currentIndex : 0,
                    data: $scope.timelineData,
                    //时间轴展示的列表
                    label: {
                        formatter: function (s) {
                            var myDate = new Date(s);
                            var year = myDate.getYear();
                            var year = year < 2000 ? year + 1900 : year;
                            var yy = year.toString().substr(2, 2);
                            var month = new Date(s).getMonth() + 1;
                            month = month < 10 ? '0' + month : '' + month; // 如果是1-9月，那么前面补0
                            return yy + '/' + month;
                        }
                    },
                    controlStyle: {
                        show: false
                    }
                },
                tooltip: {
                },
                legend: {
                    x: 'right',
                    data: ['客户', '项目', '工单', '跟进记录', '出差'],
                    selected: $scope.selected,
                },
                calculable: true,
                grid: {
                    top: 80,
                    bottom: 100,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value.replace('\n', '');
                                }
                            }
                        }
                    }
                },
                xAxis: [
                    {
                        'type': 'category',
                        'axisLabel': { 'interval': 0 },
                        'data': $scope.chartusersData,
                        //'data': $scope.service.usersData,
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '数据量（条）'
                    }
                ],
                series: [
                    { name: '客户', type: 'bar' },
                    { name: '项目', type: 'bar' },
                    { name: '工单', type: 'bar' },
                    { name: '跟进记录', type: 'bar' },
                    { name: '出差', type: 'bar' },
                    {
                        name: $scope.service.time + '：添加的数据量',
                        type: 'pie',
                        center: ['85%', '25%'],
                        radius: '28%',
                        z: 100
                    }
                ]
            },
            options: $scope.service.options,
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        //时间轴改变事件

        myChart.on('timelinechanged', function (par) {
            //把点的第几个的位置存到service里
            $scope.service.currentIndex = par.currentIndex;
            //得到的是“2018-9”，先截取年
            var timestr = $scope.timelineData[par.currentIndex];
            //年得到了
            var year = timestr.substring(0, 4);
            //月分得到了
            var month = timestr.substring(5);
            month = month < 10 ? '0' + month : '' + month;//补0操作
            //开始时间得到了 2018-09-01 00;00;00
            var stime = year + '-' + month + '-01 00:00:00';
            $scope.stime = stime;
            //结束时间需要获取到当前有多少天 2018-09-30 23:59:59
            var daynum = new Date(year, month, 0).getDate();
            var etime = year + '-' + month + '-' + daynum + ' 23:59:59';
            $scope.etime = etime;
            //这里需要脏检查才可以是页面联动
            $scope.$apply(function () {
                //这个给正规时间付个值
                $scope.service.time = year + '-' + month;
            })
            /*
                以上时间已经获取完毕了，接下来要做的是判断数据源中是否存在了，如果存在了就不查了。
            */
            var selectyear = year.substring(2);
            var select_timedata = parseInt(selectyear.toString() + month.toString());
            //select_timedata数字已经获取到了，1809，这是数据源中的key，去判断就行了
            //因为点击事件在初始化chart里所以会重复调用，暂时写了个逻辑，让她只走一遍
            $scope.isselect = $scope.isselect === false ? $scope.isselect : true;
            if ($scope.service.customernum[select_timedata] == undefined && !$scope.service.customernum.hasOwnProperty(select_timedata) && $scope.isselect) {
                $scope.isselect = false;
                //去查询
                var where = [];
                where['stime'] = Date.parse(stime) / 1000;
                where['etime'] = Date.parse(etime) / 1000;
                where['selecttimedata'] = select_timedata;
                $scope.selectcharts(where);
            }
        })
        $scope.isselect = '';
        //图标势力点击事件
        myChart.on('legendselectchanged', function (obj) {
            var selected = obj.selected;
            var legend = obj.name;
            // 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
            // 使得 无 selected 对象
            if (selected != undefined) {
                $scope.selected = selected;
            }

        })
    }


    /*总数据*/
    //初始化
    $scope.customernumberdata = {};
    $scope.projectnumberdata = {};
    $scope.workordernumberdata = {};
    $scope.recordnumberdata = {};
    $scope.businessnumberdata = {};
    //这里循环，把传过来的数据组建成想要的数据格式，并且判断如果没有就是0
    $scope.foreachdataall = function (item, type) {
        $scope[type] = [];
        angular.forEach($scope.service.usersreftypedata, function (value) {
            if (!item.hasOwnProperty(value.idusers)) {
                $scope[type].push(0);
            } else {
                $scope[type].push(item[value.idusers]);
            }
        })
    }
    //以下是加载总数柱状图
    $scope.totalLoadChart = function () {
        var myChart;
        if ($scope.myChart != null) {
            echarts.dispose($scope.myChart);
        }
        myChart = echarts.init(dom);
        $scope.myChart = myChart;
        var app = {};
        option = null;
        var dataMap = {};
        //这里组件数据
        for (item in $scope.service.privateDateObj.customerinfoData) {
            $scope.customernumberdata[$scope.service.privateDateObj.customerinfoData[item].userid] = ($scope.customernumberdata[$scope.service.privateDateObj.customerinfoData[item].userid] == undefined ? 1 : $scope.customernumberdata[$scope.service.privateDateObj.customerinfoData[item].userid] + 1);
        }
        $scope.foreachdataall($scope.customernumberdata, 'customernumber');
        for (item in $scope.service.privateDateObj.projectData) {
            $scope.projectnumberdata[$scope.service.privateDateObj.projectData[item].userid] = ($scope.projectnumberdata[$scope.service.privateDateObj.projectData[item].userid] == undefined ? 1 : $scope.projectnumberdata[$scope.service.privateDateObj.projectData[item].userid] + 1);
        }
        $scope.foreachdataall($scope.projectnumberdata, 'projectnumber');
        for (item in $scope.service.privateDateObj.workorderData.data) {
            $scope.workordernumberdata[$scope.service.privateDateObj.workorderData.data[item].userid] = ($scope.workordernumberdata[$scope.service.privateDateObj.workorderData.data[item].userid] == undefined ? 1 : $scope.workordernumberdata[$scope.service.privateDateObj.workorderData.data[item].userid] + 1);
        }
        $scope.foreachdataall($scope.workordernumberdata, 'workordernumber');
        for (item in $scope.service.privateDateObj.recordData) {
            $scope.recordnumberdata[$scope.service.privateDateObj.recordData[item].userid] = ($scope.recordnumberdata[$scope.service.privateDateObj.recordData[item].userid] == undefined ? 1 : $scope.recordnumberdata[$scope.service.privateDateObj.recordData[item].userid] + 1);
        }
        $scope.foreachdataall($scope.recordnumberdata, 'recordnumber');
        for (item in $scope.service.privateDateObj.businessData) {
            $scope.businessnumberdata[$scope.service.privateDateObj.businessData[item].userid] = ($scope.businessnumberdata[$scope.service.privateDateObj.businessData[item].userid] == undefined ? 1 : $scope.businessnumberdata[$scope.service.privateDateObj.businessData[item].userid] + 1);
        }
        $scope.foreachdataall($scope.businessnumberdata, 'businessnumber');
        //页面的数据源（页面）
        var options = {};
        //页面的数据源（页面）--- 里面的二维
        $scope.series = [
                    { name: '客户', type: 'bar', data: $scope.customernumber },
                    { name: '项目', type: 'bar', data: $scope.projectnumber },
                    { name: '工单', type: 'bar', data: $scope.workordernumber },
                    { name: '跟进记录', type: 'bar', data: $scope.recordnumber },
                    { name: '出差', type: 'bar', data: $scope.businessnumber }
        ];
        option = {
            baseOption: {

                tooltip: {
                },
                legend: {
                    x: 'right',
                    data: ['客户', '项目', '工单', '跟进记录', '出差'],
                    selected: $scope.selected,
                },
                calculable: true,
                grid: {
                    top: 80,
                    bottom: 100,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value.replace('\n', '');
                                }
                            }
                        }
                    }
                },
                xAxis: [
                    {
                        'type': 'category',
                        'axisLabel': { 'interval': 0 },
                        'data': $scope.chartusersData,
                        //'data': $scope.service.usersData,
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '总数据量（条）'
                    }
                ],
                series: $scope.series
            },
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        //图标势力点击事件
        myChart.on('legendselectchanged', function (obj) {
            var selected = obj.selected;
            var legend = obj.name;
            // 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
            // 使得 无 selected 对象
            if (selected != undefined) {
                $scope.selected = selected;
            }

        });
        myChart.on('click', function (obj) {
            var selected = obj.selected;
            var legend = obj.name;
        });

    }

    //切换个人和总数的按钮
    $scope.ischarts = function () {
        ////这里默认是显示个人的。如果点击了就显示总数的,清除所有的图表之后再去初始化
        //$scope.myChart.resize();
        $scope.ischart = !$scope.ischart;
        if ($scope.ischart) {
            //
            $scope.totalLoadChart();
        } else {
            //渲染柱状图
            //查询并组建chat表数据
            $scope.selectcharts();
        }
    }
    //下载
    $scope.onDownloadChartData = function () {
        //$scope.selected = {
        //    '客户': true, '项目': true, '工单': true, '跟进记录': false, '出差': false
        //}; 
        var arr = P_objecttoarray($scope.selected);
        var parms = {
            'customer': arr[0],
            'project': arr[1],
            'workorder': arr[2],
            'record': arr[3],
            'business': arr[4],
        };
        //if ($scope.ischart == null || $scope.ischart) {
        //    if ($scope.stime == null) {
        //        var date = new Date();
        //        var year = date.getFullYear(); //获取完整的年份(4位)
        //        var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        //        var day = date.getDate(); //获取当前日(1-31)
        //        parms.stime = year + "-" + month + "-01 00:00:00";
        //        parms.etime = year + "-" + month + "-" + day + " 23:59:59";
        //    } else {
        //        parms.stime = $scope.stime;
        //        parms.etime = $scope.etime;
        //    }
        //    //window.location.href = __URL + 'Crmlog/Systemlog/ExportChartData?iden=' + JSON.stringify(parms);            
        //} else {

        //}
        window.open(__URL + 'Crmlog/Systemlog/ExportTotalChartData?iden=' + JSON.stringify(parms));
    }
    //查询
    $scope.select();
    //刷新按钮
    $scope.refresh = refresh;
}])

