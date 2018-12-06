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