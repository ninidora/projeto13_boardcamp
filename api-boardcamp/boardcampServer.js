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
});
const gamesSchema = joi.object({
  name: joi.string().max(28),
});

const { Pool } = pg;
const connection = new Pool(roleSettings);
const app = express();
app.use(express.json());


app.get('/categories', async (req, res) => {
  try {
    const categoriesPromise = await connection.query('SELECT * FROM categories;');
    res.status(200).send(categoriesPromise.rows);
  } catch (error) {
    console.log('erro na SELECT query', error);
  }
});

app.post('/categories', async (req, res) => {
  const newCategoryName = req.body;
  const joiResult = categoriesSchema.validate(newCategoryName);
  if (joiResult.error) {
    console.log(joiResult.error.name, ":", joiResult.error.message);
    res.status(400).send('Nome da categoria deve conter de 03 a 28 caracteres');
  }
  else {
    console.log('passed joi');
    try {
      const categoriesPromise = await connection.query('SELECT * FROM categories;');
      const categoryNames = categoriesPromise.rows.map((element) => element.name);

      if (categoryNames.includes(newCategoryName.name)) {
        res.status(409).send(`categoria '${newCategoryName.name}' já existente`);
      }
      else {
        try {
          const newCategoryPromise = await connection.query(`INSERT INTO categories (name) VALUES ($1);`, [newCategoryName.name]);
          res.sendStatus(201);
          console.log('nova categoria cadastrada');
        } catch (error) {
          console.log('erro na INSERT query', error);
        }
      }
    } catch (error) {
      console.log('erro na SELECT query', error);
    }
  }
});

app.get('/games', async (req, res) => {
  console.log('>>query :', req.query);


  if (req.query.name === undefined) {
    try {
      const gamesPromise = await connection.query(`
      SELECT
        games.*,
        categories.name AS "categoryName"
      FROM games
      JOIN categories
        ON games."categoryId" = categories.id;`);
      console.log(gamesPromise);
      res.status(200).send(gamesPromise.rows);
    } catch (error) {
      console.log('erro na SELECT query', error);
    }
  }
  else {
    const searchName = req.query.name + "%";
    const joiResult = gamesSchema.validate( {name: searchName} );
    if (joiResult.error) {
      console.log(joiResult.error.name, ":", joiResult.error.message);
      res.status(400).send('CORRIGIR ESTA MSG DE ERRO');
    }
    else {
      try {
        const searchPromise = await connection.query(`
        SELECT
          games.*,
          categories.name AS "categoryName"
        FROM games
        JOIN categories
          ON games."categoryId" = categories.id
        WHERE games.name iLIKE $1;`, [searchName]);
        console.log(searchPromise);
        res.status(200).send(searchPromise.rows);
      }
      catch (error) {
        console.log('erro na SELECT pesquisa', error);
        res.status(400).send(' - - -');
      }
    }
  }
});

app.listen(4000, () => { console.log('Server listening, :4000') });