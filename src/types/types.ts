type t_cell = {
	row: number,
	col: number,
	// value?: number
}

type t_check_failed = {
	status: 'FAILED',
	conflicts: t_cell[]
}

type t_check_error = {
	status: 'ERROR',
}

type t_check_passed = {
	status: 'PASSED',
}

type t_check_result = t_check_passed | t_check_failed | t_check_error

type t_numbers_count = {
	one: number,
	two: number,
	three: number,
	four: number,
	five: number,
	six: number,
	seven: number,
	eight: number,
	nine: number,
}

type t_difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type t_board = number[][];

type t_check_solution = {
	correct: boolean,
	cellsLeft: number,
	wrongCells: t_cell[]
}

type t_history = {
	boards: t_board[],
	index: number
}

export type { 
	t_numbers_count,
	t_check_result,
	t_cell,
	t_difficulty,
	t_board,
	t_check_solution,
	t_history
}