import Home from '@/components/frontend/Home';

type Props = {
	params: { locale: string };
};

const IndexPage = ({ params: { locale } }: Props) => {
	return (
		<>
			<Home />
		</>
	);
};

export default IndexPage;
