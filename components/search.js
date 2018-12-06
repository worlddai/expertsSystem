Vue.component('search', function (resolve, reject) {
    $.get("./components/search.html").then(function (res) {
        resolve({
            template: res,
            data: () => {
                return {
                    key: "",
                    nameSearch: [
                    ],
                    mettingSearch: [
                    ],
                    annotateSearch: [
                    ]
                }
            },
            methods: {
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
                    setTimeout(() => {
                        var createData = () => {
                            return {
                                "data_id": 1000 + (Math.random().toFixed(3) * 1000),
                                "name": "专家1",
                                "duty": "少先队队长兼班花",
                                "company": {
                                    "prepend": [
                                        "北京",
                                        "西二旗"
                                    ],
                                    "detail": "辉煌国际酒店"
                                },
                                "contact": [
                                    {
                                        "type": "office",
                                        "value": "13189991222"
                                    },
                                    {
                                        "type": "mobile",
                                        "value": "051245445555"
                                    }
                                ],
                                "major": [
                                    "科学",
                                    "人文",
                                    "地理"
                                ]
                            }
                        }
                        const arr = [];
                        for (var i = 0; i < Math.random() * 15; i++) {
                            arr.push(createData());
                        }
                        this.nameSearch = arr;
                        const arr2 = [];
                        for (var i = 0; i < Math.random() * 15; i++) {
                            arr2.push(createData());
                        }
                        this.mettingSearch = arr2;
                        const arr3 = [];
                        for (var i = 0; i < Math.random() * 15; i++) {
                            arr3.push(createData());
                        }
                        this.annotateSearch = arr3;
                    }, 200);
                }
            },
            // props: ["expertsData"],
            mounted: function () {

            }
        })
    });

});