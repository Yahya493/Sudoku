import { useEffect, useState } from 'react'
import { createEmptyBoard, generateSudoku } from './actions/generateActions'
import { solve } from './actions/solveActions'
import './App.css'
import Game from './components/Game'
import { t_board, t_difficulty } from './types/types'
import SudokuExtractor from './components/SudokuExtractor'

function App() {
	const [difficulty, setDifficulty] = useState<t_difficulty>('MEDIUM')
	const [game, setGame] = useState<t_board | null>(null)
	const [solution, setSolution] = useState<t_board | null>(null)
	const [play, setPlay] = useState<boolean>(false)
	const [customGame, setCustomGame] = useState<boolean>(false)

	// const hard = [
	//   [0, 0, 9, 0, 0, 2, 5, 0, 0],
	//   [3, 0, 6, 1, 5, 9, 2, 0, 0],
	//   [0, 0, 0, 0, 6, 0, 0, 0, 0],
	//   [0, 8, 0, 6, 0, 0, 9, 5, 0],
	//   [6, 0, 0, 0, 0, 0, 0, 0, 8],
	//   [0, 3, 7, 0, 0, 8, 0, 1, 0],
	//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
	//   [0, 0, 3, 9, 2, 5, 1, 0, 6],
	//   [0, 0, 2, 7, 0, 0, 8, 0, 0]
	// ]
	// const first = [
	//   [4, 5, 0, 0, 0, 0, 0, 0, 0],
	//   [0, 0, 2, 0, 7, 0, 6, 3, 0],
	//   [0, 0, 0, 0, 0, 0, 0, 2, 8],
	//   [0, 0, 0, 9, 5, 0, 0, 0, 0],
	//   [0, 8, 6, 0, 0, 0, 2, 0, 0],
	//   [0, 2, 0, 6, 0, 0, 7, 5, 0],
	//   [0, 0, 0, 0, 0, 0, 4, 7, 6],
	//   [0, 7, 0, 0, 4, 5, 0, 0, 0],
	//   [0, 0, 8, 0, 0, 9, 0, 0, 0]
	// ]
	const test = [
	  [1, 2, 0, 0, 0, 6, 0, 0, 0],
	  [0, 0, 0, 7, 8, 9, 0, 0, 0],
	  [0, 0, 0, 0, 2, 0, 0, 0, 6],
	  [0, 1, 4, 0, 0, 5, 0, 9, 0],
	  [0, 0, 0, 8, 0, 0, 0, 1, 0],
	  [0, 0, 0, 0, 1, 4, 3, 0, 5],
	  [0, 3, 1, 6, 0, 2, 0, 0, 0],
	  [0, 0, 0, 0, 0, 0, 0, 0, 0],
	  [0, 0, 0, 5, 3, 0, 0, 0, 2]
	]

	useEffect(() => {
		if (game)
			setPlay(true)
		setSolution(null)
	}, [game])

	useEffect(() => {
		if (!play) {
			setGame(null)
			setSolution(null)
		}
	}, [play])

	// const getGame = async (difficulty: t_difficulty) => {
	// 	let solvedGame = null
	// 	let game = null
	// 	while (!solvedGame) {
	// 		game = generateSudoku(difficulty)
	// 		solvedGame = await solve(game)
	// 	}
	// 	setGame(game)
	// 	setSolution(solvedGame)
	// }

	const handleCustomGame = () => {
		setCustomGame(true)
		setGame(createEmptyBoard())
		setPlay(true)
	}

	const handleStartGame = () => {
		setCustomGame(false)
		setGame(generateSudoku(difficulty))
		// getGame(difficulty).then(() => setPlay(true))
	}

	// useEffect(() => {
	//   getGame(difficulty).then(() => setPlay(true))
	// }, [])

	return (
		<div className=' flex justify-center'>
			{play ?
				<div className=''>
					<Game fixedValues={game as t_board} setFixedValues={setGame} solution={solution as t_board} setSolution={setSolution} setPlay={setPlay} difficulty={difficulty} custom={customGame}/>
				</div> :
				<div className='w-10/12 md:w-1/2 h-fit px-4 py-8 bg-slate-300 rounded-xl flex flex-col gap-4 items-center font-bold text-slate-800 mt-10 border-4 border-blue-400'>
					<h1 className=' text-4xl '>Sudoku</h1>
					<div className=' flex flex-col items-center py-10'>
						<div className='text-xl'>Select Difficulty</div>
						<div className='flex gap-4 pt-2 text-blue-400'>
							<div className={`${difficulty == 'EASY' ? 'text-red-600 underline' : ''} cursor-pointer hover:underline underline-offset-2`}
								onClick={() => setDifficulty('EASY')}
							>Easy</div>
							<div className={`${difficulty == 'MEDIUM' ? 'text-red-600 underline' : ''} cursor-pointer hover:underline underline-offset-2`}
								onClick={() => setDifficulty('MEDIUM')}
							>Medium</div>
							<div className={`${difficulty == 'HARD' ? 'text-red-600 underline' : ''} cursor-pointer hover:underline underline-offset-2`}
								onClick={() => setDifficulty('HARD')}
							>Hard</div>
						</div>
					</div>
					<button className='text-slate-200 hover:text-green-400 hover:bg-slate-700 bg-slate-800 w-1/2 px-6 py-2 rounded-xl'
						onClick={handleStartGame}
					>START</button>
					<button className='text-slate-200 hover:text-green-400 hover:bg-slate-700 bg-slate-800 w-1/2 px-6 py-2 rounded-xl'
						onClick={handleCustomGame}
					>Custom Game</button>
					<SudokuExtractor sudokuBoard={game} setSudokuBoard={setGame} setCustomGame={setCustomGame}/>
				</div>
			}
		</div>
	)
}

export default App
