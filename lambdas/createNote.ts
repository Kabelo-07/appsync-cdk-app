import Note from "./Note";
import AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function createNote(note: Note) {
    const params = {
        TableName: process.env.NOTES_TABLE || '',
        Item: note
    }

    try {
        await docClient.put(params).promise();
        return note;
    } catch (error) {
        console.log("DynamoDB error: ", error);
        return null;
    }
    
}

export default createNote;