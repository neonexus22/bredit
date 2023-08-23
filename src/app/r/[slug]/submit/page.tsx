interface IParams {
  slug: string;
}

const CreatePost = ({ params }: { params: IParams }) => {
  const { slug } = params;
  return <div>CreatePost {slug}</div>;
};

export default CreatePost;
