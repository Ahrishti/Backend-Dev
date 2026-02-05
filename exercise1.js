const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const words = data.trim().split(" ").length;

  fs.writeFile("wordCount.txt", `Word Count: ${words}`, (err) => {
    if (err) console.error(err);
    else console.log("Word count written to file");
  });
});
