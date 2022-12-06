import React from "react";

const NoticeMessage = function (props) {
  let style =
    typeof props.style === "string" || props.style instanceof String
      ? props.style
      : "";
  return (
    <>
      <div
        className={
          "mx-auto max-w-xs relative text-center text-blue-700 " + style
        }
      >
        If you encounter any issues with the system, please email{" "}
        <strong>help.iadtsu@gmail.com</strong>.<br />
        <br />
        Voting for By-Elections 2022 will end{" "}
        <strong>Wednesday, 7th December 18:00</strong>. Please cast your votes before
        then. <br />
        <br />
        If you registered before 5th December 2022, you have to{" "}
        <strong>register again</strong>.
      </div>
    </>
  );
};

export default NoticeMessage;
