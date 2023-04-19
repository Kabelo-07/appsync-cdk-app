import AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteNote(noteId: string) {
    const params = {
        TableName: process.env.NOTES_TABLE || '',
        Key: {
            id: noteId
        }
    }

    try {
        await docClient.delete(params).promise();
        return noteId;
    } catch (error) {
        console.log("DynamoDB error: ", error);
        return null;
    }
    
}

export default deleteNote;