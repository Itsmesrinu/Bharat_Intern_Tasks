
const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
//const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const bodyParser = require('body-parser');

const PORT = 3000;

const path = require("path");

const static_path =path.join(__dirname,"/public")
app.use(express.static(static_path))

//const static_path2 =path.join(__dirname,"/public/popup.js")
//app.use(express.static(static_path2))

//console.log(path.join(__dirname,"/public/popup.js"))


//const jwt = require("jsonwebtoken");
//var nodemailer = require("nodemailer");



//const JWT_SECRET ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haWx0b21yc3Jpbml2YXN1bHVAZ21haWwuY29tIiwiaWF0IjoxNzAyMTA5OTEwLCJleHAiOjE3MDIxMTA4MTB9.TI6n07etuv_U5Auioe3iKrhJRIn7gyC6vVKgbGjdgN";

const mongoUrl =
'mongodb+srv://Sreenivasulu_Chowdam:Sreenu%402004@cluster1.usezpl8.mongodb.net/';



mongoose
  .connect(mongoUrl).then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

  const expenseSchema = new mongoose.Schema({
    category: String,
    amount: Number,
    date: String,
    time: String,
  });
  
  const Expense = mongoose.model('Expenses_money_tracker_app', expenseSchema);
  
  app.use(bodyParser.json());

  app.post('/addExpense', async (req, res) => {
    try {
        const { category, amount, date, time } = req.body;
        const expense = new Expense({ category, amount, date, time });
        await expense.save();
      
        //res.successPopup('Expense added successfully');
        //res.redirect("/addedExpense");
        res.status(201).json({ message: 'Expense added successfully' });
        
    } catch (error) {
        console.error(error);
        //res.errorPopup('Failed to add expense');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
  // Implement additional endpoints for fetching and deleting expenses
  
  app.get('/getExpenses', async (req, res) => {
    try {
      const expenses = await Expense.find();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


 app.delete('/deleteExpense', async (req, res) => {
    try {
      const { category, amount, date , time } = req.body;
      
      // Assuming you want to delete an expense matching all three criteria
      const deletedExpense = await Expense.findOneAndDelete({ category, amount, date ,time });
  
      if (deletedExpense) {
        res.json({ message: 'Expense deleted successfully' });  
      } else {
        res.status(404).json({ error: 'Expense not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  
  
  /*app.delete('/deleteExpense/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); */

/*
// Example route
app.get('/viewHistory', (req, res) => {
  // Logic to retrieve and send history data to the client
  const historyData = getHistoryData(); // Implement this function to get history data
  res.json({ history: historyData });
});
app.post('/openHistory', (req, res) => {
  console.log('View History: Open');
  // Additional logic for opening history
  res.send('History opened successfully');
});

app.post('/closeHistory', (req, res) => {
  console.log('View History: Close');
  // Additional logic for closing history
  res.send('History closed successfully');
});

app.post('/reloadHistory', (req, res) => {
  console.log('View History: Reload');
  // Additional logic for reloading history
  res.send('History reloaded successfully');
});
*/




/*app.use((req, res, next) => {
  res.locals.popupMessage = res.locals.popupMessage || null;
  res.locals.popupType = res.locals.popupType || null;
  next();
});*/

// Update your route for added_Expense
//app.get('/added_Expense', (req, res) => {
   /// res.sendFile(__dirname + "/public/added_Expense.html");
//}); 
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

