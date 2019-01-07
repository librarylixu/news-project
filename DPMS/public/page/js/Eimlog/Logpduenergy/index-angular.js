//初始化module并定义service
angular.module('AceApp')
.controller('eimPduEnergyLogController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;
    var seriesData = [];
    //时间插件，默认为0
    $scope.dates = { stoday: 0, _stime: 0, etoday: 0, _etime: 0};
    /*
        查询（本页面使用）数据 chart
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        //这个查询需指定时间段
        //时间格式：年月日
        //params.append('stime', '2018-03-09');
        //params.append('etime', '2018-03-09');
        //params.append('dpuid', "2");
        if ($scope.dates._stime) {
            params.append('stime', $scope.dates._stime.unix());
        }
        if ($scope.dates._etime) {
            params.append('etime', $scope.dates._etime.unix());
        }
        params.append('dpuid', $scope.service.pduid);
        $scope.service.postData(__URL + 'Eimlog/Logpduenergy/select_page_data', params).then(function (data) {
            $scope.service.pduenergylogData = data;
            //console.log($scope.service.pduenergylogData.voltagelist);
            //初始化默认值
            $scope.service.pduenergylogData.currentlist = [];
            $scope.service.pduenergylogData.voltagelist = [];
            $scope.service.pduenergylogData.legend_data = new Array('电流(A)', '电压(V)');
            $scope.service.pduenergylogData.series_name = {'current' : '电流(A)', 'voltage' : '电压(V)'};
            $scope.service.pduenergylogData.timeData = [];
            var timed = '';
            var timeData = [];
            angular.forEach($scope.service.pduenergylogData, function (value) {
                $scope.service.pduenergylogData.currentlist.push(value['currentavg'].toFixed(2));
                $scope.service.pduenergylogData.voltagelist.push(value['voltageavg'].toFixed(2));
                var valuetime = value['_id']['timenode'].toString();
                timed = Date.parse('20' + valuetime.substring(0, 2) + "-" + valuetime.substring(2, 4) + "-" + valuetime.substring(4, 6) + " " + valuetime.substring(6, 8) + ":" + valuetime.substring(8, 10) + ':00');
                $scope.service.pduenergylogData.timeData.push(P_format(timed, "yyyy-MM-dd h:m"));
            })
            //监听时间插件
            $scope.datewatch();
            if (!$scope.query_data_parms.dpu.status) {
                //得到值就去绑定一下
                seriesData = [
                    {
                        name: $scope.service.pduenergylogData.series_name.current,
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 9,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 3,
                                color: 'rgb(32, 15, 253)',
                                shadowColor: 'rgba(0,0,0,0.4)',
                                shadowBlur: 10,
                                shadowOffsetX: 4,
                                shadowOffsetY: 10
                            }
                        },
                        markPoint: {
                            data: [{
                                type: 'max',
                                name: '最大值'
                            }, {
                                type: 'min',
                                name: '最小值'
                            }]
                        },

                        data: $scope.service.pduenergylogData.currentlist
                    }, {
                        name: $scope.service.pduenergylogData.series_name.voltage,
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 9,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                color: 'rgb(253, 3, 62)',
                                width: 3,
                                shadowColor: 'rgba(0,0,0,0.4)',
                                shadowBlur: 10,
                                shadowOffsetX: 4,
                                shadowOffsetY: 10
                            }
                        },
                        markPoint: {
                            data: [{
                                type: 'max',
                                name: '最大值'
                            }, {
                                type: 'min',
                                name: '最小值'
                            }]
                        },
                        data: $scope.service.pduenergylogData.voltagelist
                    }
                ];
                $scope.init_chart();
            } else {
                //如果是点击了select框那就追加
                seriesData.push({
                    name: $scope.service.pduenergylogData.series_name.current,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 9,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 3,
                            color: 'rgb(32, 15, 253)',
                            shadowColor: 'rgba(0,0,0,0.4)',
                            shadowBlur: 10,
                            shadowOffsetX: 4,
                            shadowOffsetY: 10
                        }
                    },
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: '最大值'
                        }, {
                            type: 'min',
                            name: '最小值'
                        }]
                    },

                    data: $scope.service.pduenergylogData.currentlist
                });
                seriesData.push({
                    name: $scope.service.pduenergylogData.series_name.voltage,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 9,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'rgb(253, 3, 62)',
                            width: 3,
                            shadowColor: 'rgba(0,0,0,0.4)',
                            shadowBlur: 10,
                            shadowOffsetX: 4,
                            shadowOffsetY: 10
                        }
                    },
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: '最大值'
                        }, {
                            type: 'min',
                            name: '最小值'
                        }]
                    },
                    data: $scope.service.pduenergylogData.voltagelist
                });
                myChart.setOption({
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            onZero: true
                        },
                        data: $scope.service.pduenergylogData.timeData,
                    }, {
                        gridIndex: 1
                    }],
                    series: seriesData
                    
                });
            }
        }, function (error) {
            console.log(error);
        });
    }
    //查询pdu数据
    $scope.service.dpulistData = {};
    $scope.selectpdulist = function () {
        var parameter = new URLSearchParams();
        parameter.append('$json', true);
        $scope.service.postData(__URL + 'Eimdevice/Dpulist/select_page_data', parameter).then(function (data) {
            $scope.service.dpulistData = data;
            $scope.query_data_parms.dpu = $scope.service.dpulistData[Object.keys($scope.service.dpulistData)[0]];
            //给select绑定默认值
            $scope.query_data_parms.dpuarr = [];
            $scope.query_data_parms.dpuarr.push($scope.service.dpulistData[Object.keys($scope.service.dpulistData)[0]]);
            //转成数组用于绑定ui-select
            $scope.service.dpulistarrData = P_objecttoarray(data);
            $scope.service.pduid = $scope.query_data_parms.dpu.iddpulist;
            //$scope.service.dpuname = $scope.query_data_parms.dpu.devicename;
            //PDU数据加载完成后，查询chart数据
            $scope.select();
        }, function (error) {
            console.log(error);
        });
    }

    //刷新按钮
    $scope.refresh = function () {
        location.replace(location.href);
    }
    //查询按钮
    $scope.query_data_parms = {};
    $scope.on_query_data = function () {
        $scope.query_data_parms.dpu.status = false;//标记一下是点击了查询
        //如果select框为空的时候点击了查询
        if ($scope.query_data_parms.dpuarr.length == 0) {
            $scope.query_data_parms.dpuarr.push($scope.query_data_parms.dpu);
            $scope.service.pduid = $scope.query_data_parms.dpu.iddpulist;
        }
        //console.log($scope.query_data_parms);
        $scope.select();
    }
    $scope.datewatch = function () {
        //观察name 当一个model值发生改变的时候 都会触发第二个函数
        $scope.$watch('dates.etoday', function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            if (newValue != undefined) {
                $scope.dates._etime = (newValue._i != undefined ? newValue._i / 1000 : $scope.dates._etime);
                $scope.$broadcast('pickerUpdate', ['pickerMaxDate'], {
                    maxDate: angular.copy(moment(newValue)).subtract(1, 'm')
                });
            }
        });
        //观察name 当一个model值发生改变的时候 都会触发第二个函数
        $scope.$watch('dates.stoday', function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            if (newValue != undefined) {
                $scope.dates._stime = (newValue._i != undefined ? newValue._i / 1000 : $scope.dates._stime);
                $scope.$broadcast('pickerUpdate', ['pickerEnd'], {
                    minDate: angular.copy(moment(newValue)).add(1, 'm')
                });
            }
        });
    }
   

    //页面加载完成后，查询数据
    $scope.selectpdulist();



    var myChart;
    $scope.init_chart = function () {
        //chart
        var worldMapContainer = document.getElementById('pduenergychart');
        //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        var resizeWorldMapContainer = function () {
            worldMapContainer.style.width = worldMapContainer.parentElement.clientWidth + 'px';
            worldMapContainer.style.height = (worldMapContainer.parentElement.clientHeight - 100) + 'px';
        };
        resizeWorldMapContainer();
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        myChart = echarts.init(worldMapContainer);
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: true
                },
            },
            legend: {
                data: $scope.service.pduenergylogData.legend_data,
                selectedMode: 'single'
            },
            axisPointer: {
                link: {
                    xAxisIndex: 'all'
                }
            },
            dataZoom: [{
                show: true,
                realtime: true,
                start: 30,
                end: 70,
                xAxisIndex: [0, 1]
            }, {
                type: 'inside',
                realtime: true,
                start: 30,
                end: 70,
                xAxisIndex: [0, 1]
            }],
            grid: [{
                left: 48,
                right: 40,
            }, {
                left: 48,
                right: 40,
            }],
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    onZero: true
                },
                data: $scope.service.pduenergylogData.timeData,
            }, {
                gridIndex: 1
            }],
            yAxis: [{
                type: 'value',
            }, {
                gridIndex: 1
            }],
            series: seriesData
        };
        myChart.setOption(option);
        //用于使chart自适应高度和宽度
        window.onresize = function () {
            //重置容器高宽
            resizeWorldMapContainer();
            myChart.resize();
        };
    }

    //当select框做了改变的时候更新 query_data_parms.dpu.devicename
    $scope.savepduname = function (item, model, status) {
        //status = 1 是添加  =0是删除
        if (status == 1) {
            //更新一下iddpulist
            $scope.query_data_parms.dpu.status = true;//标记一下是点击了查询
            $scope.service.pduid = item.iddpulist;
            $scope.select();

        } else {
            //删除时
            $scope.query_data_parms.dpu.status = false;//标记一下是点击了查询
            //说明select里面没有值
            //如果大于1说明数组里面不值一个值
            if ($scope.query_data_parms.dpuarr.length == 0) {
                myChart.clear();
                seriesData = [{
                    name: $scope.service.pduenergylogData.series_name.current,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 9,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'rgb(253, 3, 62)',
                            width: 3,
                            shadowColor: 'rgba(0,0,0,0.4)',
                            shadowBlur: 10,
                            shadowOffsetX: 4,
                            shadowOffsetY: 10
                        }
                    },
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: '最大值'
                        }, {
                            type: 'min',
                            name: '最小值'
                        }]
                    },
                    data: []
                }, {
                    name: $scope.service.pduenergylogData.series_name.voltage,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 9,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'rgb(253, 3, 62)',
                            width: 3,
                            shadowColor: 'rgba(0,0,0,0.4)',
                            shadowBlur: 10,
                            shadowOffsetX: 4,
                            shadowOffsetY: 10
                        }
                    },
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: '最大值'
                        }, {
                            type: 'min',
                            name: '最小值'
                        }]
                    },
                    data: []
                }];
                $scope.init_chart();
            }else if ($scope.query_data_parms.dpuarr.length > 0) {
                $scope.service.pduid = $scope.query_data_parms.dpuarr[0].iddpulist;
                $scope.select();
            }


        }
    }

}]);