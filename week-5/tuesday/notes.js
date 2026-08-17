import fs from "fs";
import path from "path";

const notesFile = path.join(process.cwd(), "notes.txt");

// add a note
function addNote(note) {
    fs.appendFileSync(notesFile, note + "\n");
    console.log("Note added");
}

// show all notes
function showNotes() {
    const notes = fs.readFileSync(notesFile, "utf8");
    console.log(notes);
}

addNote("Learn Node.js fs module");
addNote("Learn Node.js path module");

showNotes();