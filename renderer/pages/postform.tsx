import Head from 'next/head'
import { PostForm } from '../components/PostForm';

export default function PostFormPage() {
  return (
    <>
      <Head>
        <title>Cross Media Uploader / Form</title>
      </Head>
      <PostForm />
    </>
  )
}
