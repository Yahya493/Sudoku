import { Dispatch, SetStateAction } from 'react'

type Props = {
	label: string,
	value: number,
	highlighted?: boolean,
	setPressedKey: Dispatch<SetStateAction<number>>,
	icon?: JSX.Element,
	disabled?: boolean
}
const Button = ({ label, value, setPressedKey, highlighted = false, icon, disabled = false }: Props) => {
	return (
		<div className={` block w-12 aspect-square ${disabled ? 'bg-slate-600' : 'hover:bg-slate-600 cursor-pointer ' + (highlighted ? 'bg-blue-600 text-green-400' : 'bg-slate-800')} relative rounded-md m-0.5 `}
			onClick={() => {
				if (disabled) return
				setPressedKey(value)
			}}
			title={icon && !disabled ? label : undefined}
		>
			<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
				<span className=' font-bold text-2xl text-shadow shadow-yellow-200'>
					{icon ?? label}
				</span>
			</div>
		</div>
	)
}

export default Button