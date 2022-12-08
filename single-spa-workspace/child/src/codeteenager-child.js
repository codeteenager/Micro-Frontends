let childContainer = null
export const bootstrap = async function () {
    console.log("应用正在启动")
}
export const mount = async function () {
    console.log("应用正在挂载")
    childContainer = document.createElement("div")
    childContainer.innerHTML = "Hello child"
    childContainer.id = "childContainer"
    document.body.appendChild(childContainer)
}
export const unmount = async function () {
    console.log("应用正在卸载")
    document.body.removeChild(childContainer)
}