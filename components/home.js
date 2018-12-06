
Vue.component('home', {
    template: '#home-component',
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
            total_num: 0,
            curIndex: 1
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
                    const tg = components.length ? components : [components];
                    tg.map((t) => {
                        t.loadImg();
                    })
                }
            });
        },
        reqExpertsData(start, end) {
            const self = this;
            return new Promise((resove, reject) => {

                AJAX.queryExperts({
                    "from": start,
                    "size": 10,
                    "sort": { "date": { "order": "asc" } }
                }).then((data) => {
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
        searchHandel() {
            this.$refs.search_component.doSearch(this.search_value);
        }
    },
    mounted() {
        this.reqExpertsData(0, 10);
    }
});