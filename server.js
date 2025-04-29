// // Start the Express server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
require('dotenv').config();  // Load environment variables
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

// Import Pool from pg (PostgreSQL client)
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5009;

app.use(cors());
app.use(express.json());

// Pool Setup (for direct PostgreSQL connection)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.SUPABASE_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  }
});

// Test PostgreSQL Connection
pool.connect()
  .then(() => console.log("Connected to database!"))
  .catch((err) => console.error("DB connection failed:", err));

// Sequelize Setup (for Sequelize ORM)
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.DB_NAME,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});


// Instructor Model
const Instructor = sequelize.define('Instructor', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
  role: DataTypes.TEXT,
  age: DataTypes.INTEGER,
}, {
  tableName: 'instructor',
  timestamps: false,
});

// Student Model
const Student = sequelize.define('Student', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: DataTypes.TEXT,
  address: DataTypes.TEXT,
  phone: DataTypes.TEXT,
  enrollment_date: DataTypes.DATE,
  age: DataTypes.INTEGER,
  gender: DataTypes.TEXT,
  email: DataTypes.TEXT,
  active: DataTypes.TEXT,
}, {
  tableName: 'student',
  timestamps: false,
});

// Course Model
const Course = sequelize.define('Course', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
  price: DataTypes.INTEGER, 
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  instructor_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'instructor',
      key: 'id'
    }
  }
}, {
  tableName: 'course',
  timestamps: false,
});

// Enrollment Model
const Enrollment = sequelize.define('Enrollment', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  student_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'student',
      key: 'id'
    }
  },
  course_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'course',
      key: 'id'
    }
  },
  status: DataTypes.TEXT,
}, {
  tableName: 'enrollment',
  timestamps: false,
});


// FormData Model
const FormData = sequelize.define('FormData', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  fulllname: {
    type: DataTypes.TEXT
  },
  email: {
    type: DataTypes.TEXT
  },
  phone: {
    type: DataTypes.INTEGER
  },
  course: {
    type: DataTypes.TEXT
  },
  course_id: {
    type: DataTypes.BIGINT
  },
  gender: {
    type: DataTypes.TEXT
  },
  age: {
    type: DataTypes.BIGINT
  },
  cardnumber: {
    type: DataTypes.BIGINT
  },
  ExpirationDate: {
    type: DataTypes.DATE
  },
  CVV: {
    type: DataTypes.BIGINT
  },
  name_on_card: {
    type: DataTypes.TEXT
  },
  cash: {
    type: DataTypes.BOOLEAN
  }
}, {
  tableName: 'formdata',
  timestamps: false, // Only add this if your table doesn't have createdAt/updatedAt
});





















// Same as your existing code...

// Route to get instructors
app.get("/instructors", async (req, res) => {
  try {
    const instructors = await Instructor.findAll();
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new instructor
app.post("/instructors", async (req, res) => {
  const { name, email, role, age } = req.body;
  try {
    const newInstructor = await Instructor.create({ name, email, role, age });
    res.status(201).json(newInstructor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update an instructor
app.put("/instructors/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, role, age } = req.body;
  try {
    const instructor = await Instructor.findByPk(id);
    if (instructor) {
      instructor.name = name || instructor.name;
      instructor.email = email || instructor.email;
      instructor.role = role || instructor.role;
      instructor.age = age || instructor.age;
      await instructor.save();
      res.json(instructor);
    } else {
      res.status(404).json({ error: "Instructor not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete an instructor
app.delete("/instructors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const instructor = await Instructor.findByPk(id);
    if (instructor) {
      await instructor.destroy();
      res.status(200).json({ message: "Instructor deleted successfully" });
    } else {
      res.status(404).json({ error: "Instructor not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
















// Route to get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new student
app.post("/students", async (req, res) => {
  const { name, address, phone, enrollment_date, age, gender, email, active } = req.body;
  try {
    const newStudent = await Student.create({ name, address, phone, enrollment_date, age, gender, email, active });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update a student
app.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, enrollment_date, age, gender, email, active } = req.body;
  try {
    const student = await Student.findByPk(id);
    if (student) {
      student.name = name || student.name;
      student.address = address || student.address;
      student.phone = phone || student.phone;
      student.enrollment_date = enrollment_date || student.enrollment_date;
      student.age = age || student.age;
      student.gender = gender || student.gender;
      student.email = email || student.email;
      student.active = active || student.active;
      await student.save();
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a student
app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (student) {
      await student.destroy();
      res.status(200).json({ message: "Student deleted successfully" });
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});










app.get("/form", async (req, res) => {
  try {
    const formDataEntries = await FormData.findAll(); // Retrieve all records from formdata table
    res.status(200).json(formDataEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.post("/form", async (req, res) => {
  const {
    fulllname,
    email,
    phone,
    course,
    course_id,
    gender,
    age,
    cardnumber,
    ExpirationDate,
    CVV,
    name_on_card,
    cash
  } = req.body;

  try {
    const newFormEntry = await FormData.create({
      fulllname,
      email,
      phone,
      course,
      course_id,
      gender,
      age,
      cardnumber,
      ExpirationDate,
      CVV,
      name_on_card,
      cash
    });

    res.status(201).json(newFormEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});














app.get("/enrollments", async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll();
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
