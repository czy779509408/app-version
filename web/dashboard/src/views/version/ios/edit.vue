<template>
    <div id="version-ios-edit">
        <Card  class="edit_card">
            <Row :gutter="48">
                <Col span="16">
                    <Form ref="editFormRule" :model="editForm" :rules="editFormRule" :label-width="110" style="position: relative">
                        <FormItem label="版本号" prop="appVersion">
                            <Input v-model="editForm.appVersion" placeholder=""/>
                        </FormItem>
                        <FormItem label="允许最低版本" prop="allowLowestVersion">
                            <Input v-model="editForm.allowLowestVersion" placeholder=""/>
                        </FormItem>
                        <FormItem label="更新类型" prop="updateType">
                            <Select v-model="editForm.updateType">
                                <Option v-for="type in updateTypes" :key="type.value" :value="type.value" :label="type.label" />
                            </Select>
                        </FormItem>
                        <FormItem label="AppStore地址" prop="appStoreUrl">
                            <Input v-model="editForm.appStoreUrl" placeholder="请输入苹果商店地址"/>
                        </FormItem>
                        <FormItem label="发布范围" prop="grayReleased">
                            <RadioGroup v-model="editForm.grayReleased">
                                <Radio v-for="item in grayReleaseds" :key="item.value" :disabled="item.disabled === true" :label="item.value">{{item.label}}</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="版本描述" prop="versionDescription">
                            <Input v-model="editForm.versionDescription" autosize type="textarea" :rows="4" placeholder="请输入版本的描述，例如更新内容等"/>
                        </FormItem>
                        <Spin size="large" fix v-if="inLoading">
                            <Icon type="load-c" size=18 class="spin-icon-load" style="margin-bottom: 12px"></Icon>
                            <div>正在加载...</div>
                        </Spin>
                    </Form>
                </Col>
                <Col span="8">
                    <div class="detailed_list">
                        <h2 class="detailed_title">#版本清单</h2>
                        <ul>
                            <li><span>应用</span>{{app.appName}}</li>
                            <li><span>版本号</span>{{editForm.appVersion}}</li>
                            <li><span>允许最低版本</span>{{editForm.allowLowestVersion}}</li>
                            <li><span>更新类型</span>{{editForm.updateType | updateTypeFilter}}</li>
                            <li><span>AppStore地址</span><p v-if="hasValue(editForm.appStoreUrl)">{{editForm.appStoreUrl}}</p></li>
                            <li><span>发布范围</span>{{editForm.grayReleased | grayReleasedFilter}}</li>
                            <li><span>版本描述</span><pre>{{editForm.versionDescription}}</pre></li>
                        </ul>
                    </div>
                    <Row class="footer" v-show="!inLoading">
                        <Col span="24">
                            <Button type="text" size="large" @click="handleClose('editFormRule')">取消</Button>
                            <Poptip
                                    style="text-align: left"
                                    confirm
                                    title="你确定要重置?"
                                    @on-ok="handleReset('editFormRule')">
                            <Button type="default" size="large" style="margin-right: 12px">重置</Button>
                            </Poptip>
                            <Button type="primary" size="large" @click="handleSubmit('editFormRule')">提交</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import { http, hasObject, hasValue } from '@/libs/util';
