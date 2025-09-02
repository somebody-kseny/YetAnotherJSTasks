// https://coderun.yandex.ru/selections/quickstart/problems/open-calculator

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', line => {
    input.push(line);
});

rl.on('close', () => {
  const buttons = input[0].split(' ');

  const nums = new Set(input[1].split(''));

  let res = 0;

  nums.forEach((num) => {
    if (buttons.includes(num)) return;

    res++;
  });

  console.log(res);
});
