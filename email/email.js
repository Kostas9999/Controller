const mailtransporter = require("./connectGmail");

let coolDownTimer = 60000;
let mailSentAt = 0;

async function sendMail(receiver, subject, text) {
  console.log(
    ` sending mail..\n Receiver: ${receiver} \nSubject: ${subject} \nText: ${text} \nTimeNow: ${new Date()} \nLastSent at: ${mailSentAt}`
  );

  if (new Date() - mailSentAt > coolDownTimer) {
    mailSentAt = new Date();
    solveReceiver(receiver).then((mail) => {
      let mailDetails = {
        from: "monToolB00148740@gmail.com",
        to: mail,
        subject: `${subject}`,
        text: `${JSON.stringify(text)}`,
      };

      mailtransporter.transporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("Error Occurs");
        } else {
          console.log("Email sent successfully");
        }
      });
    });
  }
}
async function solveReceiver(receiver) {
  // connect to db to get email by device ID
  return "goldiskiker@gmail.com";
}

module.exports = { sendMail };
