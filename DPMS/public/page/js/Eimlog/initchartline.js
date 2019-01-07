function initoption() {
  return  option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: true
            },
        },
        legend: {
            data: [],
        },
        toolbox: {
            feature: {   
                saveAsImage: {}
            }
        },
        axisPointer: {
            link: {
                xAxisIndex: 'all'
            }
        },
        dataZoom: [{
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: [0, 1]
        }, {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100,
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
            data: [],
        }, {
            gridIndex: 1
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        }, {
            gridIndex: 1
        }],
        series: [
        ]
    };
}
//需要赋值name和data和线条的颜色 字符串：rgb(242,76,16)
function init_series(name,data) {
  return  {
        name: name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 9,
        showSymbol: false,
        lineStyle: {
            normal: {
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
        data: data
    }
}
