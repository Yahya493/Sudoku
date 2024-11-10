import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FaArrowRotateRight, FaPause, FaPlay, FaXmark } from 'react-icons/fa6'
import { checkAll, checkAllCols, checkAllGrids, checkAllRows, getNumbersCount, isSolved } from '../actions/checkActions'
import { getHint, isFixedCell, solve } from '../actions/solveActions'
import Grid from '../components/Grid'
import Keyboard from '../components/Keyboard'
import { t_board, t_difficulty, t_numbers_count } from '../types/types'
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
	const [pressedKey, setPressedKey] = useState<number>(0)
	const [selectedCell, setSelectedCell] = useState<{ row: number, col: number }>({ row: -1, col: -1 })
	const [highlightedCell, setHighlightedCell] = useState<{ row: number, col: number }[]>([])
	const [numbersCount, setNumbersCount] = useState<t_numbers_count>()
	const [paused, setPaused] = useState<boolean>(false)
	const [editing, setEditing] = useState<boolean>(custom)
	const [seconds, setSeconds] = useState(0)
	const [gameOver, setGameOver] = useState(false)


	useEffect(() => {
		setValues(fixedValues)
	}, [fixedValues])


	useEffect(() => {
		if (!editing && isSolved(values)) {
			setGameOver(true)
			alert("Congratulation!")
		}
		else {
			setGameOver(false)
			const result = checkAll(values)
			// console.log('All chech:', result)
			if (result.status == 'FAILED')
				setHighlightedCell(prev => [...prev, ...result.conflicts])
		}
		setNumbersCount(getNumbersCount(values))
		return () => {
			setHighlightedCell([])
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

	const handeKeyPressed = async (pressedKey: number) => {
		if (pressedKey < 0 || paused) return
		// console.log('Pressed Key:', pressedKey)
		if (pressedKey == 10) {
			console.log('Rows chech:', checkAllRows(values))

		}
		if (pressedKey == 11) {
			console.log('Grids chech:', checkAllGrids(values))

		}
		if (pressedKey == 12) {
			const sol = await getSolution()
			if (sol) {
				const result = getHint(sol, values)
				if (result)
					setValues(result)
			}
		}
		if (pressedKey == 13) {
			const result = checkAll(values)
			console.log('All chech:', result)
			if (result.status == 'FAILED')
				setHighlightedCell(prev => [...prev, ...result.conflicts])
			if (result.status == 'PASSED')
				alert('Everything is okay')
		}
		if (pressedKey == 14) {
			const result = await getSolution()
			if (result)
				setValues(result)
		}

		if (pressedKey >= 0 && pressedKey <= 9) {
			if (selectedCell.row >= 0 && selectedCell.row <= 9) {
				if (editing) {
					setFixedValues((prev) => {
						const newValues = (prev as t_board).map(row => [...row]);
						newValues[selectedCell.row][selectedCell.col] = pressedKey;
						return newValues
					})
				}
				else if (!isFixedCell(fixedValues, selectedCell))
					setValues(prev => {
						const newValues = prev.map(row => [...row]);
						newValues[selectedCell.row][selectedCell.col] = pressedKey;
						return newValues
					})
			}
		}
		setPressedKey(-1)
	}

	useEffect(() => {
		handeKeyPressed(pressedKey)
	}, [pressedKey])

	const handleReset = () => {
		setSeconds(0)
		// setGameOver(false)
		setValues(fixedValues)
	}

	return (
		<>
			<div className='bg-slate-200 text-slate-800 rounded-b-md flex justify-between py-2 px-4 font-bold border-4 border-x-blue-400 border-b-blue-400 mb-2'>
				<Timer seconds={seconds} setSeconds={setSeconds} paused={editing || paused || gameOver} />
				<div className=''>{custom ? 'CUSTOM' : difficulty}</div>
				<div className=' flex justify-end gap-2'>
					<button className='py-1 px-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
						onClick={() => setPlay(false)}
						title='Exit'
					><FaXmark /></button>
					{editing ?
						<>
							<button className='py-1 px-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
								onClick={() => setEditing(false)}
								title={'Play'}
							><FaPlay /></button>
						</> :
						<>
							<button className='py-1 px-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
								onClick={handleReset}
								title='Reset'
							><FaArrowRotateRight /></button>
							<button className='py-1 px-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-600'
								onClick={() => setPaused(prev => !prev)}
								title={paused ? 'Continue' : 'Pause'}
							>{paused ? <FaPlay /> : <FaPause />}</button>
						</>
					}
				</div>
			</div>
			<div className=' w-fit font-bold flex flex-col md:flex-row gap-4'>
				<Grid
					values={values}
					fixedValues={fixedValues}
					setValues={setValues}
					selectedCell={selectedCell}
					setSelectedCell={setSelectedCell}
					highlightedCell={highlightedCell}
					covered={paused}
				/>
				<div className='w-fit self-center'>
					<Keyboard setPressedKey={setPressedKey} counts={numbersCount} />
				</div>

			</div>
		</>
	)
}

export default Game
