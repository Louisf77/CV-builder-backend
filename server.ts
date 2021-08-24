import { Client } from "pg";
import { config } from "dotenv";
import express, { query } from "express";
import cors from "cors";

config(); 
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); 
app.use(cors())

const client = new Client(dbConfig);
client.connect();

app.get("/", async (req, res) => {
  const dbres = await client.query('select * from users');
  res.json(dbres.rows);
});

//view cv

//update data


//create details for cv
app.post("/create/personal-details", async (req,res) => {
  const {firstName,surname,DOB,email,mobile} = req.body
  try {
    const queryValues = [firstName,surname,DOB,email,mobile]
    const query = "INSERT into users(first_name,surname,dob,email,mobile) values ($1,$2,$3,$4,$5)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${firstName}'s details to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})

 // view education for specific user
app.get("/education/:userID", async (req, res) => {
  const userID = req.params.userID
  try {
    const queryValues = [userID]
    const query = "SELECT * from education where user_id = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create education details for cv
app.post("/create/education/:userID", async (req,res) => {
  const userID = req.params.userID
  const {institutionName,startDate,endDate,qualificationLevel,grade} = req.body
  try {
    const queryValues = [userID,institutionName,startDate,endDate,qualificationLevel,grade]
    const query = "INSERT into education(user_id,institution_name,start_date,end_date,qualification_level,grade) values ($1,$2,$3,$4,$5,$6)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${userID}'s education to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})


 // view work for specific user
 app.get("/work/:userID", async (req, res) => {
  const userID = req.params.userID
  try {
    const queryValues = [userID]
    const query = "SELECT * from work_experience where user_id = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create work details for cv
app.post("/create/work/:userID", async (req,res) => {
  const userID = req.params.userID
  const {companyName,role,startDate,endDate,responsibilities} = req.body
  try {
    const queryValues = [userID,companyName,role,startDate,endDate,responsibilities]
    const query = "INSERT into work_experience(user_id,company_name,role,start_date,end_date,responsibilities) values ($1,$2,$3,$4,$5,$6)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${userID}'s work experience to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})

// view skills for specific user
app.get("/skills/:userID", async (req, res) => {
  const userID = req.params.userID
  try {
    const queryValues = [userID]
    const query = "SELECT * from skills where user_id = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create skills for cv
app.post("/create/skills/:userID", async (req,res) => {
  const userID = req.params.userID
  const {skill} = req.body
  try {
    const queryValues = [userID,skill]
    const query = "INSERT into skills(user_id,skill) values ($1,$2)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${userID}'s skills to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})

// view interests for specific user
app.get("/interests/:userID", async (req, res) => {
  const userID = req.params.userID
  try {
    const queryValues = [userID]
    const query = "SELECT * from interests where user_id = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create skills for cv
app.post("/create/interests/:userID", async (req,res) => {
  const userID = req.params.userID
  const {interest} = req.body
  try {
    const queryValues = [userID,interest]
    const query = "INSERT into interests(user_id,interest) values ($1,$2)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${userID}'s interests to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})

// view bio for specific user
app.get("/bio/:userID", async (req, res) => {
  const userID = req.params.userID
  try {
    const queryValues = [userID]
    const query = "SELECT * from bio where user_id = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create bio for cv
app.post("/create/bio/:userID", async (req,res) => {
  const userID = req.params.userID
  const {bio} = req.body
  try {
    const queryValues = [userID,bio]
    const query = "INSERT into bio(user_id,bio) values ($1,$2)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${userID}'s bio to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})


//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
