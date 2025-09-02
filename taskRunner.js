const { readFileSync, writeFileSync } = require('fs');

const TMP_FILE_TO_EXECUTE = `${__dirname}/tmp.js`
const TASK_PATH = `${__dirname}/${process.argv[2]}`;

const code = readFileSync(`${TASK_PATH}/solution.js`, 'utf-8');

const codeWokingWithFileInput = `
// ${TASK_PATH}
const fs = require('fs');

${code.replace('process.stdin,', `fs.createReadStream('${TASK_PATH}/input'), terminal: false,`)}
`;

writeFileSync(TMP_FILE_TO_EXECUTE, codeWokingWithFileInput);

require(TMP_FILE_TO_EXECUTE);
