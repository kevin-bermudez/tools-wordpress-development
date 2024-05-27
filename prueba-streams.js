const fs = require('fs');
const data = ['a','b','c'];
let dataToFile = ''
data.forEach(item=> {
  dataToFile += `${item}\n`
})

const writeStream = fs.createWriteStream('output.txt');
writeStream.write(dataToFile,(err) => {
  console.log('finis with error',err)
});
writeStream.end();

// console.log(fs.readFileSync('output.txt'));