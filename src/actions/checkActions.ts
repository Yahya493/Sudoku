import { t_board, t_cell, t_check_result, t_numbers_count } from "../types/types"


const containsCell = (array: t_cell[], newCell: t_cell): boolean => {
	for (const cell of array) {
		if (cell.row == newCell.row && cell.col == newCell.col)
			return true
	}
	return false
}

const addWithoutDuplication = (array: t_cell[], newArray: t_cell[]): t_cell[] => {
	for (const newCell of newArray) {
		if (containsCell(array, newCell))
			continue
		array = [...array, newCell]
	}
	return array
}

const checkRow = (values: t_board, row: number): t_check_result => {
	if (row < 0 || row >= values.length) return { status: 'ERROR' }
	let status = 'PASSED' as ('PASSED' | 'ERROR' | 'FAILED')
	let conflicts = [] as t_cell[]
	for (let i = 0; i < values[row].length - 1; i++) {
		if (!values[row][i]) continue
		for (let j = i + 1; j < values[row].length; j++) {
			if (values[row][i] == values[row][j]) {
				status = 'FAILED'
				conflicts = addWithoutDuplication(conflicts, [
					{ row, col: i },
					{ row, col: j },
				])
			}
		}
	}
	return { status, conflicts }
}

const checkAllRows = (values: t_board): t_check_result => {
	let status = 'PASSED' as ('PASSED' | 'ERROR' | 'FAILED')
	let conflicts = [] as t_cell[]
	for (let i = 0; i < values.length; i++) {
		const result = checkRow(values, i)
		// if (result.status == 'ERROR') {
		// 	status = 'ERROR'
		// 	continue
		// }
		if (result.status == 'FAILED') {
			status = 'FAILED'
			conflicts = addWithoutDuplication(conflicts, result.conflicts)
		}
	}
	return { status, conflicts }
}

const checkCol = (values: t_board, col: number): t_check_result => {
	if (col < 0 || col >= values[0].length) return { status: 'ERROR' }
	let status = 'PASSED' as ('PASSED' | 'ERROR' | 'FAILED')
	let conflicts = [] as t_cell[]
	for (let i = 0; i < values.length - 1; i++) {
		if (!values[i][col]) continue
		for (let j = i + 1; j < values.length; j++) {
			if (values[i][col] == values[j][col]) {
				status = 'FAILED'
				conflicts = addWithoutDuplication(conflicts, [
					{ row: i, col },
					{ row: j, col },
				])
			}
		}
	}
	return { status, conflicts }
}

const checkAllCols = (values: t_board): t_check_result => {
	let status = 'PASSED' as ('PASSED' | 'ERROR' | 'FAILED')
	let conflicts = [] as t_cell[]
	for (let i = 0; i < values[0].length; i++) {
		const result = checkCol(values, i)
		if (result.status == 'FAILED') {
			status = 'FAILED'
			conflicts = addWithoutDuplication(conflicts, result.conflicts)
		}
	}
	return { status, conflicts }
}

const checkCustomGrid = (values: t_board, row_1: number, row_2: number, col_1: number, col_2: number): t_check_result => {
	if (row_1 < 0 || row_1 > row_2 || row_2 > values.length) return { status: 'ERROR' }
	if (col_1 < 0 || col_1 > col_2 || col_2 > values[0].length) return { status: 'ERROR' }
	let status = 'PASSED' as ('PASSED' | 'ERROR' | 'FAILED')
	let conflicts = [] as t_cell[]
	for (let i = row_1; i < row_2; i++) {
		for (let j = col_1; j < col_2; j++) {
			if (!values[i][j]) continue
			const start_row = (j == col_2 - 1) ? i + 1 : i;
			let start_col = (j == col_2 - 1) ? col_1 : j + 1;
			for (let x = start_row; x < row_2; x++) {
				start_col = x == start_row ? start_col : col_1
				for (let y = start_col; y < col_2; y++) {
					if (values[i][j] == values[x][y]) {
						status = 'FAILED'
						conflicts = addWithoutDuplication(conflicts, [
							{ row: i, col: j },
							{ row: x, col: y },
						])
					}
				}
			}
		}
	}
	return { status, conflicts }
}

// const printCustomGrid = (values: t_board, row_1: number, row_2: number, col_1: number, col_2: number): void => {
// 	if (row_1 < 0 || row_1 > row_2 || row_2 > values.length) return 
// 	if (col_1 < 0 || col_1 > col_2 || col_2 > values[0].length) return 
// 	for (let i = row_1; i < row_2; i++) {
// 		for (let j = col_1; j < col_2; j++) {
// console.log(values[i][j] + ', ')
// 		}
// 	}
// }
// const printGrid = (values: t_board, grid: number): void => {
// 	if (grid < 0 || grid >= values.length) return 
// 	const sqrt = Math.sqrt(values.length)
// 	let row = 0
// 	for (let i = 0; i < sqrt; i++) {
// 		if (grid < (i + 1) * sqrt) {
// 			row = i * sqrt
// 			break
// 		}
// 	}
// 	const col = (grid % sqrt) * sqrt
// 	printCustomGrid(values, row, row + sqrt, col, col + sqrt)
// }