const updateTypes = [
    {
        label: '强制更新',
        value: 0
    },
    {
        label: '一般更新',
        value: 1
    },
    {
        label: '静默更新',
        value: 2
    },
    {
        label: '可忽略更新',
        value: 3
    },
    {
        label: '静默可忽略更新',
        value: 4
    }
];
const grayReleaseds = [
    {
        label: '全量发布',
        value: 0
    },
    {
        label: '白名单发布',
        value: 1,
        disabled: true
    },
    {
        label: 'IP发布',
        value: 2,
        disabled: true
    }
];
export default {
    data () {
        const validateInput = (rule, value, callback) => {
            if (value !== value.trim()) {
                callback(new Error('请移除前后空格'));
            } else {
                callback();
            }
        };
        return {
            isEdit: false,
            iOSId: 0,
            inLoading: false,
            app: { appName: '大管家'},//JSON.parse(localStorage.getItem('app') ? localStorage.getItem('app') : '{}'),
            editForm: {
                appVersion: '',
                allowLowestVersion: '',
                updateType: 0,
                appStoreUrl: '',
                versionDescription: '',
                grayReleased: 0
            },
            editFormRule: {
                appVersion: [
                    { required: true, message: '请输入版本号', trigger: 'blur' },
                    { required: true, type: 'string', max: 32, message: '过长的版本号', trigger: 'blur' },
                    { required: true, pattern: /^([0]|[1-9][0-9]{0,5})\.([0]|[1-9][0-9]{0,5})\.([0]|[1-9][0-9]{0,5})\.([0]|[1-9][0-9]{0,5})$/g, message: '请输入符合规范的版本号，最大版本号为999999.999999.999999.999999', trigger: 'blur' },
                    { required: true, validator: validateInput, trigger: 'blur' }
                ],
                allowLowestVersion: [
                    { required: true, message: '请输入最低版本号', trigger: 'blur' },
                    { required: true, type: 'string', max: 32, message: '过长的版本号', trigger: 'blur' },
                    { required: true, pattern: /^([0]|[1-9][0-9]{0,5})\.([0]|[1-9][0-9]{0,5})\.([0]|[1-9][0-9]{0,5})\.([0]|[1-9][0-9]{0,5})$/g, message: '请输入符合规范的版本号，最大版本号为999999.999999.999999.999999', trigger: 'blur' },
                    { required: true, validator: validateInput, trigger: 'blur' }
                ],
                updateType: [
                    { type: 'number', required: true, message: '请选择更新类型', trigger: 'change' }
                ],
                appStoreUrl: [
                    { required: true, message: '请输入 AppStore 地址', trigger: 'blur' },
                    { required: true, type: 'url', message: '请输入正确的 AppStore 地址', trigger: 'blur' }
                ],
                versionDescription: [
                    { required: true, message: '请输入版本描述内容', trigger: 'blur' },
                    { required: true, validator: validateInput, trigger: 'blur' }
                ],
                grayReleased: [
                    { type: 'number', required: true, message: '请选择发布范围', trigger: 'change' }
                ]
            },
            updateTypes,
            grayReleaseds
        };
    },
    filters: {
        updateTypeFilter (type) {
            let o = updateTypes.find(item => {
                return item.value === type;
            });

            return o != null ? o.label : '';
        },
        grayReleasedFilter (type) {
            let o = grayReleaseds.find(item => {
                return item.value === type;
            });

            return o != null ? o.label : '';
        }
    },
    created () {
        if (hasObject('params.iOSId', this.$route) && this.$route.params.iOSId > 0) {
            this.iOSId = this.$route.params.iOSId;
            this.isEdit = true;
            this.getIOS();
        }
    },
    methods: {
        async getIOS () {
            this.inLoading = true;
            // let response = await http.get('/ios/' + this.iOSId);
            let response = {
                data: {
                    code: 200,
                    data: {
                        appVersion: '',
                        allowLowestVersion: '',
                        updateType: 2,
                        appStoreUrl: '',
                        versionDescription: '',
                        grayReleased: 1
                    }
                }
            };

            if (response.data.code === 200) {
                this.editForm = {
                    appVersion: response.data.data.appVersion,
                    allowLowestVersion: response.data.data.allowLowestVersion,
                    updateType: response.data.data.updateType,
                    appStoreUrl: response.data.data.appStoreUrl,
                    versionDescription: response.data.data.versionDescription,
                    grayReleased: response.data.data.grayReleased
                };

                this.inLoading = false;
            } else {
                this.$Notice.error({
                    title: '请求失败,请返回',
                    desc: response.data.message
                });
            }
        },
        async postIOS () {
            let query = {
                appVersion: this.editForm.appVersion,
                updateType: this.editForm.updateType,
                versionDescription: this.editForm.versionDescription,
                allowLowestVersion: this.editForm.allowLowestVersion,
                appStoreUrl: this.editForm.appStoreUrl,
                grayReleased: this.editForm.grayReleased
            };
            let response = await http.post('/ios', query);
            return response.data;
        },
        async putIOS () {
            let query = {
                id: this.iOSId,
                appVersion: this.editForm.appVersion,
                updateType: this.editForm.updateType,
                versionDescription: this.editForm.versionDescription,
                allowLowestVersion: this.editForm.allowLowestVersion,
                appStoreUrl: this.editForm.appStoreUrl,
                grayReleased: this.editForm.grayReleased
            };
            let response = await http.put('/ios/' + this.iOSId, query);
            return response.data;
        },
        handleReset (name) {
            this.isEdit ? this.getIOS() : this.$refs[name].resetFields();
        },
        handleClose () {
            this.$router.go(-1);
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    this.$Message.error('请先完成所有必填项内容!');
                    return false;
                }

                const message = response => {
                    let eventText = this.isEdit === true ? '编辑' : '添加';
                    if (response.code === 200) {
                        this.$Notice.success({
                            title: '请求成功',
                            desc: `${eventText}版本 ${response.data.appVersion} 成功`
                        });

                        this.$router.push({
                            name: 'version-ios'
                        });
                    } else {
                        this.$Notice.error({
                            title: '请求失败',
                            desc: response.message
                        });
                    }
                };

                if (this.isEdit === true) {
                    this.putIOS().then(message);
                } else {
                    this.postIOS().then(message);
                }
            });
        },
        hasValue
    }
};
</script>
<style scoped lang="scss">
    #version-ios-edit {
        .edit_card{
            &:after{
                content: ' ';
                display: block;
                height: 100%;
                width: 1px;
                background-color: #eeeeee;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 66.66666667%;
            }
        }

        .detailed_list{
            ul,li{
                list-style: none;
            }
            ul{
                li{
                    color: #777;
                    span{
                        font-weight: bold;
                        font-size: 14px;
                        line-height: 2;
                        display: inline-block;
                        width: 100px;
                        margin-right: 12px;
                        text-align: right;
                        color: #333;
                    }
                    p{
                        word-wrap: break-word;
                        padding: 10px;
                        background-color: #f9f9f9;
                        border-radius: 4px;
                        display: block;
                    }
                }
            }
            pre{
                overflow: auto;
                min-height: 100px;
                margin-left: 112px;
                margin-top: -20px;
            }
        }
        .detailed_title{
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .footer{
            margin-top: 24px;
            text-align: right;
        }
    }
</style>
