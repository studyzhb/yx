
import axios from 'axios';
import queryString from 'qs';
import _ from 'lodash';


let instance = axios.create({
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
});
let url="/get.php";

console.log(OSS)

instance.get(url)
    .then(res => {
        console.log(res.data);
        return res.data
    })
    .catch(err => {
        console.log(err);
    })

export default {}

