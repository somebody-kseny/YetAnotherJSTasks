// https://coderun.yandex.ru/selections/quickstart/problems/matrix-operations

const readline = require('readline');

const rl =  readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const input = [];

rl.on('line', (line) => {
  input.push(line.trim().split(' '));
});

rl.on('close', () => {
  const [n, m, k, mA, mB] = (parseInput = () => {
    const [n, m, k] = input[0].map(Number);

    const mA = [];
    for (let i = 1; i < n + 1; i++) {
      mA.push(input[i].map(Number))
    }

    const mB = [];
    for (let i = n + 1; i < input.length; i++) {
      mB.push(input[i].map(Number))
    }

    return [n, m, k, mA, mB];
  })();

  const res = Array.from({ length: k }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < k; j++) {
      for (let a = 0; a < m; a++) {
        res[j][i] += mA[i][a] * mB[a][j];
      }
    }
  }

  res.forEach(row => {
    console.log(row.join(' '));
  });
});
