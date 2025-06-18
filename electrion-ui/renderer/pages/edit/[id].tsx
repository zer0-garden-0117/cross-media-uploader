import Head from 'next/head'
import { PostForm } from '../../components/PostForm';

type PostEditPageProps = {
  postId: string;
};

export default function PostEditPage({ postId }: PostEditPageProps) {
  return (
    <>
      <Head>
        <title>Cross Media Uploader / Edit</title>
      </Head>
      <PostForm postId={postId}/>
    </>
  )
}