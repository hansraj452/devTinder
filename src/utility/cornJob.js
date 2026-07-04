const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { startOfDay, endOfDay, subDays } = require("date-fns");
const sendEmail = require("./sendEmail");

const cornJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const today = subDays(Date.now(), 1);
      const toDayStart = startOfDay(today);
      const toDayEnd = endOfDay(today);

      const pendingConnectionRequest = await ConnectionRequest.find({
        status: "interested",
        createdAt: {
          $gte: toDayStart,
          $lt: toDayEnd,
        },
      }).populate("toUserId fromUserId");

      //list of email with to user first Name
      const listOfEmail = [
        ...new Map(
          pendingConnectionRequest.map((obj) => [
            obj.toUserId.emailId,
            {
              emailId: obj.toUserId.emailId,
              firstName: obj.toUserId.firstName,
            },
          ]),
        ).values(),
      ];
      for (const req of listOfEmail) {
        await sendEmail.run({
          to: req.emailId,
          subject: "New Connection Request",
          html: `
    <h2>Hello ${req.firstName}</h2>
    <p>You have received a connection request.</p>
  `,
        });

        await ConnectionRequest.updateOne(
          { _id: req._id },
          { emailSent: true },
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = cornJob;
