import { t_board, t_difficulty } from "../types/types"
import { checkByCell } from "./checkActions"
import { isEmptyCell, setCellValue, solve } from "./solveActions"

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
	while (cellsToRemove > 0) {
		const cell = { row: Math.floor(Math.random() * 9), col: Math.floor(Math.random() * 9) }
		if (!isEmptyCell(board, cell)) {
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
	board = await solve(board) as t_board
	shuffle(board, switchRows)
	shuffle(board, switchCols)
	shuffleGrids(board, switchRowGrids)
	shuffleGrids(board, switchColGrids)
	removeNumbers(board, difficulty)
	return board
}

export {
	createEmptyBoard,
	generateSudoku
}
