/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2018-12-06 14:09:23
 * @LastEditTime: 2018-12-11 18:17:52
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

AJAX.pushMetting = function (postData) {
    // const postData = {
    //     // "data_id": 1000 + (Math.random().toFixed(3) * 1000),
    //     "name": `第一次代表大会${Math.random().toFixed(2) * 100}`,
    //     "date": new Date().getTime(),
    //     "experts": [{
    //         "id": "h5rUlWcBbbNc8MaPwkWi",
    //         "voting": [
    //             {
    //                 "name": "废后表决",
    //                 "total": 20,
    //                 "voting_data": 0
    //             }
    //         ]
    //         ,
    //         "sing_in_time": new Date().getTime(),
    //         "sing_down_time": new Date().getTime(),
    //         "annotate": ["这是一些有道理的批注信息", "就像你说的一样，很有道理"]
    //     },
    //     {
    //         "id": "i5rVlWcBbbNc8MaP_UX6",
    //         "voting": [
    //             {
    //                 "name": "废后表决",
    //                 "voting_data": 1,
    //                 "total": 20,
    //             },
    //             {
    //                 "name": "废后表决",
    //                 "voting_data": 1,
    //                 "total": 20,
    //             }, {
    //                 "name": "废后表决",
    //                 "voting_data": 1,
    //                 "total": 20,
    //             }, {
    //                 "name": "废后表决",
    //                 "voting_data": 1,
    //                 "total": 20,
    //             }, {
    //                 "name": "废后表决",
    //                 "voting_data": 1,
    //                 "total": 20,
    //             }, {
    //                 "name": "废后表决",
    //                 "voting_data": 1,
    //                 "total": 20,
    //             }
    //         ]
    //         ,
    //         "sing_in_time": new Date().getTime() + 100000,
    //         "sing_down_time": new Date().getTime() + 100000,
    //         "annotate": ["这是一些有道理的批注信息", "就像你说的一样，很有道理"]
    //     }]
    // }

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
            },
            error(error) {
                reject(error);
            }
        })
    })
}
AJAX.queryOriginMetting = function (data) {
    const user = 'dsky';
    const pwd = 'dsky12345';
    const host = `http://183.6.98.73:8520`;
    const commonHeader = `${host}/WzhyWeb_v3/Service.asmx/WzhyObject?user=${user}&psw=${pwd}`;
    const reqDateEnd = new Date().Format('yyyy-MM-dd hh:mm:ss');
    const getJosn = (originXML) => {
        var xotree = new XML.ObjTree();
        var strXml = originXML.childNodes[0].outerHTML;
        strXml = strXml.replace(/\&lt;/g, '<');
        strXml = strXml.replace(/\&gt;/g, '>');
        return xotree.parseXML(strXml).string
    }
    const makeMyMeetingData = function (meeting_data) {
        var findSingMsgById = (id, msg) => {
            const userMsg = msg.filter(m => { return m.userid == id })[0];
            if (!userMsg) {
                return {
                    sing_down_time: 'null',
                    sing_in_time: 'null'
                }
            }
            return {
                sing_down_time: userMsg.downtime,
                sing_in_time: userMsg.signtime
            }
        }
        var findVotingById = (id, msg) => {
            return [];
        }
        var findAnnoateById = (id, msg) => {
            return msg.filter(m => {
                return m.userid == id;
            }).map(d => {
                return `在源文件 ${d.srcfilename}上做了批注。批注文件名为 ${d.filename}，地址为${d.url}`
            });
        }
        return new Promise((resove, reject) => {
            const ret_data_total = {
                "meeting_id": meeting_data.meetingid,
                "name": meeting_data.meetingname,
                "date": new Date(meeting_data.starttime.replace(/-/g, "/")).getTime()
            }

            $.ajax({
                type: "get",
                dataType: "xml",
                contentType: 'text/xml',
                url: `${commonHeader}&ifsid=G002&xmldata=<?xml version="1.0" encoding="utf-8"?><root><meetingid>${meeting_data.meetingid}</meetingid></root> `,
                success(xmldata) {
                    const jdata_experts = getJosn(xmldata);
                    const expert_ids = jdata_experts.root.body ? jdata_experts.root.body.record.map((d) => { return d.userid }) : [];

                    if (!expert_ids.length) {
                        ret_data_total.experts = []
                        resove(ret_data_total);
                        return;
                    }

                    const meeting_msg_promise_arr = [];
                    //--会议签到
                    meeting_msg_promise_arr.push(new Promise((resove, reject) => {
                        $.ajax({
                            type: "get",
                            dataType: "xml",
                            contentType: 'text/xml',
                            url: `${commonHeader}&ifsid=G009&xmldata=<?xml version="1.0" encoding="utf-8"?><root><meetingid>${meeting_data.meetingid}</meetingid></root> `,
                            success(xmldata) {
                                const jdata_sing_msg = getJosn(xmldata);
                                resove(jdata_sing_msg.root.body ? jdata_sing_msg.root.body.record : [])
                            }
                        })
                    }))
                    //--会议表决
                    meeting_msg_promise_arr.push(new Promise((resove, reject) => {
                        $.ajax({
                            type: "get",
                            dataType: "xml",
                            contentType: 'text/xml',
                            url: `${commonHeader}&ifsid=G010&xmldata=<?xml version="1.0" encoding="utf-8"?><root><meetingid>${meeting_data.meetingid}</meetingid><querytype>1</querytype></root> `,
                            success(xmldata) {
                                const jdata_voting_msg = getJosn(xmldata);
                                resove(jdata_voting_msg.root.body ? jdata_voting_msg.root.body.record : [])
                            }
                        })
                    }))
                    //--会议批注
                    meeting_msg_promise_arr.push(new Promise((resove, reject) => {
                        $.ajax({
                            type: "get",
                            dataType: "xml",
                            contentType: 'text/xml',
                            url: `${commonHeader}&ifsid=G011&xmldata=<?xml version="1.0" encoding="utf-8"?><root><meetingid>${meeting_data.meetingid}</meetingid></root> `,
                            success(xmldata) {
                                const jdata_annotate_msg = getJosn(xmldata);
                                resove(jdata_annotate_msg.root.body ? jdata_annotate_msg.root.body.record : [])
                            }
                        })
                    }))



                    Promise.all(meeting_msg_promise_arr).then(data_after_meeting => {
                        var sing_msg = data_after_meeting[0];
                        var voting_msg = data_after_meeting[1];
                        var annotate_msg = data_after_meeting[2];
                        ret_data_total.experts = expert_ids.map(expert_id => {
                            return {
                                id: expert_id,
                                voting: findVotingById(expert_id, voting_msg),
                                sing_in_time: findSingMsgById(expert_id, sing_msg).sing_in_time,
                                sing_down_time: findSingMsgById(expert_id, sing_msg).sing_down_time,
                                annotate: findAnnoateById(expert_id, annotate_msg)
                            }
                        })
                        resove(ret_data_total);
                    })
                }
            })
        })
    }
    return new Promise((resove, reject) => {

        $.ajax({
            type: "get",
            dataType: "xml",
            contentType: 'text/xml',
            url: `${commonHeader}&ifsid=G006&xmldata=`,
            success(xmldata) {
                const jdata_halls = getJosn(xmldata);

                if (jdata_halls.root.head.result != "0") {
                    reject();
                    return;
                }

                const halls = jdata_halls.root.body.record;
                const halls_promise_arr = [];
                for (let i = 0; i < halls.length; i++) {
                    halls_promise_arr.push(new Promise((resove1) => {
                        $.ajax({
                            type: "get",
                            dataType: "xml",
                            contentType: 'text/xml',
                            url: `${commonHeader}&ifsid=G001&xmldata=<?xml%20version="1.0"%20encoding="utf-8"?><root><hallname>${halls[i].hallname}</hallname><starttime>2016-05-24%2011:45:00</starttime><endtime>${reqDateEnd}</endtime></root>`,
                            success(xmldata) {
                                const jdata = getJosn(xmldata);
                                if (jdata.root.record) {
                                    resove1(jdata.root.record);
                                } else
                                    resove1([]);
                            }
                        })
                    }))
                }
                Promise.all(halls_promise_arr).then((resultarr) => {
                    const total_metting = resultarr.reduce((a, b) => {
                        for (var i = 0; i < b.length; i++) {
                            a.push(b[i]);
                        }
                        return a;
                    })
                    const insert_promise_arr = [];
                    total_metting.map((one_meeting_data) => {
                        insert_promise_arr.push(new Promise((resove2, reject2) => {

                            const querydata = {
                                "query": {
                                    "match": {
                                        "meeting_id": one_meeting_data.meetingid
                                    }
                                },
                            }
                            const insert_fn = () => {
                                makeMyMeetingData(one_meeting_data).then(myMeetingData => {
                                    AJAX.pushMetting(myMeetingData).then((push_result) => {
                                        resove2();
                                    })
                                })
                            }
                            //--查询数据库中是否有会议记录
                            AJAX.queryMeeting(querydata).then(meeting_data => {
                                if (!meeting_data.hits.hits.length) {
                                    insert_fn();
                                } else {
                                    resove2();
                                }
                            }).catch(() => {
                                //--数据库还没有会议，查询会报错
                                insert_fn();
                            });

                        }))
                    })
                    Promise.all(insert_promise_arr).then(() => {
                        resove();
                    })
                })
            }
        })
    })
}
AJAX.isIndexExist = function (indexName, docname) {
    return new Promise((resove, reject) => {
        $.ajax(
            {
                type: "get",
                contentType: 'application/json',
                url: `${gConfig.host}/${indexName}/${docname}/_search?`,
                success(data) {
                    reject(data);
                },
                error(e) {
                    if (e.responseJSON.error.type == "index_not_found_exception")
                        resove();
                    else
                        reject()
                }
            }
        )
    })
}
AJAX.createIndex = function (indexName, typename, mapping) {
    return new Promise((resove, reject) => {
        AJAX.isIndexExist(indexName, typename).then(() => {
            $.ajax({
                type: "post",
                contentType: 'application/json',
                data: "{}",
                url: `${gConfig.host}/${indexName}/${typename}/1?`,
                success(data) {
                    $.ajax({
                        type: "delete",
                        contentType: 'application/json',
                        data: "{}",
                        url: `${gConfig.host}/${indexName}/${typename}/1`,
                        success(data) {
                            if (mapping) {
                                $.ajax({
                                    type: "post",
                                    contentType: 'application/json',
                                    data: JSON.stringify(mapping),
                                    url: `${gConfig.host}/${indexName}/${typename}/_mapping?`,
                                    success() {
                                        resove();
                                    },
                                    error(data) {
                                        reject("创建mapping失败")
                                    }
                                })
                            }
                            else {
                                resove();
                            }
                        },
                        error(data) {
                            reject("创建索引失败")
                        }
                    })

                },
                error(e) {
                    reject("创建索引失败")
                }
            })
        }).catch(() => {
            reject("索引已经存在");
        })

    })
}
AJAX.saveSampleResult = function (name, type, data_arr) {

    var postData = {
        "name": name,
        "time": new Date().getTime(),
        "type": type,
        "experts": data_arr
    }

    var getRandomId = function () {
        var str = "";
        for (var i = 0; i < 5; i++) {
            str += Math.round(Math.random() * 10);
        }
        return str;
    }

    return new Promise((resove, reject) => {

        const post = () => {
            var id = getRandomId();
            $.ajax({
                type: "post",
                contentType: 'application/json',
                url: `${gConfig.host}/sample/info/${id}?refresh=wait_for`,
                data: JSON.stringify(postData),
                success() {
                    debugger;
                    resove(id);
                },
                error() {
                    debugger;
                }
            })
        }
        AJAX.createIndex("sample", "info", {
            "properties": {
                "time": {
                    "type": "date"
                }
            }
        }
        ).then(() => {
            post();
        }).catch(() => {
            post();
        })
    })
}

// $.ajax({
//     type: "put",
//     dataType: "xml",
//     contentType: 'application/json',
//     url: `${gConfig.host}/expert/_settings`,
//     data: JSON.stringify({"index.blocks.read_only_allow_delete": null })
// })