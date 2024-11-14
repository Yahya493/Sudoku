import { t_board, t_cell, t_difficulty } from "../types/types"
import { checkByCell, containsCell } from "./checkActions"
import { getCellValue, isEmptyCell, setCellValue, solve } from "./solveActions"

const createEmptyBoard = (): t_board => {
	return Array.from({ length: 9 }, () => Array(9).fill(0))
}

const switchRows = (board: t_board, row_1: number, row_2: number): void => {
	const tmp = board[row_1]
	board[row_1] = board[row_2]
	board[row_2] = tmp
}

const switchCols = (board: t_board, col_1: number, col_2: number): void => {
	for (let row = 0; row < 9; row++) {
		const tmp = board[row][col_1]
		board[row][col_1] = board[row][col_2]
		board[row][col_2] = tmp
	}
}

const switchRowGrids = (board: t_board, grid_1: number, grid_2: number): void => {
	for (let i = 0; i < 3; i++)
		switchRows(board, grid_1 * 3 + i, grid_2 * 3 + i)
}

const switchColGrids = (board: t_board, grid_1: number, grid_2: number): void => {
	for (let i = 0; i < 3; i++)
		switchCols(board, grid_1 * 3 + i, grid_2 * 3 + i)
}

const shuffle = (board: t_board, call: (board: t_board, nb_1: number, nb_2: number) => void): void => {
	for (let grid = 0; grid < 3; grid++) {
		const startIndex = grid * 3
		const rand = Math.floor(Math.random() * 6)
		switch (rand) {
			case 0: 						//012
				break
			case 1:							//021
				call(board, startIndex + 1, startIndex + 2)
				break
			case 2:							//102
				call(board, startIndex + 0, startIndex + 1)
				break
			case 3:							//120
				call(board, startIndex + 0, startIndex + 1)
				call(board, startIndex + 1, startIndex + 2)
				break
			case 4:							//201
				call(board, startIndex + 0, startIndex + 2)
				call(board, startIndex + 1, startIndex + 2)
				break
			case 5:							//210
				call(board, startIndex + 0, startIndex + 2)
				break
		}
	}
}

const shuffleGrids = (board: t_board, call: (board: t_board, grid_1: number, grid_2: number) => void): void => {
	const rand = Math.floor(Math.random() * 6)
	switch (rand) {
		case 0: 						//012
			break
		case 1:							//021
			call(board, 1, 2)
			break
		case 2:							//102
			call(board, 0, 1)
			break
		case 3:							//120
			call(board, 0, 1)
			call(board, 1, 2)
			break
		case 4:							//201
			call(board, 0, 2)
			call(board, 1, 2)
			break
		case 5:							//210
			call(board, 0, 2)
			break
	}
}

const getOppositeCellsByRowsDepth1 = (board: t_board): t_cell[][] => {
	let result = [] as t_cell[][]
	for (let row_1 = 0; row_1 < 8; row_1++) {
		for (let col_1 = 0; col_1 < 8; col_1++) {
			const cell_1 = { row: row_1, col: col_1 }
			if (isEmptyCell(board, cell_1)) continue
			for (let col_2 = col_1 + 1; col_2 < 9; col_2++) {
				if (Math.floor(col_2 / 3) != Math.floor(col_1 / 3)) break
				const cell_2 = { row: row_1, col: col_2 }
				if (isEmptyCell(board, cell_2)) continue
				for (let row_2 = row_1 + 1; row_2 < 9; row_2++) {
					if (Math.floor(row_2 / 3) == Math.floor(row_1 / 3)) continue
					const oppCell_1 = { row: row_2, col: col_1 }
					const oppCell_2 = { row: row_2, col: col_2 }
					if (getCellValue(board, oppCell_1) == getCellValue(board, cell_2)
						&& getCellValue(board, oppCell_2) == getCellValue(board, cell_1)) {
						result = [...result, [cell_1, cell_2, oppCell_1, oppCell_2]]
					}
				}
			}
		}
	}
	return result
}

