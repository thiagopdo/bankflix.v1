'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>          
          <div class="movements__value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //removeu menos que 1
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUserNames(accounts);
//console.log(accounts);

//UPDATE UI
const updateUI = function (acc) {
  //DISPLAY MOVEMENTS
  displayMovements(acc.movements);
  //DISPLAY  BALANCE
  calcDisplayBalance(acc);
  //DISPLAY SUMMARY
  calcDisplaySummary(acc);
};
//event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //optional chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //DISPLAY IU E 'BEM VINDO'
    labelWelcome.textContent = `WELCOME BACK. ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //limpar campos
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //updateUI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov > +amount * 0.1)) {
    //adicionar movemento
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.username !== currentAccount.username
  ) {
    //fazendo transferencia
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    //updateui
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //deletar conta
    accounts.splice(index, 1);

    //esconder UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);*/

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
//SLICE metodo para arrays
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice()); //copia superficial

//SPLICE
//muda oarray, mutate array
//console.log(arr.splice(2));
arr.splice(-1);
console.log(arr); //array alterado
arr.splice(1, 2);
console.log(arr);

//REVERSE
//muda array, mutate array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);

//JOIN
console.log(letters.join(' - '));
*/

// AT() METHOD
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

//obtendo o ultimo indice do array
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
//com metodo AT()
console.log(arr.at(-1)); 
 */

/*
///////////////////////////////
//FOREACH LOOP
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//for of
for (const move of movements) {
  if (move > 0) {
    console.log(`vc depositou ${move}`);
  } else {
    console.log(`vc sacou ${Math.abs(move)}`);
  }
}

//usando foreach
console.log('------ FOREACH ------');
movements.forEach(function (move) {
  if (move > 0) {
    console.log(`vc depositou ${move}`);
  } else {
    console.log(`vc sacou ${Math.abs(move)}`);
  }
});
console.log('----- COM A POSIÇAO DO ARRAY ----');
movements.forEach(function (move, i, arr) {
  if (move > 0) {
    console.log(`Movimento ${i + 1}: vc depositou ${move}`);
  } else {
    console.log(`MOvimento ${i + 1}: vc sacou ${Math.abs(move)}`);
  }
});
*/

/*
////FOREACH SET E MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
//SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
*/

//////////////////////////////
//CODING CHALLENGE #1
/*
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  //console.log(dogsJuliaCorrected);
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);

  dogs.forEach(function (dog, i) {
    if (dog > 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/

///////////////////////////////
//MAP METHOD
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

/*const movementUSD = movements.map(function (mov) {
  return mov * eurToUsd;
});
//arrow funciton
const movementUSD = movements.map(mov => mov * eurToUsd);

console.log(movementUSD);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `MOvimento ${i + 1}: vc ${mov > 0 ? 'depositou' : 'sacou'} ${Math.abs(mov)}`
);

console.log(movementsDescriptions);
*/

/////////////////////////////////////
// FILTER
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

//mesma coisa
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);
*/

//////////////////////////////////////
//REDUCE
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//accumulator
const balance = movements.reduce(function (acc, curr, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + curr;
}, 0);
console.log(balance);
//arrow function
const balance2 = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance2);

//valor máximo
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
*/
//////////////////////////////////
//CODING CHALLENGE #2
/*
const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAge.filter(age => age >= 18);
  console.log(humanAge);
  console.log(adults);

  //const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  const average = adults.reduce(
    (acc, age, i, arr) => acc + age / arr.length,
    0
  );

  return average;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2); */
///////////////////////////
//CODING CHALLENGE #3
/*
const calcAverageHumanAge2 = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const avg1 = calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
*/
///////////////////////////////////
//CHAINING METHODS
/*
const eurToUsd = 1.1;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);
*/

//////////////////////////////////////
// DEFINE METHOD
//nao retorna um novo array, apenas o primeiro elemento procurado
/*
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

/////////////////////////////////////
// SOME E EVERY
/*
const anyDeposits = movements.some(mov => mov > 0);
//console.log(anyDeposits);
const anyDeposits2 = movements.some(mov => mov > 5000);
//console.log(anyDeposits2);
*/
//EVERY
//necessário passar todos elementos que satisfazem a condiçao
/*
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));
*/

/////////////////////////////////
//CALLBACK SEPARADO
/*
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

/////////////////////////////////
// FLAT E FLATMAP
//flat junta todos elementos do array
/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log(allMovements);
const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);
//chaining
const overalBalance1 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance1);

//FLATMAP
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance1);
*/

/////////////////////////////////
//SORTING ARRAYS
//strings
/*
const owners = ['Thiago', 'Zach', 'Adam', 'MArta'];
console.log(owners.sort());
//numeros
console.log(movements);
//return < 0, A e B (mantem a ordem)
//return > 0, B e A (troca a ordem)

//crescente
/*
movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
}); 
movements.sort((a, b) => a - b);
console.log(movements);

//decrescente
/*
movements.sort((a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
}); 
movements.sort((a, b) => b - a);
console.log(movements);
*/

///////////////////////////
// CRIAR E PREENCHER ARRAYS
//fill metodo (altera o array)
/*
const arr = [1, 2, 3, 4, 5, 6, 7];

const x = new Array(7);
console.log(x);
x.fill(1, 3, 5);
console.log(x);
x.fill(1);
console.log(x);

//array.from()
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(movementsUI);
});
*/
/*
/////////////////////////////
// Exercicios com array
//1.
const backDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(backDepositSum);

// 2.
//6 depositos >= 1000
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);

console.log(numDeposits1000);

//3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

//4.
//esse é um titulo => Esse é um Titulo
const convertTitleCase = function (title) {
  const capitalizar = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['um', 'é', 'o', 'mas', 'ou', 'como'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalizar(word)))
    .join(' ');
  return titleCase;
};

console.log(convertTitleCase('esse é um belo titulo'));
console.log(convertTitleCase('esse é um LONGO TITULO mas não é grande'));
console.log(convertTitleCase('esse é um outro titulo como EXEMPLO'));
*/

////////////////////////////////
//CODING CHALLENGE $4
/*Julia and Kate are still studying dogs, and this time they are studying if dogs are
eating too much or too little.
Eating too much means the dog's current food portion is larger than the
recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10%
above and 10% below the recommended portion (see hint).
Your tasks:
1. Loop over the 'dogs' array containing dog objects, and for each dog, calcula
the recommended food portion and add it to the object as a new property. Do
not create a new array, simply loop over the array. Forumla:
recommendedFood = weight ** 0.75 * 28. (The result is in grams of
food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much
('ownersEatTooMuch') and an array with all owners of dogs who eat too lit
('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and
Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
too little!"
5. Log to the console whether there is any dog eating exactly the amount of food
that is recommended (just true or false)
6. Log to the console whether there is any dog eating an okay amount of food
(just true or false)
7. Create an array containing the dogs that are eating an okay amount of food (t
to reuse the condition used in 6.)
8. Create a shallow copy of the 'dogs' array and sort it by recommended food
portion in an ascending order (keep in mind that the portions are inside the
array's objects 😉)*/

/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

//2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Cachorro de Sarah está comendo ${
    dogSarah.curFood > dogSarah.recFood ? 'muito' : 'pouco'
  }`
);

//3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

//4.
console.log(`Os cachorros de ${ownersEatTooMuch.join(' e ')} comem muito`);
console.log(`Os cachorros de ${ownersEatTooLittle.join(' e ')} comem pouco`);

//5
console.log(dogs.some(dog => dog.curFood === dog.recFood));

//6.
const checkEatingOK = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(checkEatingOK));

//7.
console.log(dogs.filter(checkEatingOK));

//8.
const dogsCopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsCopy);
*/
