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
                    AJAX.getExpertsPhoto(this.expertsData.data_id).then((data) => {
                        if (data.hits.total > 0) {
                            self.$refs.img_photo.src = data.hits.hits[0]._source.photo;
                        }
                    })
                }
            },
            props: ["expertsData"],
            mounted: function () {
                this.loadImg();
            }
        })
    });

});