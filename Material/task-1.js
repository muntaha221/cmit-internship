const students = [
    {
        name: "Ali",
        marks: [80, 75, 90]
    },
    {
        name: "Sara",
        marks: [65, 70, 60]
    },
    {
        name: "Ahmed",
        marks: [45, 50, 40]
    }
];

// calculate average
function calculateAverage(marks) {
    let total = 0;

    for (let i = 0; i < marks.length; i++) {
        total = total + marks[i];
    }

    return total / marks.length;
}

// calculate grade
function getGrade(average) {
    if (average >= 80) {
        return "A";
    } else if (average >= 70) {
        return "B";
    } else if (average >= 60) {
        return "C";
    } else if (average >= 50) {
        return "D";
    } else {
        return "F";
    }
}

// create a new array so the original stays unchanged
const results = [];

for (let i = 0; i < students.length; i++) {
    let average = calculateAverage(students[i].marks);
    let grade = getGrade(average);

    const studentResult = {
        name: students[i].name,
        marks: students[i].marks,
        average: average,
        grade: grade
    };

    results.push(studentResult);
}

// find students who passed
const passedStudents = [];

for (let i = 0; i < results.length; i++) {
    if (results[i].average >= 50) {
        passedStudents.push(results[i]);
    }
}

// sort from highest average to lowest
const sortedStudents = [...results];

sortedStudents.sort(function (a, b) {
    return b.average - a.average;
});

// highest scorer
const highestScorer = sortedStudents[0];

// calculate class average
let totalClassAverage = 0;

for (let i = 0; i < results.length; i++) {
    totalClassAverage = totalClassAverage + results[i].average;
}

const classAverage = totalClassAverage / results.length;


// output

console.log("1. Student Averages and Grades");

for (let i = 0; i < results.length; i++) {
    console.log(
        results[i].name,
        "- Average:",
        results[i].average,
        "- Grade:",
        results[i].grade
    );
}

console.log("\n2. Passed Students");

for (let i = 0; i < passedStudents.length; i++) {
    console.log(
        passedStudents[i].name,
        "- Average:",
        passedStudents[i].average,
        "- Grade:",
        passedStudents[i].grade
    );
}

console.log("\n3. Students Sorted by Average");

for (let i = 0; i < sortedStudents.length; i++) {
    console.log(
        sortedStudents[i].name,
        "- Average:",
        sortedStudents[i].average,
        "- Grade:",
        sortedStudents[i].grade
    );
}

console.log("\n4. Highest Scorer");

console.log(
    highestScorer.name,
    "- Average:",
    highestScorer.average,
    "- Grade:",
    highestScorer.grade
);

console.log("\n5. Overall Class Average");

console.log(classAverage);

console.log("\n6. Original Array - Unchanged");

console.log(students);