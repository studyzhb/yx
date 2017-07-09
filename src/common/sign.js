
import request from 'api';
let url = "/get.php";

console.log(OSS)
request.get(url)
    .then(data => {
        localStorage.osssign = JSON.stringify(data);
        console.log(data)
    })

export default new OSS.Wrapper({
    region: 'oss-cn-qingdao',
    accessKeyId: 'LTAIZ23GkQIjMoJu',
    accessKeySecret: 'lSgHmhdnCOYFYcy60JSu34nhOjQfXy',
    bucket: 'accessorygx'
})

