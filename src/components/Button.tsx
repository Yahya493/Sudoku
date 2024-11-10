import { Dispatch, SetStateAction } from 'react'

type Props = {
	label: string,
	value: number,
	highlighted?: boolean,
	setPressedKey: Dispatch<SetStateAction<number>>,
	icon?: JSX.Element
}
const Button = ({ label, value, setPressedKey, highlighted = false, icon }: Props) => {
	return (
		<div className={` block w-12 aspect-square ${highlighted ? 'bg-blue-600 text-green-400' : 'bg-slate-800'} relative rounded-md m-0.5 hover:bg-slate-600 cursor-pointer`}
			onClick={() => setPressedKey(value)}
			title={icon?label:undefined}
		>
			<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
				<span className=' font-bold text-2xl'>
					{icon??label}
				</span>
			</div>
		</div>
	)
}

export default Button