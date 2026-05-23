// server.js
import express from 'express';
import courses from "./course.js";
const app = express();
const PORT = 3000;

app.use(express.json())

app.use(logRequest);

// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses', validateQueryParams, (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;
    // Implementing the filter logic
    // Hint: Use the filter method to filter the courses array based on the provided criteria

    const FilterCourcses = courses.filter(course => {

        if (course.department !== dept) return false;
        if (level && course.level !== level) return false;
        if (minCredits !== undefined && course.credits < minCredits) return false;
        if (maxCredits !== undefined && course.credits > maxCredits) return false;
        if (semester && course.semester !== semester) return false;
        if (instructor && !course.instructor.toLowerCase().includes(instructor.toLowerCase())) return false;
        return true;
    });
    
    res.json(FilterCourcses);
});

function logRequest(req, res, next) {
    console.log({
        method: req.method,
        requestedpath: req.path,
        query: { ...req.query },
        timestamp: new Date().toISOString()
    });
    next();
};

function validateQueryParams(req, res, next) {
    const { level, minCredits, maxCredits, semester, instructor } = req.query;

    if (minCredits !== undefined && !Number.isInteger(Number(minCredits))) {
        return res.status(400).json({ error: 'Invalid minCredits parameter' });
    }

    if (maxCredits !== undefined && !Number.isInteger(Number(maxCredits))) {
        return res.status(400).json({ error: 'Invalid maxCredits parameter' });
    }

    if (minCredits !== undefined && maxCredits !== undefined) {
        if (Number(minCredits) > Number(maxCredits)) {
            return res.status(400).json({ error: 'minCredits cannot be greater than maxCredits' });
        }
    }

    next();
};

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
