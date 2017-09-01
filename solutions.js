// Intermediate values

// christmas tree
function executeAsyncTask () {
  return functionA()
    .then((valueA) => {
      return functionB(valueA)
        .then((valueB) => {
          return functionC(valueA, valueB)
        })
    })
}

// moving to a higher scope
function executeAsyncTask () {
  let valueA
  return functionA()
    .then((v) => {
      valueA = v
      return functionB(valueA)
    })
    .then((valueB) => {
      return functionC(valueA, valueB)
    })
}

// unnecessary array
function executeAsyncTask () {
  return functionA()
    .then(valueA => {
      return Promise.all([valueA, functionB(valueA)])
    })
    .then(([valueA, valueB]) => {
      return functionC(valueA, valueB)
    })
}

// helper fn
const converge = (...promises) => (...args) => {
  let [head, ...tail] = promises
  if (tail.length) {
    return head(...args)
      .then((value) => converge(...tail)(...args.concat([value])))
  } else {
    return head(...args)
  }
}

functionA(2)
  .then((valueA) => converge(functionB, functionC)(valueA))

//
// in async/await
//
async function executeAsyncTask () {
  const valueA = await functionA()
  const valueB = await functionB(valueA)
  return function3(valueA, valueB)
}

async function executeParallelAsyncTasks () {
  const [ valueA, valueB, valueC ] = await Promise.all([ functionA(), functionB(), functionC() ])
  doSomethingWith(valueA)
  doSomethingElseWith(valueB)
  doAnotherThingWith(valueC)
}

// map
function asyncThing (value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(value), 100)
  })
}

async function main () {
  return [1,2,3,4].map(async (value) => {
    const v = await asyncThing(value)
    return v * 2
  })
}

main()
  .then(v => console.log(v))
  .catch(err => console.error(err))

// filter
function asyncThing (value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(value), 100)
  })
}

async function main () {
  return [1,2,3,4].filter(async (value) => {
    const v = await asyncThing(value)
    return v % 2 === 0
  })
}

main()
  .then(v => console.log(v))
  .catch(err => console.error(err))

// reduce
function asyncThing (value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(value), 100)
  })
}

async function main () {
  return [1,2,3,4].reduce(async (acc, value) => {
    return await acc + await asyncThing(value)
  }, Promise.resolve(0))
}

main()
  .then(v => console.log(v))
  .catch(err => console.error(err))
