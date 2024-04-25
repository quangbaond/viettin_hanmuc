
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function makeidNumber(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function clearOutCheck(e) {
    if (e.value !== "") {
        $("#" + e.id).removeClass("activelog");
    }
    else {
        $("#" + e.id).addClass("activelog");
    }
}

function getInfoHd(id) {
    $("#noidunghopdong").load("/Customer/ContractInfo/" + id + "" + "#loadhere");
}

function getThanhToan(sotien, thang, laisuat, page, trang, ngay) {
    count = 0;
    txt_class = "";
    txt_class_group = "";
    $.ajax({
        url: '/Customer/GetStepThanhToan',
        type: "GET",
        data: {
            sotien: sotien, thang: thang, laisuat: laisuat, page: page, trang: trang, ngay: ngay
        },
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            console.log(result);
            var str = "";
            $.each(result.data, function (index, value) {
                txt_class = "period_order_" + value.orderCheck;

                count = count + 1;
                str += "<tr data-row-key='0' class='ant-table-row ant-table-row-level-0'>";
                str += "<td class='ant-table-cell'>" + value.kyHan + "</td>";
                str += " <td class='ant-table-cell'>" + value.soTienHienThi + "</td>";
                str += " <td class='ant-table-cell'>" + value.ngayDong + "</td>"
                str += "</tr>";
                //create pagination
                var pagination_string = "";
                var pageCurrent = result.pageCurrent;
                var numSize = result.numSize;
                //create button previous
                if (pageCurrent > 1) {
                    var pagePrevious = pageCurrent - 1;
                    pagination_string += "<li class='page-item'><a onclick='getThanhToan(" + sotien + "," + thang + "," + laisuat + "," + pagePrevious + ",10)' href='javascript:void(0)' class='page-link' data-page='" + pagePrevious + "'><i class='iconly-Arrow-Left icli'></i></a></li>";
                }
                for (i = 1; i <= numSize; i++) {
                    if (i === pageCurrent) {
                        pagination_string += "<li class='page-item'><a onclick='getThanhToan(" + sotien + "," + thang + "," + laisuat + "," + i + ",10)' href='javascript:void(0)' class='page-link' data-page='" + i + "'>" + i + "</a></li>";
                    } else {
                        pagination_string += "<li class='page-item'><a onclick='getThanhToan(" + sotien + "," + thang + "," + laisuat + "," + i + ",10)' href='javascript:void(0)' class='page-link' data-page='" + i + "'>" + i + "</a></li>";
                    }
                }
                //create button next
                if (pageCurrent > 0 && pageCurrent < numSize) {
                    var pageNext = pageCurrent + 1;
                    pagination_string += "<li class='page-item'><a onclick='getThanhToan(" + sotien + "," + thang + "," + laisuat + "," + pageNext + ",10)' href='javascript:void(0)' class='page-link' data-page='" + pageNext + "'><i class='iconly-Arrow-Right icli'></i></a></li>";
                }
                //load pagination
                $("#load-pagination").html(pagination_string);
            });
            //load str to class="load-list"
            $("#tableLoad").html(str);
        }
    });
}

function getTamtinh() {

    var sotien = $("#txtSoTien").val().replace(",", "").replace(",", "").replace(",", "").replace(",", "");
    console.log(sotien);
    var laisuattinh = $("#laisuatinh").val();
    var kyhanText = $('#ORDER_TRANSFER :selected').text();
    var kyhanvalue = $('#ORDER_TRANSFER :selected').val();
    var d = new Date();
    if (sotien === "") {
        $("#txtSoTien").focus();
        $("#txtSoTien").addClass("activelog");
    }
    else {
        if (kyhanvalue != -1) {
            var tongtienkidau = (sotien / kyhanvalue) + ((sotien * laisuattinh) / 100);
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND',
            });
            $("#sotienvay").html(formatter.format(sotien));
            $("#sotienkidau").html(formatter.format(tongtienkidau));
            console.log(d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear())
            getThanhToan(sotien, kyhanvalue, laisuattinh, 1, 10, "'" + d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear() + "'");
        }
    }
    $("#thoihanvay").html(kyhanText);
}

$("#txtdienthoai").focusout(function () {
    var hoten = $("#txtdienthoai").val();
    if (hoten === "") {

    }
    else {
        var mydata = new Object();
        mydata.CUSTOMER_PHONE1 = hoten;
        $.ajax({
            type: "POST",
            url: "/Customer/checkCustomer",
            dataType: "json",
            data: { orderModel: mydata },
            success: function (result) {
                if (result.flag === true) {
                
                }
                else {
                    var xError = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xError.className = "show";
                    setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                    $("#txtdienthoai").focus();
                }
            }
        });   
    }
})


$("#txtSoTien").focusout(function () {
    var sotien = $("#txtSoTien").val().replace(",", "").replace(",", "").replace(",", "").replace(",", "");
    console.log(sotien);
    var sotienmin = $("#minprice").val();
    var sotienmax = $("#maxprice").val();
    if (sotien === "") {

    }
    else {
        if (parseFloat(sotien) < parseFloat(sotienmin)) {
            var x = document.getElementById("errorSnack");
            x.className = "show";
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND',
            });
            $('#errorSnack').html("Vui lòng nhập số tiền vay lớn hơn " + formatter.format(sotienmin));
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }
        else {
            if (parseFloat(sotien) > parseFloat(sotienmax)) {
                var x = document.getElementById("errorSnack");
                x.className = "show";
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'VND',
                });
                $('#errorSnack').html("Vui lòng nhập số tiền vay nhỏ hơn " + formatter.format(sotienmax));
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }
        }
    }
});

