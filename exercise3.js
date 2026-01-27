const os = require("os");
const fs = require("fs");

// 5 second me ek baar system info log karega
setInterval(() => {
  const info = `
CPU: ${os.cpus()[0].model}
Memory: ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB
Platform: ${os.platform()}
Free Memory: ${(os.freemem() / (1024 ** 3)).toFixed(2)} GB
Time: ${new Date().toLocaleString()}
-----------------------------
`;

  // Append info to systemInfo.txt
  fs.appendFile("systemInfo.txt", info, (err) => {
    if (err) console.error("Error writing file:", err);
  });

  console.log("System info logged"); // console pe bhi message
}, 5000);
