"use client";

import { useEffect, useState } from "react";
import TokenList from "./TokenList";

export default function InputToken() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chosenToken, setChosenToken] = useState<any>("");

  useEffect(() => {
    console.log(chosenToken);
  }, [chosenToken]);
  return (
    <>
      <div className="">
        <p onClick={() => setShowModal(!showModal)}>
          {chosenToken.symbol ? chosenToken.symbol : "SYMBOL"}
        </p>
      </div>
      {showModal && (
        <TokenList showModal={setShowModal} willChooseToken={setChosenToken} />
      )}
    </>
  );
}