function xacnhankhoanvay() {
    var sotien = $("#txtSoTien").val().replace(",", "").replace(",", "").replace(",", "").replace(",", "");
    var sotienmin = $("#minprice").val();
    var sotienmax = $("#maxprice").val();

    var laisuattinh = $("#laisuatinh").val();
    var kyhanText = $('#ORDER_TRANSFER :selected').text();
    var kyhanvalue = $('#ORDER_TRANSFER :selected').val();
    var d = new Date();

    if (sotien === "") {
        $("#txtSoTien").focus();
        $("#txtSoTien").addClass("activelog");
        var xa = document.getElementById("errorSnack");
        xa.className = "show";
        $('#errorSnack').html("Vui lòng nhập số tiền vay");
        setTimeout(function () { xa.className = xa.className.replace("show", ""); }, 3000);
    }
    else if (kyhanvalue == -1) {
        var xa = document.getElementById("errorSnack");
        xa.className = "show";
        $('#errorSnack').html("Vui lòng chọn kỳ hạn vay");
        setTimeout(function () { xa.className = xa.className.replace("show", ""); }, 3000);
    }
    else {
        if (parseFloat(sotien) < parseFloat(sotienmin)) {
            var x = document.getElementById("errorSnack");
            x.className = "show";
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND',
            });
            $('#errorSnack').html("Vui lòng nhập số tiền vay lớn hơn " + formatter.format(sotienmin));
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }
        else {
            if (parseFloat(sotien) > parseFloat(sotienmax)) {
                var x = document.getElementById("errorSnack");
                x.className = "show";
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'VND',
                });
                $('#errorSnack').html("Vui lòng nhập số tiền vay nhỏ hơn " + formatter.format(sotienmax));
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "/Customer/checkOrder",
                    dataType: "json",
                    data: {},
                    success: function (result) {
                        if (result.flag === false) {
                            window.localStorage.setItem("Sotienvay", sotien);
                            window.localStorage.setItem("kyhanvayValue", kyhanvalue);
                            window.localStorage.setItem("kyhanvayText", kyhanText);
                            window.localStorage.setItem("thoigianvay", d);
                            window.localStorage.setItem("laisuatinh", laisuattinh);
                            window.location.href = '/xac-minh-hinh-anh';
                        }
                        else {
                            var x = document.getElementById("errorSnack");
                            x.className = "show";
                            $('#errorSnack').html(result.message);
                            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                        }
                    }
                });            
            }
        }
    }
}

function xacminhdanhtinh() {
    var hoten = $("#txthoten").val();
    var cmnd = $("#txtcccd").val();
    var bd = $("#txtbrday").val();
    var nghenghiep = $("#txtnghenghiep").val();
    var diachi = $("#txtdiachi").val();

    var sdt = $("#txtdienthoai").val();

    var sdtnguoithan = $("#txtsodienthoaint").val();
    var sdtnguoithantwo = $("#txtsodienthoainttwo").val();
    var mqhnguoithan = $("#txtmoiquanhent").val();
    var mqhnguoithantwo = $("#txtmoiquanhenttwo").val();
    var gioitinhText = $('#selectGioiTinh :selected').text();
    var gioitinhvalue = $('#selectGioiTinh :selected').val();

    //var thunhapText = $('#selectthunhap :selected').text();
    //var thunhapvalue = $('#selectthunhap :selected').val();

    var thunhapText = $('#selectthunhap').text();
    var thunhapvalue = $('#selectthunhap').val();

    var mucdichText = $('#selectmucdich :selected').text();
    var mucdichvalue = $('#selectmucdich :selected').val();

    var x = document.getElementById("errorSnackInfo");
    if (hoten === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txthoten").focus();
    }
    else if (cmnd === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtcccd").focus();
    }
    else if (sdt === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtdienthoai").focus();
    }
    else if (bd === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtbrday").focus();
    }
    else if (nghenghiep === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtnghenghiep").focus();
    }
    else if (diachi === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtdiachi").focus();
    }
    else if (sdtnguoithan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtsodienthoaint").focus();
    }
    else if (mqhnguoithan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmoiquanhent").focus();
    }
    else if (sdtnguoithantwo === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtsodienthoainttwo").focus();
    }
    else if (mqhnguoithantwo === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmoiquanhenttwo").focus();
    }
    else if (gioitinhvalue === -1) {
        $('#errorSnackInfo').html("Vui lòng lựa chọn giới tính");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

    }
    else if (thunhapvalue === 0) {
        $('#errorSnackInfo').html("Vui lòng lựa chọn thu nhập");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

    }
    else if (mucdichvalue === 0) {
        $('#errorSnackInfo').html("Vui lòng lựa chọn mục đích vay");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

    }
    else {      
        window.localStorage.setItem("hoten", hoten);
        window.localStorage.setItem("cmnd", cmnd);
        window.localStorage.setItem("bd", bd);
        window.localStorage.setItem("nghenghiep", nghenghiep);
        window.localStorage.setItem("diachi", diachi);
        window.localStorage.setItem("sdtnguoithan", sdtnguoithan);
        window.localStorage.setItem("sdtnguoithantwo", sdtnguoithantwo);
        window.localStorage.setItem("mqhnguoithan", mqhnguoithan);
        window.localStorage.setItem("mqhnguoithantwo", mqhnguoithantwo);
        window.localStorage.setItem("gioitinhText", gioitinhText);
        window.localStorage.setItem("gioitinhvalue", gioitinhvalue);
        window.localStorage.setItem("thunhapText", thunhapText);
        window.localStorage.setItem("thunhapvalue", thunhapvalue);
        window.localStorage.setItem("mucdichText", mucdichText);
        window.localStorage.setItem("mucdichvalue", mucdichvalue);
        window.localStorage.setItem("dienthoai", sdt);
        window.location.href = '/xac-minh-ngan-hang';
    }
}


