import { Link } from "wouter";
import LoginMenu from "./LoginMenu";
import { Separator } from "./ui/separator";
import { Heading } from "./ui/typography";

export default function Header() {
	return (
		<div className="mb-8">
			<nav className="container mx-auto flex items-center py-2">
				<div className="grow">
					<Link className="text-2xl font-semibold" to="/">
						Discord Command Manager
					</Link>
				</div>
				<LoginMenu />
			</nav>
			<Separator />
		</div>
	);
}
