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
        <strong>help.iadtsu@gmail.com</strong>.
      </div>
    </>
  );
};

export default NoticeMessage;
