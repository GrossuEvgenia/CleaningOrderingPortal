const openAreaList = document.getElementById('open_area_list');
const closeAreaList = document.getElementById('close_area_list');
const areaList = document.getElementById('list_area');

const openServiceList = document.getElementById('open_service_list');
const closeServiceList = document.getElementById('close_service_list');
const serviceList = document.getElementById('list_services');
const serviceSwitcher = document.getElementsByClassName('list_services_switcher');
const tapChoise =serviceSwitcher

openAreaList.addEventListener('click', function(e){
	e.preventDefault();
	areaList.classList.add('active');
});

closeAreaList.addEventListener('click', ()=>{
areaList.classList.remove('active');
});

openServiceList.addEventListener('click', function(e){
	e.preventDefault();
	serviceList.classList.add('active');
});

closeServiceList.addEventListener('click', ()=>{
serviceList.classList.remove('active');
});