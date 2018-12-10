Vue.component('search', function (resolve, reject) {
    $.get("./components/search.html").then(function (res) {
        resolve({
            template: res,
            data: () => {
                return {
                    key: "",
                    basic_search_condition: [
                        {
                            name: "姓名",
                            field_key: "name",
                            search_key: ['name'],
                        },
                        {
                            name: "职务",
                            field_key: "duty",
                            search_key: ['duty'],
                        },
                        {
                            name: "单位",
                            field_key: "company",
                            search_key: ['company.prepend', 'company.detail'],
                        },
                        {
                            name: "联系方式",
                            field_key: "contact",
                            search_key: ['contact.value'],
                        },
                        {
                            name: "专业领域",
                            field_key: "major",
                            search_key: ['major'],
                        }
                    ],
                    mettingSearch: []
                }
            },
            computed: {
                allnone() {
                    return this.basic_search_condition.every((d) => {
                        const tg = this[`${d.field_key}Search`];
                        if (!tg)
                            return true;
                        return tg.length == 0;
                    }, this)
                }
            },
            methods: {
                oneSearchEmpty(key) {
                    return !this[`${key}Search`] || this[`${key}Search`].length == 0;
                },
                goDetail(id) {
                    this.$emit('on-detail', id)
                },
                showAddUpdateExperts(id) {
                    this.$emit('on-edit', id)
                },
                showDeleteExperts(item) {
                    this.$emit('on-delete', item)
                },
                doSearch(key) {
                    this.key = key;
                    const self = this;
                    this.basic_search_condition.map(d => {
                        AJAX.queryExperts({
                            "query": {
                                "multi_match": {
                                    "query": this.key,
                                    "fields": d.search_key,
                                    "operator": "and",
                                    "fuzziness": "AUTO"
                                }
                            }
                        }).then(data => {
                            self[`${d.field_key}Search`] = data.hits.hits.map((d) => {
                                d._source.data_id = d._id;
                                return d._source;
                            });
                            //--驱使ui刷新
                            self.basic_search_condition.push(self.basic_search_condition.pop())
                        })
                    })

                    // AJAX.queryMeeting({
                    //     "query": {
                    //         "multi_match": {
                    //             "query": this.key,
                    //             "fields": ["name"],
                    //             "operator": "and",
                    //             "fuzziness": "AUTO"
                    //         }
                    //     }
                    // }).then(data => {
                    //     const experts_id = [];
                    //     data.hits.hits.map((d) => {
                    //         // d._source.data_id = d._id;
                    //         d._source.experts.map((exp) => {
                    //             if (experts_id.every(tg => {
                    //                 return tg != exp.id
                    //             }))
                    //                 experts_id.push(exp.id);
                    //         });
                    //     });
                    // })

                }
            },
            mounted: function () {
                var self = this;
                this._self = this;
                window.aaa = this;
                this.basic_search_condition.map((d) => {
                    self[`${d.field_key}Search`] = new Array();
                })
            }
        })
    });

});