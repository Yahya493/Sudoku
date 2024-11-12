import { t_board, t_cell, t_check_solution } from "../types/types"
import { checkAll, checkByCell, isFilled, isSolved } from "./checkActions"

const getNextCell = (cell: t_cell): t_cell | null => {
	if (cell.col < 8)
		return { row: cell.row, col: cell.col + 1 }
	if (cell.row < 8)
		return { row: cell.row + 1, col: 0 }
	return null
}

const getPreviousCell = (cell: t_cell): t_cell | null => {
	if (cell.col > 0)
		return { row: cell.row, col: cell.col - 1 }
	if (cell.row > 0)
		return { row: cell.row - 1, col: 8 }
	return null
}

const isNineCell = (values: t_board, cell: t_cell): boolean => {
	return (values[cell.row][cell.col] == 9)
}

const incrementCell = (values: t_board, cell: t_cell): boolean => {
	if (isNineCell(values, cell)) return false
	values[cell.row][cell.col] += 1
	return true
}

const setCellValue = (values: t_board, cell: t_cell, nb: number): void => {
	values[cell.row][cell.col] = nb
}

const getCellValue = (values: t_board, cell: t_cell): number => {
	if (cell.row < 0 || cell.col < 0) return -1
	return values[cell.row][cell.col]
}

const isFixedCell = (fixedValues: t_board, cell: t_cell): boolean => {
	return fixedValues[cell.row][cell.col] != 0
}

const isEmptyCell = (values: t_board, cell: t_cell): boolean => {
	return values[cell.row][cell.col] == 0
}

const clearCell = (values: t_board, cell: t_cell): void => {
	values[cell.row][cell.col] = 0
}

const rollback = (fixedValues: t_board, values: t_board, cell: t_cell | null): t_cell | null => {
	if (!cell) return null
	// console.log('value: ',values[cell.row][cell.col], cell)
	if (isFixedCell(fixedValues, cell)) {
		return rollback(fixedValues, values, getPreviousCell(cell))
	}
	if (isNineCell(values, cell)) {
		clearCell(values, cell)
		return rollback(fixedValues, values, getPreviousCell(cell))
	}
	return cell
}

// const recSolve = (fixedValues: t_board, values: t_board, cell: t_cell | null): t_board => {
// 	if (!cell)
// 		return values
// 	if (isFixedCell(fixedValues, cell))
// 		return recSolve(fixedValues, values, getNextCell(cell))
// 	while (true) {
// 		if (!incrementCell(values, cell)) {
// 			// const newCell = rollback(fixedValues,values, cell)
// 			return recSolve(fixedValues, values, rollback(fixedValues, values, cell))
// 		}
// 		if (!checkByCell(values, cell)) continue
// 		return recSolve(fixedValues, values, getNextCell(cell))
// 	}
// }

const recSolve = (fixedValues: t_board, values: t_board): t_board => {
	let cell = { row: 0, col: 0 } as t_cell | null
	while (cell) {
		if (isFixedCell(fixedValues, cell)) {
			cell = getNextCell(cell)
			continue
		}
		while (true) {
			if (!incrementCell(values, cell)) {
				cell = rollback(fixedValues, values, cell)
				break
			}
			if (!checkByCell(values, cell)) continue
			cell = getNextCell(cell)
			break
		}
	}
	return values
}

const duplicateValues = (fixedValues: t_board): t_board => {
	return fixedValues.map(row => row.map(cell => cell))
}

