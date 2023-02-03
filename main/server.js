require("dotenv").config();
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// Set up Handlebars as the templating engine
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up body-parser to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the blog post model
const BlogPost = sequelize.define("blog_post", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

// Route for displaying the homepage
app.get("/", (req, res) => {
  BlogPost.findAll().then((posts) => {
    res.render("home", { posts });
  });
});

// Route for creating a new blog post
app.post("/create", (req, res) => {
  BlogPost.create({
    title: req.body.title,
    content: req.body.content,
  }).then((post) => {
    res.redirect("/");
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Blog site listening on port 3000");
});
