const pool = require ('../connection');


class ExecutorController{
    
    //гет запрос на открытие страницы для создания компании
    async formCreate(req,res){
        const type_executor = await pool.query('select * from type_executor')
        res.render('executor_create.html', {type_executor: type_executor.rows})
    }

    async registration(req, res){
        
        const { name_company,  email , password, id_type_executor}=req.body;
        const photo_link="default_image.png";
        const description="Отредактируйте свою страницу в разделе \"Редактировать\", чтобы клиенты получили всю нужную информацию"
        console.log(req.body);
        const check = await pool.query('select * from executor where email=$1 and password_=$2',[email,password]);
        if(check.rowCount==0)
       { const newExecutor = await pool.query(
            'insert into executor (login, password_,name_company, description,photo_link, email, id_type_executor)'+
            'values($1,$2,$3,$4,$5,$6,$7)'+
            'returning *',[ email, password,name_company,description,photo_link,email,id_type_executor ]);
            return res.redirect('/');
        }
        else{
            return res.redirect('/');
        }
    }
    async logOut(req,res){
        const ses=req.session;
        ses.id_executor=null;
        ses.name_company=null;
        console.log(ses);
        const executors = await pool.query('select * from executor');
        const type_executor = await pool.query('select * from type_executor');
       // console.log(type_executor);
        return  res.redirect('/');
        //('executor_list.html', {executors: executors.rows,type_executor: type_executor.rows, session:req.session});  
    }
    async backInExecutorCabinet(req, res){
        const id_executor=req.session.id_executor;
        const executor = await pool.query('select * from executor where id_executor=$1', [id_executor]);
        const aria =await pool.query('select * from aria');
        const services = await pool.query('select * from services');
      const aria_list = await pool.query('select a.id_aria, a.name_aria from aria a inner join aria_list  al on a.id_aria=al.id_aria'
        + ' inner join executor e on e.id_executor=al.id_executor where e.id_executor=$1',[id_executor]);
        const service_list = await pool.query('select s.name_services, ls.price, s.id_services from services s inner join list_services ls on '+
        's.id_services=ls.id_services inner join executor e on e.id_executor=ls.id_executor where e.id_executor=$1',[id_executor]);
        res.render('executor_cabinet.html', {executor: executor.rows[0],aria:aria.rows,aria_list:aria_list.rows, services:services.rows, service_list:service_list.rows});
    }
    async openExecutorCabinet(req,res){
        const ses=req.session;
        
        const {email , password}=req.body;
        console.log(req.body);
        const executor= await pool.query('select * from executor where email=$1 and password_=$2',[email,password]);
       
        if (executor.rowCount>0)
         {
            ses.id_executor=executor.rows[0].id_executor;
            ses.name_company=executor.rows[0].name_company;
            console.log(req.session);
            const aria =await pool.query('select * from aria');
            const aria_list = await pool.query('select a.id_aria, a.name_aria from aria a inner join aria_list  al on a.id_aria=al.id_aria'
            + ' inner join executor e on e.id_executor=al.id_executor where e.id_executor=$1',[req.session.id_executor]);
            const services = await pool.query('select * from services');
            const service_list = await pool.query('select s.name_services,  ls.price, s.id_services from services s inner join list_services ls on '+
        's.id_services=ls.id_services inner join executor e on e.id_executor=ls.id_executor where e.id_executor=$1',[req.session.id_executor]);
            res.render('executor_cabinet.html', {executor: executor.rows[0],aria:aria.rows,aria_list:aria_list.rows, services:services.rows, service_list:service_list.rows});
        }
         else return res.redirect('/');
    }

