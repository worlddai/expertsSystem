

//--加载自定义级联数据json
function loopCascadeData(target_arr) {
    let retArr = [];
    target_arr.forEach(d => {
        const unit = {
            label: d.title,
            value: d.title
        }
        if (d.children) {
            unit.children = loopCascadeData(d.children);
        }
        retArr.push(unit)
    })
    return retArr;
}

function loadMajorCascadeConfig(success) {
    $.ajax({
        type: 'get',
        url: './config/zhuanye_tree.json',
        success: data => {
            success(data);
        },
        error: () => {
        }
    })
}
function loadCompanyCascadeConfig(success) {
    $.ajax({
        type: 'get',
        url: './config/danwei_tree.json',
        success: data => {
            success(
                loopCascadeData(data),
            );
        },
        error: () => {
            // failure();
        }
    })
}
//--加载基本配置
function loadCommonConfig(success) {
    $.ajax({
        type: 'get',
        url: './config/common_config.json',
        success: data => {
            success(data);
        },
        error: () => {
        }
    })
}

function loopLeaf(treeData, fn, scope) {
    treeData.map((tg) => {
        if (tg.children)
            loopLeaf(tg.children, fn, scope)
        else {
            fn.call(scope, tg, treeData)
        }
    })
}
function loopAll(treeData, fn, scope) {
    treeData.map((tg) => {
        fn.call(scope, tg, treeData);
        if (tg.children)
            loopAll(tg.children, fn, scope)
    })
}

Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

