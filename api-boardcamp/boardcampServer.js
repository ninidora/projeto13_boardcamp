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

const queriesSchema = joi.object({
  categoryName: joi.string().alphanum().required(),
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

/*
app.post('/categories', async (req, res) => {
  
  

});
*/
const testJoi = {categoryName: '' };
queriesSchema.validate(testJoi).error ? console.log('erro') : console.log('passed');
console.log('joi:', queriesSchema.validate(testJoi).error);















app.listen(4000, () => { console.log('Server listening, :4000.') });