/**
*create by lix
*2018-11-06
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap']);
//主控制器
appModule.controller('funnelController', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.workorderData == undefined || Object.keys($scope.service.privateDateObj.workorderData).length < 1) {
        parent.layer.load(1, {
            shade: [0.6, '#fff']
        });
    }
    //初始化一个文字模板
    $scope.service.textallprojectmoney = {};
    //查询方法
    //初始化
    $scope.service.allprojectmoney = {};
    //初始化时间插件
    $scope.initDatepiker = function () {
        //给时间戳插件赋值
        $scope.service.start = new Date();
        $scope.service.end = new Date();
        //控制日期选择框的显示与否
        $scope.popup1 = { opened: false };
        $scope.popup2 = { opened: false };
        //时间插件配置项
        $scope.dateOptions1 = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.dateOptions2 = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            startingDay: 1
        };
        //打开事件选择框的方法
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        }
        //打开事件选择框的方法
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        }
    };
    //初始化时间插件
    $scope.initDatepiker();
    $scope.select = function () {
        /*
            sql:select sum(promoney.money * promoney.number) as allnum from xc_projectmain as project left join xc_projectdevicelist as promoney on project.idproject=promoney.projectid where project.del=0 AND promoney.del=0 AND project.index = 0 group by project.statusid ;
            +------------+
            | allnum     |
            +------------+
            | 248705815  |//客户调研
            | 1009180026 |//投标
            | 348927634  |//谈判
            | 100000     |//确定需求 
            +------------+
            把总价的数据也加到数据里，因为成交的总价是分开做的。所以查询的方式不一样，后台给做处理了
        */
        $scope.service.postData(__URL + 'Crmproject/Project/select_page_alldatamoney', {}).then(function (data) {
            /*
            得到数据.这里把数据写死了，后期维护起来有点麻烦，暂时没有好的办法，那就对不住了
                5: "248705815"      客户调研
                6: "1009080026"     项目投标
                7: "348927634"      项目谈判
                8: "190589511"      签订合同
                9: "100000"         确定需求 
                    5: {allnum: "20541761", actualnum: "10403797.8000"}
                    6: {allnum: "26857368", actualnum: "14922406.0000"}
                    7: {allnum: "8684684", actualnum: "3069536.8000"}
                    8: {allnum: "13321179", actualnum: "10399406.0000"}
            */
            $scope.service.allprojectmoney = data;
            //确保得到数据之后你再去渲染
            $scope.renderfunnel();
        });
    }
    $scope.wintotal = function () {
        var wintotal = 0;
        for (item in $scope.service.textallprojectmoney) {
            wintotal += parseInt($scope.service.textallprojectmoney[item].wintotal != undefined ? $scope.service.textallprojectmoney[item].wintotal :0);//防止等于undefined
        }
        $scope.wintotal = P_formateNumber(wintotal);
    }
    //渲染漏斗图
    $scope.renderfunnel = function () {
        var dom = document.getElementById("container");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params, ticket, callback) {
                    if ($scope.service.allprojectmoney[params.value[2]] == undefined) {
                        return '很抱歉，【' + params.data.name + '】没有项目金额';
                    }
                    return params.seriesName + '--' + params.data.name + '<br/>总金额：' + P_formateNumber($scope.service.allprojectmoney[params.value[2]].allnum) + '<br />预计成交金额：' + P_formateNumber((parseInt($scope.service.allprojectmoney[params.value[2]].actualnum)));
                }
            },
            //工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
            toolbox: {
                //是否显示工具栏组件。
                show: true,
                //工具栏 icon 的布局朝向。
                orient: 'horizontal',
                //工具栏 icon 的大小。 
                itemSize: 20,
                //工具栏 icon 每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
                itemGap: 15,
                //是否在鼠标 hover 的时候显示每个工具 icon 的标题。
                showTitle: true,
                //各工具配置项。除了各个内置的工具按钮外，还可以自定义工具按钮。
                //注意，自定义的工具名字，只能以 my 开头，例如下例中的 myTool1，myTool2：
                feature: {
                    //数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
                    //dataView: { readOnly: false },
                    //配置项还原。
                    restore: {},
                    //保存为图片。
                    saveAsImage: {}
                },
                //工具栏组件离容器上侧的距离。
                left: 'auto',
                //工具栏组件离容器右侧的距离。
                right: 20,
                //还有很多不计了。。。
            },
            legend: {
                data: ['展现', '点击', '访问', '咨询', '订单']
            },
            calculable: true,
            series: [
                {
                    //系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                    name: '赢率',
                    //在漏斗图中，type 值为 funnel。
                    type: 'funnel',
                    //向左偏移20%这样右边也是20，宽度为60%就居中了
                    left: '5%',
                    top: 60,
                    //x2: 80,
                    bottom: 60,
                    width: '70%',
                    // height: {totalHeight} - y - y2,
                    //指定的数据最小值，不设置时为 0。
                    min: 0,
                    //指定的数据最大值，默认为 100。
                    max: 100,
                    //数据最小值 min 映射的宽度，默认为0%。
                    minSize: '0%',
                    //数据最大值 max 映射的宽度，默认为 100%。
                    maxSize: '100%',
                    //数据排序， 可以取 'ascending'，'descending'（默认值），'none'（表示按 data 顺序），或者一个函数
                    sort: 'none',
                    //数据图形间距。
                    gap: 2,
                    //是否启用图例 hover 时的联动高亮，默认为 true。
                    legendHoverLink: true,
                    //水平方向对齐布局类型，默认居中对齐，可用选项还有：'left'、'right'、'center'（默认值）
                    funnelAlign: 'center',
                    //漏斗图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等，label选项在 ECharts 2.x 中放置于itemStyle.normal下，在 ECharts 3 中为了让整个配置项结构更扁平合理，label 被拿出来跟 itemStyle 平级，并且跟 itemStyle 一样拥有 normal, emphasis 两个状态。
                    winrate: 10,
                    label: {
                        normal: {
                            //是否显示标签。
                            show: true,
                            //标签的位置。 top
                            position: 'inside',
                            //距离图形元素的距离。
                            distance: 5,
                            //formatter 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行。
                            /*
                                {a}：系列名。
                                {b}：数据名。
                                {c}：数据值。
                                {@xxx}：数据中名为'xxx'的维度的值，如{@product}表示名为'product'` 的维度的值。
                                {@[n]}：数据中维度n的值，如{@[3]}` 表示维度 3 的值，从 0 开始计数。
                            */
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    //标签的视觉引导线样式，在 label 位置设置为'left'或者'right'的时候会显示视觉引导线。
                    labelLine: {
                        normal: {
                            length: 10,
                            lineStyle: {
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    //图形样式，有 normal 和 emphasis 两个状态。normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1
                        }
                    },
                    //表示渲染的数据
                    data: [
                        { value: [100, 10, 5], name: '客户调研' },
                        { value: [80, 30, 9], name: '确定需求' },
                        { value: [60, 60, 6], name: '项目投标' },
                        { value: [40, 80, 7], name: '项目谈判' },
                        { value: [20, 100, 8], name: '签订合同' },
                    ]
                }, {
                    name: '赢率',
                    type: 'funnel',
                    left: '5%',
                    width: '70%',
                    maxSize: '100%',
                    //这边用来控制漏斗右边文字的显示隐藏和文字是什么
                    label: {
                        emphasis: {
                            position: 'inside',
                            formatter: function (params, tic, callback) {
                                //先给textdata一个空对象初始化
                                $scope.service.textallprojectmoney[params.value[2]] = {};
                                //开始要进行判断，因为可能会有空的
                                if ($scope.service.allprojectmoney[params.value[2]] == undefined) {
                                    $scope.service.textallprojectmoney[params.value[2]]['color'] = "#3c3c3c";//如果没有的话给个灰黑色的吧
                                    return $scope.service.textallprojectmoney[params.value[2]]['textdata'] = '很抱歉，【' + params.data.name + '】没有项目金额';
                                }
                                //这里把算出来的值给个变量
                                $scope.service.textallprojectmoney[params.value[2]]['wintotal'] = (parseInt($scope.service.allprojectmoney[params.value[2]].actualnum));
                                //组件成   初步接洽：  100万 × 10% = 10万 赋值给一个新的变量
                                $scope.service.textallprojectmoney[params.value[2]]['textdata'] = params.name + '：预计成交金额：' + P_formateNumber((parseInt($scope.service.allprojectmoney[params.value[2]].actualnum)));
                                $scope.service.textallprojectmoney[params.value[2]]['color'] = params.color;
                                return $scope.service.textallprojectmoney[params.value[2]]['textdata'];
                            }
                        }
                    },
                    data: [
                        { value: [100, 10, 5], name: '客户调研' },
                        { value: [80, 30, 9], name: '确定需求' },
                        { value: [60, 60, 6], name: '项目投标' },
                        { value: [40, 80, 7], name: '项目谈判' },
                        { value: [20, 100, 8], name: '签订合同' },
                    ]
                }
            ]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
            //计算出赢单总额---在渲染完毕
            $scope.wintotal();
            //关闭加载中提示
            parent.layer.closeAll('loading');
        } else {
            //关闭加载中提示并提示页面损坏
            parent.layer.closeAll('loading');
            parent.layer.msg("页面损坏，请稍后再试或退出页面进行重载！");
        }
    }

    
    //查询
    $scope.select();
    //刷新按钮
    $scope.refresh = refresh;
}])

