
Vue.component('home', {
    template: '#home-component',
    data: () => {
        return {
            search_value: "",
            experts_type_value: [],
            company_group_json: [],
            experts_type: [
                {
                    value: 'New York',
                    label: '分类1'
                },
                {
                    value: 'London',
                    label: '分类2'
                }],
            data_list: [],
            delete_experts: {
                model_show: false,
                willbeDelete: null
            },
            total_num: 0,
            curIndex: 1
        }
    },
    watch: {
        experts_type_value() {
            this.reqExpertsData(0, 10);
            // this.curIndex = 1;
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
            $.ajax({
                type: 'delete',
                url: `${gConfig.host}/expert/info/${this.delete_experts.willbeDelete.data_id}?refresh=wait_for`,
                success() {
                    self.delete_experts.model_show = false;
                    self.reflashData();
                    self.$Message.info('删除专家成功！');
                }
            })


        },
        goDetail(id) {
            this.$router.push({ path: `/detail/${id}` })
        },
        reflashData(deep) {
            const self = this;
            this.reqExpertsData((this.curIndex - 1) * 10, this.curIndex * 10).then(() => {
                if (deep) {
                    const components = self.$refs.experts_components;
                    if (!components)
                        return;
                    const tg = $.isArray(components) ? components : [components];
                    tg.map((t) => {
                        t.loadImg();
                    })
                }
            });
        },
        reqExpertsData(start, end) {
            const self = this;
            return new Promise((resove, reject) => {

                const query = {
                    "from": start,
                    "size": 10,
                    "sort": { "date": { "order": "asc" } }
                }
                if (self.experts_type_value.length) {
                    //--取最后一个关键字查找
                    const key = self.experts_type_value[self.experts_type_value.length - 1];
                    query.query = {
                        "multi_match": {
                            "query": key,
                            "fields": ["company.prepend"],
                            "operator": "and"
                        }
                    }
                }

                AJAX.queryExperts(query).then((data) => {
                    self.total_num = data.hits.total;
                    self.data_list = data.hits.hits.map((d) => {
                        d._source.data_id = d._id;
                        return d._source;
                    });
                    resove();
                })

            })
        },
        onPageChange(nIndex) {
            this.curIndex = nIndex;
            this.reqExpertsData((nIndex - 1) * 10, nIndex * 10);
        },
        searchHandel(e) {
            this.$refs.search_component.doSearch(this.search_value);
        },
        loadCashaData() {
            const self = this;
            loadCompanyCascadeConfig((data) => {
                self.company_group_json = data;
            })
        }

    },
    mounted() {
        this.reqExpertsData(0, 10);
        this.loadCashaData();
        AJAX.queryOriginMetting();
    }
});