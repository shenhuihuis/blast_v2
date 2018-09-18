const Validator = {
  tels(rule, value, callback){//手机号
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }
        setTimeout(() => {
            if (!(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value))) {
              callback(new Error('请输入正确的手机号'));
            } else {
              callback();
            }
        }, 1000);
  },
  phone(rule, value, callback){//办公电话
        if (!value) {
          return callback(new Error('办公电话不能为空'));
        }
        setTimeout(() => {
            if (!(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value))) {
              callback(new Error('请输入正确的办公电话'));
            } else {
              callback();
            }
        }, 1000);
  },
  email(rule, value, callback){
    if (!value) {
      return callback(new Error('邮箱不能为空'));
    }
    setTimeout(() => {
        if (!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value))) {
          callback(new Error('请输入正确的公司邮箱'));
        } else {
          callback();
        }
    }, 1000);
   },
   txm(rule, value, callback){
    if (!value) {
      return callback(new Error('营业执照代码不能为空'));
    }
    setTimeout(() => {
        if (value.length<18 || value.length>20) {
          callback(new Error('请输入正确的营业执照代码'));
        } else {
          callback();
        }
    }, 1000);
   },
   licenceNumber(rule, value, callback){
    if (!value) {
      return callback(new Error('许可证编号不能为空'));
    }
    setTimeout(() => {
        if (value.length!=13) {
          callback(new Error('请输入正确的许可证编号'));
        } else {
          callback();
        }
    }, 1000);
   },
   frameNumber(rule, value, callback){
    if (!value) {
      return callback(new Error('车架号不能为空'));
    }
    setTimeout(() => {
        if (value.length!=17) {
          callback(new Error('请输入正确的车架号'));
        } else {
          callback();
        }
    }, 1000);
   },
   identityId(rule,value,callback){
    if(!value){
      return callback(new Error('身份证号不能为空'))
    }
    setTimeout(()=>{
      if(!(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(value))){
        callback(new Error('请输入正确的身份证号'))
      }else{
        callback()
      }
    })
   },
   drivingLicence(rule,value,callback){
    if(!value){
      return callback(new Error('驾驶证号不能为空'))
    }
    setTimeout(()=>{
      if(!(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(value))){
        callback(new Error('请输入正确的驾驶证号'))
      }else{
        callback()
      }
    })
   },
   carNumber(rule, value, callback){
    if (!value) {
      return callback(new Error('车牌号不能为空'));
    }
    setTimeout(() => {
        if (!(/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(value))) {
          callback(new Error('请输入正确的车牌号'));
        } else {
          callback();
        }
    }, 1000);
   }
}
export default Validator;