// const getPossibleValues = (values: t_board, cell: t_cell): number[] => {
// 	let result = [] as number[]
// 	for (let i = 1; i < 10; i++) {
// 		setCellValue(values, cell, i)
// 		if (checkByCell(values, cell))
// 			result = [...result, i]
// 	}
// 	clearCell(values, cell)
// 	return result
// }
// const getPossibleCellsByCustomGridAndValue = (values: t_board, row_1: number, row_2: number, col_1: number, col_2: number, nb: number): t_cell[] => {
// 	let result = [] as t_cell[]
// 	for (let row = row_1; row < row_2; row++) {
// 		for (let col = col_1; col < col_2; col++) {
// 			const cell = { row, col }
// 			if (isEmptyCell(values, cell)) {
// 				setCellValue(values, cell, nb)
// 				if (checkByCell(values, cell))
// 					result = [...result, cell]
// 				clearCell(values, cell)
// 			}
// 		}
// 	}
// 	return result
// }
// const getPossibleCellsByGridAndValue = (values: t_board, grid: number, nb: number): t_cell[] => {
// 	const sqrt = Math.sqrt(values.length)
// 	let row = 0
// 	for (let i = 0; i < sqrt; i++) {
// 		if (grid < (i + 1) * sqrt) {
// 			row = i * sqrt
// 			break
// 		}
// 	}
// 	const col = (grid % sqrt) * sqrt
// 	return getPossibleCellsByCustomGridAndValue(values, row, row + sqrt, col, col + sqrt, nb)
// }
// const containsByCustomGrid = (values: t_board, row_1: number, row_2: number, col_1: number, col_2: number, nb: number): boolean => {
// 	for (let row = row_1; row < row_2; row++) {
// 		for (let col = col_1; col < col_2; col++) {
// 			if (values[row][col] == nb)
// 				return true
// 		}
// 	}
// 	return false
// }
// const containsByGrid = (values: t_board, grid: number, nb: number): boolean => {
// 	const sqrt = Math.sqrt(values.length)
// 	let row = 0
// 	for (let i = 0; i < sqrt; i++) {
// 		if (grid < (i + 1) * sqrt) {
// 			row = i * sqrt
// 			break
// 		}
// 	}
// 	const col = (grid % sqrt) * sqrt
// 	return containsByCustomGrid(values, row, row + sqrt, col, col + sqrt, nb)
// }
// const addOnlyOneValueCell = (values: t_board): boolean => {
// 	let count = -1
// 	while (count) {
// 		count = 0
// 		for (let row = 0; row < values.length; row++) {
// 			for (let col = 0; col < values[0].length; col++) {
// 				const cell = { row, col }
// 				if (isEmptyCell(values, cell)) {
// 					const possiblevalues = getPossibleValues(values, cell)
// 					if (possiblevalues.length == 0)
// 						return false
// 					if (possiblevalues.length == 1) {
// 						setCellValue(values, cell, possiblevalues[0])
// 						// console.log('Added: ', cell, possiblevalues[0])
// 						count++
// 					}
// 				}
// 			}
// 		}
// 	}
// 	return true
// }
// const addOnlyOneValueByGrid = (values: t_board): boolean => {
// 	let count = -1
// 	while (count) {
// 		count = 0
// 		for (let grid = 0; grid < 9; grid++) {
// 			for (let nb = 1; nb < 10; nb++) {
// 				if (containsByGrid(values, grid, nb))
// 					continue
// 				const possibleCells = getPossibleCellsByGridAndValue(values, grid, nb)
// 				// console.log('=> ', nb, possibleCells)
// 				if (possibleCells.length == 0)
// 					return false
// 				if (possibleCells.length == 1) {
// 					setCellValue(values, possibleCells[0], nb)
// 					// console.log('Added: ', possibleCells[0], nb)
// 					count++
// 				}
// 			}
// 		}
// 	}
// 	return true
// }

const solve = (fixedValues: t_board): Promise<t_board | null> => {
	return new Promise((resolve, reject) => {
		if (checkAll(fixedValues).status != 'PASSED')
			resolve(null)
		// let solution = duplicateValues(fixedValues)
		// if (!addOnlyOneValueByGrid(solution)) resolve(null)
		// if (!addOnlyOneValueCell(solution)) return null
		try {
			let solution2 = duplicateValues(fixedValues)
			solution2 = recSolve(fixedValues, solution2)
			resolve(solution2)
		} catch (error) {
			resolve(null)
		}
	})
}

const isCorrectValue = (solution: t_board, values: t_board, cell: t_cell): boolean => {
	return getCellValue(solution, cell) == getCellValue(values, cell)
}

const getHint = (solution: t_board | null, values: t_board): t_board | null => {
	if (!solution) return null
	if (isSolved(values)) return values
	const result = duplicateValues(values)
	let cell = { row: Math.floor(Math.random() * 9), col: Math.floor(Math.random() * 9) }
	while (isCorrectValue(solution, values, cell)) {
		cell = { row: Math.floor(Math.random() * 9), col: Math.floor(Math.random() * 9) }
	}
	setCellValue(result, cell, getCellValue(solution, cell) as number)
	return result
}

const checkSolution = (solution: t_board | null, values: t_board): t_check_solution => {
	if (!solution) throw new Error('No solution')
	let cellsLeft = 0
	let wrongCells = [] as t_cell[]
	for (let row = 0; row < values.length; row++) {
		for (let col = 0; col < values[row].length; col++) {
			const cell = { row, col }
			const cellValue = getCellValue(values, cell)
			if (!cellValue) {
				cellsLeft++
				continue
			}
			if (cellValue != getCellValue(solution, cell))
				wrongCells = [...wrongCells, cell]
		}
	}
	return {correct: !wrongCells.length, cellsLeft, wrongCells}
}

export {
	solve,
	incrementCell,
	getHint,
	isFixedCell,
	getCellValue,
	isEmptyCell,
	checkSolution
}