const getOppositeCellsByRowsDepth2 = (board: t_board): t_cell[][] => {
	let result = [] as t_cell[][]
	for (let row_1 = 0; row_1 < 3; row_1++) {
		for (let col_1 = 0; col_1 < 8; col_1++) {
			const cell_11 = { row: row_1, col: col_1 }
			if (isEmptyCell(board, cell_11)) continue
			for (let col_2 = col_1 + 1; col_2 < 9; col_2++) {
				if (Math.floor(col_2 / 3) != Math.floor(col_1 / 3)) break
				const cell_12 = { row: row_1, col: col_2 }
				if (isEmptyCell(board, cell_12)) continue
				for (let row_2 = 3; row_2 < 6; row_2++) {
					const cell_21 = { row: row_2, col: col_1 }
					const cell_22 = { row: row_2, col: col_2 }
					if (isEmptyCell(board, cell_21) || isEmptyCell(board, cell_22)) continue
					for (let row_3 = 6; row_3 < 9; row_3++) {
						const cell_31 = { row: row_3, col: col_1 }
						const cell_32 = { row: row_3, col: col_2 }
						if (
							(
								getCellValue(board, cell_11) == getCellValue(board, cell_32)
								&& getCellValue(board, cell_12) == getCellValue(board, cell_21)
								&& getCellValue(board, cell_22) == getCellValue(board, cell_31)
							)
							||
							(
								getCellValue(board, cell_12) == getCellValue(board, cell_31)
								&& getCellValue(board, cell_11) == getCellValue(board, cell_22)
								&& getCellValue(board, cell_21) == getCellValue(board, cell_32)
							)
						) {
							result = [...result, [cell_11, cell_12, cell_21, cell_22, cell_31, cell_32]]
						}
					}
				}
			}
		}
	}
	return result
}

const getOppositeCellsBysDepth1 = (board: t_board): t_cell[][] => {
	let result = [] as t_cell[][]
	for (let col_1 = 0; col_1 < 8; col_1++) {
		for (let row_1 = 0; row_1 < 8; row_1++) {
			const cell_1 = { row: row_1, col: col_1 }
			if (isEmptyCell(board, cell_1)) continue
			for (let row_2 = row_1 + 1; row_2 < 9; row_2++) {
				if (Math.floor(row_2 / 3) != Math.floor(row_1 / 3)) break
				const cell_2 = { row: row_2, col: col_1 }
				if (isEmptyCell(board, cell_2)) continue
				for (let col_2 = col_1 + 1; col_2 < 9; col_2++) {
					if (Math.floor(col_2 / 3) == Math.floor(col_1 / 3)) continue
					const oppCell_1 = { row: row_1, col: col_2 }
					const oppCell_2 = { row: row_2, col: col_2 }
					if (getCellValue(board, oppCell_1) == getCellValue(board, cell_2)
						&& getCellValue(board, oppCell_2) == getCellValue(board, cell_1)) {
						result = [...result, [cell_1, cell_2, oppCell_1, oppCell_2]]
					}
				}
			}
		}
	}
	return result
}

const getOppositeCellsByColsDepth2 = (board: t_board): t_cell[][] => {
	let result = [] as t_cell[][]
	for (let col_1 = 0; col_1 < 3; col_1++) {
		for (let row_1 = 0; row_1 < 8; row_1++) {
			const cell_11 = { row: row_1, col: col_1 }
			if (isEmptyCell(board, cell_11)) continue
			for (let row_2 = row_1 + 1; row_2 < 9; row_2++) {
				if (Math.floor(row_2 / 3) != Math.floor(row_1 / 3)) break
				const cell_12 = { row: row_2, col: col_1 }
				if (isEmptyCell(board, cell_12)) continue
				for (let col_2 = 3; col_2 < 6; col_2++) {
					const cell_21 = { row: row_1, col: col_2 }
					const cell_22 = { row: row_2, col: col_2 }
					if (isEmptyCell(board, cell_21) || isEmptyCell(board, cell_22)) continue
					for (let col_3 = 6; col_3 < 9; col_3++) {
						const cell_31 = { row: row_1, col: col_3 }
						const cell_32 = { row: row_2, col: col_3 }
						if (
							(
								getCellValue(board, cell_11) == getCellValue(board, cell_32)
								&& getCellValue(board, cell_12) == getCellValue(board, cell_21)
								&& getCellValue(board, cell_22) == getCellValue(board, cell_31)
							)
							||
							(
								getCellValue(board, cell_12) == getCellValue(board, cell_31)
								&& getCellValue(board, cell_11) == getCellValue(board, cell_22)
								&& getCellValue(board, cell_21) == getCellValue(board, cell_32)
							)
						) {
							result = [...result, [cell_11, cell_12, cell_21, cell_22, cell_31, cell_32]]
						}
					}
				}
			}
		}
	}
	return result
}

