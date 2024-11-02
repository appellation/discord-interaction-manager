import LoginMenu from "./LoginMenu";
import { Heading } from "./ui/typography";

export default function Header() {
	return (
		<div className="flex items-baseline">
			<Heading className="grow" level={1}>
				Discord Interactions
			</Heading>
			<LoginMenu />
		</div>
	);
}