    //пост запрос о создании компании
    async createExecutor(req,res){
      

        const { name_company, description,
             photo_link,  phone_number, email ,id_type_executor}=req.body;
             console.log(req.body)
             let filedata = req.file;
             console.log(req.file);
        if(!filedata)
            console.log("Ошибка при загрузке файла");
         else
             console.log("Файл загружен");
             
             const newExecutor = await pool.query(
                'insert into executor (login, password_,name_company, description,photo_link, email, phone_number, id_type_executor)'+
                'values(\'user\', \'user\',$1,$2,$3,$4,$5,$6)'+
                'returning *',[ name_company, description,
                    filedata.filename, email, phone_number,id_type_executor ]);
                   //res.json(newExecutor.rows[0]);
                  return res.redirect('/');
    
                }
                //гет запрос на просмотр информации о конкретной компании
                async getExecutorById(req, res) {
                    const id_executor = req.params.id_executor;
                    console.log(id_executor);
                    console.log(req.body);
                    const executor = await pool.query('select * from executor where id_executor = $1', [id_executor]);
                    const aria_list = await pool.query('select a.id_aria, a.name_aria from aria a inner join aria_list  al on a.id_aria=al.id_aria'
                    + ' inner join executor e on e.id_executor=al.id_executor where e.id_executor=$1',[id_executor]);
                    const service_list = await pool.query('select ls.id_list_services, s.name_services,  ls.price, s.id_services from services s inner join list_services ls on '+
                's.id_services=ls.id_services inner join executor e on e.id_executor=ls.id_executor where e.id_executor=$1',[id_executor]);
                    res.render('concrete_executor.html', {executor: executor.rows[0],aria_list:aria_list.rows,service_list:service_list.rows,session:req.session});
                }
                //гет запрос на получении списка компаний
                async getExecutors(req, res) {
                    const executors = await pool.query('select * from executor');
                    const type_executor = await pool.query('select * from type_executor');

                   // console.log(type_executor);
                   const aria= await pool.query('select * from aria');
   const services= await pool.query('select * from services');
   //console.log(type_executor);
    res.render('executor_list.html', {executors: executors.rows,type_executor: type_executor.rows, session:req.session, aria:aria.rows,services:services.rows});
                    
                }
                //удаление компании
                async deleteExecutor(req, res) {
                    const id_executor = req.params.id_executor;
                    await pool.query('delete from executor where id_executor = $1', [id_executor]);
                    return res.redirect('/');
                }
                //открытие форму для редактирования информации о компании
            async openFormUpdateExecutor(req,res){
                const id_executor = req.session.id_executor;
                const executor = await pool.query('select * from executor where id_executor = $1::int', [id_executor]);
                const aria =await pool.query('select * from aria');
                res.render('executor_update.html', {executor: executor.rows[0],session:req.session, aria:aria.rows});
            }
            
            async createService(req, res){
              const{name_service, price, id_executor}=req.body;
              const new_service = await pool.query(
                'insert into list_services (name_service,price,id-executor)'+
                'values($1,$2,$3)'+
                'returning *',[ name_service, price,id_executor ]);
            }
            //пост запрос на обновление ресурсов
            async updateExecutor(req, res) {
                
                const id_executor=req.session.id_executor;
                const { name_company, description,
                    photo_link,  phone_number, email}=req.body;
                    console.log(req.body)
                    let name;
                    let filedata = req.file;
                    console.log(req.file);
               if(!filedata)
                  { console.log("Ошибка при загрузке файла");
                    name= photo_link;
                    console.log(name);
                }

                else
                   { console.log("Файл загружен");
                   name=filedata.filename;
                   }
                    
                    const updatedExecutor = await pool.query('update executor set name_company = $1, description = $2, photo_link = $3,'
                    +' email = $4, phone_number = $5 ' +
                    'where id_executor = $6::int RETURNING *', [name_company, description, name, email, phone_number, Number(id_executor)]);        
                          //res.json(newExecutor.rows[0]);
                    return res.redirect('/executor_cabinet_');
            }
        

            async addAreaList(req, res){
                var ariaList = req.body.id_aria;
                if(!Array.isArray(ariaList)){
                    var tmp = ariaList;
                    ariaList=[];
                    ariaList.push(tmp);
                }
                console.log(ariaList);
                for(let i=0; i<ariaList.length; i++){
                    const arrList= await pool.query('insert into aria_list (id_executor, id_aria) values($1,$2)',[req.session.id_executor,ariaList[i]]);
                }
                return res.redirect('/executor_cabinet_');
            }              
            
