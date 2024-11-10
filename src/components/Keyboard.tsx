import { Dispatch, SetStateAction } from 'react'
import Button from './Button'
import { t_numbers_count } from '../types/types'
import { FaEraser, FaFileSignature, FaMagnifyingGlass } from "react-icons/fa6"
import { HiLightBulb, HiOutlineLightBulb } from "react-icons/hi";

type Props = {
	setPressedKey: Dispatch<SetStateAction<number>>,
	counts: t_numbers_count | undefined
}
const Keyboard = ({ setPressedKey, counts }: Props) => {

	return (
		<div className=' bg-gray-50 w-fit'>
			<div className=' flex select-none'>
				<Button label='1' value={1} setPressedKey={setPressedKey} highlighted={counts?.one == 9}/>
				<Button label='2' value={2} setPressedKey={setPressedKey} highlighted={counts?.two == 9}/>
				<Button label='3' value={3} setPressedKey={setPressedKey} highlighted={counts?.three == 9}/>
				<Button label='4' value={4} setPressedKey={setPressedKey} highlighted={counts?.four == 9}/>
				<Button label='5' value={5} setPressedKey={setPressedKey} highlighted={counts?.five == 9}/>
			</div>
			<div className=' flex select-none'>
				<Button label='6' value={6} setPressedKey={setPressedKey} highlighted={counts?.six == 9}/>
				<Button label='7' value={7} setPressedKey={setPressedKey} highlighted={counts?.seven == 9}/>
				<Button label='8' value={8} setPressedKey={setPressedKey} highlighted={counts?.eight == 9}/>
				<Button label='9' value={9} setPressedKey={setPressedKey} highlighted={counts?.nine == 9}/>
				<Button label='Erase' value={0} setPressedKey={setPressedKey} icon={<FaEraser/>}/>
			</div>
			<div className=' flex select-none'>
				<Button label='R' value={10} setPressedKey={setPressedKey} />
				<Button label='G' value={11} setPressedKey={setPressedKey} />
				<Button label='Hint' value={12} setPressedKey={setPressedKey} icon={<HiLightBulb />}/>
				<Button label='Check' value={13} setPressedKey={setPressedKey} icon={<FaMagnifyingGlass />}/>
				<Button label='Solve' value={14} setPressedKey={setPressedKey} icon={<FaFileSignature />}/>
			</div>
		</div>
	)
}

export default Keyboard