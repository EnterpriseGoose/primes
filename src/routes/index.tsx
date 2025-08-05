import { Title } from '@solidjs/meta';
import { createSignal } from 'solid-js';
import styles from './index.module.scss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97,
];

const DIGIT_ORDERS = [
  [0, 1, 2, 3],
  [0, 1, 3, 2],
  [0, 2, 1, 3],
  [0, 2, 3, 1],
  [0, 3, 1, 2],
  [0, 3, 2, 1],
  [1, 0, 2, 3],
  [1, 0, 3, 2],
  [1, 2, 0, 3],
  [1, 2, 3, 0],
  [1, 3, 0, 2],
  [1, 3, 2, 0],
  [2, 0, 1, 3],
  [2, 0, 3, 1],
  [2, 1, 0, 3],
  [2, 1, 3, 0],
  [2, 3, 0, 1],
  [2, 3, 1, 0],
  [3, 0, 1, 2],
  [3, 0, 2, 1],
  [3, 1, 0, 2],
  [3, 1, 2, 0],
  [3, 2, 0, 1],
  [3, 2, 1, 0],
];

const OPERATIONS = ['+', '-', '*', '/'];

let savedPuzzles: {
  [index: number]: {
    [index: string]: string[][];
  };
} = {};

const readSavedPuzzles = () => {
  'use server';
  try {
    const filePath = path.join(__dirname, 'public', 'saved-puzzles.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading saved puzzles:', error);
  }
  return {};
};

const writeSavedPuzzles = (puzzles: any) => {
  'use server';
  try {
    const filePath = path.join(__dirname, 'public', 'saved-puzzles.json');
    fs.writeFileSync(filePath, JSON.stringify(puzzles, null, 2));
  } catch (error) {
    console.error('Error writing saved puzzles:', error);
  }
};

