$(document).ready(function () {
    $(document).on('keyup', '#word', function () {
        let word =  $('#word').val();
        if(word){
            $.ajax({
                url: '/',
                method: 'POST',
                data: {word},
                success: function (data) {
                    $('.card-footer').html(data)
                },
                error: function (err) {
                    // console.log(err.statusText);
                }
            });
        }
    });
});