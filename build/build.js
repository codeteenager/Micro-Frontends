const childProcess = require('child_process');
const path = require('path');

const filePath = {
    'qiankun-base': path.join(__dirname,'../qiankun-base'),
    'qiankun-vue': path.join(__dirname,'../qiankun-vue'),
};

function runChild(){
    Object.values(filePath).forEach((item)=>{
        childProcess.spawn(`cd ${item} && npm start`,{
            stdio:'inherit',
            shell: true
        });
    });
}

runChild();
