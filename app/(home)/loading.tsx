import React from "react";

import Loading from "@/components/Loading";

function loading() {
  return (
    <div className="h-[95dvh] w-[93dvw] flex justify-center items-center">
      <Loading isVisible={true} />
    </div>
  );
}

export default loading;
