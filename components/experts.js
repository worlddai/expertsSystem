Vue.component('experts', function (resolve, reject) {
    $.get("./components/experts.html").then(function (res) {
        resolve({
            template: res,
            data: () => {
                return {
                    delete_show: false,
                    ellipse_show:false
                }
            },
            computed:{
                // ellipse_show(){
                //     var ele = this.$refs.expert_show_tag_container;
                //     if(!ele)
                //     {
                //         return false
                //     }
                //     return ele.scrollHeight > ele.offsetHeight
                // }
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
                var ele  = this.$refs.expert_show_tag_container;
                this.ellipse_show = ele.scrollHeight > ele.offsetHeight
                this.loadImg();
            }
        })
    });

});