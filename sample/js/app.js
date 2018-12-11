
const global_vue = new Vue({
    data: () => {
        return {
            mode: "random",
            random_spample_num: 5,//--随机抽取数量
            department_level_group: [],//--部门分类每级数量
            department_level_name: [],//--部门分类名称
            department_level_value: "",//--当前选择的分类类型
            department_level_actived: [],//--选中的分类组
            group_same_check: true,//--每组相同人数
            same_sample_num: 5,//--每组相同人数
            group_result: [],//--分组抽取结果
            random_result: [],//--随机抽取结果
            diy_group: [],//--自定义分组
            diy_group_same_check: true,
            diy_same_sample_num: 5,
            diy_same_sample_num_max: 5,
            diy_group_result: [],

            all_experts_wait_add: []
        }
    },
    watch: {
        department_level_value: function () {
            this.department_level_actived.splice(0, this.department_level_actived.length);
        },
        group_same_check: function (value) {
            if (value) {
                const tg = this.$refs.groups_component;
                if (!tg)
                    return;
                const arr = tg.length ? tg : [tg];
                arr.map(tg => {
                    tg.sample_num = this.same_sample_num;
                })
            }
        },
        same_sample_num: function (value) {
            if (!this.group_same_check) {
                return;
            }
            const tg = this.$refs.groups_component;
            if (!tg)
                return;
            const arr = tg.length ? tg : [tg];
            arr.map(tg => {
                tg.sample_num = value;
            })
        },
        diy_group_same_check: function (value) {
            if (value) {
                const tg = this.$refs.groups_component_diy;
                if (!tg)
                    return;
                const arr = tg.length ? tg : [tg];
                arr.map(tg => {
                    tg.sample_num = this.diy_same_sample_num;
                })
            }
        },
        diy_same_sample_num: function (value) {
            if (!this.diy_group_same_check) {
                return;
            }
            const tg = this.$refs.groups_component_diy;
            if (!tg)
                return;
            const arr = tg.length ? tg : [tg];
            arr.map(tg => {
                tg.sample_num = value;
            })
        },

        department_level_actived: function () {
            if (!this.group_same_check) {
                return;
            }

            const self = this;
            setTimeout(() => {
                const tg = self.$refs.groups_component;
                if (!tg)
                    return;

                const arr = $.isArray(tg) ? tg : [tg];
                if (!arr.length)
                    return;
                let nMin = 1000000;
                let primiseArr = []

                arr.map(tg => {

                    primiseArr.push(tg.getTotalNum());
                })
                Promise.all(primiseArr).then(result => {
                    self.same_sample_num = result.reduce((d1, d2) => {
                        return Math.min(d1, d2);
                    });
                    $(self.$refs.group_same_check_input).attr('max', self.same_sample_num);
                })

            }, 100)


        }

    },
    computed: {
        group_result_show: function () {
            return this.department_level_actived.map((d, i) => {
                return {
                    name: d,
                    result: this.group_result[i]
                }
            }, this)
        },
        diy_group_result_show: function () {
            return this.diy_group.map((d, i) => {
                return {
                    name: d.name,
                    result: this.diy_group_result[i]
                }
            }, this)
        },
        isActiveAddDIYGroup: function () {
            if (!this.diy_group.length)
                return true;

            const tg = this.$refs.groups_component_diy;
            if (!tg)
                return true;
            const arr = tg.length ? tg : [tg];
            return tg.every((d) => {
                return !d.add_experts_menu_show
            })
        }

    },
    methods: {
        isActiveDepartment(item) {
            return this.department_level_actived.some((d) => { return d == item })
        },
        onExpertSelectChange(num) {

            if (!this.diy_group_same_check) {
                return;
            }
            const tg = this.$refs.groups_component_diy;
            if (!tg)
                return;
            const arr = tg.length ? tg : [tg];

            var nMin = 1000000;

            arr.map(tg => {
                nMin = Math.min(nMin, tg.experts_data.length);
            })

            this.diy_same_sample_num = nMin;
            this.diy_same_sample_num_max = nMin;


        },
        doRandomSample() {
            const self = this;
            AJAX.queryExperts(
                {
                    "from": 0,
                    "size": gConfig.max_data_size,
                }
            ).then(data => {
                const dataarr = data.hits.hits.map((d) => {
                    d._source.data_id = d._id;
                    return d._source;
                });
                if (this.random_spample_num > dataarr.length) {
                    self.$Message.error(`抽取数量不得大于专家总数量 ${dataarr.length} 人；`)
                    return;
                }
                const ret = [];
                for (var i = 0; i < this.random_spample_num; i++) {
                    let value = dataarr[Math.round(Math.random() * (dataarr.length - 1))]
                    if (ret.every((d) => {
                        return d.data_id != value.data_id;
                    })) {
                        ret.push(value)
                    }
                    else {
                        i--;
                    }
                }
                self.random_result = ret;
            })
        },
        doSample() {
            const tg = this.$refs.groups_component;
            if (!tg)
                return;
            const arr = tg.length ? tg : [tg];

            this.group_result = arr.map((d) => {
                return d.sample();
            })

        },
        doDIYSample() {
            const tg = this.$refs.groups_component_diy;
            if (!tg)
                return;
            const arr = tg.length ? tg : [tg];

            this.diy_group_result = arr.map((d) => {
                return d.sample();
            })
        },
        onDepartmentLevelChange() {
        },
        onDepartmentChange(item) {
            var nIndex = 0
            if (this.department_level_actived.some((d, index) => {
                nIndex = index;
                return d == item
            })) {
                this.department_level_actived.splice(nIndex, 1);
            } else {
                this.department_level_actived.push(item);
            }
        },
        getLevelGroup() {
            const levelArr = [];
            const self = this;
            const loop = (childs, level) => {
                if (!levelArr[level])
                    levelArr[level] = new Array();
                childs.map((d) => {
                    levelArr[level].push(d.title);
                    if (d.children) {
                        loop(d.children, level + 1);
                    }
                })
            }

            $.ajax({
                type: 'get',
                url: '../config/danwei_tree.json',
                success: data => {
                    loop(data, 0);
                    self.department_level_group = levelArr;
                },
                error: () => {
                }
            })

            $.ajax({
                type: 'get',
                url: '../config/danwei_name.json',
                success: data => {
                    self.department_level_name = data.map((d, i) => {
                        return {
                            value: i,
                            label: d
                        }
                    });
                },
                error: () => {
                }
            })
        },
        addDIYGroup() {

            if (!this.isActiveAddDIYGroup)
                return;

            if (this.all_experts_wait_add.length == 0) {
                this.$Message.info('所有专家都添加完了')
                return;
            }
            this.diy_group.push({
                name: ""
            })
        },
        deleteDIYGroup(index) {

            this.diy_group.splice(index, 1);
            this.diy_group_result.splice(index, 1)
        }
    },
    mounted() {
        this.getLevelGroup();
        const self = this;
        window._parent = this;
        AJAX.queryExperts(
            {
                "from": 0,
                "size": gConfig.max_data_size,
            }
        ).then((date) => {
            self.all_experts_wait_add = date.hits.hits.map((d) => {
                d._source.data_id = d._id;
                return d._source;
            });
        })
    }
}).$mount('#app')