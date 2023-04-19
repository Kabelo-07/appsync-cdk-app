import AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getNoteById(noteId: string) {
    const params = {
        TableName: process.env.NOTES_TABLE || '',
        Key: {
            id: noteId
        }
    }

    try {
        const Item = await docClient.get(params).promise();
        return Item;
    } catch (error) {
        console.log("DynamoDB error: ", error);
        return null;
    }
    
}

export default getNoteById;