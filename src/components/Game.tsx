import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { FaArrowRotateRight, FaPause, FaPlay, FaXmark } from 'react-icons/fa6'
import { checkAll, getFilledCells, getNumbersCount, isSolved } from '../actions/checkActions'
import { checkSolution, getCellValue, getHint, isFixedCell, solve } from '../actions/solveActions'
import Grid from '../components/Grid'
import Keyboard from '../components/Keyboard'
import { t_board, t_cell, t_difficulty, t_history, t_numbers_count } from '../types/types'
import Timer from './Timer'
import Modal from './Modal'

type Props = {
	fixedValues: t_board,
	setFixedValues: Dispatch<SetStateAction<t_board | null>>
	solution: t_board,
	setSolution: Dispatch<SetStateAction<t_board | null>>
	difficulty: t_difficulty,
	setPlay: Dispatch<SetStateAction<boolean>>,
	custom?: boolean,
	newGame: ({ custom }: { custom?: boolean }) => Promise<t_board>
}

function Game({ fixedValues, setFixedValues, solution, setSolution, difficulty, setPlay, custom = false, newGame }: Props) {
	const [values, setValues] = useState(fixedValues)
	const previousValues = useRef<t_board>(fixedValues)
	const [history, setHistory] = useState<t_history>({ boards: [fixedValues], index: 0 })
	const [pressedKey, setPressedKey] = useState<number>(-1)
	const [selectedCell, setSelectedCell] = useState<t_cell>({ row: -1, col: -1 })
	const [selectedValue, setSelectedValue] = useState<number>(-1)
	const [conflictedCells, setConflictedCells] = useState<t_cell[]>([])
	const [wrongCells, setWrongCells] = useState<t_cell[]>([])
	const [numbersCount, setNumbersCount] = useState<t_numbers_count>()
	const [paused, setPaused] = useState<boolean>(false)
	const [editing, setEditing] = useState<boolean>(custom)
	const [seconds, setSeconds] = useState(0)
	const [gameOver, setGameOver] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const modalContent = useRef<JSX.Element>(<></>)


	useEffect(() => {
		setValues(fixedValues)
	}, [fixedValues])

	useEffect(() => {
		if (history.boards.length && history.index >= 0 && history.index <= history.boards.length)
			setValues(history.boards[history.index])
	}, [history.index])

	const updateWrongCells = () => {
		for (let row = 0; row < values.length; row++) {
			for (let col = 0; col < values[row].length; col++) {
				const currentCell = { row, col }
				const cellValue = getCellValue(values, currentCell)
				if (cellValue != getCellValue(previousValues.current, currentCell))
					setWrongCells(prev => prev.filter(cell => cell.row != currentCell.row || cell.col != currentCell.col))
			}
		}
	}

	useEffect(() => {
		if (gameOver && !editing) {
			modalContent.current = <div className=' flex flex-col gap-3'>
				<div className=" text-slate-800 text-xl">
					Game Over<br />Congratulation!
				</div>
				<div className=" flex justify-center gap-4">
					<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
						onClick={() => setShowModal(false)}
					>CANCEL</button>
					<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
						onClick={() => setPlay(false)}
					>EXIT</button>
					<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
						onClick={handleNewGame}
					>NEW GAME</button>
				</div>
			</div>
			setShowModal(true)
		}
	}, [gameOver])

	useEffect(() => {
		if (isSolved(values)) {
			setGameOver(true)
			// if (!editing)
			// 	alert("Game Over, Congratulation!")
		}
		else {
			setGameOver(false)
			const result = checkAll(values)
			if (result.status == 'FAILED')
				setConflictedCells(prev => [...prev, ...result.conflicts])
		}
		setNumbersCount(getNumbersCount(values))
		updateWrongCells()
		previousValues.current = values
		return () => {
			setConflictedCells([])
		}
	}, [values])

	const getSolution = async () => {
		if (solution) return solution
		const result = await solve(fixedValues)
		setSolution(result)
		if (!result) {
			modalContent.current = <div className=' flex flex-col gap-3'>
				<div className=" text-slate-800 text-xl">
					This Board cannot be solved!
				</div>
				<div className=" flex justify-center gap-4">
					<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
						onClick={() => setShowModal(false)}
					>OK</button>
				</div>
			</div>
			setShowModal(true)
			// alert('This Board cannot be solved!')
		}
		return result
	}

	const handleKeyPressed = async (pressedKey: number) => {
		if (pressedKey == 10) {
			setHistory(prev => prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev)
		}
		if (pressedKey == 11) {
			setHistory(prev => prev.index < history.boards.length - 1 ? { ...prev, index: prev.index + 1 } : prev)

		}
		if (pressedKey == 12) {
			const sol = await getSolution()
			if (sol) {
				const result = getHint(sol, values)
				if (result)
					setHistory(prev => {
						let newBoards = prev.boards
						if (prev.index < prev.boards.length - 1)
							newBoards = prev.boards.filter((_, index) => index <= prev.index)
						return { boards: [...newBoards, result], index: prev.index + 1 }
					})
			}
		}
		if (pressedKey == 13) {
			const sol = await getSolution()
			if (sol) {
				const result = checkSolution(sol, values)
				if (!result.correct) {
					setWrongCells(result.wrongCells)
					modalContent.current = <div className=' flex flex-col gap-3'>
						<div className=" text-slate-800 text-xl">
							Sorry, you have made some errors!
						</div>
						<div className=" flex justify-center gap-4">
							<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
								onClick={() => setShowModal(false)}
							>OK</button>
						</div>
					</div>
					setShowModal(true)
					// alert(`Sorry, you have made some errors!`)
				}
				else {
					modalContent.current = <div className=' flex flex-col gap-3'>
						<div className=" text-slate-800 text-xl">
							Everything is okay<br /> {result.cellsLeft} cells to go
						</div>
						<div className=" flex justify-center gap-4">
							<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
								onClick={() => setShowModal(false)}
							>OK</button>
						</div>
					</div>
					setShowModal(true)
					// alert(`Everything is okay. ${result.cellsLeft} cells to go`)
				}
			}
			else {
				modalContent.current = <div className=' flex flex-col gap-3'>
					<div className=" text-slate-800 text-xl">
						There is no solution
					</div>
					<div className=" flex justify-center gap-4">
						<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
							onClick={() => setShowModal(false)}
						>OK</button>
					</div>
				</div>
				setShowModal(true)
				// alert(`There is no solution`)
			}
		}
		if (pressedKey == 14) {
			const result = await getSolution()
			if (result)
				setHistory(prev => {
					let newBoards = prev.boards
					if (prev.index < prev.boards.length - 1)
						newBoards = prev.boards.filter((_, index) => index <= prev.index)
					return { boards: [...newBoards, result], index: prev.index + 1 }
				})
		}

		if (pressedKey >= 0 && pressedKey <= 9) {
			setSelectedValue(prev => pressedKey > 0 ? pressedKey : prev)
			if (selectedCell.row >= 0 && selectedCell.row <= 9) {
				if (editing) {
					setFixedValues((prev) => {
						const newValues = (prev as t_board).map(row => [...row]);
						newValues[selectedCell.row][selectedCell.col] = pressedKey;
						return newValues
					})
				}
				else if (!isFixedCell(fixedValues, selectedCell)) {
					setValues(prev => {
						const newValues = prev.map(row => [...row])
						newValues[selectedCell.row][selectedCell.col] = pressedKey
						setHistory(prev => {
							let newBoards = prev.boards
							if (prev.index < prev.boards.length - 1)
								newBoards = prev.boards.filter((_, index) => index <= prev.index)
							return { boards: [...newBoards, newValues], index: prev.index + 1 }
						})
						return newValues
					})
				}
			}
		}
		else setSelectedValue(-1)
		setPressedKey(-1)
	}

	useEffect(() => {
		if (pressedKey < 0 || paused) return
		handleKeyPressed(pressedKey)
	}, [pressedKey])

	useEffect(() => {
		const selectedCellValue = getCellValue(values, selectedCell)
		setSelectedValue(prev => {
			if (selectedCellValue != 0) return selectedCellValue
			return prev
		})
	}, [selectedCell])

	const handleReset = () => {
		modalContent.current = <div className=' flex flex-col gap-3'>
			<div className=" text-slate-800 text-xl">
				Are you sure!<br />
				You're about to reset the game
			</div>
			<div className=" flex justify-center gap-4">
				<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
					onClick={() => setShowModal(false)}
				>CANCEL</button>
				<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
					onClick={() => {
						setShowModal(false)
						setSeconds(0)
						setValues(fixedValues)
						setHistory({ boards: [fixedValues], index: 0 })
					}}
				>YES</button>
			</div>
		</div>
		setShowModal(true)
	}

	const handlePlay = async () => {
		const sol = await getSolution()
		if (!sol) {
			modalContent.current = <div className=' flex flex-col gap-3'>
				<div className=" text-slate-800 text-xl">
					This Board cannot be solved!
				</div>
				<div className=" flex justify-center gap-4">
					<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
						onClick={() => setShowModal(false)}
					>OK</button>
				</div>
			</div>
			setShowModal(true)
			return
		}
		setHistory({ boards: [fixedValues], index: 0 })
		setEditing(false)
	}

	const handleNewGame = async () => {
		const game = await newGame({ custom: custom })
		setFixedValues(game)
		setHistory({ boards: [game], index: 0 })
		setEditing(custom)
		setSeconds(0)
		setShowModal(false)
	}

	const handleExit = () => {
		modalContent.current = <div className=' flex flex-col gap-3'>
			<div className=" text-slate-800 text-xl">
				Are you sure!<br />Your progress will be lost
			</div>
			<div className=" flex justify-center gap-4">
				<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
					onClick={() => setShowModal(false)}
				>CANCEL</button>
				<button className="rounded-md py-1 px-3 text-sm bg-slate-800 hover:bg-slate-600 hover:text-green-400"
					onClick={() => {
						setShowModal(false)
						setPlay(false)
					}}
				>YES</button>
			</div>
		</div>
		setShowModal(true)
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// console.log(event.key)
			setPressedKey(() => (event.key >= '0' && event.key <= '9') ? +event.key : -1)
			if (event.key == ' ') setSelectedCell({row: -1, col: -1})
			if (event.key == 'Escape') handleExit()
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const filledCells = getFilledCells(fixedValues)

	return (
		<>
			<Modal content={modalContent.current} show={showModal} />
			<div className='w-full bg-slate-200 text-slate-800 rounded-b-md flex justify-between items-center py-2 px-4 font-bold border-4 border-x-blue-400 border-b-blue-400 mb-2'>
				<Timer seconds={seconds} setSeconds={setSeconds} paused={editing || paused || gameOver} />
				<div className=''>{custom ? 'CUSTOM' : difficulty}</div>
				<div className=' flex justify-end flex-row-reverse gap-2'>
					<button className='py-1 px-2 aspect-square bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
						onClick={handleExit}
						title='Exit'
					><FaXmark /></button>
					<button className='py-1 px-2 aspect-square bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
						onClick={handleReset}
						title='Reset'
					><FaArrowRotateRight /></button>
					{editing ?
						<>
							<button className={`py-1 px-2 aspect-square ${(filledCells < 25) || !!conflictedCells.length ? 'bg-slate-600' : 'bg-slate-800'} text-slate-200 rounded-md hover:bg-slate-600`}
								onClick={handlePlay}
								title={'Play'}
								disabled={filledCells < 25 || !!conflictedCells.length}
							><FaPlay /></button>
						</> :
						<>
							<button className='py-1 px-2 aspect-square bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
								onClick={() => setPaused(prev => !prev)}
								title={paused ? 'Continue' : 'Pause'}
							>{paused ? <FaPlay /> : <FaPause />}</button>
						</>
					}
				</div>
			</div>
			<div className='flex justify-center w-full'>
				<div className=' w-fit font-bold flex flex-col md:flex-row gap-4'>
					<Grid
						values={values}
						fixedValues={fixedValues}
						selectedCell={selectedCell}
						setSelectedCell={setSelectedCell}
						conflictedCells={conflictedCells}
						wrongCells={wrongCells}
						covered={paused}
						selectedValue={selectedValue}
					/>
					<div className='w-fit self-center'>
						<Keyboard
							setPressedKey={setPressedKey}
							counts={numbersCount}
							historyLenght={history.boards.length}
							historyIndex={history.index}
							editing={editing}
							gameOver={gameOver}
							conflicte={!!conflictedCells.length}
							fiewNumbers={filledCells < 25}
							paused={paused}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default Game
