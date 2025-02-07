import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import "./db.js";
import {Category, User, Account, Goal, Transaction, sequelize} from "./db.js";

import {Op} from "sequelize";

process.on('unhandledRejection', function(reason, p){
  console.error('Произошла ошибка перехваченая глобальным хендлером', reason, p)

  return true;
});




const isPull = process.argv.includes('--pull')

const isAlter = process.argv.includes('--alter')


const doHandler = (callback) => {

  return async (request, response) => {
    try {
      return await callback(request, response)
    }catch (e) {
      console.error('Произошла ошибка', e);


      return response.sendStatus(500);
    }
  }
}


async function createUserAccounts(user_id) {
  await Account.create({
    name: "Наличные",
    balance: 0,
    user_id,
  });
}

async function createUserCategories(user_id) {
  // Создание пользователей
  let type1 = [
    'Заработная плата',
    'Хобби',
    'Продажа',
    'Питание',
    'Транспорт',
    'Здоровье',
  ]

  let type2 = [
    {
      id: 1,
      name: 'Питание'
    },
    {
      id: 2,
      name: 'Транспорт',
    },
    {
      id: 3,
      name: 'Здоровье',
    },
    {
      id: 4,
      name: 'Красота',
    },
    {
      id: 5,
      name: 'Услуги',
    },
    {
      id: 6,
      name: 'Развлечения',
    },
    {
      id: 7,
      name: 'Одежда и обувь',
    },
    {
      id: 8,
      name: 'Образование и развитие',
    },
    {
      id: 8,
      name: 'Благотворительность и подарки',
    },
  ]

  for (let name of type1)
    await Category.create({
      name: name,
      user_id,
      type: 1
    });

  for (let name of type2)
    await Category.create({
      name: name.name,
      type: 2,
      user_id,
    });
}

// async function seeds() {
//   try {
//     await sequelize.sync({ force: true });
//
//     // Создание пользователей
//     let list = [
//       'Заработная плата',
//       'Хобби',
//       'Продажа',
//       'Питание',
//       'Транспорт',
//       'Здоровье',
//
//     ]
//
//     for (let name of list)
//       await Category.create({
//         name
//       })
//
//   } catch (error) {
//     console.error("Ошибка:", error);
//   }
// }


// sequelize.sync({alter: true})

if (isPull)
  sequelize.sync({force: true})
if (isAlter)
  sequelize.sync({alter: true})




const app = express()

app.use((err, req, res, next) => {
  console.log('Ошибка перехвачена мидлваром ', err);
  console.error(err.stack)
  return res.status(500).send('Something broke!')
})

app.use(express.static('public'))
app.use(cors())
app.use(express.json())


const log = console.log;


const transformDBResponse = (data) => {
  return data.map(el => el.dataValues);
}

const encode = (data) => JSON.stringify(data)


app.get('/accounts', async (request, response) => {
  const transactions =  await Account.findAll();

  return response.send(transformDBResponse(transactions));
});

app.post('/account', async (request, response) => {
  const { name, balance } = request.body;

  let user = await Account.create( {name, balance})

  return response.send(Boolean(user));
});


app.get('/categoryIn', async (request, response) => {
  const transactions =  await Category.findAll({
    where: {
      type: 1
    }
  });

  return response.send(transformDBResponse(transactions));
})


app.get('/categoryOut', async (request, response) => {
  const transactions =  await Category.findAll({
    where: {
      type: 2
    }
  });

  return response.send(transformDBResponse(transactions));
})



app.get('/category', async (request, response) => {
  const transactions =  await Category.findAll();

  return response.send(transformDBResponse(transactions));
})

app.post('/category', async (request, response) => {
  const { sum } = request.body

  let user = await Transaction.create( {date: Date.now(), description: '', amount: sum, type: 1} )

  return response.send(Boolean(user));
})

app.get('/goals', async (request, response) => {
  const transactions =  await Goal.findAll();

  return response.send(transformDBResponse(transactions));
});

app.post('/goal', async (request, response) => {
  const { name, amount, deadline, startDate } = request.body

  log(deadline, startDate);

  let user = await Goal.create( {name: name,  amount, deadline, startDate})

  return response.send(Boolean(user));
});

app.get('/transactions', async (request, response) => {
  const where = {};

  if (Boolean(request.query.account)) {
    where.account_id = request.query.account
  }

  if (Boolean(request.query.category)) {
    where.category_id = request.query.category
  }

  if (Boolean(request.query.type)) {
    where.type = request.query.type
  }

  // if (Boolean(request.query.search)) {
  //   where[Op.like] = "%" + request.query.search + "%";
  //   // where.category_id = request.query.category
  // }



  const transactions =  await Transaction.findAll({
    where,
    include: [Category,Account],
  });

  
  return response.send(transformDBResponse(transactions));
})



app.post('/transaction', async (request, response) => {
  const {  account_id, amount,description, category_id, type} = request.body;


  log(account_id, category_id);

  let user = await Transaction.create( {date: Date.now(),
    description: description, account_id, category_id, amount: amount, type} )

  return response.send(Boolean(user));
})

app.post('/register', doHandler(async (request, response) => {
  const { email: email, name: name, password: password } = request.body

  let user = await User.create( {email, name, password } )

  createUserCategories(user.id);
  createUserAccounts(user.id);

  let token = jwt.sign( { email: email }, "2315", { expiresIn: "30m" } )

  response.send( { token } )
}))


app.post('/login', doHandler(async (request, response) => {
  const { email, password } = request.body

  let user = await User.findOne( {where: {email: email}} );

  if(user == null) {
      return response.sendStatus(404)
  }

  if(user.password != password)
      return response.sendStatus(400)

  let token = jwt.sign( { email: email }, "2315", { expiresIn: "30m" } );

  response.send( { token } )
}))

app.listen(3000, () => {
  console.log('express started at 3000')
})
