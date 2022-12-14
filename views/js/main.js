const openPopUp =document.getElementById('open_pop_up');
const closePopUp = document.getElementById('pop_up_close');

const openPopUp1 =document.getElementById('open_pop_up1');
const closePopUp1 = document.getElementById('pop_up_close1');

const popUp=document.getElementById('pop_up');
const popUp1=document.getElementById('pop_up1');



openPopUp.addEventListener('click', function(e){
	e.preventDefault();
	popUp.classList.add('active');
});

closePopUp.addEventListener('click', ()=>{
popUp.classList.remove('active');
});

openPopUp1.addEventListener('click', function(e){
	e.preventDefault();
	popUp1.classList.add('active');
});

closePopUp1.addEventListener('click', ()=>{
popUp1.classList.remove('active');
});

