import { FC } from "react"

type Props = {
	show: boolean,
	content: JSX.Element
}

const Modal: FC<Props> = ({ show, content }) => {
	if (!show) return <></>
	return (
		<div className="fixed z-50 top-0 left-0 w-full h-screen bg-transparent flex justify-center items-center">
			<div className=" w-fit min-w-80 bg-slate-200 rounded-md border-4 border-blue-400 p-3 font-bold">
				{content}
			</div>
		</div>
	)
}

export default Modal