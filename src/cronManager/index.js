import setDaoMemberships from "./jobs/setDaoMemberships";
const cron = require("node-cron");

class CronManager {
  constructor() {
    cron.schedule("* * * * *", () => {
      setDaoMemberships();
    });
  }
}

export default CronManager;
