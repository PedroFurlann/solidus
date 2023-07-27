"use client"
import { MainHeader } from "@/components/MainHeader";

export default function Profile() {
  return (
    <>
      <MainHeader chosenPage="Profile" />
      <div className="min-h-screen overflow-y-auto"></div>
    </>
  );
}
