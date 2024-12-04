import React from "react";

import style from "@/style/loading.module.css";

interface LoadingProps {
  isVisible: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isVisible }) => {
  return (
    <>
      {isVisible ? (
        <div className="ml-[80px]">
          <div className={style.loader}></div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Loading;
