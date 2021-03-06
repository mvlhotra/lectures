/* helpers
 *   in most functional languages, methods that work with objects return new objects (instead of modifying the original)
 *   the methods below create new copies of objects
 *     however, they are inefficient b/c they use up new more and more every time
 *     functional languages are smart about how they create new objects, sharing memory with old ones
 *     in JS, you can have immutable data structures with the help of libraries, ex.:
 *       https://github.com/swannodette/mori
 *       https://github.com/facebook/immutable-js */

/* given an object, returns a new object with newVals merged in */
function set(object, newVals) {
  return Object.assign({}, object, newVals);
}

/* given a list, returns a new list with newVal added to end */
function conj(array, newVal) {
  let a = Object.assign([], array)
  a.push(newVal);
  return a;
}

/* this fn allows us to chain functions of functions, but write it in reverse
 *   see examples at bottom */
function thread(init, ...args) {
  let v = init;
  for(exp of args) {
    v = exp[0].apply(null, [v].concat(exp.slice(1)))
  }
  return v;
}


/* setup */
/* note: all are pure functions */

function createAccount(owner) {
  return { owner: owner,
           balance: 0,
           transactions: [] };
}

function createProAccount(owner) {
  return set(createAccount(owner), {type: "pro"});
}

function deposit(account, amount) {
  return set(account,
            { balance: account.balance + amount,
              transactions: conj(account.transactions, `D${amount}`) });
}

function withdraw(account, amount) {
  return set(account,
    { balance: account.balance - amount,
      transactions: conj(account.transactions, `W${amount}`) });
}

function withdrawPro(account, amount) {
  let tempAccount = withdraw(account, amount);
  if (account.balance >= 1000) {
    return deposit(tempAccount, 10)
  } else {
    return tempAccount;
  }
}

function toString(account) {
  let out = `${account.owner}: $${account.balance}`;
  return out + "\n\t"+account.transactions.join("\n\t") + "\n";
}

/* program */

let accountABC = createAccount("Juan");

accountABC = deposit(accountABC, 1500);

// accountABC = withdrawPro(accountABC, 300);
// // // accountABC.balance = 5000;
accountABC = withdraw(accountABC, 1000);

console.log(toString(accountABC));


/* or... */

console.log(
  toString(
    withdrawPro(
      withdrawPro(
        deposit(
          createProAccount("Bob"), 
          1500), 
        400), 
      200)
    )
  )

// console.log(toString(bobsAccount))


/* or... */

// thread(createSavingsAccount("Bob"),
//        [deposit, 500],
//        [withdraw, 100],
//        [withdraw, 1000],
//        [toString],
//        [console.log])
