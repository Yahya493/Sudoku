import { Dispatch, SetStateAction } from 'react'
import { containsCell } from '../actions/checkActions'
import { t_board } from '../types/types'
import Cell from './Cell'

type Props = {
	values: t_board,
	fixedValues: t_board,
	covered?: boolean,
	highlightedCell: { row: number, col: number }[],
	setValues: Dispatch<SetStateAction<t_board>>,
	selectedCell: { row: number, col: number },
	setSelectedCell: Dispatch<SetStateAction<{ row: number, col: number }>>
}

const Grid = ({ values, fixedValues, setValues, selectedCell, setSelectedCell, highlightedCell, covered=true }: Props) => {
	// const setCellValue = (row: number, col: number, value: number) => {
	// 	setValues(prev => {
	// 		const newValues = prev.map(row => [...row]);
	// 		newValues[row][col] = value;
	// 		return newValues;
	// 	})
	// }

	const isConflectedCell = (row: number, col: number): boolean => {
		return containsCell(highlightedCell, {row, col})
	}

	const isSelectedCell = (row: number, col: number): boolean => {
		return selectedCell.row == row && selectedCell.col == col
	}

	const isHighlightedCell = (row: number, col: number): boolean => {
		if (selectedCell.row < 0 || selectedCell.col < 0) return false
		return values[row][col] != 0 && values[row][col] == values[selectedCell.row][selectedCell.col]
	}

	return (
		<div className=' bg-slate-50 w-fit border-4 border-blue-400 select-none'>
			{
				fixedValues.map((row, row_index) =>
					<div key={'row_' + row_index}>
						<div className=' flex'>
							{
								row.map((cellValue, col_index) =>
									<div key={'cell_' + row_index + col_index} className=' flex'>
										<Cell row={row_index} col={col_index} value={cellValue ? cellValue : values[row_index][col_index]} editable={!cellValue} /*setValue={(newValue) => setCellValue(row_index, col_index, newValue)}*/
											selected={isSelectedCell(row_index, col_index)} highlighted={isHighlightedCell(row_index, col_index)}
											setSelectedCell={setSelectedCell} conflected={isConflectedCell(row_index, col_index)} covered={covered}/>
										{
											(col_index + 1) % 3 == 0 && col_index != 8 ?
												<div className=' block w-1 h-full bg-blue-400'></div> : null
										}
									</div>
								)
							}
						</div>
						{
							(row_index + 1) % 3 == 0 && row_index != 8 ?
								<div className=' block w-full h-1 bg-blue-400'></div> : null
						}
					</div>
				)
			}
		</div>
	)
}

export default Grid