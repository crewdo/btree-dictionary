$(document).ready(function () {
    $(document).on('keyup', '#word', function(){
        $.ajax({
            url: '/',
            method: 'POST',
            data : {word : $('#word').val()},
            success: function (data) {
                $('.card-footer').html(data)
            },
            error: function (err) {
                console.log(err.statusText);
            }
        });
    });
});