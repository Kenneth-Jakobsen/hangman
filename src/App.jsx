import {useState } from 'react'
import { languages  } from './languages'
import clsx from 'clsx';
import './index.css'
import { getFarewellText, getRandomWord } from './utils';
import Confetti from 'react-confetti';

function App() {

  const [currentWord, setCurrentWord] = useState(()=>getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  
  let wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length;
  let isGameLost = wrongGuessCount >= languages.length-1;
  let isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  let isGameOver = isGameLost || isGameWon;

  let letterElements = currentWord.split("").map((letter, index) =>{
    const isGuessed = guessedLetters.includes(letter);
    const revealLetter = isGameLost || guessedLetters.includes(letter)
    const className = clsx({
      "show--letter": isGuessed,
      "hide--letter": !isGuessed,
      "lost--letter": isGameOver && !isGuessed
    });
    
    return(
    <span className={className} key={index}>
      {revealLetter ? letter.toUpperCase():''}
    </span>
    )});

  
  let alphabetElements = alphabet.split("").map((letter)=>{
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct:isCorrect,
      wrong:isWrong
    });
    return (<button className={className} onClick={()=>guessLetter(letter)}key={letter}>{letter.toLocaleUpperCase()}</button>)});


  let chipElements = languages.map((chip,index) =>{
    let isLost = index<wrongGuessCount;
    const className = clsx("chip", isLost && "lost")
    return ((<span className={className}key={chip.name} style={{color:chip.color,backgroundColor:chip.backgroundColor}}>{chip.name}</span>))});

  function guessLetter(letter){
    setGuessedLetters(prev => prev.includes(letter) ? prev : [...prev, letter]);
  };

  function renderGameStatus() {
    if (!isGameOver) return null;
    return (
      <>
        <h2>{isGameWon ? "You win!" : "Game Over 😣"}</h2>
        <p>{isGameWon ? <>Well done! 🎉</>: <>Time to learn Assembly 💀</>}</p>
      </>
    );
  }
  

  function newGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
    isGameOver = !isGameOver
    isGameWon = !isGameWon
  }

  return (
    <main>
      {isGameWon && <Confetti/>}
    <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the 
        programming world safe from Assembly!</p>
    </header>

    <section className='languages--chips'>
      {chipElements}
    </section>

    <section className="game--status" id='game--status'>
      {renderGameStatus()}
    </section>

      <section className='word'>
      {letterElements}
      </section>
    
    <section className='keyboard'>
      {alphabetElements}
    </section>

      {(isGameOver || isGameWon) && <button onClick={()=>newGame()} className='new--game'>New Game</button>}

</main>
  );
};

export default App
