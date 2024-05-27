function getOddNumbersUpTo(x) {
    let result = [];
    for(let i = 1; i <= x; i++) {
        if (i % 2 !== 0) {
            result.push(i);
        }
    }
    return result;
}

console.log(getOddNumbersUpTo(9)) // [ 1, 3, 5, 7, 9 ]
console.log(getOddNumbersUpTo(10)) // [ 1, 3, 5, 7, 9 ]
console.log(getOddNumbersUpTo(11)) // [ 1, 3, 5, 7, 9, 11]
console.log(getOddNumbersUpTo(9)) // [ 1, 3, 5, 7 ]