            async deleteAreaList(req, res){
                var ariaList = req.body.id_aria;
                if(!Array.isArray(ariaList)){
                    var tmp = ariaList;
                    ariaList=[];
                    ariaList.push(tmp);
                }
                console.log(ariaList);
                for(let i=0; i<ariaList.length; i++){
                 await   pool.query('delete from aria_list where id_aria=$1 and id_executor=$2',[ariaList[i],req.session.id_executor]);
                }
                return res.redirect('/executor_cabinet_');
            }
            async addServiceList(req, res){
                const id_service=req.body.id_services;
                const price = req.body.price;

                const servList= await pool.query('insert into list_services (id_executor, id_services, price) values($1,$2,$3)'
                ,[req.session.id_executor,id_service,price]);
                
                return res.redirect('/executor_cabinet_');
            }       
            
            async addNewServiceList(req, res){
               const {name_services, price} = req.body;
               const id_service= await pool.query('insert into services (name_services) values($1) returning id_services',[name_services]);
               console.log(id_service.rows[0]);
                const servList= await pool.query('insert into list_services (id_executor, id_services, price) values($1,$2,$3)'
                ,[req.session.id_executor,id_service.rows[0].id_services,price]);
                
                return res.redirect('/executor_cabinet_');
            }  
            
            async updateServiceList(req,res){
                console.log('i\'m here');
                console.log(req.body);
                const id_services=req.body.id_services;
                const price = req.body.price;
                console.log(req.body.id_services);
                await pool.query('update list_services set price=$1 where id_services=$2 and id_executor=$3',[price,id_services,req.session.id_executor]);
                return res.redirect('/executor_cabinet_');
            }
            
