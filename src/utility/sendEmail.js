const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } =  require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress , subject , body) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h1>  ${body} </h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "this is the text format",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async ({ to, subject, html }) => {
  try {
    const sendEmailCommand = createSendEmailCommand(
      to, // <-- Use the dynamic 'to' address here instead of the hardcoded string
      "devtinder@DEVTINDERS.WORK.GD",
      subject,
      html
    );
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      return caught;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };

