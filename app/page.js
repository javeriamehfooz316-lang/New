'use client'
import { useState } from 'react'
export default function Home() {
  const [collectionName, setCollectionName] = useState('')
  const [collectionImg, setCollectionImg] = useState('')
  const [description, setDescription] = useState('')

  
   const senddata = async () => {
  const res = await fetch("/api/senddata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collectionName,
      collectionImg,
      description,
    }),
  });

  const data = await res.json();
  if (data.success) {
    setCollectionImg('')
    setCollectionName('')
    setDescription('')
  }
  console.log(data);
};



  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      <div className="inputs flex flex-col gap-4 mt-6">
        <input
          type="text"
          placeholder="Enter Collection Name"
          className="border p-1 outline-none px-4  w-100 rounded"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Collection IMG"
          className="border p-1 outline-none px-4  w-100 rounded"
          value={collectionImg}
          onChange={(e) => setCollectionImg(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Description"
          className="border p-1 outline-none px-4  w-100 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={senddata} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300">Submit</button>
      </div>
      <p className="mt-4 text-lg">This is the home page.</p>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3720159892554941"
     crossorigin="anonymous"></script>
    </div>

  );
}
