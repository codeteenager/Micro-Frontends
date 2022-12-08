// import Parcel from "single-spa-react/parcel"
import React, { useEffect, useState } from "react"

function useToolsModule() {
  const [toolsModule, setToolsModule] = useState()
  useEffect(() => {
    System.import("@codeteenager/tools").then(setToolsModule)
  }, [])
  return toolsModule
}

export default function Root(props) {
  const toolsModule = useToolsModule()
  if (toolsModule) toolsModule.sayHello("todos")
  return <section>{props.name} is mounted!
  {/* <Parcel config={System.import("@codeteenager/test-parcel")} /> */}
  </section>;
}
