import Head from 'next/head'
import { PostForm } from '../../components/PostForm';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type PostEditPageProps = {
  postId: string;
};

export default function PostEditPage({ postId }: PostEditPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (id) {
      console.log("postId:", id);
      setIsReady(true);
    }
  }, [id]);

  if (!isReady) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Cross Media Uploader / Edit</title>
      </Head>
      <PostForm postId={id as string} />
    </>
  )
}