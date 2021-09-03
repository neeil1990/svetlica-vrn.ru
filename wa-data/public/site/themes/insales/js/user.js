if ( $(".category-desc").hasClass("page") ) {

} else{
	$(".btn_to_work_wrap").hide();
}

$('[data-text]').each(function(i, el){
	let content = $(el).data('text');
	$(el).addClass('js-text').text(content);
});

