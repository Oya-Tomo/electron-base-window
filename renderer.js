function quit() {
    window.api.send("quit", true);
}
function resize() {
    window.api.send("resize", true);
}
function mini() {
    window.api.send("mini", true);
}

window.api.on("getResize", (e, arg) => {
    if (arg === true) {
        document.getElementById("resize").src = "button_img/unmax_w.png"
    } else {
        document.getElementById("resize").src = "button_img/max_w.png"
    }
});

window.api.send("getResize", true);
