function Eid(id) {
    return document.getElementById(id);

}
var nguoidungSV = new nguoidungService();
function dangnhap() {
    var taiKhoan = Eid('txtTaiKhoan').value;
    var matKhau = Eid('txtMatKhau').value;

    nguoidungSV.dangnhap(taiKhoan, matKhau).then(function (res) {
        console.log(res.data);
        if (res.data.MaLoaiNguoiDung === "QuanTri") {
            localStorage.setItem("currenuser", JSON.stringify(res.data)),
                window.location.assign('index.html');
        }
        //JSON.stringify chuyển object thành chuỗi

    })
        .catch(function (ex) {
            console.log(ex.messenger);
        })

}
Eid('btnDangNhap').addEventListener('click', dangnhap);