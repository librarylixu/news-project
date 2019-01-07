/* eim-vue-filter v1.0.0 | (c) 2017 by XinChenQingHong ------LSQ */
/*
公用过滤器
*/
/*时间戳过滤器
将时间戳转换为标准的时间
*/
Vue.filter('F_IntToDate', function (input) {
    var date = new Date(parseInt(input) * 1000);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    var h = "0" + date.getHours();
    var minutes = '0' + date.getMinutes();
    var s = '0' + date.getSeconds();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length) + " " + h.substring(h.length - 2, h.length) + ":" + minutes.substring(minutes.length - 2, minutes.length) + ":" + s.substring(s.length - 2, s.length);
    //return new Date(parseInt(input) * 1000).toLocaleString().substr(0, 17).replace(/年|月/g, "-").replace(/日/g, " ").replace(/上午/g, " am ").replace(/下午/g, " pm ");   
});

