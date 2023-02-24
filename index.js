import { exec } from "child_process";

const TIMEZONES = ["Europe/London", "America/Toronto"];

function cmd(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      if (stderr) {
        return reject(stderr);
      }

      return resolve(stdout);
    });
  });
}

let user = await cmd("whoami");
user = user.trim();

if (user !== "root") {
  console.log("Timeshift needs root privileges. Please run again with sudo.");
  process.exit(1);
}

let currentTimezone = await cmd("systemsetup -gettimezone");
currentTimezone = currentTimezone.split(": ")[1].trim();

const currentIndex = TIMEZONES.indexOf(currentTimezone);
const newIndex = currentIndex < TIMEZONES.length - 1 ? currentIndex + 1 : 0;
const newTimezone = TIMEZONES[newIndex];

try {
  await cmd("systemsetup -settimezone " + newTimezone);
} catch (e) {}