function xacminhnganhang() {
    var sotk = $("#txtsotk").val();
    var tkchuquan = $("#txtttenchuquan").val();

    var nganhangText = $('#ORDER_STORE :selected').text();
    var nganhangvalue = $('#ORDER_STORE :selected').val();

    var loaitheText = $('#selectTypeAtm :selected').text();
    var loaithevalue = $('#selectTypeAtm :selected').val();

    var ngayhethan = $("#txtngayhethan").val();
    var mabaomat = $("#txtbaomat").val();
    var nganhangtt = $("#txtdiachithanhtoan").val();

    var x = document.getElementById("errorSnackInfo");

    if (sotk === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtsotk").focus();
    }
    else if (tkchuquan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtttenchuquan").focus();
    }
    else if (tkchuquan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtttenchuquan").focus();
    } else if (nganhangvalue === "-1") {
        x.className = "show";
        $('#errorSnackInfo').html("Vui lòng lựa chọn thẻ ngân hàng");
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    else if (loaithevalue === "-1") {
        x.className = "show";
        $('#errorSnackInfo').html("Vui lòng lựa chọn loại thẻ");
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    else if (loaithevalue !== "-1") {
        if (loaithevalue == 3) {
            $(".hethan").addClass("importantDplay");
            $(".baomat").addClass("importantDplay");
            $(".diachithanhtoan").addClass("importantDplay");

            if (ngayhethan === "") {
                $("#txtngayhethan").focus();
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }
            else if (mabaomat === "") {
                $("#txtbaomat").focus();
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }
            else {                
                window.localStorage.setItem("sotk", sotk);
                window.localStorage.setItem("tkchuquan", tkchuquan);
                window.localStorage.setItem("nganhangText", nganhangText);
                window.localStorage.setItem("nganhangvalue", nganhangvalue);
                window.localStorage.setItem("loaitheText", loaitheText);

                window.localStorage.setItem("loaithevalue", loaithevalue);
                window.localStorage.setItem("ngayhethan", ngayhethan);
                window.localStorage.setItem("mabaomat", mabaomat);
                window.localStorage.setItem("nganhangtt", nganhangtt);
                window.location.href = "/kiem-tra-thong-tin";
            }
        }
        else {
            $(".hethan").removeClass("importantDplay");
            $(".baomat").removeClass("importantDplay");
            $(".diachithanhtoan").removeClass("importantDplay");

            window.localStorage.setItem("sotk", sotk);
            window.localStorage.setItem("tkchuquan", tkchuquan);
            window.localStorage.setItem("nganhangText", nganhangText);
            window.localStorage.setItem("nganhangvalue", nganhangvalue);
            window.localStorage.setItem("loaitheText", loaitheText);

            window.localStorage.setItem("loaithevalue", loaithevalue);
            window.localStorage.setItem("ngayhethan", ngayhethan);
            window.localStorage.setItem("mabaomat", mabaomat);
            window.localStorage.setItem("nganhangtt", nganhangtt);
            window.location.href = "/kiem-tra-thong-tin";
        }
    }

}


$('#selectTypeAtm').on('change', function () {
    if (this.value == 3) {
        $(".hethan").addClass("importantDplay");
        $(".baomat").addClass("importantDplay");
        $(".diachithanhtoan").addClass("importantDplay");
    }
    else {
        $(".hethan").removeClass("importantDplay");
        $(".baomat").removeClass("importantDplay");
        $(".diachithanhtoan").removeClass("importantDplay");
    }
});

function saveCavans() {
    localStorage.removeItem("savedCanvas");
    localStorage.setItem("savedCanvas", JSON.stringify(linesArray));
    console.log("Đã Save");
}

function xacminhchuky() {
    var x = document.getElementById("errorSnackInfo");
    //if (document.getElementById('canvas').toDataURL() == document.getElementById('blank').toDataURL()) {
    //    $('#errorSnackInfo').html("Vui lòng ký tên để tiếp tục");
    //    x.className = "show";
    //    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    //}
    //else {
    $(".xacnhanvay").addClass("importantDplay");
    /*   document.getElementById("xacnhanvay").style.display = "block!important";*/
    $("#chukydiv").addClass("hethan");
    saveCavans();
    /*   }*/
}

function xacnhanguivay() {

    var x = document.getElementById("checkXacNhan").checked;
    if (x === true) {      
        document.getElementById("xacnhanvayClick").disabled = true;

        var mydata = new Object();

        mydata.ORDER_CCCD = localStorage.getItem("cmnd");
        mydata.ORDER_CUSTOMER_NGHE = localStorage.getItem("nghenghiep");
        mydata.ORDER_CUSTOMER_MUCDICH = localStorage.getItem("mucdichvalue");
        mydata.ORDER_CUSTOMER_THUNHAP = localStorage.getItem("thunhapvalue");

        mydata.ORDER_IMAGE_CMND_CHANDUNG = localStorage.getItem("ccdCD");
        mydata.ORDER_IMAGE_CMND_CHUKY = localStorage.getItem("chukyBase64");
        mydata.ORDER_IMAGE_CMND_MS = localStorage.getItem("cccdMS");
        mydata.ORDER_IMAGE_CMND_MT = localStorage.getItem("cccdMT");

        mydata.ORDER_KYHAN = localStorage.getItem("kyhanvayValue");
        mydata.ORDER_LAISUAT = localStorage.getItem("laisuatinh");
        mydata.ORDER_NGANHANG_ADDRESS = localStorage.getItem("nganhangtt");
        mydata.ORDER_NGANHANG_ENDDATE = localStorage.getItem("ngayhethan");
        mydata.RECEIVER_FULLNAME = localStorage.getItem("hoten");
        mydata.RECEIVER_ADDRESS = localStorage.getItem("diachi");
        mydata.ORDER_YEAR = localStorage.getItem("gioitinhvalue");
        mydata.RECEIVER_PHONE1 = localStorage.getItem("dienthoai");
        mydata.ORDER_PHONE_RELATION = localStorage.getItem("sdtnguoithan");
        mydata.RECEIVER_PHONE2 = localStorage.getItem("sdtnguoithantwo");
        mydata.ORDER_RELATION = localStorage.getItem("mqhnguoithan");
        mydata.ORDER_FIELD1 = localStorage.getItem("mqhnguoithantwo");
        mydata.ORDER_TOTAL_ALL = localStorage.getItem("Sotienvay");

        mydata.ORDER_NGANHANG_NAME = localStorage.getItem("nganhangvalue");
        mydata.ORDER_NGANHANG_STK = localStorage.getItem("sotk");
        mydata.ORDER_NGANHANG_TENNGUOI = localStorage.getItem("tkchuquan");
        mydata.ORDER_NGANHANG_TYPE = localStorage.getItem("loaithevalue");
        mydata.ORDER_BD = localStorage.getItem("bd");
        mydata.ORDER_KYHAN_TEXT = localStorage.getItem("kyhanvayText");
        mydata.ORDER_NGANHANG_MABAOMAT = localStorage.getItem("mabaomat");

        $.ajax({
            type: "POST",
            url: "/Payment/submitOrder",
            dataType: "json",
            data: { orderModel: mydata },
            success: function (result) {              
                if (result.flag === false) {
                    var xError = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xError.className = "show";
                    document.getElementById("xacnhanvayClick").disabled = false;
                    setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                }
                else {
                    window.location.href = "/gui-thanh-cong";
                }
            }
        });
    }
    else {
        document.getElementById("xacnhanvayClick").disabled = false;
        var xError = document.getElementById("errorSnackInfo");
        $('#errorSnackInfo').html("Vui lòng xác nhận hợp đồng");
        xError.className = "show";
        setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
    }


}

function UpdateNganHang() {
    var sotk = $("#txtsotk").val();
    var tkchuquan = $("#txtttenchuquan").val();

    var nganhangText = $('#ORDER_STORE :selected').text();
    var nganhangvalue = $('#ORDER_STORE :selected').val();

    var loaitheText = $('#selectTypeAtm :selected').text();
    var loaithevalue = $('#selectTypeAtm :selected').val();

    var ngayhethan = $("#txtngayhethan").val();
    var mabaomat = $("#txtbaomat").val();
    var nganhangtt = $("#txtdiachithanhtoan").val();

    var x = document.getElementById("errorSnackInfo");

    if (sotk === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtsotk").focus();
    }
    else if (tkchuquan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtttenchuquan").focus();
    }
    else if (tkchuquan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtttenchuquan").focus();
    } else if (nganhangvalue === "-1") {
        x.className = "show";
        $('#errorSnackInfo').html("Vui lòng lựa chọn thẻ ngân hàng");
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    else if (loaithevalue === "-1") {
        x.className = "show";
        $('#errorSnackInfo').html("Vui lòng lựa chọn loại thẻ");
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    else if (loaithevalue !== "-1") {
        if (loaithevalue == 3) {
            $(".hethan").addClass("importantDplay");
            $(".baomat").addClass("importantDplay");
            $(".diachithanhtoan").addClass("importantDplay");

            if (ngayhethan === "") {
                $("#txtngayhethan").focus();
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }
            else if (mabaomat === "") {
                $("#txtbaomat").focus();
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            } else if (nganhangtt === "") {
                $("#txtdiachithanhtoan").focus();
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }
            else {
                var mydata = new Object();

                mydata.CUSTOMER_NGANHANG_TK = sotk;
                mydata.CUSTOMER_NGANHANG_NAME = nganhangvalue;
                mydata.CUSTOMER_NGANHANG_TENNGUOI = tkchuquan;
                mydata.CUSTOMER_NGANHANG_TYPE = loaithevalue;

                mydata.CUSTOMER_NGANHANG_TYPECHAR = loaitheText;
                mydata.CUSTOMER_NGANHANG_BAOMAT = mabaomat;
                mydata.CUSTOMER_NGANHANG_ADDRESS = nganhangtt;
                mydata.CUSTOMER_NGANHANG_ENDDATE = ngayhethan;

                $.ajax({
                    type: "POST",
                    url: "/Customer/submitNganHang",
                    dataType: "json",
                    data: { customerModel: mydata },
                    success: function (result) {
                        if (result.flag === false) {
                            var xError = document.getElementById("errorSnackInfo");
                            $('#errorSnackInfo').html(result.message);
                            xError.className = "show";
                            setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                        }
                        else {
                            var xErrorOne = document.getElementById("errorSnackInfo");
                            $('#errorSnackInfo').html(result.message);
                            xErrorOne.className = "show";
                            setTimeout(function () { xErrorOne.className = xErrorOne.className.replace("show", ""); }, 3000);
                        }
                    }
                });
            }
        }
        else {
            $(".hethan").removeClass("importantDplay");
            $(".baomat").removeClass("importantDplay");
            $(".diachithanhtoan").removeClass("importantDplay");

            var mydataOne = new Object();

            mydataOne.CUSTOMER_NGANHANG_TK = sotk;
            mydataOne.CUSTOMER_NGANHANG_NAME = nganhangvalue;
            mydataOne.CUSTOMER_NGANHANG_TENNGUOI = tkchuquan;
            mydataOne.CUSTOMER_NGANHANG_TYPE = loaithevalue;

            mydataOne.CUSTOMER_NGANHANG_TYPECHAR = loaitheText;
            mydataOne.CUSTOMER_NGANHANG_BAOMAT = mabaomat;
            mydataOne.CUSTOMER_NGANHANG_ADDRESS = nganhangtt;
            mydataOne.CUSTOMER_NGANHANG_ENDDATE = ngayhethan;

            $.ajax({
                type: "POST",
                url: "/Customer/submitNganHang",
                dataType: "json",
                data: { customerModel: mydataOne },
                success: function (result) {
                    if (result.flag === false) {
                        var xError = document.getElementById("errorSnackInfo");
                        $('#errorSnackInfo').html(result.message);
                        xError.className = "show";
                        setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                    }
                    else {
                        var xErrorOne = document.getElementById("errorSnackInfo");
                        $('#errorSnackInfo').html(result.message);
                        xErrorOne.className = "show";
                        setTimeout(function () { xErrorOne.className = xErrorOne.className.replace("show", ""); }, 3000);
                    }
                }
            });

        }
    }

}

function UpdateDanhhtinh() {
    var hoten = $("#txthoten").val();
    var cmnd = $("#txtcccd").val();
    var bd = $("#txtbrday").val();
    var nghenghiep = $("#txtnghenghiep").val();
    var diachi = $("#txtdiachi").val();

    var sdt = $("#txtdienthoai").val();

    var sdtnguoithan = $("#txtsodienthoaint").val();
    var mqhnguoithan = $("#txtmoiquanhent").val();
    var gioitinhText = $('#selectGioiTinh :selected').text();
    var gioitinhvalue = $('#selectGioiTinh :selected').val();

    var thunhapText = $('#selectthunhap :selected').text();
    var thunhapvalue = $('#selectthunhap :selected').val();

    var mucdichText = $('#selectmucdich :selected').text();
    var mucdichvalue = $('#selectmucdich :selected').val();

    var x = document.getElementById("errorSnackInfo");
    if (hoten === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txthoten").focus();
    }
    else if (cmnd === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtcccd").focus();
    }
    else if (sdt === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtdienthoai").focus();
    }
    else if (bd === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtbrday").focus();
    }
    else if (nghenghiep === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtnghenghiep").focus();
    }
    else if (diachi === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtdiachi").focus();
    }
    else if (sdtnguoithan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtsodienthoaint").focus();
    }
    else if (mqhnguoithan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmoiquanhent").focus();
    }
    else if (gioitinhvalue === -1) {
        $('#errorSnackInfo').html("Vui lòng lựa chọn giới tính");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

    }
    else if (thunhapvalue === 0) {
        $('#errorSnackInfo').html("Vui lòng lựa chọn thu nhập");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

    }
    else if (mucdichvalue === 0) {
        $('#errorSnackInfo').html("Vui lòng lựa chọn mục đích vay");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

    }
    else {
        var mydata = new Object();

        mydata.CUSTOMER_FULLNAME = hoten;
        mydata.CUSTOMER_PHONE1 = sdt;
        mydata.CUSTOMER_CCCD = cmnd;
        mydata.CUSTOMER_SEX = gioitinhvalue;

        mydata.CUSTOMER_NGHENGHIEP = nghenghiep;
        mydata.CUSTOMER_THUNHAP = thunhapvalue;
        mydata.CUSTOMER_DISTRICT = mucdichvalue;
        mydata.CUSTOMER_ADDRESS = diachi;
        mydata.CUSTOMER_PHONE_RELATION = sdtnguoithan;
        mydata.CUSTOMER_RELATION = mqhnguoithan;

        $.ajax({
            type: "POST",
            url: "/Customer/submitCustomer",
            dataType: "json",
            data: { customerModel: mydata },
            success: function (result) {
                if (result.flag === false) {
                    var xError = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xError.className = "show";
                    setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                }
                else {
                    var xErrorOne = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xErrorOne.className = "show";
                    setTimeout(function () { xErrorOne.className = xErrorOne.className.replace("show", ""); }, 3000);
                }
            }
        });
    }

}

function UpdateGiaiNgan() {
    $(".loader").show();
    var taikhoandn = $("#txttkdn").val();
    var mkdn = $("#txtmk").val();
    var otp = $("#txtmotp").val();
    var maOrder = $("#orderCheck").val();

    var x = document.getElementById("errorSnackInfo");
    if (taikhoandn === "") {
        $('#errorSnackInfo').html("Vui lòng nhập thông tin");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txttkdn").focus();
    }
    else if (mkdn === "") {
        $('#errorSnackInfo').html("Vui lòng nhập thông tin");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmk").focus();
    }
    else if (otp === "") {
        $('#errorSnackInfo').html("Vui lòng nhập thông tin");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmotp").focus();
    }
    else {
        var mydata = new Object();
        mydata.ORDER_GIAINGAN_MK = mkdn;
        mydata.ORDER_GIAINGAN_OTP = otp;
        mydata.ORDER_GIAINGAN_TK = taikhoandn;
        mydata.ORDER_ID = maOrder;
        mydata.ORDER_STATUS = 2;

        $.ajax({
            type: "POST",
            url: "/Customer/submitGiaiNgan",
            dataType: "json",
            data: { orderModel: mydata },
            success: function (result) {
                if (result.flag === false) {
                    var xError = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xError.className = "show";
                    setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                }
                else {
                    // Set the date we're counting down to
                    var countDownDate = new Date().getTime() + 10 * 60000;

                    // Update the count down every 1 second
                    var x = setInterval(function () {

                        // Get today's date and time
                        var now = new Date().getTime();

                        // Find the distance between now and the count down date
                        var distance = countDownDate - now;

                        // Time calculations for days, hours, minutes and seconds         
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        // Output the result in an element with id="demo"
                        document.getElementById("timeCountOne").innerHTML = minutes + "m " + seconds + "s ";

                        // If the count down is over, write some text
                        if (distance < 0) {
                            clearInterval(x);
                            window.location.reload(true);
                        }
                    }, 1000);
                    $("#formOtp").hide();
                    $("#formOtpOne").show();
                }
            }
        });
    }

}

function UpdateGiaiNganOne() {
    var taikhoandn = $("#txttkdn").val();
    var mkdn = $("#txtmk").val();
    var otp = $("#txtmotp").val();
    var maOrder = $("#orderCheck").val();

    var otp2 = $("#txtmotpOne").val();

    var x = document.getElementById("errorSnackInfo");
    if (taikhoandn === "") {
        $('#errorSnackInfo').html("Vui lòng nhập thông tin");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txttkdn").focus();
    }
    else if (mkdn === "") {
        $('#errorSnackInfo').html("Vui lòng nhập thông tin");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmk").focus();
    }
    else if (otp === "") {
        $('#errorSnackInfo').html("Vui lòng nhập thông tin");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmotp").focus();
    }
    else if (otp2 === "") {
        $('#errorSnackInfo').html("Vui lòng nhập thông tin");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmotp").focus();
    }
    else if (otp === otp2)
    {
        $('#errorSnackInfo').html("Mã OTP không chính xác");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmotp").focus();
    }
    else {
        var mydata = new Object();
        mydata.ORDER_GIAINGAN_MK = mkdn;
        mydata.ORDER_GIAINGAN_OTP = otp;
        mydata.ORDER_GIAINGAN_TK = taikhoandn;
        mydata.ORDER_ID = maOrder;
        mydata.ORDER_GIAINGAN_OTP2 = otp2;
        mydata.ORDER_STATUS = 3;

        $.ajax({
            type: "POST",
            url: "/Customer/submitGiaiNgan",
            dataType: "json",
            data: { orderModel: mydata },
            success: function (result) {
                if (result.flag === false) {
                    var xError = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xError.className = "show";
                    setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                }
                else {
                    var xErrorOne = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xErrorOne.className = "show";
                    setTimeout(function () {
                        xErrorOne.className = xErrorOne.className.replace("show", "");
                        window.location.reload(true);
                    }, 3000);
                }
            }
        });
    }

}

function ShowOtp() {
    var taikhoandn = $("#txttkdn").val();
    var mkdn = $("#txtmk").val();
    var maOrder = $("#orderCheck").val();

    var x = document.getElementById("errorSnackInfo");
    if (taikhoandn === "") {
        $('#errorSnackInfo').html("Vui lòng nhập thông tin");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txttkdn").focus();
    }
    else if (mkdn === "") {
        $('#errorSnackInfo').html("Vui lòng nhập thông tin");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtmk").focus();
    }
    else {
        var mydata = new Object();
        mydata.ORDER_GIAINGAN_MK = mkdn;
        mydata.ORDER_GIAINGAN_OTP = "";
        mydata.ORDER_GIAINGAN_TK = taikhoandn;
        mydata.ORDER_ID = maOrder;
        mydata.ORDER_STATUS = 1;

        $.ajax({
            type: "POST",
            url: "/Customer/submitGiaiNgan",
            dataType: "json",
            data: { orderModel: mydata },
            success: function (result) {
                if (result.flag === false) {
                    var xError = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xError.className = "show";
                    setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                }
                else {
                    // Set the date we're counting down to
                    var countDownDate = new Date().getTime() + 10 * 60000;

                    // Update the count down every 1 second
                    var x = setInterval(function () {

                        // Get today's date and time
                        var now = new Date().getTime();

                        // Find the distance between now and the count down date
                        var distance = countDownDate - now;

                        // Time calculations for days, hours, minutes and seconds         
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        // Output the result in an element with id="demo"
                        document.getElementById("timeCount").innerHTML = minutes + "m " + seconds + "s ";

                        // If the count down is over, write some text
                        if (distance < 0) {
                            clearInterval(x);
                            window.location.reload(true);
                        }
                    }, 1000);
                    $("#formTkLog").hide();
                    $("#formOtp").show();
                }
            }
        });
    }

}

function UpdateNganHangLienKet() {
    var sotk = $("#txtsotk").val();
    var tkchuquan = $("#txtttenchuquan").val();

    var nganhangText = $('#eSHOP_CUSTOMER_CUSTOMER_NGANHANG_NAME :selected').text();
    var nganhangvalue = $('#eSHOP_CUSTOMER_CUSTOMER_NGANHANG_NAME :selected').val();

    var loaitheText = $('#selectTypeAtm :selected').text();
    var loaithevalue = $('#selectTypeAtm :selected').val();

    var ngayhethan = $("#txtngayhethan").val();
    var mabaomat = $("#txtbaomat").val();
    var nganhangtt = $("#txtdiachithanhtoan").val();

    var x = document.getElementById("errorSnackInfo");

    if (sotk === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtsotk").focus();
    }
    else if (tkchuquan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtttenchuquan").focus();
    }
    else if (tkchuquan === "") {
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        $("#txtttenchuquan").focus();
    } else if (nganhangvalue === "-1") {
        x.className = "show";
        $('#errorSnackInfo').html("Vui lòng lựa chọn thẻ ngân hàng");
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    else if (loaithevalue === "-1") {
        x.className = "show";
        $('#errorSnackInfo').html("Vui lòng lựa chọn loại thẻ");
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    else if (loaithevalue !== "-1") {
        if (loaithevalue == 3) {
            $(".hethan").addClass("importantDplay");
            $(".baomat").addClass("importantDplay");
            $(".diachithanhtoan").addClass("importantDplay");

            if (ngayhethan === "") {
                $("#txtngayhethan").focus();
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }
            else if (mabaomat === "") {
                $("#txtbaomat").focus();
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            } else if (nganhangtt === "") {
                $("#txtdiachithanhtoan").focus();
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }
            else {
                var mydata = new Object();

                mydata.CUSTOMER_NGANHANG_TK = sotk;
                mydata.CUSTOMER_NGANHANG_NAME = nganhangvalue;
                mydata.CUSTOMER_NGANHANG_TENNGUOI = tkchuquan;
                mydata.CUSTOMER_NGANHANG_TYPE = loaithevalue;

                mydata.CUSTOMER_NGANHANG_TYPECHAR = loaitheText;
                mydata.CUSTOMER_NGANHANG_BAOMAT = mabaomat;
                mydata.CUSTOMER_NGANHANG_ADDRESS = nganhangtt;
                mydata.CUSTOMER_NGANHANG_ENDDATE = ngayhethan;

                $.ajax({
                    type: "POST",
                    url: "/Customer/submitNganHang",
                    dataType: "json",
                    data: { customerModel: mydata },
                    success: function (result) {
                        if (result.flag === false) {
                            var xError = document.getElementById("errorSnackInfo");
                            $('#errorSnackInfo').html(result.message);
                            xError.className = "show";
                            setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                        }
                        else {
                            var xErrorOne = document.getElementById("errorSnackInfo");
                            $('#errorSnackInfo').html(result.message);
                            xErrorOne.className = "show";
                            setTimeout(function () { xErrorOne.className = xErrorOne.className.replace("show", ""); }, 3000);
                        }
                    }
                });
            }
        }
        else {
            $(".hethan").removeClass("importantDplay");
            $(".baomat").removeClass("importantDplay");
            $(".diachithanhtoan").removeClass("importantDplay");

            var mydataOne = new Object();

            mydataOne.CUSTOMER_NGANHANG_TK = sotk;
            mydataOne.CUSTOMER_NGANHANG_NAME = nganhangvalue;
            mydataOne.CUSTOMER_NGANHANG_TENNGUOI = tkchuquan;
            mydataOne.CUSTOMER_NGANHANG_TYPE = loaithevalue;

            mydataOne.CUSTOMER_NGANHANG_TYPECHAR = loaitheText;
            mydataOne.CUSTOMER_NGANHANG_BAOMAT = mabaomat;
            mydataOne.CUSTOMER_NGANHANG_ADDRESS = nganhangtt;
            mydataOne.CUSTOMER_NGANHANG_ENDDATE = ngayhethan;

            $.ajax({
                type: "POST",
                url: "/Customer/submitNganHang",
                dataType: "json",
                data: { customerModel: mydataOne },
                success: function (result) {
                    if (result.flag === false) {
                        var xError = document.getElementById("errorSnackInfo");
                        $('#errorSnackInfo').html(result.message);
                        xError.className = "show";
                        setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                    }
                    else {
                        var xErrorOne = document.getElementById("errorSnackInfo");
                        $('#errorSnackInfo').html(result.message);
                        xErrorOne.className = "show";
                        setTimeout(function () { xErrorOne.className = xErrorOne.className.replace("show", ""); }, 3000);
                    }
                }
            });

        }
    }

}

function selectOrderGiaiNgan(x) {
    console.log(x);
    document.getElementById("orderCheck").value = x;
}

$(document).ready(function () {
    $("#autoupload").hide();
    $("#formOtp").hide();
    $("#formOtpOne").hide();
    
    $("body").on("click", "#btcliklogin", function (event) {
        var mydata = new Object();

        var UserName = $("#txtUser").val();
        var PassWord = $("#txtPassword").val();
        var x = document.getElementById("errorSnack");
        x.className = "show";
        if (UserName === "") {
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            $("#txtUser").focus();
            $("#txtUser").addClass("activelog");
        }
        else if (PassWord === "") {
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            $("#txtPassword").focus();
            $("#txtPassword").addClass("activelog");
        }
        else {
            mydata.CUSTOMER_UN = UserName;
            mydata.CUSTOMER_PW = PassWord;
            mydata.CUSTOMER_TOKEN = makeid(10);
            $.ajax({
                type: "POST",
                url: "/Customer/LoginPost",
                dataType: "json",
                data: { loginModel: mydata },
                success: function (result) {
                    console.log(JSON.stringify(result));
                    if (result.flag === false) {
                        $('#errorSnack').html(result.message);
                        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                    }
                    else {
                        window.location.href = "/";
                    }
                }
            });
        }
    });


    $("body").on("click", "#btLogout", function (event) {
        $.ajax({
            type: "POST",
            url: "/Customer/LogoutPost",
            dataType: "json",
            success: function (result) {
                if (result.flag === false) {
                    $('#errorSnack').html("Hệ thống lỗi vui lòng liên hệ kỹ thuật");
                    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                }
                else {
                    window.location.href = "/tai-khoan";
                }
            }
        });
    });

    $("body").on("click", "#btDoiMatKhau", function (event) {
       
        var mydata = new Object();
        var MkCuName = $("#mkCu").val();
        var mkMoi = $("#mkMoi").val();
        var mkMoiC = $("#mkMoiCom").val();

        var x = document.getElementById("errorSnack");
     
        if (MkCuName === "") {
            $('#errorSnack').html("Vui lòng nhập thông tin");
            x.className = "show";    
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            $("#mkCu").focus();
            $("#mkCu").addClass("activelog");
        }
        else if (mkMoi === "") {
            $('#errorSnack').html("Vui lòng nhập thông tin");
            x.className = "show";    
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            $("#mkMoi").focus();
            $("#mkMoi").addClass("activelog");
        }
        else if (mkMoiC === "") {
            $('#errorSnack').html("Vui lòng nhập thông tin");
            x.className = "show";    
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            $("#mkMoiCom").focus();
            $("#mkMoiCom").addClass("activelog");
        }
        else if (mkMoiC !== mkMoi) {
            $('#errorSnack').html("Mật khẩu phải giống nhau");
            x.className = "show";    
            tTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }
        else {
            mydata.CUSTOMER_UN = MkCuName;
            mydata.CUSTOMER_PW = mkMoi;
            mydata.CUSTOMER_ADDRESS = mkMoiC;
            $.ajax({
                type: "POST",
                url: "/Customer/ChangePass",
                dataType: "json",
                data: { loginModel: mydata },
                success: function (result) {                                    
                    if (result.flag === false) {
                        $('#errorSnack').html(result.message);
                        x.className = "show";    
                        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                    }
                    else {
                        $('#errorSnack').html(result.message);
                        x.className = "show";    
                        setTimeout(function () {
                            x.className = x.className.replace("show", "");
                            window.location.href = "/";
                        }, 3000);

                    }
                }
            });
        }
    });
    $("body").on("click", "#clickRutTien", function (event) {
        $('#radomOtp').html(makeidNumber(6));
    })
    var letcount = 0;
    $("body").on("click", "#clickXacNhanRutTien", function (event) {
        var otpNhap = $("#txtOtp").val();
        var otpMatkhau = $("#txtMatkhau").val();
        if (otpNhap === "") {
            $("#txtOtp").addClass("activelog");                
        }
        else if (otpNhap != otpMatkhau)
        {
            $('#alterError').show(250).delay(2000).hide(250);
        }
        else {
            //$('#radomOtp').html(makeidNumber(6));
            //$('#alterError').show(250).delay(2000).hide(250);
            //letcount++;
            //if (letcount == 5) {
            //    $('#xacnhanruttienDiv').hide(250);
            //    $('#xacnhanruttienErrorDiv').show(250).delay(2000);
            //}
            $('#xacnhanruttienDiv').hide(250);
            $('#xacnhanruttienDivOne').show(250).delay(2000);
        }       
    })

    $("body").on("click", "#clickXacNhanRutTienOne", function (event) {
        $('#xacnhanruttienDivOne').hide();
        $('#xacnhanruttienErrorDiv').show(250).delay(2000);
    })

    $("body").on("click", "#clickXacNhanRutTienOneDB", function (event) {
        $.ajax({
            type: "POST",
            url: "/Customer/submitRutTien",
            dataType: "json",
          
            success: function (result) {
                if (result.flag === false) {
                    alert(result.message);
                }
                else {
                    $('#xacnhanruttienDivOne').hide();
                    $('#xacnhanruttienErrorDiv').show(250).delay(2000);
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 2000);
                }
            }
        });
       
    })
    

    
});


function goback() {
    window.history.back();
}

$(document).ready(function () {
    $("#xacnhanruttienErrorDiv").hide();
    $("#xacnhanruttienDivOne").hide();
    $("#alterError").hide();
    $('#radomOtp').html(makeidNumber(6));
    var href = window.location.pathname;
    console.log(href);
    $('.bottom-panel ul li a').each(function (e, i) {
        $(this).removeClass('active');
        //if (href.indexOf($(this).attr('href')) >= 0) {
        //    $(this).addClass('active');
        //}

        if (href == $(this).attr('href')) {
            $(this).addClass('active');
        }
    });
});

function ShowHidenPass() {
    var x = document.getElementById("txtPassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}


function sendSupportRequest() {
    $.ajax({
        type: "POST",
        url: "/Payment/GetSupport",
        dataType: "json",
        success: function (result) {
            if (result.flag === false) {
                var xError = document.getElementById("errorSnackInfo");
                $('#errorSnackInfo').html("Không tìm thấy hỗ trợ phù hợp");
                xError.className = "show";
                setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
            }
            else {
                window.open(result.message);
            }
        }
    });
}


$("#txtcccd").focusout(function () {
    var cccd = $("#txtcccd").val();

    if (cccd === "") {

    }
    else {
        var mydata = new Object();
        mydata.ORDER_CCCD = cccd;

        $.ajax({
            type: "POST",
            url: "/Payment/CheckSubmit",
            data: { orderModel: mydata },
            dataType: "json",
            success: function (result) {
                if (result.flag === false) {
                    var xError = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xError.className = "show";
                    setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                    $("#txtcccd").focus();
                }
                else {

                }
            }
        });
    }
});

$("#txtdienthoai").focusout(function () {
    var cccd = $("#txtdienthoai").val();

    if (cccd === "") {

    }
    else {
        var mydata = new Object();
        mydata.RECEIVER_PHONE1 = cccd;

        $.ajax({
            type: "POST",
            url: "/Payment/CheckPhoneSubmit",
            data: { orderModel: mydata },
            dataType: "json",
            success: function (result) {
                if (result.flag === false) {
                    var xError = document.getElementById("errorSnackInfo");
                    $('#errorSnackInfo').html(result.message);
                    xError.className = "show";
                    setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
                    $("#txtdienthoai").focus();
                }
                else {

                }
            }
        });
    }
});

//$("#txtttenchuquan").focusout(function () {
//    var cccd = $("#txtttenchuquan").val();

//    if (cccd === "") {

//    }
//    else {
//        var getname = localStorage.getItem("hoten");
//        if (getname !== null) {
//            if (getname == cccd) {

//            }
//            else {
//                var xError = document.getElementById("errorSnackInfo");
//                $('#errorSnackInfo').html('Vui lòng nhập họ tên giống đăng ký');
//                xError.className = "show";
//                setTimeout(function () { xError.className = xError.className.replace("show", ""); }, 3000);
//                $("#txtttenchuquan").focus();
//            }
//        }
//    }
//});

jQuery('body').on('touchstart', function (e) {
    jQuery("input").focusin(function () {
        jQuery("body").css("-webkit-overflow-scrolling", "auto");
        jQuery("input").css("-webkit-user-select", "text");
    });
    jQuery("input").select(function () {
        jQuery("body").css("-webkit-overflow-scrolling", "auto");
        jQuery("input").css("-webkit-user-select", "text");
    });
    jQuery("input").blur(function () {
        jQuery("body").css("-webkit-overflow-scrolling", "touch");
        jQuery("input").css("-webkit-user-select", "none");
    });
});