function addyeuthich(x) {
    var getItemId = parseInt(x);
    //alert(soluong);
    var postData = {
        news_id: getItemId,
    };
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',       
        url: '/Customer/AddYeuThich?news_id=' + getItemId,
        data: postData,
        success: function (data) {
            $('.divCart').html(data.message)
            $('.divCart').show(250).delay(1000).hide(250);        
        },
        error: function (data) {
            alert(data.message);
        }
    });
};

function removeyeuthich(x) {
    var getItemId = parseInt(x);
    //alert(soluong);
    var postData = {
        news_id: getItemId,
    };
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        url: '/Customer/RemoveYeuThich?news_id=' + getItemId,
        data: postData,
        success: function (data) {        
            window.location.reload(true);
        },
        error: function (data) {
            alert(data.message);
        }
    });
};


function goback() {
    window.history.back();
}