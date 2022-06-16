import setDaoMemberships from "./jobs/setDaoMemberships";
const cron = require("node-cron");

class CronManager {
  constructor() {
    // un comment on dedicated server
    // cron.schedule("* * * * *", () => {
    //   setDaoMemberships();
    // });
  }
}

export default CronManager;
