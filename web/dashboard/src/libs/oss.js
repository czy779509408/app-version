import {fmtFileSize, getFileName, getGUID, hasValue, http} from '@/libs/util';
import Vue from 'vue';
import * as qiniu from 'qiniu-js'

// const client = new OSS({
//     region: process.env.VUE_APP_OSS_REGION,
//     accessKeyId: process.env.VUE_APP_OSS_KEYID,
//     accessKeySecret: process.env.VUE_APP_OSS_KEYSECRET,
//     bucket: process.env.VUE_APP_OSS_BUCKET
// });

/**
 * 封装upload方法
 * qiniu.upload(file: blob, key: string, token: string, putExtra: object, config: object): observable
 * file: Blob 对象，上传的文件
 * key: 文件资源名
 * token: 上传验证信息，前端通过接口请求后端获得
 * config:
 *   config.useCdnDomain: 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
 config.disableStatisticsReport: 是否禁用日志报告，为布尔值，默认为false。
 config.region: 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域
 config.retryCount: 上传自动重试次数
 config.concurrentRequestLimit: 分片上传的并发请求量，number，默认为3；因为浏览器本身也会限制最大并发量，所以最大并发量与浏览器有关。
 config.checkByMD5: 是否开启 MD5 校验，为布尔值；
 * putExtra:
 *   fname: string，文件原文件名
 params: object，用来放置自定义变量
 mimeType: null || array，用来限定上传文件类型，指定null时自动判断文件类型。
 ["image/png", "image/jpeg", "image/gif"]
 * @param file
 * @param fileName 七牛存储文件路径
 * @param callBack
 * @param progressCB
 * @returns {Promise}
 */
const uploadFileToOSS = (file, fileName = '', callBack, progressCB = null) => {
    console.log('uploadFileToOSS:');
    fileName = 'BE/QA/temp/' + file.name;
    http.get('/user/uploadToken', {
        params: {
            fileName: fileName
        }
    }).then(resData => {
        console.log('uploadToken:' + JSON.stringify(resData));
            let putExtra = {
                fname: file.name,//文件原文件名
                mimeType: null
            };
            let config = {};
            let observable = qiniu.upload(file, fileName, resData.data.data.token, putExtra, config);
            let observer = {
                next(res) {
                    // total.loaded: number，已上传大小，单位为字节。
                    // total.total: number，本次上传的总量控制信息，单位为字节，注意这里的 total 跟文件大小并不一致。
                    // total.percent: number，当前上传进度，范围：0～100。
                    let progress = Number(res.total.percent.toFixed(0));
                    // 此处得到上传进度百分比 可加后续操作
                    if (progressCB !== null) {
                        progressCB(progress);
                    }
                },
                error(err) {
                    // reject(err);
                    // err.isRequestError: 用于区分是否 xhr 请求错误；当 xhr 请求出现错误并且后端通过 HTTP 状态码返回了错误信息时，该参数为 true；否则为 undefined 。
                    // err.reqId: string，xhr请求错误的 X-Reqid。
                    // err.code: number，请求错误状态码，只有在 err.isRequestError 为 true 的时候才有效，可查阅码值对应说明。
                    // err.message: string，错误信息，包含错误码，当后端返回提示信息时也会有相应的错误信息。
                    let message = '请求失败！请检查网络';
                    if (err.message) message = err.message;
                    Vue.prototype.$alert({
                        title: '错误！',
                        message: message,
                        type: 'error',
                    })
                },
                complete(res) {
                    console.log('upload complete:' + JSON.stringify(res));
                    res.url = res.key;
                    res.name = fileName;
                    callBack(res);
                }
            };
            let subscription = observable.subscribe(observer)
        }
    )
};

export default uploadFileToOSS;

