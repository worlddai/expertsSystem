/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2018-12-06 14:09:23
 * @LastEditTime: 2018-12-10 18:49:38
 * @LastEditors: Please set LastEditors
 */

var AJAX = {};

AJAX.queryExperts = function (data) {

    return new Promise((resove, reject) => {
        $.ajax({
            type: "post",
            contentType: 'application/json',
            url: `${gConfig.host}/expert/info/_search?`,
            data: JSON.stringify(data),
            success(data) {
                resove(data);
            }
        })
    })
}

AJAX.getExperts = function (_id) {

    return new Promise((resove, reject) => {
        var queryData = {
            "query": {
                "match": {
                    "_id": _id
                }
            }
        };
        $.ajax({
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify(queryData),
            url: `${gConfig.host}/expert/info/_search`,
            success(data) {
                resove(data);
            }
        })
    })
}
AJAX.addExperts = function (postData) {
    postData.date = new Date().getTime();
    return new Promise((resove, reject) => {
        $.ajax({
            "type": "post",
            "contentType": 'application/json',
            "url": `${gConfig.host}/expert/info?refresh=wait_for`,
            "data": JSON.stringify(postData),
            "success": (data) => {
                resove(data);
            }
        })
    })
}
AJAX.deleteExperts = function (data) {

}
AJAX.updateExperts = function (_id, postData) {
    return new Promise((resove, reject) => {
        $.ajax({
            "type": "post",
            "contentType": 'application/json',
            "url": `${gConfig.host}/expert/info/${_id}?refresh=wait_for`,
            "data": JSON.stringify(postData),
            "success": (data) => {
                resove(data);
            }
        })
    })
}
AJAX.queryExpertsByCompany = function (key) {
    var data = {
        "query": {
            "multi_match": {
                "query": key,
                "fields": ["company.prepend"],
                "operator": "and"
            }
        }
    }
    return new Promise((resove, reject) => {
        $.ajax({
            type: "post",
            contentType: 'application/json',
            url: `${gConfig.host}/expert/info/_search?`,
            data: JSON.stringify(data),
            success(data) {
                resove(data);
            }
        })
    })
}
AJAX.getExpertsPhoto = function (expert_id) {

    return new Promise((resove, reject) => {
        const data = {
            "query": {
                "match": {
                    "data_id": expert_id
                }
            },
        }
        $.ajax({
            type: "post",
            contentType: 'application/json',
            url: `${gConfig.host}/picture/info/_search`,
            data: JSON.stringify(data),
            success(data) {
                resove(data);
            }
        })
    })

}
AJAX.addPhoto = function (postData) {
    return new Promise((resove, reject) => {

        $.ajax({
            type: 'post',
            contentType: 'application/json',
            url: `${gConfig.host}/picture/info?refresh=wait_for`,
            data: JSON.stringify(postData),
            success: function (data) {
                resove(data)
            },
            error: function () {
                reject()
            }
        })

    })
}

AJAX.updatePhoto = function (expert_id, postData) {
    const queryOp = {
        "query": {
            "match": {
                "data_id": expert_id
            }
        },
    }
    return new Promise((resolve, reject) => {

        $.ajax({
            type: "post",
            url: `${gConfig.host}/picture/info/_search?`,
            contentType: 'application/json',
            data: JSON.stringify(queryOp),
            success(data) {
                if (data.hits.total > 0) {
                    $.ajax({
                        type: "post",
                        url: `${gConfig.host}/picture/info/${data.hits.hits[0]._id}?refresh=wait_for`,
                        contentType: 'application/json',
                        data: JSON.stringify(postData),
                        success(data) {
                            resolve()
                        }
                    })
                }
            }
        })
    })
}

AJAX.getExpertsMetting = function (expert_id) {

    return new Promise((resove, reject) => {
        const data = {
            "query": {
                "multi_match": {
                    "query": expert_id,
                    "fields": ["experts.id"]
                }
            }
        };
        $.ajax({
            type: "post",
            contentType: 'application/json',
            url: `${gConfig.host}/meeting/info/_search`,
            data: JSON.stringify(data),
            success(data) {
                resove(data);
            }
        })
    })

}

AJAX.pushMetting = function () {
    const postData = {
        // "data_id": 1000 + (Math.random().toFixed(3) * 1000),
        "name": `第一次代表大会${Math.random().toFixed(2) * 100}`,
        "date": new Date().getTime(),
        "experts": [{
            "id": "h5rUlWcBbbNc8MaPwkWi",
            "voting": [
                {
                    "name": "废后表决",
                    "total": 20,
                    "voting_data": 0
                }
            ]
            ,
            "sing_in_time": new Date().getTime(),
            "sing_down_time": new Date().getTime(),
            "annotate": ["这是一些有道理的批注信息", "就像你说的一样，很有道理"]
        },
        {
            "id": "i5rVlWcBbbNc8MaP_UX6",
            "voting": [
                {
                    "name": "废后表决",
                    "voting_data": 1,
                    "total": 20,
                },
                {
                    "name": "废后表决",
                    "voting_data": 1,
                    "total": 20,
                }, {
                    "name": "废后表决",
                    "voting_data": 1,
                    "total": 20,
                }, {
                    "name": "废后表决",
                    "voting_data": 1,
                    "total": 20,
                }, {
                    "name": "废后表决",
                    "voting_data": 1,
                    "total": 20,
                }, {
                    "name": "废后表决",
                    "voting_data": 1,
                    "total": 20,
                }
            ]
            ,
            "sing_in_time": new Date().getTime() + 100000,
            "sing_down_time": new Date().getTime() + 100000,
            "annotate": ["这是一些有道理的批注信息", "就像你说的一样，很有道理"]
        }]
    }

    return new Promise((resove, reject) => {
        $.ajax({
            "type": "post",
            "contentType": 'application/json',
            "url": `${gConfig.host}/meeting/info?refresh=wait_for`,
            "data": JSON.stringify(postData),
            "success": (data) => {
                resove(data);
            }
        })
    })
}
AJAX.queryMeeting = function (data) {
    return new Promise((resove, reject) => {
        $.ajax({
            type: "post",
            contentType: 'application/json',
            url: `${gConfig.host}/meeting/info/_search`,
            data: JSON.stringify(data),
            success(data) {
                resove(data);
            }
        })
    })
}

