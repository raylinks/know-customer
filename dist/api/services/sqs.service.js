"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMessageFromQueue = exports.PollMessages = exports.sendMessageToQueue = void 0;
const sqsClient_1 = require("../../config/sqsClient");
const { SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const { Consumer } = require('sqs-consumer');
const queueUrl = '';
const sendMessageToQueue = async (body) => {
    try {
        const command = await sqsClient_1.sqsClient.send(new SendMessageCommand({
            MesaageBody: body,
            QueueUrl: queueUrl,
            MessageAttributes: {
                OrderId: { DataType: 'String', StringValue: '4421x' },
            },
        }));
        await sqsClient_1.sqsClient.send(command);
    }
    catch (error) { }
};
exports.sendMessageToQueue = sendMessageToQueue;
const PollMessages = async () => {
    try {
        const command = await sqsClient_1.sqsClient.send(new ReceiveMessageCommand({
            MaxNumberOfMessages: 10,
            QueueUrl: queueUrl,
            WaitTimeSeconds: 5,
            MessageAttributes: ['ALL'],
            VisibilityTimeout: 10,
        }));
        const result = await sqsClient_1.sqsClient.send(command);
        await (0, exports.DeleteMessageFromQueue)(result.message[0].ReceiptHandle);
    }
    catch (error) { }
};
exports.PollMessages = PollMessages;
const DeleteMessageFromQueue = async (ReceiptHandle) => {
    try {
        await sqsClient_1.sqsClient.send(new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle,
        }));
    }
    catch (error) { }
};
exports.DeleteMessageFromQueue = DeleteMessageFromQueue;
const app = sqsClient_1.sqsClient.send(Consumer.create({
    queueUrl,
    sqs: sqsClient_1.sqsClient,
    handleMessage: async (_message) => { },
}));
app.on('Processing  error', (_err) => { });
app.start();
//# sourceMappingURL=sqs.service.js.map