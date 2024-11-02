import { Link } from "wouter";
import LoginMenu from "./LoginMenu";
import { Separator } from "./ui/separator";
import { Heading } from "./ui/typography";

export default function Header() {
	return (
		<div className="mb-8">
			<div className="container mx-auto flex items-end pb-4">
				<Heading className="grow" level={1}>
					<Link to="/">Discord Interactions</Link>
				</Heading>
				<LoginMenu />
			</div>
			<Separator />
		</div>
	);
}
