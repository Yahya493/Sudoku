import { Dispatch, SetStateAction } from "react"
import { FaX } from "react-icons/fa6"
import { CiSquareQuestion } from "react-icons/ci"

type Props = {
	row: number,
	col: number,
	value: number,
	editable?: boolean,
	selected?: boolean,
	covered?: boolean,
	highlighted?: boolean,
	conflected?: boolean,
	wrong?: boolean,
	setSelectedCell: Dispatch<SetStateAction<{ row: number, col: number }>>,
	// setValue: (newValue: number) => void
}

const Cell = ({ row, col, value, editable = true, selected = false, highlighted = false, conflected = false, wrong = false, covered = false, setSelectedCell }: Props) => {
	const handleEdit = () => {
		setSelectedCell(prev => {
			if (prev.row == row && prev.col == col)
				return { row: -1, col: -1 }
			return { row, col }
		})
		// if (!editable) return undefined
		// setValue((value + 1) % 10)
	}
	return (
		<div className={` w-9 md:w-12 aspect-square relative flex justify-center items-center rounded-md m-0.5
				${editable && !covered ? 'cursor-pointer hover:bg-slate-500 ' : ''}
				${selected && editable && !covered ? 'bg-slate-500 ' : (highlighted && !covered ? 'bg-blue-600' : 'bg-slate-800')}`
		}
			onClick={handleEdit}>
			<div className={`z-10 w-2/3 h-2/3 aspect-square rounded-full ${conflected && !covered ? ' border-2 border-red-500' : ''}`}>
				{value ?
					<span className={` h-full font-bold md:text-xl flex justify-center items-center ${editable && !covered ? ' text-green-400' : ''} `}>
						{covered ? <CiSquareQuestion /> : value}
					</span> :
					null}
			</div>
			{
				wrong && !covered ?
					<div className={`absolute flex justify-center items-center w-full h-full text-2xl text-red-500`}>
						<FaX />
					</div> :
					null
			}
		</div>
	)
}

export default Cell