const getOppositeL = (board: t_board): t_cell[][] => {
	let result = [] as t_cell[][]
	for (let row_1 = 0; row_1 < 9; row_1++) {
		for (let col_1 = 0; col_1 < 8; col_1++) {
			const cell_1h = { row: row_1, col: col_1 }
			if (isEmptyCell(board, cell_1h)) continue
			for (let col_2 = col_1 + 1; col_2 < 9; col_2++) {
				if (Math.floor(col_2 / 3) != Math.floor(col_1 / 3)) break
				const cell_2h = { row: row_1, col: col_2 }
				if (isEmptyCell(board, cell_2h)) continue
				for (let col_3 = 0; col_3 < 9; col_3++) {
					if (Math.floor(col_3 / 3) == Math.floor(col_1 / 3)) continue
					for (let row_2 = 0; row_2 < 8; row_2++) {
						if (Math.floor(row_2 / 3) == Math.floor(row_1 / 3)) continue
						const cell_1v = { row: row_2, col: col_3 }
						if (isEmptyCell(board, cell_1v)) continue
						for (let row_3 = row_2 + 1; row_3 < 9; row_3++) {
							if (Math.floor(row_3 / 3) != Math.floor(row_2 / 3)) break
							const cell_2v = { row: row_3, col: col_3 }
							if (isEmptyCell(board, cell_2v)) continue
							const cell_11 = { row: cell_1v.row, col: cell_1h.col }
							const cell_22 = { row: cell_2v.row, col: cell_2h.col }
							if (getCellValue(board, cell_1h) == getCellValue(board, cell_1v)
								&& getCellValue(board, cell_2h) == getCellValue(board, cell_2v)
								&& getCellValue(board, cell_1h) == getCellValue(board, cell_22)
								&& getCellValue(board, cell_2h) == getCellValue(board, cell_11)
							) {
								result = [...result, [cell_1h, cell_2h, cell_1v, cell_2v, cell_11, cell_22]]
								continue
							}
							const cell_12 = { row: cell_2v.row, col: cell_1h.col }
							const cell_21 = { row: cell_1v.row, col: cell_2h.col }
							if (getCellValue(board, cell_1h) == getCellValue(board, cell_2v)
								&& getCellValue(board, cell_2h) == getCellValue(board, cell_1v)
								&& getCellValue(board, cell_1h) == getCellValue(board, cell_21)
								&& getCellValue(board, cell_2h) == getCellValue(board, cell_12)
							)
								result = [...result, [cell_1h, cell_2h, cell_1v, cell_2v, cell_21, cell_12]]
						}
					}
				}
			}
		}
	}
	return result
}

const getOppositeCells = (board: t_board): t_cell[][] => {
	return [
		...getOppositeCellsByRowsDepth1(board),
		...getOppositeCellsByRowsDepth2(board),
		...getOppositeCellsBysDepth1(board),
		...getOppositeCellsByColsDepth2(board),
		...getOppositeL(board)
	]
}

const getUnremovableCells = (borad: t_board): t_cell[] => {
	const oppositeCells = getOppositeCells(borad)
	return oppositeCells.map(array => array[Math.floor(Math.random() * array.length)])
}

const removeNumbers = (board: t_board, difficulty: t_difficulty): void => {
	let cellsToRemove: number
	switch (difficulty) {
		case 'EASY': cellsToRemove = 36
			break
		case 'MEDIUM': cellsToRemove = 46
			break
		case 'HARD': cellsToRemove = 56
			break
	}
	const unremovableCells = getUnremovableCells(board)
	// console.log('Unremovable cells:', unremovableCells)
	while (cellsToRemove > 0) {
		const cell = { row: Math.floor(Math.random() * 9), col: Math.floor(Math.random() * 9) }
		if (!isEmptyCell(board, cell) && !containsCell(unremovableCells, cell)) {
			setCellValue(board, cell, 0)
			cellsToRemove--
		}
	}
}

const fillFirstRow = (borad: t_board): void => {
	for (let col = 0; col < 9; col++) {
		const cell = { row: 0, col }
		let value = Math.floor(Math.random() * 9 + 1)
		setCellValue(borad, cell, value)
		while (!checkByCell(borad, cell)) {
			value = Math.floor(Math.random() * 9 + 1)
			setCellValue(borad, cell, value)
		}
	}
}

const generateSudoku = async (difficulty: t_difficulty): Promise<t_board> => {
	let board = createEmptyBoard()
	fillFirstRow(board)
	// let board = [
	// 	[1, 2, 0, 0, 0, 6, 0, 0, 0],
	// 	[0, 0, 0, 7, 8, 9, 0, 0, 0],
	// 	[0, 0, 0, 0, 2, 0, 0, 0, 6],
	// 	[0, 0, 1, 0, 0, 5, 0, 9, 0],
	// 	[0, 0, 4, 8, 0, 0, 0, 1, 0],
	// 	[0, 0, 0, 0, 1, 4, 3, 0, 5],
	// 	[0, 3, 0, 6, 0, 2, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[2, 1, 0, 5, 3, 0, 0, 0, 7]
	// ]
	board = await solve(board) as t_board
	shuffle(board, switchRows)
	shuffle(board, switchCols)
	shuffleGrids(board, switchRowGrids)
	shuffleGrids(board, switchColGrids)
	// console.log('Rows 3:', getOppositeCellsByRowsDepth2(board))
	// console.log('Cols 3:', getOppositeCellsByColsDepth2(board))
	removeNumbers(board, difficulty)
	return board
}

export {
	createEmptyBoard,
	generateSudoku
}

