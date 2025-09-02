// https://coderun.yandex.ru/selections/quickstart/problems/improving-academic-performance

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const input = [];
rl.on('line', line => {
  input.push(Number(line.trim()));
  if (input.length === 3) {
    rl.close();
  }
});

rl.on('close', () => {
  const [a, b, c] = input;

  const minFives = a + b / 3 - c / 3;

  console.log(minFives < 0
    ? 0
    : Math.ceil(minFives) || 1
  );
});
