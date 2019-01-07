window.onload = function () {
    vm = new Vue({
        el: '#',
        data: {
            //服务器基本信息
            baseinfo: {
                title: '基本信息',
                labservertime: 0,
                labserverruntime: 0,
                labdiskspace: 0,
                lblfreeSpace: 0,
                lblTotalMemory: 0,
                lblmemRealUsed: 0,
                NetInput2: 0,
                diskSpace: 0,//磁盘空间disk_total_space
                freeSpace: 0,//剩余磁盘空间 disk_free_space
                disk_use: 0,//磁盘已使用的值
                cpuModel: '',//CPU型号 
            },
            //用户统计信息
            userStatistics: {
                //图表对象
                userChart: echarts.init(document.getElementById('container2')),
                //用户图表数据
                userData: [],
                //总人数
                user_num: 0,
                //图表参数
                userOption: getuserOption(),
            },
            //磁盘使用
            diskStatistics: {
                diskChart: echarts.init(document.getElementById('container1')),
                color: 'red',
                //图表参数
                Option: getdiskOption(),
            },
            //资产统计
            devicesStatistics: {
                deviceChart: echarts.init(document.getElementById('devicechart')),
                Option: deviceOption(),
                deviceData: [],
                deviceNumber: 0,
            }
        },
        methods: {
            //定时器事件
            displayData: function () {
                _displayData();
                setInterval(function () {
                    _displayData();
                }, _intervalTime);
            },
            //获取用户数据
            userGetdata: userChartInit,
            //设备数据
            deviceChart: deviceChartInit,
        },
        created: function () {
            this.displayData();
            //初始化事件
            //用户图表
            this.userGetdata();
            //资产设备统计
            this.deviceChart();
        },

    })
}
//基础数据数据刷新
function _displayData() {
    $.getJSON('?act=rt&callback=?', function (dataJSON) {
        vm.baseinfo.labservertime = dataJSON.stime;
        vm.baseinfo.labserverruntime = dataJSON.uptime;
        vm.baseinfo.labdiskspace = dataJSON.diskSpace;
        vm.baseinfo.lblfreeSpace = dataJSON.freeSpace;
        vm.baseinfo.lblTotalMemory = dataJSON.TotalMemory;
        vm.baseinfo.lblmemRealUsed = dataJSON.memRealUsed;//真实内存使用
        vm.baseinfo.NetInput2 = dataJSON.NetInput2;
        vm.baseinfo.diskSpace = dataJSON.diskSpace;//磁盘空间
        vm.baseinfo.freeSpace = dataJSON.freeSpace;//剩余磁盘空间
        vm.baseinfo.cpuModel = dataJSON.cpuModel;//CPU型号 
        vm.baseinfo.disk_use = vm.baseinfo.diskSpace - vm.baseinfo.freeSpace;//磁盘已使用
        //更新磁盘空间的chat
        diskOptionInit();
        vm.diskStatistics.diskChart.setOption(vm.diskStatistics.Option);

    });
}
//用户图标赋值
function userChartInit() {
    axios.post(__URL + 'Homepage/async_system_usercharts_data', {
        params: {}
    }).then(function (response) {
        vm.userStatistics.userData = response.data;
        vm.userStatistics.user_num = user_num(response.data);
        vm.userStatistics.userOption.title.subtext = '总计：' + vm.userStatistics.user_num + '人';
        vm.userStatistics.userOption.series[0].data = vm.userStatistics.userData;
        vm.userStatistics.userChart.setOption(vm.userStatistics.userOption);
    }).catch(function (error) {
        console.log(error);
    });
}
//用户option 
function getuserOption() {
    return {
        backgroundColor: '#fff',
        //饼图的颜色块
        color: ['#83c338', '#f9ab78', '#209db7', '#2070b7', '#f9d178'],
        title: {
            text: '用户统计',
            left: 'center',
            top: 20,
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}人 ({d}%)"
        },
        series: [
            {
                name: '用户类型',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [],
                roseType: 'angle',
                label: {
                    normal: {
                        formatter: '{b}: {c}人',
                        textStyle: {
                            color: 'inherit'
                        }
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
}
//用户人数统计
function user_num(userlist) {
    var total = 0;
    $.each(userlist, function (i, val) {
        total += val.value;
    });
    return total;
}

//磁盘使用option
function getdiskOption() {
    return {
        title: {
            text: ''
        },
        series: [{
            type: 'liquidFill',
            animation: true,
            waveAnimation: true,
            data: [],
            color: ['red'],
            center: ['50%', '60%'],
            waveLength: '60%',
            amplitude: 8,
            radius: '70%',
            label: {
                normal: {
                    formatter: '',
                    textStyle: {
                        fontSize: 22,
                        color: ''
                    },
                    position: ['50%', '50%']
                }
            },
            outline: {
                itemStyle: {
                    borderColor: 'red',
                    borderWidth: 5
                },
                borderDistance: 0
            },
            itemStyle: {
                normal: {
                    backgroundColor: 'red'
                }
            }
        }]
    };

}
//初始化磁盘Option
function diskOptionInit() {
    var color = 'red';//red  38b470 2aaf66
    var data = (vm.baseinfo.disk_use / vm.baseinfo.diskSpace);
    if (data <= 0.7) {
        color = "#B4CB9D";
    } else if (data >= 0.7 && data <= 0.85) {
        color = "#DEDEA0";
    } else if (data > 0.8) {
        color = "#F57462";
    }
    vm.diskStatistics.Option.title.text = '磁盘已使用' + parseInt(vm.baseinfo.disk_use) + 'GB(' + (data * 100).toFixed(1) + '%),剩余空间' + parseInt(vm.baseinfo.freeSpace) + 'GB';
    vm.diskStatistics.Option.series[0].color = [color];
    vm.diskStatistics.Option.series[0].data = [data, data - 0.02, data - 0.04];
    vm.diskStatistics.Option.series[0].label.normal.formatter = (data * 100).toFixed(1) + '%';
    vm.diskStatistics.Option.series[0].label.normal.textStyle.color = color;//字体颜色
    vm.diskStatistics.Option.series[0].outline.itemStyle.borderColor = color;
    vm.diskStatistics.Option.series[0].itemStyle.normal.backgroundColor = color;

}

//设备option
function deviceOption() {
    return {
        //饼图的颜色块
        color: ['#83c338', '#f9ab78', '#209db7', '#2070b7', '#f9d178'],
        title: {
            text: '资产设备统计',
            subtext: '单位（台）',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}台 ({d}%)"
        },
        series: [
           {
               name: '设备数量',
               type: 'pie',
               radius: '55%',
               center: ['50%', '55%'],
               data: [],
               label: {
                   normal: {
                       show: true,
                       formatter: '{b}:{c}台'
                   },
                   emphasis: {
                       show: true
                   }
               },

               itemStyle: {
                   emphasis: {
                       shadowBlur: 10,
                       shadowOffsetX: 0,
                       shadowColor: 'rgba(0, 0, 0, 0.5)'
                   }
               }
           }
        ]
    };

}
//设备图标赋值
function deviceChartInit() {
    axios.post(__URL + 'Homepage/async_system_devicecharts_data', {
        params: {}
    }).then(function (response) {
        vm.devicesStatistics.deviceNumber = 0;
        var data = [];
        for (var item in response.data) {
            data.push({ name: item, value: response.data[item] });
            vm.devicesStatistics.deviceNumber += parseInt(response.data[item]);
        }
        vm.devicesStatistics.deviceData = data;
        vm.devicesStatistics.Option.series[0].data = data;
        vm.devicesStatistics.Option.title.subtext = "共计:" + vm.devicesStatistics.deviceNumber + "台";
        vm.devicesStatistics.deviceChart.setOption(vm.devicesStatistics.Option);
    }).catch(function (error) {
        console.log(error);
    });
}