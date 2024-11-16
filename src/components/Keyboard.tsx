import { Dispatch, SetStateAction } from 'react';
import { FaEraser, FaFileSignature, FaMagnifyingGlass } from "react-icons/fa6";
import { HiLightBulb } from "react-icons/hi";
import { IoArrowRedo, IoArrowUndo } from "react-icons/io5";
import { t_numbers_count } from '../types/types';
import Button from './Button';

type Props = {
	setPressedKey: Dispatch<SetStateAction<number>>,
	counts: t_numbers_count | undefined,
	historyLenght: number, 
	historyIndex: number,
	editing: boolean,
	gameOver: boolean,
	conflicte: boolean,
	fiewNumbers: boolean,
	paused: boolean
}
const Keyboard = ({ setPressedKey, counts, historyIndex, historyLenght, editing, gameOver, conflicte, fiewNumbers, paused }: Props) => {

	return (
		<div className=' bg-slate-200 w-fit'>
			<div className=' flex select-none'>
				<Button label='1' value={1} disabled={paused} setPressedKey={setPressedKey} highlighted={counts?.one == 9}/>
				<Button label='2' value={2} disabled={paused} setPressedKey={setPressedKey} highlighted={counts?.two == 9}/>
				<Button label='3' value={3} disabled={paused} setPressedKey={setPressedKey} highlighted={counts?.three == 9}/>
				<Button label='4' value={4} disabled={paused} setPressedKey={setPressedKey} highlighted={counts?.four == 9}/>
				<Button label='5' value={5} disabled={paused} setPressedKey={setPressedKey} highlighted={counts?.five == 9}/>
			</div>
			<div className=' flex select-none'>
				<Button label='6' value={6} disabled={paused} setPressedKey={setPressedKey} highlighted={counts?.six == 9}/>
				<Button label='7' value={7} disabled={paused} setPressedKey={setPressedKey} highlighted={counts?.seven == 9}/>
				<Button label='8' value={8} disabled={paused} setPressedKey={setPressedKey} highlighted={counts?.eight == 9}/>
				<Button label='9' value={9} disabled={paused} setPressedKey={setPressedKey} highlighted={counts?.nine == 9}/>
				<Button label='Erase' value={0} disabled={paused} setPressedKey={setPressedKey} icon={<FaEraser/>}/>
			</div>
			<div className=' flex select-none justify-end'>
				<Button label='Undo' value={10} disabled={paused || historyIndex <= 0} setPressedKey={setPressedKey} icon={<IoArrowUndo />} />
				<Button label='Redo' value={11} disabled={paused || historyIndex >= historyLenght - 1} setPressedKey={setPressedKey} icon={<IoArrowRedo />} />
				<Button label='Hint' value={12} disabled={paused || editing || gameOver} setPressedKey={setPressedKey} icon={<HiLightBulb />}/>
				<Button label='Check' value={13} disabled={paused || editing || gameOver} setPressedKey={setPressedKey} icon={<FaMagnifyingGlass />}/>
				<Button label='Solve' value={14} disabled={paused || fiewNumbers || gameOver || (editing && conflicte)} setPressedKey={setPressedKey} icon={<FaFileSignature />}/>
			</div>
		</div>
	)
}

export default Keyboard