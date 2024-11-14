import { Dispatch, SetStateAction } from 'react'
import { containsCell } from '../actions/checkActions'
import { t_board, t_cell } from '../types/types'
import Cell from './Cell'
import { getCellValue } from '../actions/solveActions'

type Props = {
	values: t_board,
	fixedValues: t_board,
	covered?: boolean,
	conflictedCells: t_cell[],
	wrongCells: t_cell[],
	selectedCell: t_cell,
	setSelectedCell: Dispatch<SetStateAction<t_cell>>,
	selectedValue: number
}

const Grid = ({ values, fixedValues, selectedCell, setSelectedCell, conflictedCells, wrongCells, covered = true, selectedValue }: Props) => {
	// const setCellValue = (row: number, col: number, value: number) => {
	// 	setValues(prev => {
	// 		const newValues = prev.map(row => [...row]);
	// 		newValues[row][col] = value;
	// 		return newValues;
	// 	})
	// }

	const isConflictedCell = (cell: t_cell): boolean => {
		return containsCell(conflictedCells, cell)
	}

	const isSelectedCell = (cell: t_cell): boolean => {
		return selectedCell.row == cell.row && selectedCell.col == cell.col
	}

	const isHighlightedCell = (cell: t_cell): boolean => {
		if (selectedValue < 0) return false
		const cellValue = getCellValue(values, cell)
		return cellValue != 0 && cellValue == selectedValue
	}

	const isWrongCell = (cell: t_cell): boolean => {
		for (const wrongCell of wrongCells) {
			if (wrongCell.row == cell.row && wrongCell.col == cell.col)
				return true
		}
		return false
	}

	return (
		<div className=' bg-slate-200 w-full border-4 border-blue-400 select-none'>
			{
				fixedValues.map((row, row_index) =>
					<div key={'row_' + row_index}>
						<div className={` flex border-blue-400 ${(row_index + 1) % 3 == 0 && row_index != 8?'border-b-4':''}`}>
							{
								row.map((cellValue, col_index) => {
									const cell = { row: row_index, col: col_index }
									return <div key={'cell_' + row_index + col_index} className={` flex border-blue-400 ${(col_index + 1) % 3 == 0 && col_index != 8?'border-r-4':''}`}>
										<Cell row={row_index} col={col_index} value={cellValue ? cellValue : values[row_index][col_index]} editable={!cellValue} /*setValue={(newValue) => setCellValue(row_index, col_index, newValue)}*/
											selected={isSelectedCell(cell)} highlighted={isHighlightedCell(cell)}
											setSelectedCell={setSelectedCell} conflected={isConflictedCell(cell)} wrong={isWrongCell(cell)} covered={covered} />
										{/* {
											(col_index + 1) % 3 == 0 && col_index != 8 ?
												<div className=' block w-1 h-full bg-blue-400'></div> : null
										} */}
									</div>
								}
								)
							}
						</div>
						{/* {
							(row_index + 1) % 3 == 0 && row_index != 8 ?
								<div className=' block w-full h-1 bg-blue-400'></div> : null
						} */}
					</div>
				)
			}
		</div>
	)
}

export default Grid