Vue.component('experts', function (resolve, reject) {
    $.get("./components/experts.html").then(function (res) {
        resolve({
            template: res,
            data: () => {
                return {
                    delete_show: false
                }
            },
            methods: {
                loadImg() {
                    const self = this;
                    //--need_service
                    const data = {
                        "query": {  
                            "match": {
                                "data_id": this.expertsData.data_id
                            }
                        },
                    }
                    $.ajax({
                        type: "post",
                        url: "http://192.168.43.123:9200/expert/picture/_search?",
                        data: JSON.stringify(data),
                        success(data) {
                            if (data.hits.total > 0) {
                                self.$refs.img_photo.src = data.hits.hits[0]._source.photo;
                            }
                        }
                    })

                    // setTimeout(() => {
                    //     self.$refs.img_photo.src = "./css/images/logo_big.png"
                    // }, 100)
                }
            },
            props: ["expertsData"],
            mounted: function () {
                this.loadImg();
            }
        })
    });

});