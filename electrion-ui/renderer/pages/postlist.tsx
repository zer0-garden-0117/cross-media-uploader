import Head from 'next/head'
import { PostList } from '../components/PostList';

export default function PostListPage() {
  return (
    <>
      <Head>
        <title>Cross Media Uploader / PostList</title>
      </Head>
      <PostList />
    </>
  );
}