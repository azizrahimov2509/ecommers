import DetailsCars from "@/app/components/detailscard";

const Page = ({ params }: { params: { id: string } }) => {
  return <DetailsCars id={params.id} />;
};

export default Page;
