import { CSSProperties } from "react";

export enum PlaceholderTypes {
	QuestionMark,
	UserPlaceholder,
}

export default function Placeholder({PlaceholderType, style,}: {PlaceholderType: PlaceholderTypes, style?: CSSProperties}) {
    switch (PlaceholderType) {
		case PlaceholderTypes.QuestionMark:
			return QuestionMark(style);
		case PlaceholderTypes.UserPlaceholder:
			return UserPlaceholder(style);
	}
}

function QuestionMark(style: CSSProperties) {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60' y={0} x={0} style={style}>
			<path
				d='M30 4.687C16.03 4.687 4.687 16.03 4.687 30 4.687 43.97 16.03 55.313 30 55.313S55.313 43.97 55.313 30 43.97 4.687 30 4.687z'
				strokeLinejoin='round'
				stroke='#fff'
				strokeLinecap='round'
				strokeWidth={8.125}
				fill='none'
			/>
			<path
				d='M30 4.687C16.03 4.687 4.687 16.03 4.687 30 4.687 43.97 16.03 55.313 30 55.313S55.313 43.97 55.313 30 43.97 4.687 30 4.687z'
				fillRule='evenodd'
				stroke='#000'
				strokeWidth={3.125}
				fill='#fff'
			/>
			<path
				d='M29.515 10.465c1.69 0 3.295.259 4.76.758s2.754 1.217 3.881 2.183a10.036 10.036 0 012.638 3.517c.643 1.368.94 2.918.94 4.608 0 3.026-.745 5.361-2.274 7.034-1.513 1.658-3.591 2.758-6.246 3.305v.97c0 .773-.178 1.467-.516 2.062-.321.579-.799 1.026-1.394 1.364-.58.322-1.231.486-1.971.486s-1.406-.164-2.001-.486a3.703 3.703 0 01-1.364-1.364c-.322-.595-.486-1.289-.486-2.062v-3.971c0-.821.148-1.476.486-1.911.338-.434.76-.718 1.243-.879.482-.161 1.217-.338 2.183-.515 2.51-.467 3.759-1.73 3.759-3.79 0-.837-.355-1.584-1.031-2.244-.66-.676-1.529-1-2.607-1-.998 0-1.786.19-2.365.576-.563.386-1.104.957-1.668 1.698-.547.724-1.091 1.281-1.606 1.667-.499.37-1.193.546-2.062.546-.982 0-1.809-.382-2.517-1.122-.692-.756-1.031-1.624-1.031-2.638 0-1.77.57-3.333 1.729-4.669 1.158-1.336 2.597-2.354 4.335-3.062s3.463-1.061 5.185-1.061zm-.243 30.369c.757 0 1.463.204 2.123.606s1.16.931 1.546 1.607c.402.66.606 1.38.606 2.153 0 .788-.204 1.537-.606 2.213a4.152 4.152 0 01-1.577 1.546 4.06 4.06 0 01-2.092.576c-.74 0-1.446-.19-2.122-.576-.66-.386-1.205-.886-1.607-1.546a4.414 4.414 0 01-.576-2.213c0-.773.19-1.493.576-2.153.402-.676.947-1.205 1.607-1.607s1.366-.606 2.122-.606z'
				strokeLinejoin='round'
				fillRule='evenodd'
				stroke='#000'
				strokeWidth={1.25}
				fill='#000'
			/>
		</svg>
	);
}

function UserPlaceholder(style: CSSProperties) {
	return (
		<svg id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 528 528' style={style}>
			<defs>
				<style>{'.cls-1{fill:#fff}'}</style>
			</defs>
			<path fill='#5b5f32' d='M0 0H528V528H0z' />
			<circle className='cls-1' cx={264} cy={176.91} r={115} />
			<path
				className='cls-1'
				d='M36 528c0-127.58 102.08-231 228-231s228 103.42 228 231'
			/>
		</svg>
	);
}
