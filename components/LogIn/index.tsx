"use client";
import { useState } from "react";
import useCheck from "@/lib/check";
import myself from "@/lib/myself";
import axios from "axios";
import { Button } from "@/components/ui/button";
import PhoneInput from "@/components/PhoneInput";
import { Input } from "@/components/ui/input";
import { useToast } from "../ui/use-toast";

export default function Home() {
  useCheck();

  let [vonageid, setVonageid] = useState<string>("");
  let [firebase_session, set_firebase_session] = useState<string>("");
  let [inputNumber, setInputNumber] = useState<string>("");
  let [inputOTP, setInputOTP] = useState<string>("");
  let [requestedOtp, setRequestedOtp] = useState<boolean>(false);
  const { toast } = useToast();

  async function verifyOTPVonage(otp: string) {
    console.log("client vonage verify otp: ", otp, " vonageid: ", vonageid);

    let body = JSON.stringify({ code: otp, vonageRequestId: vonageid });
    let options = {
      url: "/api/otp/vonage/verify",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: body,
    };

    let response = axios
      .request(options)
      .then(async (response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("expiration", response.data.expiration);
        localStorage.setItem("uid", response.data.uid);
        localStorage.setItem("is_new_user", response.data.is_new_user);
        localStorage.setItem("token_type", response.data.token_type);
        await myself();
        window.location.href = "/recap";
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.response.data.error.error.message,
          variant: "destructive",
        });
      });
  }

  async function requestOTPVonage(number: string) {
    console.log("client vonage request otp");
    console.log(number);
    console.log("------------------");

    let body = JSON.stringify({ number: number });
    let options = {
      url: "/api/otp/vonage/send",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: body,
    };

    let response = axios
      .request(options)
      .then((response) => {
        let rvonageid = response.data.vonageRequestId;
        console.log(response.data);
        setVonageid(rvonageid);
        setRequestedOtp(true);
      })
      .catch((error) => {
        requestOTPFirebase(number);
      });
  }

  async function verifyOTPFirebase(otp: string) {
    console.log(
      "client firebase verify otp: ",
      otp,
      " firebase_session: ",
      firebase_session
    );

    let body = JSON.stringify({ code: otp, session_info: firebase_session });
    let options = {
      url: "/api/otp/fire/verify",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: body,
    };

    let response = axios
      .request(options)
      .then(async (response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("expiration", response.data.expiration);
        localStorage.setItem("uid", response.data.uid);
        localStorage.setItem("is_new_user", response.data.is_new_user);
        localStorage.setItem("token_type", response.data.token_type);
        await myself();
        window.location.href = "/recap";
      })
      .catch((error) => {
        if (error.response) {
          toast({
            title: "Error",
            description: error.response.data.error.error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "unknown error, please try re-logging in",
            variant: "destructive",
          });
        }
      });
  }

  async function requestOTPFirebase(number: string) {
    console.log("client firebase request otp");
    console.log(number);
    console.log("------------------");

    let body = JSON.stringify({ number: number });
    let options = {
      url: "/api/otp/fire/send",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: body,
    };

    let response = axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        let firebase_session = response.data.session_info;
        set_firebase_session(firebase_session);
        setRequestedOtp(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  return (
    <main className="flex flex-col items-center justify-center w-full h-[100vh]">
      <div className="flex flex-col items-center w-full md:w-[16vw] gap-4 justify-center">
        {!requestedOtp ? (
          <>
            <PhoneInput
              value={inputNumber}
              onChange={(phone) => setInputNumber("+" + phone)}
            />
            <Button
              onClick={() => requestOTPVonage(inputNumber)}
              className="w-full"
            >
              Send code
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-2xl">Enter code</h2>
            <div className="flex flex-row items-center gap-2">
              <Input
                onChange={(event) => {
                  setInputOTP(event.target.value);
                }}
                placeholder={"000111"}
              />
              <Button
                onClick={() => {
                  vonageid != ""
                    ? verifyOTPVonage(inputOTP)
                    : verifyOTPFirebase(inputOTP);
                }}
              >
                Sign In
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
