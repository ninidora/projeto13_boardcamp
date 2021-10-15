import express from 'express';
import pg from 'pg';
import joi from 'joi';

const roleSettings = {
  user: 'bootcamp_role',
  password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
  host: 'localhost',
  port: 5432,
  database: 'boardcamp'
};

const categoriesSchema = joi.object({
  name: joi.string().min(3).max(28).required(),
})

const { Pool } = pg;
const connection = new Pool(roleSettings);
const app = express();
app.use(express.json());


app.get('/categories', async (req, res) => {
  try {
  const categoriesPromise = await connection.query('SELECT * FROM categories;');
  console.log(categoriesPromise);
  res.status(200).send(categoriesPromise.rows);
  } catch(error) {
    console.log('ERRO!:', error);
  }
});

app.post('/categories', async (req, res) => {
  const categoryName = req.body;
  const joiResult = categoriesSchema.validate(categoryName);
  if (joiResult.error) {
    console.log(joiResult.error.name,":",joiResult.error.message);
    res.status(400).send('Nome da categoria deve conter de 03 a 28 caracteres');
  }
  else {
    console.log('passed joi');
    try {
      const categoriesPromise = await connection.query('SELECT * FROM categories;');
    } catch {
      console.log('catch, error');
    }
  
  }
  res.status(501).send('request closed');

});














app.listen(4000, () => { console.log('Server listening, :4000') });