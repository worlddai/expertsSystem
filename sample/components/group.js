Vue.component('group', function (resolve, reject) {
    $.get("./components/group.html").then(function (res) {
        resolve({
            template: res,
            data: () => {
                return {
                    isEdit: false,
                    isLoaded: false,
                    experts_data: this.experts || [],
                    sample_num: this.sample_number,
                    add_experts_menu_show: false,
                    add_search_value: "",
                    will_be_add: [],
                    delete_show: true
                }
            },

            methods: {
                onAddSearch() {

                },
                isActiveExperts(item) {
                    return this.will_be_add.some((d) => { return d.data_id == item.data_id })
                },
                onItemClick(item) {
                    var nIndex = 0
                    if (this.will_be_add.some((d, index) => {
                        nIndex = index;
                        return d.data_id == item.data_id
                    })) {
                        this.will_be_add.splice(nIndex, 1);
                    } else {
                        this.will_be_add.push(item);
                    }
                },
                sample() {
                    var ret = [];
                    for (var i = 0; i < this.sample_num; i++) {
                        let value = this.experts_data[Math.round(Math.random() * (this.experts_data.length - 1))]
                        if (ret.every((d) => {
                            return d.data_id != value.data_id;
                        })) {
                            ret.push(value)
                        }
                        else {
                            i--;
                        }
                    }
                    return ret;
                },
                addExperts() {

                    if (!this.isEdit)
                        return;

                    const spliced = this.experts_data.splice(0, this.experts_data.length);
                    if (spliced.length) {
                        this.all_experts.push(...spliced);
                    }

                    this.add_experts_menu_show = true;
                },
                getTotalNum() {
                    const self = this;
                    return new Promise((resolve, reject) => {
                        var interval = setInterval(() => {
                            if (self.isLoaded) {
                                clearInterval(interval);
                                resolve(self.experts_data.length)
                            }
                        }, 100)
                    })
                },
                ensureAdd() {
                    if (this.will_be_add.length < 1) {
                        this.$Message.error('请至少选择一个专家!');
                        return;
                    }
                    this.experts_data = this.will_be_add.splice(0, this.will_be_add.length);
                    for (var i = 0; i < this.all_experts.length; i++) {
                        var tg = this.all_experts[i];
                        if (this.experts_data.some(dd => {
                            return dd.data_id == tg.data_id;
                        })) {
                            this.all_experts.splice(i, 1);
                            i--;
                        }
                    }
                    // this.sample_num = this.experts_data.length;
                    this.$emit('on-expert-select-change')

                    this.add_experts_menu_show = false;
                }
            },
            props: ["experts", "all_experts", "sample_number", "sample_checked", "name", "edit", "item"],
            mounted: function () {
                window._child = this;
                this.sample_num = this.sample_number
                this.isEdit = this.edit;
                this.$emit('on-expert-select-change')
                if (this.isEdit) {
                    return;
                }

                if (this.name) {
                    const self = this;
                    AJAX.queryExpertsByCompany(this.name).then((data) => {

                        self.total_num = data.hits.total;
                        self.experts_data = data.hits.hits.map((d) => {0
                            d._source.data_id = d._id;
                            return d._source;
                        });
                        self.isLoaded = true;
                    })
                }

            },
            destroyed() {
                if (!this.isEdit)
                    return;
                if (!this.experts_data.length)
                    return;
                const spliced = this.experts_data.splice(0, this.experts_data.length);
                if (spliced.length) {
                    this.all_experts.push(...spliced);
                }
                // this.$emit('on-expert-select-change');
            },
        })
    });

});