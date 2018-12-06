
Vue.component('detail', {
    template: '#detail-component',
    data: () => {
        return {
            selected: null,
            expertId: null,
            basicData: {},
            mettingData: [],
            test: [
                { data_id: 1, name: "123", date: "2014-12-12" },
                { data_id: 2, name: "123", date: "2014-12-12" },
                { data_id: 3, name: "123", date: "2014-12-12" },
                { data_id: 4, name: "123", date: "2014-12-12" },
                { data_id: 5, name: "123", date: "2014-12-12" },
                { data_id: 6, name: "123", date: "2014-12-12" },
                { data_id: 7, name: "123", date: "2014-12-12" }
            ]
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
        loadData() {
            const self = this;
            AJAX.getExperts(this.expertId).then((data) => {
                debugger;
                if (data.hits.total > 0) {
                    self.basicData = data.hits.hits[0]._source
                }
            })
            AJAX.getExpertsPhoto(this.expertId).then(data=>{
                if (data.hits.total > 0) {
                    self.$refs.detail_photo.src = data.hits.hits[0]._source.photo;
                }
            })
        }
    },
    mounted() {
        this.expertId = this.$route.params.expertId;
        this.loadData();
        // debugger;
        // const self = this;

        // setTimeout(() => {
        //     var createData = () => {
        //         return {
        //             "data_id": 1000 + (Math.random().toFixed(3) * 1000),
        //             "name": "专家1",
        //             "duty": "少先队队长兼班花",
        //             "company": {
        //                 "prepend": [
        //                     "北京",
        //                     "西二旗"
        //                 ],
        //                 "detail": "辉煌国际酒店"
        //             },
        //             "contact": [
        //                 {
        //                     "type": "office",
        //                     "value": "13189991222"
        //                 },
        //                 {
        //                     "type": "mobile",
        //                     "value": "051245445555"
        //                 }
        //             ],
        //             "major": [
        //                 "科学",
        //                 "人文",
        //                 "地理"
        //             ]
        //         }
        //     }

        //     var createMettingData = () => {
        //         return {
        //             "data_id": 1000 + (Math.random().toFixed(3) * 1000),
        //             "name": "第一次代表大会",
        //             "date": new Date().getTime(),
        //             "experts": [{
        //                 "id": "abceef",
        //                 "voting": [
        //                     {
        //                         "name": "废后表决",
        //                         "voting_data": 0
        //                     }
        //                 ]
        //                 ,
        //                 "sing_in_time": new Date().getTime(),
        //                 "sing_down_time": new Date().getTime(),
        //                 "annotate": ["daddddddddddddddddddddddd", "dadddddddddddddddddd"]
        //             }]
        //         }
        //     }
        //     // debugger;
        //     self.basicData = createData();

        // }, 200)
    }
});