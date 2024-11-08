import React, { useState, useEffect, useRef } from 'react';
import { minimax, checkWinner } from './Algorithms';
import './App.css';
import backgroundMusic from "./assets/music.mp3";
import click from "./assets/Click.mp3";

const EMPTY_BOARD = Array(9).fill(null);

function getRandomNumber() {
  return Math.floor(Math.random() * 2) + 1;
}

const getComputerMove = (board, difficulty) => {
  if (difficulty === 'Easy') {
    const availableMoves = board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  if (difficulty === 'Medium' && Math.random() > 0.5) {
    const availableMoves = board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      let score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

function App() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [difficulty, setDifficulty] = useState('Easy');
  const [winner, setWinner] = useState(null);
  const [timer, setTime] = useState(8)
  const [playerScore, setPlayerScore] = useState(0)
  const [machineScore, setMachineScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [currentPage, setCurrentPage] = useState("Home")
  const [gameMode, setGameMode] = useState("")
  const [count, setCount] = useState(0)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [audio, setAudio] = useState("off")
  const [playerTurn, setPlayerTurn] = useState("one")

  const audioRef = useRef(new Audio(backgroundMusic));

  const changeAudio = () => {
    playAudio()
    if (audio == "off") {
      setAudio("on")
    } else {
      setAudio("off")
    }
  }

  useEffect(() => {
    const audionew = audioRef.current;

    audionew.loop = true;
    audionew.volume = 0.5;
    if (audio === 'on') {
      // console.log("object")
      audionew.play().catch(error => {
        console.log("Audio playback failed due to autoplay restrictions", error);
      });

      return () => {
        audionew.pause();
      };
    }
  }, [audio]);



  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  const changePage = (type) => {
    if (type == "multiplayer") {

      playAudio()
      setPlayer1Score(0)
      setPlayer2Score(0)
      setWinner(null)
      setGameOver(false)
      setCurrentPage("Multiplayer")
      initializeGame()
    }
    else if (type == "singleplayer") {
      playAudio()
      setCurrentPage("Selection")
    }
  }

  const goBack = (location) => {
    playAudio()
    setCurrentPage(location)
  }

  useEffect(() => {
    if (!gameOver) {

      const countdown = setTimeout(() => {
        if (timer > 0) {
          setTime(timer - 1);
        } else {
          if (!winner) {
            if(currentPage == "Game"){
              setWinner(isPlayerTurn ? "O" : "X");
            }
            else if(currentPage == "Multiplayer"){
              setWinner(playerTurn == "two" ? "X" : "O");
            }
          }
        }
      }, 1000);

      return () => clearTimeout(countdown);
    }
  }, [timer, isPlayerTurn, playerTurn]);

  useEffect(() => {

    if (winner == "X") {
      setPlayerScore(playerScore + 1)
      if (playerScore == 2) {
        setTime(0)
        setGameOver(true)
      }
    } else if (winner == "O") {
      setMachineScore(machineScore + 1)
      if (machineScore == 2) {
        setTime(0)
        setGameOver(true)
      }
    }
  }, [winner])

  useEffect(() => {

    if (winner == "X") {
      setPlayer1Score(player1Score + 1)
      if (player1Score == 2) {
        setTime(0)
        setGameOver(true)
      }
    } else if (winner == "O") {
      setPlayer2Score(player2Score + 1)
      if (player2Score == 2) {
        setTime(0)
        setGameOver(true)
      }
    }
  }, [winner])

  const initializeGame = () => {

    setTime(8)
    setBoard(EMPTY_BOARD);
    setPlayerTurn("one")
    setWinner(null);
    setPlayer1Score(0)
    setPlayer2Score(0)
  }

  const playAudio = () => {
    if (audio !== "off") {
      const newaudio = new Audio(click)
      newaudio.play()
    }
  }

  const handleClick = (index) => {
    playAudio()
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setTime(0)
      setWinner(gameResult);
      return;
    }
    setTime(8)
    setIsPlayerTurn(false);
  };

  // useEffect(() => {

  //   const gameResult = checkWinner(newBoard);
  //   if (gameResult) {
  //     setTime(0)
  //     setWinner(gameResult);
  //     return;
  //   }

  // }, [playerTurn])

  const handleMultiplayer = (index) => {
    playAudio()
    if (board[index] || winner) return;

    const newBoard = [...board];
    if (playerTurn == "one") {
      newBoard[index] = 'X';
      setBoard(newBoard);
      setPlayerTurn("two")
      setTime(8)
    } else if (playerTurn == 'two') {
      newBoard[index] = 'O';
      setBoard(newBoard);
      setTime(8)
      setPlayerTurn("one")
    }
    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setTime(0)
      setWinner(gameResult);
      return;
    }

  }

  const resetGame = () => {
    playAudio()
    setTime(8)
    setBoard(EMPTY_BOARD);
    setIsPlayerTurn(true);
    setPlayerTurn("one")
    setWinner(null);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const rnd = getRandomNumber()
      setTimeout(() => {
        const computerMove = getComputerMove(board, difficulty);
        if (computerMove !== undefined) {
          const newBoard = [...board];
          newBoard[computerMove] = 'O';
          setBoard(newBoard);

          const gameResult = checkWinner(newBoard);
          if (gameResult) {
            setTime(0)
            setWinner(gameResult);
          } else {
            setTime(8)
            setIsPlayerTurn(true);
          }
        }
      }, rnd * 1000);
    }
  }, [isPlayerTurn, board, difficulty, winner]);

  return (
    <>
      {
        currentPage == "Home"
          ?
          <>
            <div className='min-h-screen h-fit  bg-[#f2f5f9] pt-[40px]'>
              <div className='w-[320px] m-auto'>
                <div className='flex justify-end items-center mb-[40px]'>
                  <div onClick={changeAudio} className='speaker-button'>
                    {
                      audio == "off" ?
                        <i class="fa-solid fa-volume-xmark text-[#b7c5d5] text-[20px]"></i>
                        :
                        <i class="fa-solid fa-volume-high text-[#b7c5d5] text-[20px]"></i>
                    }
                  </div>
                </div>
                <div className='relative min-h-[160px] h-fit flex justify-center items-center'>
                  <img src="O.png" className='absolute w-[100px]' alt="" />
                  <img src="X.png" className='absolute w-[100px]' alt="" />
                </div>
                <div className='text-center text-[25px] text-[#90a5bb] font-medium tracking-[0.5px]'>
                  TIC TAC TOE
                </div>
                <div className='flex flex-col gap-[40px] pt-[14vh]'>
                  <button onClick={() => changePage("multiplayer")} className='home-btn text-[#CF4945]'>
                    PLAYER VS PLAYER
                  </button>
                  <button onClick={() => changePage("singleplayer")} className='home-btn text-[#607AAD]'>
                    PLAYER VS MACHINE
                  </button>
                </div>
              </div>

            </div>
          </>
          :
          currentPage == 'Selection' ?
            <>
              <div className='min-h-screen h-fit  bg-[#f2f5f9] pt-[40px]'>
                <div className='w-[320px] h-full m-auto flex flex-col justify-between'>
                  <div className='flex justify-between items-center mb-[40px]'>
                    <div onClick={() => goBack("Home")} className='back-button'>
                      <i class="fa-solid fa-arrow-left text-[#b7c5d5] text-[25px]"></i>
                    </div>
                    <div onClick={changeAudio} className='speaker-button'>
                      {
                        audio == "off" ?
                          <i class="fa-solid fa-volume-xmark text-[#b7c5d5] text-[20px]"></i>
                          :
                          <i class="fa-solid fa-volume-high text-[#b7c5d5] text-[20px]"></i>
                      }
                    </div>
                  </div>

                  <div className='text-center min-h-[150px] flex justify-center items-center  text-[25px] text-[#90a5bb] font-medium tracking-[1.5px]'>
                    SELECT DIFFICULTY
                  </div>
                  <div className='flex flex-col gap-[40px] pt-[10vh]'>
                    <button onClick={() => {
                      playAudio()
                      resetGame()
                      setPlayerScore(0)
                      setMachineScore(0)
                      setWinner(null)
                      setGameOver(false)
                      setTime(8)
                      setCurrentPage("Game")
                      setDifficulty("Easy")
                    }}
                      className='home-btn text-[#607AAD]'>
                      EASY
                    </button>
                    <button onClick={() => {
                      playAudio()
                      resetGame()
                      setPlayerScore(0)
                      setMachineScore(0)
                      setWinner(null)
                      setTime(8)
                      setGameOver(false)
                      setCurrentPage("Game")
                      setDifficulty("Medium")
                    }} className='home-btn text-[#607AAD]'>
                      MEDIUM
                    </button>
                    <button onClick={() => {
                      playAudio()
                      resetGame()
                      setGameOver(false)
                      setPlayerScore(0)
                      setMachineScore(0)
                      setWinner(null)
                      setTime(8)
                      setCurrentPage("Game")
                      setDifficulty("Hard")
                    }} className='home-btn text-[#607AAD]'>
                      HARD
                    </button>
                  </div>
                </div>

              </div>
            </>
            :
            currentPage == "Multiplayer"
              ?
              <div className=''>
                {
                  gameOver == true ?
                    <><div className='flex justify-center'>

                      <div className='h-screen w-full bg-[#00000028] backdrop-blur-[2px] fixed'></div>
                      <div className=' win fixed pt-[30px] gap-[20px] flex items-center flex-col bottom-0 w-full h-[400px] bg-white rounded-t-[40px] '>
                        <img src="trophy.png" className='w-[200px]' alt="" />
                        <div className='normal-text'>Player {player1Score > player2Score ? 1 : 2} Won the match</div>
                        <button onClick={(e) => {
                          playAudio()
                          setCurrentPage("Home")
                        }} className='new-game-btn'>NEW GAME</button>
                      </div>
                    </div>
                    </>
                    :
                    null
                }


                <div className="min-h-screen h-fit  bg-[#f2f5f9] pt-[40px] ">


                  <div className='w-[320px] m-auto'>


                    <div className='flex justify-between items-center mb-[40px]'>

                      <div onClick={() => goBack("Home")} className='back-button'>
                        <i class="fa-solid fa-arrow-left text-[#b7c5d5] text-[25px]"></i>
                      </div>
                      {winner && (

                        winner == "Tie" ?
                          <div className=' text-[19px] text-[#607AAD] font-medium tracking-[0.5px]  '>
                            It's a Tie
                          </div>
                          :
                          winner == "X" ?
                            <div className=' text-[19px] text-[#607AAD] font-medium tracking-[0.5px]  '>
                              PLAYER 1 WON
                            </div>
                            :
                            <div className=' text-[19px] text-[#CF4945] font-medium tracking-[0.5px]  '>
                              PLAYER 2 WON
                            </div>
                      )}
                      <div onClick={changeAudio} className='speaker-button'>
                        {
                          audio == "off" ?
                            <i class="fa-solid fa-volume-xmark text-[#b7c5d5] text-[20px]"></i>
                            :
                            <i class="fa-solid fa-volume-high text-[#b7c5d5] text-[20px]"></i>
                        }
                      </div>
                    </div>
                    <div className='flex justify-between items-center gap-[20px] mb-[40px]'>
                      <div className='flex flex-col items-start'>
                        <div className='normal-text '>Player 1</div>
                        <div className='score-board'>
                          <span className={`text-[23px] ${player1Score >= 1 ? "text-[#607AAD]" : "text-[#bdc7d2]"}`}>X</span>
                          <span className={`text-[23px] ${player1Score >= 2 ? "text-[#607AAD]" : "text-[#bdc7d2]"}`}>X</span>
                          <span className={`text-[23px] ${player1Score == 3 ? "text-[#607AAD]" : "text-[#bdc7d2]"}`}>X</span>
                        </div>
                      </div>
                      <div className='flex flex-col justify-center text-center'>
                        <div className='normal-text'>Time</div>
                        <div className='normal-text'>00:0{timer}</div>
                      </div>
                      <div className='flex flex-col items-end'>
                        <div className='normal-text'>Player 2</div>
                        <div className='score-board'>
                          <span className={`text-[23px] ${player2Score >= 1 ? "text-[#CF4945]" : "text-[#bdc7d2]"} `}>O</span>
                          <span className={`text-[23px] ${player2Score >= 2 ? "text-[#CF4945]" : "text-[#bdc7d2]"}`}>O</span>
                          <span className={`text-[23px] ${player2Score == 3 ? "text-[#CF4945]" : "text-[#bdc7d2]"}`}>O</span>
                        </div>
                      </div>

                    </div>

                    <div className='flex justify-center'>

                      <div className=" w-[350px] gap-y-[10px] flex-wrap flex justify-between  items-center">
                        {board.map((cell, i) => (
                          <div key={i} onClick={() => {

                            handleMultiplayer(i)

                          }} class={`${cell != null ? "box-after" : "box-before"}`}>
                            {
                              cell == "X" ?
                                <img src="X.png" className='img' alt="" />
                                :
                                cell == "O"
                                  ?
                                  <img src="O.png" className='img' alt="" />
                                  :
                                  null
                            }
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='m-auto flex justify-center mt-[40px] pb-[30px]'>
                      <button onClick={resetGame} className='restart-btn '>RESTART</button>
                    </div>
                  </div>
                </div>
              </div>
              :
              currentPage == "Game"
                ?
                <div className=''>
                  {
                    gameOver == true ?
                      <><div className='flex justify-center'>

                        <div className='h-screen w-full bg-[#00000028] backdrop-blur-[2px] fixed'></div>
                        <div className=' win fixed pt-[30px] gap-[20px] flex items-center flex-col bottom-0 w-full h-[400px] bg-white rounded-t-[40px] '>
                          <img src="trophy.png" className='w-[200px]' alt="" />
                          <div className='normal-text'> {playerScore > machineScore ? 'Player 1' : "Machine"} Won the match</div>
                          <button onClick={(e) => {
                            playAudio()
                            setCurrentPage("Home")
                          }} className='new-game-btn'>NEW GAME</button>
                        </div>
                      </div>
                      </>
                      :
                      null
                  }


                  <div className="min-h-screen h-fit  bg-[#f2f5f9] pt-[40px] ">


                    <div className='w-[320px] m-auto'>


                      <div className='flex justify-between items-center mb-[40px]'>

                        <div onClick={() => goBack("Selection")} className='back-button'>
                          <i class="fa-solid fa-arrow-left text-[#b7c5d5] text-[25px]"></i>
                        </div>
                        {winner && (

                          winner == "Tie" ?
                            <div className=' text-[19px] text-[#607AAD] font-medium tracking-[0.5px]  '>
                              It's a Tie
                            </div>
                            :
                            winner == "X" ?
                              <div className=' text-[19px] text-[#607AAD] font-medium tracking-[0.5px]  '>
                                PLAYER 1 WON
                              </div>
                              :
                              <div className=' text-[19px] text-[#CF4945] font-medium tracking-[0.5px]  '>
                                MACHINE WON
                              </div>
                        )}
                        <div onClick={changeAudio} className='speaker-button'>
                          {
                            audio == "off" ?
                              <i class="fa-solid fa-volume-xmark text-[#b7c5d5] text-[20px]"></i>
                              :
                              <i class="fa-solid fa-volume-high text-[#b7c5d5] text-[20px]"></i>
                          }
                        </div>
                      </div>
                      <div className='flex justify-between items-center gap-[20px] mb-[40px]'>
                        <div className='flex flex-col items-start'>
                          <div className='normal-text '>Player 1</div>
                          <div className='score-board'>
                            <span className={`text-[23px] ${playerScore >= 1 ? "text-[#607AAD]" : "text-[#bdc7d2]"}`}>X</span>
                            <span className={`text-[23px] ${playerScore >= 2 ? "text-[#607AAD]" : "text-[#bdc7d2]"}`}>X</span>
                            <span className={`text-[23px] ${playerScore == 3 ? "text-[#607AAD]" : "text-[#bdc7d2]"}`}>X</span>
                          </div>
                        </div>
                        <div className='flex flex-col justify-center text-center'>
                          <div className='normal-text'>Time</div>
                          <div className='normal-text'>00:0{timer}</div>
                        </div>
                        <div className='flex flex-col items-end'>
                          <div className='normal-text'>Machine</div>
                          <div className='score-board'>
                            <span className={`text-[23px] ${machineScore >= 1 ? "text-[#CF4945]" : "text-[#bdc7d2]"} `}>O</span>
                            <span className={`text-[23px] ${machineScore >= 2 ? "text-[#CF4945]" : "text-[#bdc7d2]"}`}>O</span>
                            <span className={`text-[23px] ${machineScore == 3 ? "text-[#CF4945]" : "text-[#bdc7d2]"}`}>O</span>
                          </div>
                        </div>

                      </div>

                      <div className='flex justify-center'>

                        <div className=" w-[350px] gap-y-[10px] flex-wrap flex justify-between  items-center">
                          {board.map((cell, i) => (
                            <div key={i} onClick={() => {
                              if (isPlayerTurn) {
                                handleClick(i)
                              }
                            }} class={`${cell != null ? "box-after" : "box-before"}`}>
                              {
                                cell == "X" ?
                                  <img src="X.png" className='img' alt="" />
                                  :
                                  cell == "O"
                                    ?
                                    <img src="O.png" className='img' alt="" />
                                    :
                                    null
                              }
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='m-auto flex justify-center mt-[40px] pb-[30px]'>
                        <button onClick={resetGame} className='restart-btn '>RESTART</button>
                      </div>
                    </div>
                  </div>
                </div>
                :
                null
      }
    </>
  )

}

export default App;
