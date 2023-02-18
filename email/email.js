const mailtransporter = require("./connectGmail");
const { solveEmail } = require("./solveReceiver");
const { solveText } = require("./solveData");

async function sendMail(receiver, subject, data) {
  let to = await solveEmail(receiver);
  let text = await solveText(subject, data);

  if (to.email != "none" && to.emailpref.includes(subject)) {
    let mailDetails = {
      from: "monTool",
      to: to.email,
      subject: `${subject} - ${JSON.stringify(data.reading)}`,
      text: `${JSON.stringify(text)}  \nDevice: ${receiver}`,
    };

    mailtransporter.transporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("Error Occurs");
      } else {
        console.log("Email sent successfully");
      }
    });
  }
}
/*

async function sendMail(receiver, subject, text) {
  console.log(
    ` sending mail..\n Receiver: ${receiver} \nSubject: ${subject} \nText: ${text} \nTimeNow: ${new Date()} \nLastSent at: ${mailSentAt}`
  );

  if (new Date() - mailSentAt > coolDownTimer) {
    mailSentAt = new Date();
    solveReceiverr(receiver).then((mail) => {
      let mailDetails = {
        from: "monToolB00148740@gmail.com",
        to: mail,
        subject: `${subject}`,
        text: `${JSON.stringify(text)}`,
      };

      console.log(mailDetails);

     
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
*/

module.exports = { sendMail };
