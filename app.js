const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());

// POST /assignments
app.post("/assignments", async (req, res) => {
    try {
        const { title, deadline } = req.body;

        const result = await pool.query(
            "INSERT INTO assignments (title, deadline) VALUES ($1, $2) RETURNING *",
            [title, deadline]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /assignments
// GET /assignments
app.get("/assignments", async (req, res) => {
    try {
        const submitted = req.query.submitted;

        if (submitted === "true") {
            const result = await pool.query(
                "SELECT * FROM assignments WHERE submitted = $1 ORDER BY id DESC",
                [true]
            );

            return res.status(200).json(result.rows);
        }

        const result = await pool.query(
            "SELECT * FROM assignments ORDER BY id DESC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /assignments/:id
app.patch("/assignments/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            "UPDATE assignments SET submitted = true WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /assignments/:id
app.delete("/assignments/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            "DELETE FROM assignments WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.status(200).json({
            message: "Assignment deleted successfully",
            assignment: result.rows[0]
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});