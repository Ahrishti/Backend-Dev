const express = require("express");
const fileHandler = require("./modules/fileHandler");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// DASHBOARD
app.get("/", async (req, res) => {
  const employees = await fileHandler.read();
  res.render("index", { employees });
});

// ADD PAGE
app.get("/add", (req, res) => {
  res.render("add");
});

// ADD SUBMIT
app.post("/add", async (req, res) => {
  const employees = await fileHandler.read();

  const newEmployee = {
    id: Date.now(),
    name: req.body.name,
    department: req.body.department,
    salary: Number(req.body.salary),
    image: req.body.image
  };

  employees.push(newEmployee);
  await fileHandler.write(employees);
  res.redirect("/");
});

// EDIT PAGE
app.get("/edit/:id", async (req, res) => {
  const employees = await fileHandler.read();
  const employee = employees.find(e => e.id == req.params.id);
  res.render("edit", { employee });
});

// EDIT SUBMIT
app.post("/edit/:id", async (req, res) => {
  let employees = await fileHandler.read();

  employees = employees.map(e =>
    e.id == req.params.id
      ? {
          ...e,
          name: req.body.name,
          department: req.body.department,
          salary: Number(req.body.salary)
        }
      : e
  );

  await fileHandler.write(employees);
  res.redirect("/");
});

// DELETE
app.get("/delete/:id", async (req, res) => {
  let employees = await fileHandler.read();
  employees = employees.filter(e => e.id != req.params.id);
  await fileHandler.write(employees);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