const regenerateNumbers = (prime: number) => {
  'use server';

  savedPuzzles = readSavedPuzzles();

  if (savedPuzzles[prime]) {
    return savedPuzzles[prime];
  }

  let puzzles: { [index: string]: string[][] } = {};

  for (let i = 1; i < 10; i++) {
    console.log(`processing digits: ${i.toString()}`);
    for (let j = 1; j <= i; j++) {
      console.log(`processing sub-digit: ${j.toString()}`);
      for (let k = 1; k <= i; k++) {
        for (let l = 1; l <= i; l++) {
          const digits = [i, j, k, l];

          // Operations:
          // 0 = +, 1 = -, 2 = *, 3 = /
          for (let o1 = 0; o1 < 4; o1++) {
            for (let o2 = 0; o2 < 4; o2++) {
              for (let o3 = 0; o3 < 4; o3++) {
                // Digit orders - See DIGIT_ORDERS
                for (let d = 0; d < DIGIT_ORDERS.length; d++) {
                  // Parthentases
                  // 0 =  x  x  x  x
                  // 1 =  x (x  x) x
                  // 2 =  x  x (x  x)
                  // 3 =  x (x  x  x)
                  // 4 = (x  x)(x  x)

                  let foundOne = false;
                  for (let p = 0; p < 5 && !foundOne; p++) {
                    const ordered_digits = [
                      digits[DIGIT_ORDERS[d][0]],
                      digits[DIGIT_ORDERS[d][1]],
                      digits[DIGIT_ORDERS[d][2]],
                      digits[DIGIT_ORDERS[d][3]],
                    ];
                    const ordered_operations = [
                      OPERATIONS[o1],
                      OPERATIONS[o2],
                      OPERATIONS[o3],
                    ];
                    let result = 0;
                    if (p == 0) {
                      result = eval(
                        `${ordered_digits[0]}${ordered_operations[0]}${ordered_digits[1]}${ordered_operations[1]}${ordered_digits[2]}${ordered_operations[2]}${ordered_digits[3]}`
                      );
                    }
                    if (p == 1) {
                      result = eval(
                        `${ordered_digits[0]}${ordered_operations[0]}${ordered_digits[1]}${ordered_operations[1]}${ordered_digits[2]}${ordered_operations[2]}${ordered_digits[3]}`
                      );
                    }
                    if (p == 2) {
                      result = eval(
                        `${ordered_digits[0]}${ordered_operations[0]}${ordered_digits[1]}${ordered_operations[1]}${ordered_digits[2]}${ordered_operations[2]}${ordered_digits[3]}`
                      );
                    }
                    if (p == 3) {
                      result = eval(
                        `${ordered_digits[0]}${ordered_operations[0]}${ordered_digits[1]}${ordered_operations[1]}${ordered_digits[2]}${ordered_operations[2]}${ordered_digits[3]}`
                      );
                    }
                    if (p == 4) {
                      result = eval(
                        `${ordered_digits[0]}${ordered_operations[0]}${ordered_digits[1]}${ordered_operations[1]}${ordered_digits[2]}${ordered_operations[2]}${ordered_digits[3]}`
                      );
                    }

                    if (result == prime) {
                      let resArray = [];
                      if (p == 4) {
                        resArray.push('(');
                      }
                      resArray.push(
                        ordered_digits[0].toString(),
                        ordered_operations[0]
                      );
                      if (p == 1 || p == 3) {
                        resArray.push('(');
                      }
                      resArray.push(ordered_digits[1].toString());
                      if (p == 4) {
                        resArray.push(')');
                      }
                      resArray.push(ordered_operations[1]);
                      if (p == 2 || p == 4) {
                        resArray.push('(');
                      }
                      resArray.push(ordered_digits[2].toString());
                      if (p == 1) {
                        resArray.push(')');
                      }
                      resArray.push(
                        ordered_operations[2],
                        ordered_digits[3].toString()
                      );
                      if (p == 2 || p == 3 || p == 4) {
                        resArray.push(')');
                      }
                      if (!puzzles[`${i} ${j} ${k} ${l}`])
                        puzzles[`${i} ${j} ${k} ${l}`] = [];
                      puzzles[`${i} ${j} ${k} ${l}`].push(resArray);
                      foundOne = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  savedPuzzles[prime] = puzzles;
  writeSavedPuzzles(savedPuzzles);

  console.log(puzzles);

  return puzzles as { [index: string]: string[][] };
};

export default function Home() {
  const [numbers, setNumbers] = createSignal([1, 2, 3, 4]);
  const [prime, setPrime] = createSignal(0);
  const [loadedPuzzles, setLoadedPuzzles] = createSignal({});
  const [selectedNumber, setSelectedNumber] = createSignal('');
  const [error, setError] = createSignal('');
  const [difficulty, setDifficulty] = createSignal(5);
  const [isLoading, setIsLoading] = createSignal(false);

  const randomizePrime = () => {
    const randomPrime = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    setSelectedNumber(randomPrime.toString());
    setError('');
  };

  const validateAndSetPrime = (value: string) => {
    const num = parseInt(value);
    if (PRIMES.includes(num)) {
      setSelectedNumber(value);
      setError('');
    } else {
      setSelectedNumber(value);
      setError('Please select a prime number');
      setTimeout(() => setError(''), 3000);
    }
  };

  const loadPuzzles = async () => {
    const num = parseInt(selectedNumber());
    if (PRIMES.includes(num)) {
      setIsLoading(true);
      try {
        let puzzles = await regenerateNumbers(num);
        setPrime(num);
        setLoadedPuzzles(puzzles);
        setError('');
      } catch (error) {
        setError('Failed to load puzzles');
        setTimeout(() => setError(''), 3000);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please select a valid prime number first');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getPuzzle = () => {
    const puzzles = loadedPuzzles();
    if (Object.keys(puzzles).length === 0) {
      setError('Please load puzzles first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const puzzleKeys = Object.keys(puzzles).filter((key) => parseInt(key) > 0);
    const weightedIndex = Math.floor(
      Math.random() * puzzleKeys.length * (difficulty() / 5)
    );

    const selectedKey =
      puzzleKeys[Math.min(weightedIndex, puzzleKeys.length - 1)];
    const selectedNumbers = selectedKey.split(' ').map(Number);
    setNumbers(selectedNumbers);
    setError('');
  };

  return (
    <main class={styles.container}>
      <Title>Prime Card Generator</Title>

      <div class={styles.cardSection}>
        <div class={styles.cardContainer}>
          <img
            src="/card-template.svg"
            alt="Card Template"
            class={styles.cardImage}
          />
          <div
            class={styles.cornerNumber}
            classList={{ [styles.topLeft]: true }}
          >
            {numbers()[0]}
            {numbers()[0] == 1 ? ' ' : ''}
          </div>
          <div
            class={styles.cornerNumber}
            classList={{ [styles.topRight]: true }}
          >
            {numbers()[1]}
          </div>
          <div
            class={styles.cornerNumber}
            classList={{ [styles.bottomLeft]: true }}
          >
            {numbers()[2]}
          </div>
          <div
            class={styles.cornerNumber}
            classList={{ [styles.bottomRight]: true }}
          >
            {numbers()[3]}
          </div>
          <div class={styles.centerNumber}>{prime()}</div>
        </div>
      </div>

      <div class={styles.controls}>
        <div class={styles.numberSection}>
          <label for="numberInput" class={styles.label}>
            Prime Number
          </label>
          <div class={styles.numberInputGroup}>
            <input
              type="number"
              id="numberInput"
              value={selectedNumber()}
              onInput={(e) => validateAndSetPrime(e.currentTarget.value)}
              class={styles.numberInput}
              placeholder="Enter prime number"
            />
            <button onClick={randomizePrime} class={styles.randomizeButton}>
              Randomize
            </button>
          </div>
          {error() && <div class={styles.error}>{error()}</div>}
        </div>

        <button
          onClick={loadPuzzles}
          class={styles.loadButton}
          disabled={isLoading()}
        >
          {isLoading() ? (
            <div class={styles.loadingSpinner}>
              <div class={styles.spinner}></div>
              Loading...
            </div>
          ) : (
            'Load Puzzles'
          )}
        </button>

        <div class={styles.difficultySection}>
          <label for="difficulty" class={styles.difficultyLabel}>
            Difficulty: {difficulty()}
          </label>
          <input
            type="range"
            id="difficulty"
            min="1"
            max="10"
            value={difficulty()}
            onInput={(e) => setDifficulty(parseInt(e.currentTarget.value))}
            class={styles.difficultySlider}
          />
        </div>

        <button onClick={getPuzzle} class={styles.getPuzzleButton}>
          Get Puzzle
        </button>
      </div>
    </main>
  );
}
