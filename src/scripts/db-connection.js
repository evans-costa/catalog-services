const { exec } = require('node:child_process');

const maxTries = 30;
const retryInterval = 5000;

let tries = 0;

function checkDatabase() {
  console.log(`Try ${tries + 1} of ${maxTries}`);

  const command = `docker exec postgres-catalog-service pg_isready`;

  exec(command, (error, stdout) => {
    let checkStatus = stdout;
    if (error) {
      if (tries < maxTries - 1) {
        setTimeout(checkDatabase, retryInterval);
        tries++;
      } else {
        console.error('It is not possible establishing a connection to the database');
        process.exit(1);
      }
    } else {
      console.log('Check status: ', checkStatus);
    }
  });
}

checkDatabase();
