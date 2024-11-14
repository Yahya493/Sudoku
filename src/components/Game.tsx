import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { FaArrowRotateRight, FaPause, FaPlay, FaXmark } from 'react-icons/fa6'
import { checkAll, getNumbersCount, isSolved } from '../actions/checkActions'
import { checkSolution, getCellValue, getHint, isFixedCell, solve } from '../actions/solveActions'
import Grid from '../components/Grid'
import Keyboard from '../components/Keyboard'
import { t_board, t_cell, t_difficulty, t_numbers_count } from '../types/types'
import Timer from './Timer'

type Props = {
	fixedValues: t_board,
	setFixedValues: Dispatch<SetStateAction<t_board | null>>
	solution: t_board,
	setSolution: Dispatch<SetStateAction<t_board | null>>
	difficulty: t_difficulty,
	setPlay: Dispatch<SetStateAction<boolean>>,
	custom?: boolean
}

function Game({ fixedValues, setFixedValues, solution, setSolution, difficulty, setPlay, custom = false }: Props) {
	const [values, setValues] = useState(fixedValues)
	const previousValues = useRef<t_board>(fixedValues)
	const history = useRef<t_board[]>([fixedValues])
	const [historyIndex, setHistoryIndex] = useState<number>(0)
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


	useEffect(() => {
		setValues(fixedValues)
	}, [fixedValues])

	useEffect(() => {
		if (history.current.length && historyIndex >= 0 && historyIndex <= history.current.length)
			setValues(history.current[historyIndex])
	}, [historyIndex])

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
		if (isSolved(values)) {
			setGameOver(true)
			if (!editing)
				alert("Game Over, Congratulation!")
		}
		else {
			setGameOver(false)
			const result = checkAll(values)
			// console.log('All chech:', result)
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
		if (!result)
			alert('This Board cannot be solved!')
		return result
	}

	const handleKeyPressed = async (pressedKey: number) => {
		// if (pressedKey < 0 || paused) return
		// console.log('Pressed Key:', pressedKey)
		if (pressedKey == 10) {
			// console.log('Rows chech:', checkAllRows(values))
			setHistoryIndex(prev => prev > 0 ? prev - 1 : prev)
		}
		if (pressedKey == 11) {
			// console.log('Grids chech:', checkAllGrids(values))
			setHistoryIndex(prev => prev < history.current.length - 1 ? prev + 1 : prev)

		}
		if (pressedKey == 12) {
			const sol = await getSolution()
			if (sol) {
				const result = getHint(sol, values)
				if (result)
					setValues(() => {
						if (historyIndex < history.current.length - 1)
							history.current = history.current.filter((_, index) => index <= historyIndex)
						history.current = [...history.current, result]
						setHistoryIndex(prev => prev + 1)
						return result
					})
			}
		}
		if (pressedKey == 13) {
			const sol = await getSolution()
			if (sol) {
				const result = checkSolution(sol, values)
				console.log('All chech:', result)
				if (!result.correct) {
					setWrongCells(result.wrongCells)
					alert(`Sorry, you have made some errors!`)
				}
				else
					alert(`Everything is okay. ${result.cellsLeft} cells to go`)
			}
			else alert(`There is no solution`)
		}
		if (pressedKey == 14) {
			const result = await getSolution()
			if (result)
				setValues(() => {
					if (!editing && historyIndex < history.current.length - 1)
						history.current = history.current.filter((_, index) => index <= historyIndex)
					history.current = editing ? [fixedValues] : [...history.current, result]
					setHistoryIndex(prev => editing ? 0 : prev + 1)
					return result
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
						const newValues = prev.map(row => [...row]);
						// if (getCellValue(newValues, selectedCell) != pressedKey) {
						// 	setWrongCells(prev => prev.filter(cell => cell.row != selectedCell.row || cell.col != selectedCell.col))
						// }
						newValues[selectedCell.row][selectedCell.col] = pressedKey
						if (historyIndex < history.current.length - 1)
							history.current = history.current.filter((_, index) => index <= historyIndex)
						history.current = [...history.current, newValues]
						setHistoryIndex(prev => prev + 1)
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
		// console.log(selectedCell, selectedCellValue)
		setSelectedValue(prev => {
			// if (selectedCellValue == -1) return -1
			if (selectedCellValue != 0) return selectedCellValue
			return prev
		})
	}, [selectedCell])

	const handleReset = () => {
		setSeconds(0)
		// setGameOver(false)
		setValues(fixedValues)
		history.current = [fixedValues]
		setHistoryIndex(0)
	}

	return (
		<>
			<div className='w-full bg-slate-200 text-slate-800 rounded-b-md flex justify-between py-2 px-4 font-bold border-4 border-x-blue-400 border-b-blue-400 mb-2'>
				<Timer seconds={seconds} setSeconds={setSeconds} paused={editing || paused || gameOver} />
				<div className=''>{custom ? 'CUSTOM' : difficulty}</div>
				<div className=' flex justify-end gap-2'>
					<button className='py-1 px-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
						onClick={() => setPlay(false)}
						title='Exit'
					><FaXmark /></button>
					<button className='py-1 px-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
						onClick={handleReset}
						title='Reset'
					><FaArrowRotateRight /></button>
					{editing ?
						<>
							<button className='py-1 px-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
								onClick={() => setEditing(false)}
								title={'Play'}
							><FaPlay /></button>
						</> :
						<>
							<button className='py-1 px-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
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
							historyLenght={history.current.length}
							historyIndex={historyIndex}
							editing={editing}
							gameOver={gameOver}
							conflicte={!!conflictedCells.length}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default Game
