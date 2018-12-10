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