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

app.get("/:sub", async (req, res) => {
  const sub = req.params.sub
  try {
    const dbres = await client.query('select * from users where sub = $1',[sub]);
    return res.json(dbres.rowCount);
  } catch (error) {
    console.error(error.message)
  }
  
});

//view cv for specific user
app.get("/viewCV/:sub", async (req,res) => {
  const sub = req.params.sub
  try {
    const queryValues = [sub]
    const userQuery = "select * from users where sub = $1"
    const userQRes = await client.query(userQuery,queryValues)
    let user = userQRes.rows[0]

    const edQuery = "select ed_id,institution_name,start_date,end_date,qualification_level,grade,subject from education where sub = $1 order by end_date desc"
    const edQRes = await client.query(edQuery,queryValues)
    user.education = edQRes.rows

    const workQuery = "select work_id,company_name,role,start_date,end_date,responsibilities from work_experience where sub = $1 order by end_date desc"
    const workQRes = await client.query(workQuery,queryValues)
    user.work = workQRes.rows

    const skillQuery = "select skill_id,skill from skills where sub = $1"
    const skillQRes = await client.query(skillQuery,queryValues)
    user.skill = skillQRes.rows

    const interestQuery = "select interest_id,interest from interests where sub = $1"
    const interestQRes = await client.query(interestQuery,queryValues)
    user.interest = interestQRes.rows

    const bioQuery = "select bio_id,bio from bio where sub = $1"
    const bioQRes = await client.query(bioQuery,queryValues)
    user.bio = bioQRes.rows

    const softwareQuery = "select software_id,software from software where sub = $1"
    const softwareQRes = await client.query(softwareQuery,queryValues)
    user.software = softwareQRes.rows
    
    res.status(201).json({
      status: "success",
      data:{
        userData: user
      }
    }) 
  }
  catch (error) {
    console.error(error.message)
  }
})


//update data


//create details for cv
app.post("/create/personal-details", async (req,res) => {
  const {firstName,surname,dob,email,mobile,address,sub} = req.body
  try {
    const queryValues = [firstName,surname,dob,email,mobile,address,sub]
    const query = "INSERT into users(first_name,surname,dob,email,mobile,address,sub) values ($1,$2,$3,$4,$5,$6,$7)"
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
app.get("/education/:sub", async (req, res) => {
  const sub = req.params.userID
  try {
    const queryValues = [sub]
    const query = "SELECT * from education where sub = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create education details for cv
app.post("/create/education/:sub", async (req,res) => {
  const sub = req.params.sub
  const {institutionName,startDate,endDate,qualificationLevel,grade,subject} = req.body
  try {
    const queryValues = [sub,institutionName,startDate,endDate,qualificationLevel,grade,subject]
    const query = "INSERT into education(sub,institution_name,start_date,end_date,qualification_level,grade,subject) values ($1,$2,$3,$4,$5,$6,$7)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${sub}'s education to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})


 // view work for specific user
 app.get("/work/:sub", async (req, res) => {
  const sub = req.params.sub
  try {
    const queryValues = [sub]
    const query = "SELECT * from work_experience where sub = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create work details for cv
app.post("/create/work/:sub", async (req,res) => {
  const sub = req.params.sub
  const {companyName,role,startDate,endDate,responsibilities} = req.body
  try {
    const queryValues = [sub,companyName,role,startDate,endDate,responsibilities]
    const query = "INSERT into work_experience(sub,company_name,role,start_date,end_date,responsibilities) values ($1,$2,$3,$4,$5,$6)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${sub}'s work experience to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})

// view skills for specific user
app.get("/skills/:sub", async (req, res) => {
  const sub = req.params.sub
  try {
    const queryValues = [sub]
    const query = "SELECT * from skills where sub = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create skills for cv
app.post("/create/skills/:sub", async (req,res) => {
  const sub = req.params.sub
  const {skill} = req.body
  try {
    const queryValues = [sub,skill]
    const query = "INSERT into skills(sub,skill) values ($1,$2)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${sub}'s skills to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})

// view interests for specific user
app.get("/interests/:sub", async (req, res) => {
  const sub = req.params.sub
  try {
    const queryValues = [sub]
    const query = "SELECT * from interests where sub = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create skills for cv
app.post("/create/interests/:sub", async (req,res) => {
  const sub = req.params.sub
  const {interest} = req.body
  try {
    const queryValues = [sub,interest]
    const query = "INSERT into interests(sub,interest) values ($1,$2)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${sub}'s interests to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})

// view bio for specific user
app.get("/bio/:sub", async (req, res) => {
  const sub = req.params.sub
  try {
    const queryValues = [sub]
    const query = "SELECT * from bio where sub = $1"
    const dbres = await client.query(query,queryValues);
    res.json(dbres.rows)
  } catch (error) {
    console.error(error.message)
  }
  ;
});


//create bio for cv
app.post("/create/bio/:sub", async (req,res) => {
  const sub = req.params.sub
  const {bio} = req.body
  try {
    const queryValues = [sub,bio]
    const query = "INSERT into bio(sub,bio) values ($1,$2)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${sub}'s bio to their CV'`
      }
    })
  } catch (error) {
    console.error(error.message)
  }
})

app.post("/create/software/:sub", async (req,res) => {
  const sub = req.params.sub
  const {software} = req.body
  try {
    const queryValues = [sub,software]
    const query = "INSERT into software(sub,software) values ($1,$2)"
    await client.query(query,queryValues)
    res.status(201).json({
      status: "success",
      data:{
        message: `Added "${sub}'s software skills to their CV'`
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
})
