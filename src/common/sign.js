
import request from 'api';
let url = "/oss/key";
console.log('qingqiu')
export default request.get(url, { date: new Date().getTime() })
    .then(res => {
        console.log(res)
        let { code, data } = res;
        if (code == 200) {
            return new OSS.Wrapper({
                region: 'oss-cn-qingdao',
                accessKeyId: 'LTAIZ23GkQIjMoJu',
                accessKeySecret: 'lSgHmhdnCOYFYcy60JSu34nhOjQfXy',
                bucket: 'accessorygx'
            })
        }
    })
    .catch((e) => {
        console.log(e);
    })

// new OSS.Wrapper({
//     region: 'oss-cn-qingdao',
//     accessKeyId: data.cnt.AccessKeyId,
//     accessKeySecret: data.cnt.AccessKeySecret,
//     stsToken: data.cnt.SecurityToken,
//     bucket: 'accessorygx'
// })


