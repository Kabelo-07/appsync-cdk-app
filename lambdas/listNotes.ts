import AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function listNotes() {
    const params = {
        TableName: process.env.NOTES_TABLE || ''
    }

    try {
        const data = await docClient.scan(params).promise();
        return data.Items;
    } catch (error) {
        console.log("DynamoDB error: ", error);
        return null;
    }
    
}

export default listNotes;