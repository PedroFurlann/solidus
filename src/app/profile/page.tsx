"use client";
import { Avatar } from "@/components/Avatar";
import { MainHeader } from "@/components/MainHeader";

export default function Profile() {
  return (
      <div className="min-h-screen overflow-y-auto bg-gray-950 flex flex-col">
              <MainHeader chosenPage="Profile" style={{ marginBottom: 120 }} />

      <div className="flex flex-col justify-center items-center">
        <Avatar size="profileSize" style={{ marginBottom: 120 }} />
        <div className="bg-amber-400 rounded-2xl h-72 md:w-2/3 py-8 px-12 flex items-center justify-between">
            <div className="flex gap-4 `text-lg font-extrabold text-gray-200 bg-gray-950 transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl">
            <p className="text-gray-200 text-lg font-bold">Nome:</p>
              <p className="text-gray-200 text-lg font-bold">Pedro Furlan</p>
            </div>
            <div className="flex gap-4 `text-lg font-extrabold text-gray-200 bg-gray-950 transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl">
              <p className="text-gray-200 text-lg font-bold">Email:</p>
              <p className="text-gray-200 text-lg font-bold">
                example@gmail.com
              </p>
            </div>
      
        </div>
      </div>
      </div>
  );
}
