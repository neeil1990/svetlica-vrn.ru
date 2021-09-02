class Names {

    constructor() {
        this.el = '';
        this.id = '';
        this.values = '';
    }

    record(el){
        this.el = $(el);
        this.id = this.el.data('id');
        this.values = this.el.val();

        this.request();
    }

    request() {
        $.post('?plugin=names&module=save', {
            id: this.id,
            name: this.values,
        }, function (response) {

            //
        }, 'json');

        return false;
    }
}

