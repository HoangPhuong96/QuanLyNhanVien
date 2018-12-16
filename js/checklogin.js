//kiểm tra đăng nhập
// lưu là set lấy là get
var currentUser=localStorage.getItem('currenuser')
// nếu ko có currentuser thì quay lại trang đăng nhập
if(!currentUser){
    window.location.assign('dangnhap.html')
}