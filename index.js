const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json()); //req.body


//ROUTES:

//GET ALL TODOS
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//GET A TODO
app.get("/todos/:id", async (req, res) => {
    const {id} = req.params; //destructing 
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//POST A TODO
app.post("/todo", async (req, res) => {
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *",
        [description]);

        res.json(newTodo.rows[0])
    } catch(err){
        console.error(err.message);
    }
});

//UPDATE A TODO
app.put("/todos/:id", async (req, res) =>{
    try {
        const {id} = req.params; //use the WHERE
        const {description} = req.body; //SET

        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
        );
        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//DELETE A TODO
app.delete("/todos/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1", [id]
        );

        res.json("Todo was successfully deleted!");
    } catch (error) {
        console.error(err.message);
    }
});

app.listen(3000, () => {console.log(`sever is listening at 3000`)});
 