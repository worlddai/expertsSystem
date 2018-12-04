const global_vue = new Vue({
    el: '#app',
    data: () => {
        return {
            search_value: "",
            experts_type_value: 'New York',
            experts_type: [
                {
                    value: 'New York',
                    label: 'New York'
                },
                {
                    value: 'London',
                    label: 'London'
                }],
            data_list: [],
            delete_experts: {
                model_show: false,
                willbeDelete: null
            },
            total_num: 0
        }
    },
    computed: {
        data_list_prev() {
            return this.data_list.filter((d, i) => { return i < 5 })
        },
        data_list_app() {
            return this.data_list.filter((d, i) => { return i >= 5 })
        }
    },
    methods: {
        showAddUpdateExperts(id) {
            this.$refs.add_update_experts.show(id);
        },
        showDeleteExperts(item) {
            this.delete_experts.model_show = true;
            this.delete_experts.willbeDelete = item;

        },
        deleteExperts() {
            //--need_service
            var self = this;
            debugger;
            $.ajax({
                type:'delete',
                url:`http://192.168.43.123:9200/expert/info/${this.delete_experts.willbeDelete.data_id}`,
                success()
                {
                    self.delete_experts.model_show = false;
                    self.$Message.info('删除专家成功！');
                }
            })

            
        },
        reqExpertsData(start, end) {
            const self = this;
            //--need_service
            return new Promise((resove, reject) => {

                var postData= {
                    from:start,
                    size:10
                }
                $.ajax({
                    type: "get",
                    url: "http://192.168.43.123:9200/expert/info/_search?",
                    data:JSON.stringify(postData),
                    success(data) {
                        // debugger;
                        self.data_list = data.hits.hits.map((d)=>{
                            d._source.data_id = d._id;
                            return d._source;
                        });
                    }
                })


                // setTimeout((data) => {
                //     var createData = () => {
                //         return testData =
                //             {
                //                 "data_id": 1000 + (Math.random().toFixed(3) * 1000),
                //                 "name": "专家1",
                //                 "duty": "少先队队长兼班花",
                //                 "company": {
                //                     "prepend": [
                //                         "北京",
                //                         "西二旗"
                //                     ],
                //                     "detail": "辉煌国际酒店"
                //                 },
                //                 "contact": [
                //                     {
                //                         "type": "1",
                //                         "value": "13189991222"
                //                     },
                //                     {
                //                         "type": "2",
                //                         "value": "051245445555"
                //                     }
                //                 ],
                //                 "major": [
                //                     "科学",
                //                     "人文",
                //                     "地理"
                //                 ]
                //             }
                //     }


                //     for (var i = 0; i < 10; i++) {
                //         var createdData = createData();
                //         createdData.name = `测试${start + i}`
                //         self.data_list.push(testData);
                //     }

                // }, 1000)
            })
        },
        onPageChange(nIndex) {
            this.reqExpertsData(nIndex * 10, (nIndex + 1) * 10);
        },
        searchHandel() {

        }
    },
    mounted() {
        this.reqExpertsData(0, 10);
    }

})