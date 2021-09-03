$(function(){

    $('.delete-advantage').on('click',function (e) {
        e.preventDefault();

        if(!confirm("You sure?"))
            return;

        let id = $(this).data('id');
        $.post('?module=post&action=delete', {
            id: id,
        }, (response) => {
            if(response.status === "ok")
                $(this).closest('tr').remove();
        }, 'json');
    });
});
