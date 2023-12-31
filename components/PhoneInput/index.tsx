"use client";
import countryList from "country-list";
import { useState } from "react";
import { Combobox } from "../ui/combobox";
import { Input } from "../ui/input";
import Image from "next/image";
import countryCodes from "./CountryCodes";

export default function PhoneInput({
  onChange,
  value,
}: {
  onChange: (phone: string) => void;
  value: string;
}) {
  const [number, setNumber] = useState(value);
  const [country, setCountry] = useState("United States of America");
  const [mobileCode, setMobileCode] = useState("1");
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <Combobox
        list={countryList.getData().map((c) => ({
          label: c.name,
          value: c.name,
          icon: (
            <Image
              src={`https://flagsapi.com/${c.code}/flat/64.png`}
              width={20}
              height={20}
              alt={c.name}
            />
          ),
        }))}
        listName="country"
        updateValue={async (value) => {
          setCountry(value);
          // get mobile code from https://gist.github.com/anubhavshrimal/75f6183458db8c453306f93521e93d37

          let code = countryCodes.find(
            (c) => c.name.toLowerCase() === value
          )?.dial_code;
          if (!code) return;
          setMobileCode(code.split("+")[1] || "1");
          onChange(`${code.split("+")[1]}${number}`);
        }}
        baseValue={country}
      />
      <Input
        placeholder="phone number"
        value={number}
        onChange={(event) => {
          setNumber(event.target.value);
          onChange(`${mobileCode}${event.target.value}`);
        }}
        className="ml-2 w-full"
      />
    </div>
  );
}
