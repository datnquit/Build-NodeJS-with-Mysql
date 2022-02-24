const sql = require("./db");

const Todo = function(todo){
    this.title = todo.title;
    this.description = todo.description;
    this.published = todo.published;
};

Todo.create = (newTodo, result) => {
    sql.query("INSERT INTO todo SET ?", newTodo, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created todo: ", { id: res.insertId, ...newTodo });
        result(null, { id: res.insertId, ...newTodo });
    });
};
Todo.findById = (id, result) => {
    sql.query(`SELECT * FROM todo WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found todo: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found todo with the id
        result({ kind: "not_found" }, null);
    });
};
Todo.getAll = (title, result) => {
    let query = "SELECT * FROM todo";
    if (title) {
        query += ` WHERE title LIKE '%${title}%'`;
    }
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("todo: ", res);
        result(null, res);
    });
};
Todo.getAllPublished = result => {
    sql.query("SELECT * FROM todo WHERE published=true", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("todo: ", res);
        result(null, res);
    });
};
Todo.updateById = (id, todo, result) => {
    sql.query(
        "UPDATE todo SET title = ?, description = ?, published = ? WHERE id = ?",
        [todo.title, todo.description, !todo.published ? false : true, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                // not found todo with the id
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("updated todo: ", { id: id, ...todo });
            result(null, { id: id, ...todo });
        }
    );
};
Todo.remove = (id, result) => {
    sql.query("DELETE FROM todo WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            // not found todo with the id
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("deleted todo with id: ", id);
        result(null, res);
    });
};
Todo.removeAll = result => {
    sql.query("DELETE FROM todo", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log(`deleted ${res.affectedRows} todo`);
        result(null, res);
    });
};
module.exports = Todo;