const students = [
  { id: 1, name: "Ali", marks: [70, 80, 65] },
  { id: 2, name: "Sara", marks: [90, 85, 88] },
  { id: 3, name: "John", marks: [45, 55, 50] }
];

// Helper function to calculate average of an array of marks
function calculateAverage(marksArray)
{
  let total = 0;
  for (let i = 0; i < marksArray.length; i++) {
    total = total + marksArray[i];
  }
  let average = total / marksArray.length;
  return average;
}

// 1. Calculate average marks for every student
function getStudentAverages(studentsArray)
{
  let result = [];
  for (let i = 0; i < studentsArray.length; i++) {
    let student = studentsArray[i];
    let avg = calculateAverage(student.marks);
    result.push({
      id: student.id,
      name: student.name,
      marks: student.marks,
      average: avg
    });
  }
  return result;
}

// 2. Add a grade property to each student
function addGradeToStudents(studentsArray) {
  let studentsWithAvg = getStudentAverages(studentsArray);
  let result = [];

  for (let i = 0; i < studentsWithAvg.length; i++) {
    let student = studentsWithAvg[i];
    let grade = "";

    if (student.average >= 80) {
      grade = "A";
    } else if (student.average >= 60) {
      grade = "B";
    } else if (student.average >= 50) {
      grade = "C";
    } else {
      grade = "F";
    }

    result.push({ ...student, grade: grade });
  }
  return result;
}

// 3. Return only students who passed (average 50 or above)
function getPassedStudents(studentsArray)
{
  let studentsWithGrade = addGradeToStudents(studentsArray);
  let passed = [];

  for (let i = 0; i < studentsWithGrade.length; i++) {
    if (studentsWithGrade[i].average >= 50) {
      passed.push(studentsWithGrade[i]);
    }
  }
  return passed;
}

// 4. Sort students by average marks
function sortStudentsByAverage(studentsArray) {
  let studentsWithGrade = addGradeToStudents(studentsArray);
  // copy array first so original is not touched
  let sorted = [...studentsWithGrade];

  sorted.sort(function (a, b) {
    return b.average - a.average;
  });

  return sorted;
}

// 5. Find the student with the highest average
function getTopStudent(studentsArray) {
  let studentsWithGrade = addGradeToStudents(studentsArray);
  let topStudent = studentsWithGrade[0];

  for (let i = 1; i < studentsWithGrade.length; i++) {
    if (studentsWithGrade[i].average > topStudent.average) {
      topStudent = studentsWithGrade[i];
    }
  }
  return topStudent;
}

// 6. Calculate overall class average
function getClassAverage(studentsArray) {
  let studentsWithGrade = addGradeToStudents(studentsArray);
  let total = 0;

  for (let i = 0; i < studentsWithGrade.length; i++) {
    total = total + studentsWithGrade[i].average;
  }

  let classAverage = total / studentsWithGrade.length;
  return classAverage;
}

// ---- Testing everything below ----
console.log("Students with average:");
console.log(getStudentAverages(students));

console.log("\nStudents with grade:");
console.log(addGradeToStudents(students));

console.log("\nPassed students:");
console.log(getPassedStudents(students));

console.log("\nSorted by average:");
console.log(sortStudentsByAverage(students));

console.log("\nTop student:");
console.log(getTopStudent(students));

console.log("\nClass average:");
console.log(getClassAverage(students));

// checking original array is not modified
console.log("\nOriginal students array (should be unchanged):");
console.log(students);
