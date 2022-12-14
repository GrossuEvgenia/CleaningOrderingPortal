const open_order = document.getElementById('open_order');
const close_order = document.getElementById('close_order');
const order = document.getElementById('order');


open_order.addEventListener('click', function(e){
	e.preventDefault();
	order.classList.add('active');
});

close_order.addEventListener('click', ()=>{
order.classList.remove('active');
});