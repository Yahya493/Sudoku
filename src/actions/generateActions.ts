import { t_difficulty, t_board } from "../types/types";

const createEmptyBoard = (): t_board => {
	 return Array.from({ length: 9 }, () => Array(9).fill(0))
}

// Function to check if a number can be placed in a given cell
const isSafe = (board: t_board, row: number, col: number, num: number): boolean => {
	for (let x = 0; x < 9; x++) {
		if (board[row][x] === num || board[x][col] === num) return false;
	}
	const startRow = Math.floor(row / 3) * 3;
	const startCol = Math.floor(col / 3) * 3;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[i + startRow][j + startCol] === num) return false;
		}
	}
	return true;
};

// Recursive backtracking function to fill the board
const fillBoard = (board: t_board): boolean => {
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (board[row][col] === 0) {
				for (let num = 1; num <= 9; num++) {
					if (isSafe(board, row, col, num)) {
						board[row][col] = num;
						if (fillBoard(board)) return true;
						board[row][col] = 0;
					}
				}
				return false;
			}
		}
	}
	return true;
};

// Function to remove numbers based on difficulty
const removeNumbers = (board: t_board, difficulty: t_difficulty): void => {
	let cellsToRemove: number;
	switch (difficulty) {
		case 'EASY': cellsToRemove = 36; break;   // Easy level - 36 cells removed
		case 'MEDIUM': cellsToRemove = 46; break; // Medium level - 46 cells removed
		case 'HARD': cellsToRemove = 56; break;   // Hard level - 56 cells removed
	}
	while (cellsToRemove > 0) {
		const row = Math.floor(Math.random() * 9);
		const col = Math.floor(Math.random() * 9);
		if (board[row][col] !== 0) {
			board[row][col] = 0;
			cellsToRemove--;
		}
	}
};

// Main function to generate a Sudoku puzzle
const generateSudoku = (difficulty: t_difficulty): t_board => {
	const board = createEmptyBoard();
	fillBoard(board);       // Fill the board to create a solution
	removeNumbers(board, difficulty); // Remove numbers to create the puzzle
	return board;
};

// Example usage
// const sudokuPuzzle = generateSudoku('MEDIUM');
// console.log(sudokuPuzzle);
export {
	createEmptyBoard,
	generateSudoku
}
