module.exports=function encryptPassword(password){
    let newPasswordEncrypted="";
    let length=password.length;
    for(let i=0;i<length;i++)
        newPasswordEncrypted+=String.fromCharCode(Math.floor(Math.random() * password.charCodeAt(i)));
    return newPasswordEncrypted;
};