let numbers = []
for(let i=1;i<=90;i++){
  numbers.push(i)
}

const suffleArray = (array)=> array.sort((a, b) => 0.5 - Math.random());

const divide = (array, chunkSize)=>{
  const numberOfChunks = Math.ceil(array.length/chunkSize)

  return [...Array(numberOfChunks)].map((value,index)=>{
    return array.slice(index*chunkSize, (index+1)*chunkSize).sort((a,b)=>a>b?1:-1)
  })  
}

const bingoNumbers= (people, cardsPerPerson, array=numbers)=>{ 
  const numbers = []
  while(numbers.length<people*cardsPerPerson){
    numbers.push(...divide(suffleArray(array),array.length/6))
  }
  
  const [result] = divide(numbers,cardsPerPerson).slice(0,people)
  return result
}

const shuffledMappedNumbers = (array=numbers)=>{
  const suffledArray = suffleArray(array)
  const mappedArray= suffledArray.map(n=>{
    return {
      value:n, 
      clicked:false, 
      played:false
    }
  })
  return mappedArray
}

const bingoNumbersObject = (people, cardsPerPerson, array=numbers)=>{ 
  let numbers = []
  
  const shuffledNumbers = shuffledMappedNumbers(array)

  while(numbers.length<people*cardsPerPerson){
    const cards = divide(shuffledNumbers,array.length/6)
    const sortedCards = cards.map(el=>el.sort((a,b)=>a.value> b.value?1:-1))
    const cardMatrix = sortedCards.map(el=>divide(el,3))
    const cardMatrixSorted = cardMatrix.map(column=>column.map(el=>el.sort((a,b)=>a.value> b.value?1:-1)))
    numbers.push(...cardMatrixSorted)
  }

  const [result] = divide(numbers,cardsPerPerson).slice(0,people)
  return result
}



module.exports={
  divide,
  suffleArray,
  bingoNumbers,
  bingoNumbersObject,
  // bingoNumbersMap,
}