
var DSNV = [];
var NhanVienSV = new NhanVienService();
function getEl(id) {
    return document.getElementById(id);
}
window.onload = function () {

    NhanVienSV.layDSNV().then(function (res) {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
            var maNV = res.data[i].MaNV;
            var ho = res.data[i].Ho;
            var ten = res.data[i].Ten;
            var ngayBatDau = res.data[i].NgayBatDau;
            var luongCB = res.data[i].luongCB;
            var chucVu = res.data[i].ChucVu;

            var nhanVien = new NhanVien(ho, ten, maNV, ngayBatDau, chucVu);
            DSNV.push(nhanVien);
            taoBang(DSNV);
        }

    })
        .catch(function (ex) {
            console.log(ex.messenger);
        })

}
function FormValidation() {
    // var kiemtra = true;
    // if (!KiemTraRong('ho', 'thongBaoHo', 'Vui lòng nhập họ!')) {
    //     kiemtra = false;
    // }
    // else {
    //     if (!KiemTraDinhDangChu('ho', 'thongBaoHo', 'Họ phải là chữ!')) {
    //         kiemtra = false;
    //     }
    // }
    // if (!KiemTraRong('ten', 'thongBaoTen', 'Vui lòng nhập tên!')) {
    //     kiemtra = false;
    // }
    // if (!KiemTraChucVu()) {
    //     kiemtra = false;
    // }
    // if (!KiemTraMa(2, 6)) {
    //     kiemtra = false;
    // }
    // return kiemtra;
    var isvalid = true;
    isvalid &= KiemTraRong('ho', 'thongBaoHo', 'Vui Lòng Nhập Họ') && KiemTraDinhDangChu('ho', 'thongBaoHo', 'Họ Phải là chữ');
    isvalid &= KiemTraRong('ten', 'thongBaoTen', 'Vui lòng nhập Tên') && KiemTraDinhDangChu('ten', 'thongBaoTen', 'Tên phải là chữ');
    isvalid &= KiemTraRong('msnv', 'thongBaoMa','Vui lòng nhập Mã')&&KiemTraMa('2','6')
    return isvalid

}
//Hàm thêm nhân viên mới
function themNhanVien() {
    if (FormValidation()) {
        var ho = getEl('ho').value;
        var ten = getEl('ten').value;
        var msnv = getEl('msnv').value;
        var ngayLam = getEl('datepicker').value;
        var chucVu = getEl('chucvu').value;

        var nhanVienMoi = new NhanVien(ho, ten, msnv, ngayLam, chucVu);


        NhanVienSV.themNhanVien().then(function (res) {
            console.log(res);
            DSNV.push(nhanVienMoi);
            //Tạo bảng
            taoBang(DSNV);
        })
            .catch(function (ex) {
                console.log(ex.messenger);
            })

    }
}
//Hàm tạo bảng nhân viên
function taoBang(arr) {
    var content = '';
    for (var i = 0; i < arr.length; i++) {
        var nhanVien = arr[i];
        content += `
            <tr>
                <td>${i + 1}</td>
                <td>${nhanVien.Ten}</td>
                <td>${nhanVien.MaNV}</td>
                <td>${nhanVien.ChucVu}</td>
                <td>${nhanVien.TinhLuong()}</td>
                <td>
                    <button class="btn btn-success" onclick="xoaNhanVien('${i}')">Xóa</button>
                    <button class="btn btn-info"
                    data-manhanvien = "${nhanVien.MaNV}"
                    data-ho = "${nhanVien.Ho}"
                    data-ten = "${nhanVien.Ten}"
                    data-chucvu = "${nhanVien.ChucVu}"
                    data-ngaylam = "${nhanVien.NgayBatDau}"
                    onclick = "HienThiLenForm(event)"
                    >Cập Nhật</button>
                </td>
            </tr>
        `
    }
    getEl('tbodyNhanVien').innerHTML = content;
}

