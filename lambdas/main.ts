import Note from './Note';
import listNotes from './listNotes';
import getNoteById from './getNoteById';
import createNote from './createNote';
import updateNote from './updateNote';
import deleteNote from './deleteNote';

type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        noteId: string,
        note: Note
    }
}

exports.handler =async (event:AppSyncEvent) => {
    console.log("event.info "+ event.info);
    console.log("event.args "+ event.arguments.note);

    switch(event.info.fieldName) {
        case "getNoteById":
            return await getNoteById(event.arguments.noteId);
        case "listNotes":
            return await listNotes();
        case "createNote":
            return await createNote(event.arguments.note);
        case "updateNote":
            return await updateNote(event.arguments.note);
        case "deleteNote":
            return await deleteNote(event.arguments.noteId);            
        default:
            return null;
    }
}
