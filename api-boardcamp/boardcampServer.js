import express from 'express';
import pg from 'pg';

const { Pool } = pg;
const connection = new Pool({
    user: 'bootcamp_role',
    password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp'
  });

  const app = express();
  app.use(express.json());

  app.get('/categories', (req, res) => {
    const query = connection.query('SELECT * FROM categories;');
    query.then(result => { 
      res.status(200).send(result.rows); });
  });

  app.listen(4000, () => {console.log('Server listening, :4000.')});