function xoaNhanVien(index) {
    Swal({
        title: 'Bạn chắc chắn?',
        text: "Bạn không thể trở lại được ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'blue',
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.value) {
            //DSNV[index].MaNV;
            axios({
                method: 'DELETE',
                url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/nhanVien/${DSNV[index].MaNV}`,

            })
                .then(function (res) {
                    console.log(res);
                    DSNV.splice(index, 1);
                    taoBang(DSNV);
                })
                .catch(function (ex) {
                    console.log(ex.messenger);
                })
            Swal(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }

    })


}

//Hàm tìm kiếm theo Mã Nhân Viên
function timKiemTheoMa() {
    var danhSachCanTim = [];
    var keyword = getEl('txtSearch').value;

    var index = findIndex(DSNV, keyword);
    if (index !== -1) {

        danhSachCanTim.push(DSNV[index]);
        return danhSachCanTim;
    }
}

function timKiemTheoTen() {
    var danhSachCanTim = [];
    var keyword = getEl('txtSearch').value;

    for (var i = 0; i < DSNV.length; i++) {
        if (DSNV[i].Ten.toLowerCase().indexOf(keyword.toLowerCase().trim()) !== -1) {
            danhSachCanTim.push(DSNV[i]);
        }
    }
    return danhSachCanTim;
}

function timKiemNhanVien() {
    var dSHienThi = [];
    if (timKiemTheoMa()) {
        dSHienThi = timKiemTheoMa();
    }
    else if (timKiemTheoTen()) {
        dSHienThi = timKiemTheoTen();
    }
    if (dSHienThi.length === 0) {
        Swal({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<a href>Why do I have this issue?</a>'
        })
    }
    else {
        taoBang(dSHienThi);
    }
}

function findIndex(arr, ma) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].MaNV === ma) {
            return i;
        }
    }
    return -1;
}

// Cập nhật:
//  b1) Hiển thị lại thông tin lên form
function HienThiLenForm(event) {
    console.log(event);
    var button = event.target;
    var ma = button.getAttribute('data-manhanvien');
    var ho = button.getAttribute('data-ho');
    var ten = button.getAttribute('data-ten');
    var chucvu = button.getAttribute('data-chucvu');
    var ngaylam = button.getAttribute('data-ngaylam');

    getEl('ho').value = ho;
    getEl('ten').value = ten;
    getEl('msnv').value = ma;
    getEl('datepicker').value = ngaylam;
    getEl('chucvu').value = chucvu;

    getEl('msnv').setAttribute("readonly", true);
    getEl('btnThemNV').style.display = "none";
    getEl('btnCapNhatNV').style.display = "block";
}

//B2: Lấy thông tin người dùng đã sửa, 
//thay thế nhân viên cũ thành viên mới (DSNV)
function CapNhatNhanVien() {
    var ho = getEl('ho').value;
    var ten = getEl('ten').value;
    var msnv = getEl('msnv').value;
    var ngayLam = getEl('datepicker').value;
    var chucVu = getEl('chucvu').value;

    var nhanVienCapNhat = new NhanVien(ho, ten, msnv, ngayLam, chucVu);

    axios({
        method: 'PUT',
        url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/nhanVien/${nhanVienCapNhat.MaNV}`,
        data: nhanVienCapNhat

    })
        .then(function (res) {
            console.log(res);
            //Lấy vị trí của nhân viên cần thay thế
            var index = findIndex(DSNV, msnv);
            //Thay thế nhân viên cũ bằng nhân viên mới cập nhật
            DSNV[index] = nhanVienCapNhat;

            taoBang(DSNV);

        })
        .catch(function (ex) {
            console.log(ex);
        })

}

//Kiểm tra rỗng
function KiemTraRong(idField, idThongBao, thongBaoContent) {
    var bool = true;
    var value = getEl(idField).value;
    if (value === "") {
        getEl(idThongBao).innerHTML = thongBaoContent;
        bool = false;
    }
    else {
        getEl(idThongBao).innerHTML = "";
    }
    return bool;
}

//Kiểm tra định dạng chữ
function KiemTraDinhDangChu(idField, idThongBao, thongBaoContent) {
    var bool = true;
    var value = getEl(idField).value;
    var patt = new RegExp("^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
        "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
        "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$");
    if (!patt.test(value)) {
        getEl(idThongBao).innerHTML = thongBaoContent;
        bool = false;
    }
    else {
        getEl(idThongBao).innerHTML = "";
    }
    return bool;
}

//Kiểm tra chức vụ
function KiemTraChucVu() {
    var bool = true;
    if (getEl('chucvu').selectedIndex == 0) {
        getEl('thongBaoChucVu').innerHTML = "Vui lòng chọn chức vụ";
        bool = false;
    }
    else {
        getEl('thongBaoChucVu').innerHTML = "";
    }
    return bool;
}

function KiemTraMa(min, max) {
    var bool = true;
    var value = getEl('msnv').value;
    if (value.length < min || value.length > max) {
        getEl('thongBaoMa').innerHTML = "Mã NV phải có từ " + min + " tới " + max;
        bool = false;
    }
    else {
        getEl('thongBaoMa').innerHTML = "";
    }
    return bool;
}

// Yêu cầu : Nút thêm nó phải có sẵn trên giao diện
// Trường hợp 1: trong trường hợp mà hàm ko có tham số
getEl('btnThemNV').addEventListener('click', themNhanVien);
// Trường hợp 2: trong trường hợp mà hàm có tham số tham số
// getEl('btnThemNV').addEventListener('click', function(){
//     themNhanVien(a,b);
// }) 
// Trường hợp 3: nếu ko viết hàm sẵn
// getEl('btnThemNV').addEventListener('click', function(){
//     //code viết trong này
//     var a = 5;
//     var b =10 ;
//     console.log(a+b);
// }) 
getEl('btnSearch').addEventListener('click', timKiemNhanVien);
getEl('btnCapNhatNV').addEventListener('click', CapNhatNhanVien);
