
Vue.component('detail', {
    template: '#detail-component',
    data: () => {
        return {
            selected: null,
            expertId: null,
            basicData: {},
            mettingData: [],

        }
    },
    computed: {
        selectedExpertMeetingData() {
            if (!this.selected) {
                return null;
            }
            const expertsMeetingDataArr = this.selected.experts.filter((d) => {
                return d.id == this.expertId
            }, this);
            if (expertsMeetingDataArr.length != 1) {
                // this.$Message.error('获取专家会议信息失败！')
                return null;
            }
            return expertsMeetingDataArr[0];
        }
    },
    methods: {
        getContactType(nType) {
            switch (nType) {
                case 'office':
                    return "办公";
                case 'home':
                    return "家庭";
                case 'mobile':
                    return "手机";
                case 'others':
                    return "其他";
            }
        },
        getVotingShow(i) {
            return i < 0 ? "反对" : i > 0 ? "赞成" : "弃权";
        },
        loadData() {
            const self = this;
            AJAX.getExperts(this.expertId).then((data) => {
                if (data.hits.total > 0) {
                    self.basicData = data.hits.hits[0]._source
                }
            })
            AJAX.getExpertsPhoto(this.expertId).then(data => {
                if (data.hits.total > 0) {
                    self.$refs.detail_photo.src = data.hits.hits[0]._source.photo;
                }
            })
            AJAX.getExpertsMetting(this.expertId).then(data => {
                if (data.hits.total > 0) {
                    self.mettingData = data.hits.hits.map(d => {
                        d._source.data_id = d._id;
                        return d._source;
                    })
                }
            })
        },
        date_show(time, format) {
            var date = new Date();
            date.setTime(time);
            return date.Format(format || 'yyyy-MM-dd');
        },
        getExpertsMeetingMsgByMeetingID(mettingid) {
            const expertsMeetingDataArr = this.selected.experts.filter((d) => {
                return d.data_id == this.expertId
            }, this);
            if (expertsMeetingDataArr.length != 1) {
                this.$Message.error('获取专家会议信息失败！')
                return null;
            }
            return expertsMeetingDataArr[0];
        }
    },
    mounted() {
        this.expertId = this.$route.params.expertId;
        this.loadData();

        var createMettingData = () => {
            return {
                "data_id": 1000 + (Math.random().toFixed(3) * 1000),
                "name": "第一次代表大会",
                "date": new Date().getTime(),
                "experts": [{
                    "id": "dadwa",
                    "voting": [
                        {
                            "name": "废后表决",
                            "voting_data": 0
                        }
                    ]
                    ,
                    "sing_in_time": new Date().getTime(),
                    "sing_down_time": new Date().getTime(),
                    "annotate": ["daddddddddddddddddddddddd", "dadddddddddddddddddd"]
                }]
            }
        }
    }
});