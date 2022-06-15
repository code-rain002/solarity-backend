import Bree from "bree";
import path from "path";
import Graceful from "@ladjs/graceful";
import setDaoMemberships from "./jobs/setDaoMemberships";

class CronManager {
  constructor() {
    this.scheduler = new Bree({
      root: path.resolve("src/cronManager/jobs"),
      jobs: [
        {
          name: "setDaoMemberships",
          cron: "0 0 * * *",
          path: setDaoMemberships,
        },
      ],
      closeWorkerAfterMs: 1200000,
    });
    const graceful = new Graceful({ brees: [this.scheduler] });
    graceful.listen();
    this.scheduler.start();
  }
}

export default CronManager;
