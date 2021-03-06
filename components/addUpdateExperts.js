﻿
Vue.component('addUpdateExperts', function (resolve, reject) {
    $.get("./components/addUpdateExperts.html").then(function (res) {
        resolve({
            template: res,
            data: () => {
                return {
                    addUpdateExpertsShow: false,//--是否显示
                    title: "添加专家",//--页面标题
                    persistent: {//--固定加载的数据
                        major_group_json: [],
                        company_group_json: [],//--单位级联数据
                    },
                    modeIsUpdate: false,//--是否是更新模式

                    tags_add: { //--标签添加相关属性
                        tag_list_visible: false,//--标签窗口是否打开
                        tag_tree_data: [],//--所有的标签数据树
                        temp_tag_tree_removed: [],//--暂存移除的标签
                        search: {//--标签搜索
                            value: "",
                            result_tags: []
                        }
                    },
                    formItem: {//--表单相关字段
                        name: "",//--姓名
                        duty: "",//--职务
                        company: {//--单位
                            prepend: [
                            ],
                            detail: ""
                        },
                        contact: [{//--联系方式
                            "type": "office",
                            "value": ""
                        }],
                        major: []//--专业领域
                    },
                    ruleValidate: {//--表单验证规则
                        name: [
                            { required: true, message: '专家姓名不能为空', trigger: 'blur' }
                        ],
                        duty: [
                            { required: true, message: '职务不能为空', trigger: 'blur' }
                        ],
                        company: [
                            { type: "object", required: true },
                            {
                                validator(rule, value, callback, source, options) {
                                    var errors = []
                                    if (!value.prepend.length) {
                                        errors.push('请选择单位分类');
                                    }
                                    callback(errors);
                                }
                            }
                        ],
                        contact: [
                            { type: "array", required: true },
                            {
                                validator(rule, value, callback, source, options) {
                                    var errors = []
                                    for (var i = 0; i < value.length; i++) {
                                        const tg = value[i];
                                        if (tg.type == 'mobile') {
                                            if (!/^1[34578]\d{9}$/.test(tg.value)) {
                                                errors.push('请输入正确的手机号');
                                            }
                                        }
                                        else {
                                            if (tg.value == "") {
                                                errors.push("联系方式项不能为空")
                                            }
                                        }

                                    }

                                    callback(errors);
                                }
                            }
                        ],
                    },
                    file: null//--记录头像的base64
                }
            },
            computed: {
                frequently_used_tags() {
                    var loop = function (tararr, ret) {
                        tararr.map((tg) => {
                            if (tg.children) {
                                loop(tg.children, ret);
                            }
                            else {
                                if (tg.frequently)
                                    ret.push(tg.title);
                            }
                        })
                    }
                    const target = this.tags_add.tag_tree_data;
                    const ret = [];
                    loop(target, ret);
                    return ret;
                },
                search_tags() {
                    const search_condition = this.tags_add.search.value;
                    var loop = function (tararr, ret) {
                        tararr.map((tg) => {
                            if (tg.children) {
                                loop(tg.children, ret);
                            }
                            else {
                                if (tg.title.search(search_condition) != -1)
                                    ret.push(tg.title);
                            }
                        })
                    }
                    const target = this.tags_add.tag_tree_data;
                    const ret = [];
                    loop(target, ret);
                    return ret;
                }
            },
            methods: {
                searchHandel() {

                },
                handleUpload(file) {
                    this.file = file;
                    this.checkFile(file);
                    return false;
                },
                checkFile(file) {
                    const _this = this;
                    let imgType = false;
                    const type = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
                    type.map(item => {
                        if (file.type.indexOf(item) > -1) {
                            imgType = true;
                        }
                    })
                    if (!file.name || !file.type || !imgType) {
                        this.$Message.error("文件格式不匹配")
                        return;
                    }
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (theFile) {
                        const image = new Image();
                        image.src = theFile.target.result;
                        _this.filesrc = theFile.target.result;
                        image.onload = function () {
                            previewImage(file)
                        }
                    }
                },
                uploadImg(id, isUpdate) {

                    const json = {
                        photo: this.filesrc,
                        data_id: id
                    }
                    if (!isUpdate)
                        return AJAX.addPhoto(json);
                    else {
                        return AJAX.updatePhoto(id, json);
                    }
                },
                //--渲染树数据
                makeTreeData() {
                    const copyedData = $.extend(true, [], this.persistent.major_group_json);
                    const self = this;
                    loopAll(copyedData, (tg, brothers) => {
                        if (!tg.children) {
                            tg.render = (h, { root, node, data }) => {
                                return h('span', {
                                    style: {
                                        // display: 'inline-block',
                                        width: '100%'
                                    }
                                }, [
                                        h('span', {
                                            style: {
                                                float: 'left',
                                            }
                                        }, [
                                                h('Icon', {
                                                    props: {
                                                        type: 'ios-link'
                                                    },
                                                    style: {
                                                        marginRight: '8px'
                                                    }
                                                }),
                                                h('span', data.title)
                                            ]),
                                        h('span', {
                                            style: {
                                                // display: 'inline-block',
                                                float: 'right',
                                                marginRight: '20px'
                                            }
                                        }, [
                                                h('Button', {
                                                    props: Object.assign({}, {
                                                        type: 'default',
                                                        size: 'small',
                                                    }, {
                                                            icon: 'ios-add',
                                                            type: 'primary'
                                                        }),
                                                    style: {
                                                        width: '64px'
                                                    },
                                                    on: {
                                                        click: () => { this.addOneTag(data) }
                                                    }
                                                })
                                            ]),
                                        h('div', {
                                            style: {
                                                clear: "both"
                                            }
                                        })
                                    ]);
                            }
                        } else {
                            tg.selected = false
                        }
                    }, this)
                    return copyedData;
                },
                //--展开节点
                expandNode(targetarr) {
                    const target = targetarr[0]
                    target.expand = !target.expand;
                    target.selected = false;
                },
                //--清除表单
                clearForm() {
                    this.formItem.name = "";
                    this.formItem.duty = "";
                    this.formItem.company.prepend = [];
                    this.formItem.company.detail = "";
                    this.formItem.contact[0].value = ""
                    this.$refs.photo_img.src = "./css/images/default_photo.png";
                    this.$refs.add_update_form.resetFields();
                },
                //--重置添加标签页面
                resoreTagsAddState() {
                    this.tags_add.tag_list_visible = false;
                    this.tags_add.tag_tree_data = this.makeTreeData();
                    this.formItem.major = [];
                    this.tags_add.temp_tag_tree_removed.splice(0, this.tags_add.temp_tag_tree_removed.length - 1);
                },
                //--重置状态
                resoreState() {
                    this.resoreTagsAddState();
                    this.file = null;
                    this.filesrc = null;
                },
                //--处理更新
                handelAddUpdate() {
                    const self = this;
                    this.$refs.add_update_form.validate((valid) => {
                        if (valid) {
                            if (!self.filesrc) {
                                // self.$Message.error("请选择照片");
                                // self.$refs.add_update_modal.buttonLoading = false;
                                // return;
                                self.filesrc = './css/images/default_photo.png'
                            }
                            if (!this.modeIsUpdate) {
                                AJAX.addExperts(self.formItem).then((data) => {
                                    self.addUpdateExpertsShow = false;
                                    self.uploadImg(data._id).then(() => {
                                        self.$emit('reflash', true)
                                        self.$Message.info("添加专家成功");
                                    })
                                })
                            }
                            else {
                                AJAX.updateExperts(self.needToUpdateExpertsId, self.formItem).then(data => {
                                    self.addUpdateExpertsShow = false;
                                    self.uploadImg(data._id, true).then(() => {
                                        self.$emit('reflash', true)
                                        self.$Message.info('更新专家成功！');
                                    })
                                })
                            }

                        } else {
                            self.$refs.add_update_modal.buttonLoading = false;
                            self.$Message.error('表单验证失败，请重试');
                        }
                    })
                    return false;

                },
                //--主入口
                show: function (experts_id) {
                    this.resoreState();
                    this.modeIsUpdate = !!experts_id;
                    this.clearForm();
                    this.needToUpdateExpertsId = experts_id;
                    this.title = this.modeIsUpdate ? "更新专家" : "添加专家";
                    const self = this;
                    if (experts_id) {
                        AJAX.getExperts(experts_id).then((data) => {
                            if (data.hits.total > 0) {
                                self.formItem = data.hits.hits[0]._source
                            }
                        })
                        AJAX.getExpertsPhoto(experts_id).then((data) => {
                            if (data.hits.total > 0) {
                                self.$refs.photo_img.src = data.hits.hits[0]._source.photo;
                                self.filesrc = data.hits.hits[0]._source.photo;
                            }
                        })
                    }

                    this.addUpdateExpertsShow = true;
                },
                handleAddContact() {
                    this.formItem.contact.push({ 'type': 'mobile', 'value': '' })
                },
                handelRemoveContcat(index) {
                    if (this.formItem.contact.length > 1)
                        this.formItem.contact.splice(index, 1);
                },
                addOneTag(target) {
                    let name = "";
                    if (typeof target == 'string')
                        name = target;
                    else {
                        if (target.children)
                            return;
                        else
                            name = target.title;
                    }
                    var loop = function (tararr, parent) {
                        for (var i = 0, nlen = tararr.length; i < nlen; i++) {
                            const tg = tararr[i];
                            if (tg.title == name) {
                                return { node: tararr.splice(i, 1)[0], parent: parent };
                            }
                            else {
                                if (tg.children) {
                                    const finded = loop(tg.children, tg.title);
                                    if (finded) {
                                        return finded;
                                    } else
                                        continue;
                                }
                            }
                        }
                    }
                    const removeed = loop(this.tags_add.tag_tree_data, '_root_');
                    this.tags_add.temp_tag_tree_removed.push(removeed);
                    this.formItem.major.push(removeed.node.title);
                },
                handleAddTag() {
                    this.tags_add.tag_list_visible = true;
                },
                handleCloseTagList() {
                    this.tags_add.search.value = ""
                    this.tags_add.tag_list_visible = false;
                },
                handleCloseTag(event, name) {
                    const index = this.formItem.major.indexOf(name);
                    const spliced = this.formItem.major.splice(index, 1)[0];
                    let removedNode = null;
                    for (var i = 0, nLen = this.tags_add.temp_tag_tree_removed.length; i < nLen; i++) {
                        const tg = this.tags_add.temp_tag_tree_removed[i];
                        if (tg.node.title == spliced) {
                            removedNode = this.tags_add.temp_tag_tree_removed.splice(i, 1)[0];
                            break;
                        }
                    }
                    if (!removedNode)
                        return;
                    const loop = (arr, parent) => {
                        if (parent == removedNode.parent) {
                            arr.push(removedNode.node);
                        }
                        else {
                            for (var i = 0; i < arr.length; i++) {
                                const tg = arr[i];
                                if (tg.children) {
                                    loop(tg.children, tg.title)
                                }
                            }
                        }
                    }
                    loop(this.tags_add.tag_tree_data, '_root_')

                },
                loadConfig() {
                    const self = this;
                    //--专业领域级联数据
                    loadMajorCascadeConfig((data) => {
                        self.persistent.major_group_json = data;
                        // self.persistent.frequently_used_major = data.changyong_data;
                    })
                    //--单位级联数据
                    loadCompanyCascadeConfig((data) => {
                        self.persistent.company_group_json = data;
                    })
                }
            },
            mounted: function () {
                this.loadConfig();
            }
        })
    });

});