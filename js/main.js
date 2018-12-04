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