            async delleteServiceList(req, res){
                var serviseList = req.body.id_services;
                if(!Array.isArray(serviseList)){
                    var tmp = ariaList;
                    serviceList=[];
                    serviceList.push(tmp);
                }
                for(let i=0; i<serviseList.length; i++){
                  await pool.query('delete from list_services where id_services=$1 and id_executor=$2',[serviseList[i],req.session.id_executor]);
                }
                return res.redirect('/executor_cabinet_');   
            }

async search(req,res){
   const {id_services, id_aria, price} = req.body;
   var id_executor=[];
   console.log(req.body);
   if(id_services!=0){

    if(id_aria!=0){
        if(price!=0){

            id_executor=await pool.query('select e.id_executor, e.name_company, e.description, e.phone_number, e.photo_link, e.email from executor e inner join aria_list al '+
            'on e.id_executor=al.id_executor inner join aria a on a.id_aria=al.id_aria '+
            'inner join list_services ls on ls.id_executor=e.id_executor where ls.id_services=$1 and al.id_aria=$2 and ls.price<=$3',
            [id_services,id_aria,price]);
            console.log(id_executor.rows);
        }
        else{
            id_executor=await pool.query('select e.id_executor, e.name_company, e.description, e.phone_number,e.photo_link, e.email from executor e inner join aria_list al '+
            'on e.id_executor=al.id_executor inner join aria a on a.id_aria=al.id_aria '+
            'inner join list_services ls on ls.id_executor=e.id_executor where ls.id_services=$1 and al.id_aria=$2',
            [id_services,id_aria]);
            console.log(id_executor.rows); 
        }
    }
    else{
        id_executor=await pool.query('select e.id_executor, e.name_company, e.description, e.phone_number, e.photo_link, e.email from executor e '+
        'inner join list_services ls on ls.id_executor=e.id_executor where ls.id_services=$1',
        [id_services]);
        console.log(id_executor.rows);
    }
   }

   else{
    if(id_aria!=0){
        if(price!=0){

            id_executor=await pool.query('select e.id_executor, e.name_company, e.description, e.phone_number, e.photo_link, e.email from executor e inner join aria_list al '+
            'on e.id_executor=al.id_executor inner join aria a on a.id_aria=al.id_aria '+
            'inner join list_services ls on ls.id_executor=e.id_executor where  al.id_aria=$1 and ls.price<=$2',
            [id_aria,price]);
            console.log(id_executor.rows);
        }
        else{
            id_executor=await pool.query('select e.id_executor, e.name_company, e.description, e.phone_number,e.photo_link, e.email from executor e inner join aria_list al '+
            'on e.id_executor=al.id_executor inner join aria a on a.id_aria=al.id_aria where  al.id_aria=$1',
            [id_aria]);
            console.log(id_executor.rows); 
        }
    }
    else{
        if(price!=0)
        {id_executor=await pool.query('select e.id_executor, e.name_company, e.description, e.phone_number, e.photo_link, e.email from executor e '+
        'inner join list_services ls on ls.id_executor=e.id_executor where ls.price<=$1',
        [price]);
        console.log(id_executor.rows);
         }
         else{
            id_executor=await pool.query('select e.id_executor, e.name_company, e.description, e.phone_number, e.photo_link, e.email from executor e',
        [price]);
         }
    }
   
   }
   const type_executor = await pool.query('select * from type_executor');
                   // console.log(type_executor);
    const aria= await pool.query('select * from aria');
   const services= await pool.query('select * from services');
   //console.log(typ
   res.render('executor_list.html', {executors:id_executor.rows, type_executor:type_executor.rows, aria:aria.rows, services:services.rows});
}
async addOrder(req,res){
        const { fio, email, phone_number, text_order, id_executor}=req.body;
        var id_list_services = req.body.id_list_services;
        var date = new Date();
        if(!Array.isArray(id_list_services)){
            var tmp = id_list_services;
            id_list_services=[];
            id_list_services.push(tmp);
        }
        const id_orders=   await pool.query('insert into orders (fio, email, phone_number, text_orders, id_executor, data_orders) values '+
        '($1,$2,$3,$4,$5,$6) returning id_orders', [fio,email,phone_number,text_order,id_executor, date]);
        for(let i=0; i<id_list_services.length; i++){
            await   pool.query('insert into orders_list (id_orders,id_list_services) values ($1,$2)',[id_orders.rows[0].id_orders,id_list_services[i]]);
           }
        const executor = await pool.query('select * from executor where id_executor = $1', [id_executor]);
        const aria_list = await pool.query('select a.id_aria, a.name_aria from aria a inner join aria_list  al on a.id_aria=al.id_aria'
                    + ' inner join executor e on e.id_executor=al.id_executor where e.id_executor=$1',[id_executor]);
         const service_list = await pool.query('select ls.id_list_services, s.name_services,  ls.price, s.id_services from services s inner join list_services ls on '+
                's.id_services=ls.id_services inner join executor e on e.id_executor=ls.id_executor where e.id_executor=$1',[id_executor]);
        res.render('concrete_executor.html', {executor: executor.rows[0],aria_list:aria_list.rows,service_list:service_list.rows,session:session}); 
}

       

async orders(req,res){
    var orders = await pool.query('select o.id_orders, o.fio, o.data_orders, o.text_orders, array_agg(s.name_services) as list_orders, sum(ls.price)  as summ  from '+
    'orders o inner join orders_list lo on o.id_orders=lo.id_orders '+
    'inner join list_services ls on ls.id_list_services=lo.id_list_services '+
    'inner join services s on s.id_services=ls.id_services '+
    'where o.id_executor=$1 group by 1,2,3,4',[req.session.id_executor]);
    console.log(req.session.id_executor);
    console.log(orders.rows);
   
    for(var i =0; i<orders.rowCount;i++){
        var date = new Date(orders.rows[i].data_orders).toLocaleDateString();
        orders.rows[i].data_orders=date;
    }

    res.render('list_orders.html',{orders:orders.rows, session:req.session});
   
}
}
    
        



module.exports= new ExecutorController();