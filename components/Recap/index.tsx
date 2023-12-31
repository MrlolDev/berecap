"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import useCheck from "@/lib/check";
import Link from "next/link";
import Memory from "@/types/memory";
import { Loader2Icon } from "lucide-react";

// Made memories global for downloading (kinda ugly)
let newmemories: Memory[] = [];

export default function Recap() {
  useCheck();

  let [memories, setMemories] = useState<Memory[]>([]);
  let [loading, setLoading] = useState<boolean>(true);
  let [base64Image, setBase64Image] = useState<string>("");

  useEffect(() => {
    if (memories.length > 0 || !loading) {
      return;
    }
    let token = localStorage.getItem("token");
    let body = JSON.stringify({ token: token });
    let options = {
      url: "/api/memories",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: body,
    };

    axios
      .request(options)
      .then(async (response) => {
        console.log(response.data);
        let memorydata = response.data.data;

        async function createMemory(data: any) {
          let newmemory = await Memory.create(data);
          newmemories.push(newmemory);
          return newmemory;
        }

        for (let i = 0; i < memorydata.length; i++) {
          try {
            await createMemory(memorydata[i]);
            setLoading(false);
            setMemories([...newmemories]);
          } catch (error) {
            console.log("COULDN'T MAKE MEMORY WITH DATA: ", memorydata[i]);
            console.log(error);
          }
        }
        console.log(newmemories);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      {loading ? (
        <>
          <Loader2Icon className="animate-spin h-8 w-8" />
          <p>Getting Memories...</p>
        </>
      ) : (
        "Memories"
      )}
      {base64Image && <img src={`data:image/webp;base64,${base64Image}`} />}
    </main>
  );
}
