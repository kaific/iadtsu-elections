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
        Voting for By-Elections 2022 will open on{" "}
        <strong>Tuesday, 6th December 09:00</strong>. Please register before
        then. <br />
        <br />
        If you registered before 5th December 2022, you have to{" "}
        <strong>register again</strong>.
      </div>
    </>
  );
};

export default NoticeMessage;
