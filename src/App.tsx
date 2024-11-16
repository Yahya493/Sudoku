import { useEffect, useState } from 'react'
import { createEmptyBoard, generateSudoku } from './actions/generateActions'
import './App.css'
import Game from './components/Game'
import SudokuExtractor from './components/SudokuExtractor'
import { t_board, t_difficulty } from './types/types'

function App() {
	const [difficulty, setDifficulty] = useState<t_difficulty>('MEDIUM')
	const [game, setGame] = useState<t_board | null>(null)
	const [solution, setSolution] = useState<t_board | null>(null)
	const [play, setPlay] = useState<boolean>(false)
	const [customGame, setCustomGame] = useState<boolean>(false)
	const [loadingImage, setLoadingImage] = useState<boolean>(false);

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
	// const test = [
	//   [1, 2, 0, 0, 0, 6, 0, 0, 0],
	//   [0, 0, 0, 7, 8, 9, 0, 0, 0],
	//   [0, 0, 0, 0, 2, 0, 0, 0, 6],
	//   [0, 1, 4, 0, 0, 5, 0, 9, 0],
	//   [0, 0, 0, 8, 0, 0, 0, 1, 0],
	//   [0, 0, 0, 0, 1, 4, 3, 0, 5],
	//   [0, 3, 1, 6, 0, 2, 0, 0, 0],
	//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
	//   [0, 0, 0, 5, 3, 0, 0, 0, 2]
	// ]

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

	const handleStartGame = async () => {
		setCustomGame(false)
		setGame(await generateSudoku(difficulty))
		// getGame(difficulty).then(() => setPlay(true))
	}

	const newGame = async ({ custom = false }: { custom?: boolean }): Promise<t_board> => {
		setCustomGame(custom)
		if (custom)
			return createEmptyBoard()
		return await generateSudoku(difficulty)
	}

	// useEffect(() => {
	//   getGame(difficulty).then(() => setPlay(true))
	// }, [])

	return (
		<div className=' flex justify-center select-none'>
			{play ?
				<div className='w-fit'>
					<Game
						fixedValues={game as t_board}
						setFixedValues={setGame}
						solution={solution as t_board}
						setSolution={setSolution}
						setPlay={setPlay}
						difficulty={difficulty}
						custom={customGame}
						newGame={newGame}
					/>
				</div> :
				<div className='w-10/12 md:w-1/2 h-fit px-4 py-8 bg-slate-300 rounded-xl flex flex-col gap-4 items-center font-bold text-slate-800 mt-10 border-4 border-blue-400'>
					<h1 className=' text-4xl pb-3 border-b-2 w-full border-blue-400 '>Sudoku</h1>
					<div className=' flex flex-col items-center'>
						<div className='text-xl'>Select Difficulty</div>
						<div className='flex gap-4 pt-2 text-blue-400'>
							<button className={` rounded-md py-1 px-3 ${difficulty == 'EASY' ? 'bg-slate-800 text-slate-200' : 'bg-slate-400 text-slate-800'} hover:bg-slate-600 hover:text-green-400 `}
								onClick={() => setDifficulty('EASY')}
							>EASY</button>
							<button className={` rounded-md py-1 px-3 ${difficulty == 'MEDIUM' ? 'bg-slate-800 text-slate-200' : 'bg-slate-400 text-slate-800'} hover:bg-slate-600 hover:text-green-400 `}
								onClick={() => setDifficulty('MEDIUM')}
							>MEDIUM</button>
							<button className={` rounded-md py-1 px-3 ${difficulty == 'HARD' ? 'bg-slate-800 text-slate-200' : 'bg-slate-400 text-slate-800'} hover:bg-slate-600 hover:text-green-400 `}
								onClick={() => setDifficulty('HARD')}
							>HARD</button>
						</div>
					</div>
					<button className={` w-3/4 px-6 py-2 rounded-xl ${loadingImage ? 'bg-slate-400 cursor-default' : 'bg-slate-800 hover:text-green-400 text-slate-200 hover:bg-slate-600'}`}
						onClick={handleStartGame} disabled={loadingImage}
					>START</button>
					<button className={` w-3/4 px-6 py-2 rounded-xl ${loadingImage ? 'bg-slate-400 cursor-default' : 'bg-slate-800 hover:text-green-400 text-slate-200 hover:bg-slate-600'}`}
						onClick={handleCustomGame} disabled={loadingImage}
					>Custom Game</button>
					<SudokuExtractor
						setSudokuBoard={setGame}
						setCustomGame={setCustomGame}
						loading={loadingImage}
						setLoading={setLoadingImage}
					/>
				</div>
			}
		</div>
	)
}

export default App