const checkGrid = (values: t_board, grid: number): t_check_result => {
	if (grid < 0 || grid >= values.length) return { status: 'ERROR' }
	const sqrt = Math.sqrt(values.length)
	let row = 0
	for (let i = 0; i < sqrt; i++) {
		if (grid < (i + 1) * sqrt) {
			row = i * sqrt
			break
		}
	}
	const col = (grid % sqrt) * sqrt
	return checkCustomGrid(values, row, row + sqrt, col, col + sqrt)
}


const checkAllGrids = (values: t_board): t_check_result => {
	let status = 'PASSED' as ('PASSED' | 'ERROR' | 'FAILED')
	let conflicts = [] as t_cell[]
	for (let i = 0; i < values.length; i++) {
		const result = checkGrid(values, i)
		if (result.status == 'FAILED') {
			status = 'FAILED'
			conflicts = addWithoutDuplication(conflicts, result.conflicts)
		}
	}
	return { status, conflicts }
}

const isFilled = (values: t_board): boolean => {
	for (let i = 0; i < values.length; i++) {
		for (let j = 0; j < values[0].length; j++) {
			if (!values[i][j]) return false
		}
	}
	return true
}

const isEmptyBoard = (values: t_board): boolean => {
	for (let i = 0; i < values.length; i++) {
		for (let j = 0; j < values[0].length; j++) {
			if (values[i][j]) return false
		}
	}
	return true
}

const numberCount = (values: t_board, nb: number): number => {
	let count = 0
	for (let i = 0; i < values.length; i++) {
		for (let j = 0; j < values[0].length; j++) {
			if (values[i][j] == nb) count++
		}
	}
	return count
}

const getFilledCells = (values: t_board): number => {
	let count = 0
	for (let i = 0; i < values.length; i++) {
		for (let j = 0; j < values[0].length; j++) {
			if (values[i][j]) count++
		}
	}
	return count
}

const getNumbersCount = (values: t_board): t_numbers_count => {
	return {
		one: numberCount(values, 1),
		two: numberCount(values, 2),
		three: numberCount(values, 3),
		four: numberCount(values, 4),
		five: numberCount(values, 5),
		six: numberCount(values, 6),
		seven: numberCount(values, 7),
		eight: numberCount(values, 8),
		nine: numberCount(values, 9),
	}
}

const checkAll = (values: t_board): t_check_result => {
	let status = 'PASSED' as ('PASSED' | 'ERROR' | 'FAILED')
	let conflicts = [] as t_cell[]
	let result = checkAllRows(values)
	if (result.status == 'FAILED') {
		status = 'FAILED'
		conflicts = addWithoutDuplication(conflicts, result.conflicts)
	}
	result = checkAllCols(values)
	if (result.status == 'FAILED') {
		status = 'FAILED'
		conflicts = addWithoutDuplication(conflicts, result.conflicts)

	}
	result = checkAllGrids(values)
	if (result.status == 'FAILED') {
		status = 'FAILED'
		conflicts = addWithoutDuplication(conflicts, result.conflicts)

	}
	return { status, conflicts }
}

const isSolved = (values: t_board): boolean => {
	return isFilled(values) && (checkAll(values).status == 'PASSED')
}

const getGridByCell = (cell: t_cell): number => {
	if (cell.row < 3) {
		if (cell.col < 3) return 0
		if (cell.col < 6) return 1
		return 2
	}
	if (cell.row < 6) {
		if (cell.col < 3) return 3
		if (cell.col < 6) return 4
		return 5
	}
	if (cell.col < 3) return 6
	if (cell.col < 6) return 7
	return 8
}

const checkByCell = (values: t_board, cell: t_cell): boolean => {
	let result = checkRow(values, cell.row)
	if (result.status != 'PASSED')
		return false
	result = checkCol(values, cell.col)
	if (result.status != 'PASSED')
		return false
	result = checkGrid(values, getGridByCell(cell))
	if (result.status != 'PASSED')
		return false
	return true
}

export {
	// checkRow,
	// checkCol,
	// checkGrid,
	containsCell,
	checkAllRows,
	checkAllCols,
	checkAllGrids,
	checkAll,
	isFilled,
	isEmptyBoard,
	isSolved,
	getNumbersCount,
	checkByCell,
	getGridByCell,
	getFilledCells
}

