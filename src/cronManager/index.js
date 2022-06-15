import setDaoMemberships from "./jobs/setDaoMemberships";
import cron from "node-cron";

class CronManager {
  constructor() {
    cron.schedule("* * * * *", () => {
      setDaoMemberships();
    });
  }
}

export default CronManager;
