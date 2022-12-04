import React from "react";

const ElectionMessage = function (props) {
  let style =
    typeof props.style === "string" || props.style instanceof String
      ? props.style
      : "";
  return (
    <>
      <div className="my-12 border-b text-center">
        <div className="leading-none px-2 inline-block text-sm text-red-600 tracking-wide font-medium bg-white transform translate-y-1/2">
          IMPORTANT INFORMATION
        </div>
      </div>
      <div className="mx-auto max-w-xs relative text-center font-medium text-gray-800">
        Hi {props.name}! Welcome to IADTSU Elections 2022.
        <br />
        {/* Voting is now closed. Thank you for your participation. */}
        Please fill out your digital ballot carefully.{" "}
        <span className="text-red-600">
          Once submitted, your votes are final.
        </span>
        <br />
        <br />
        You may vote separately for each role subject to this election, as well
        as any referenda. Choose your candidate for each, or vote to reopen
        nominations. Referenda can be voted for or against.
        <br />
        <br />
        To cast your vote, simply ensure that the box corresponding to your
        choice is selected.
      </div>
    </>
  );
};

export default ElectionMessage;
