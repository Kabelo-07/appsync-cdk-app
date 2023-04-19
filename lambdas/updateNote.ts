import AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

type Params = {
    TableName: string,
    Key: {},
    ExpressionAttributeValues: any,
    ExpressionAttributeNames: any,
    ReturnValues: string,
    UpdateExpression?: string
}

async function updateNote(note: any) {
    const params: Params = {
        TableName: process.env.NOTES_TABLE || '',
        ReturnValues: "UPDATED_NEW",
        ExpressionAttributeValues: {},
        ExpressionAttributeNames: {},
        UpdateExpression: "",
        Key: {
            id: note.id
        }
    }

    let prefix = "set ";
    let attributes = Object.keys(note);
    for (let index = 0; index < attributes.length; index++) {
        let element = attributes[index];
        if(element !== "id") {
            params["UpdateExpression"] += prefix + "#" + element + " = :" + element;
            params["ExpressionAttributeValues"][":" + element] = note[element];
            params["ExpressionAttributeNames"]["#" + element] = element;
            prefix = ", ";
        }
    }

    console.log("params", params);

    try {
        await docClient.update(params).promise();
        return note;
    } catch (error) {
        console.log("DynamoDB error: ", error);
        return null;
    }
    
}

export default updateNote;