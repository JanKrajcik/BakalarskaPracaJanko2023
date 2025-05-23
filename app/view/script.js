/*
* This file includes code from GraphvizOnline, which is licensed under the BSD-3-Clause license.
*
* Original project: https://github.com/GraphvizOnline
*
* Copyright (c) Dreampuf
*
* This project also includes dependencies:
* - Viz.js (MIT License)
* - ACE Editor (BSD-2-Clause License)
*
* See the LICENSE file for more details.
*/
(function (document) {
    //http://stackoverflow.com/a/10372280/398634
    window.URL = window.URL || window.webkitURL;
    var el_stetus = document.getElementById("status"),
        t_stetus = -1,
        reviewer = document.getElementById("viewCanvas"),
        scale = window.devicePixelRatio || 1,
        downloadBtn = document.getElementById("download"),
        editor = ace.edit("editor"),
        lastHD = -1,
        worker = null,
        parser = new DOMParser(),
        showError = null,
        formatEl = "svg",
        engineEl = "dot",
        rawEl = document.querySelector("#raw input"),
        shareEl = document.querySelector("#share"),
        shareURLEl = document.querySelector("#shareurl"),
        errorEl = document.querySelector("#error");

    function show_status(text, hide) {
        hide = hide || 0;
        clearTimeout(t_stetus);
        el_stetus.innerHTML = text;
        if (hide) {
            t_stetus = setTimeout(function () {
                el_stetus.innerHTML = "";
            }, hide);
        }
    }

    function show_error(e) {
        show_status("error", 500);
        reviewer.classList.remove("working");
        reviewer.classList.add("error");

        var message = e.message === undefined ? "An error occurred while processing the graph input." : e.message;
        while (errorEl.firstChild) {
            errorEl.removeChild(errorEl.firstChild);
        }
        errorEl.appendChild(document.createTextNode(message));
    }

    function svgXmlToImage(svgXml, callback) {
        var pngImage = new Image(), svgImage = new Image();

        svgImage.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = svgImage.width * scale;
            canvas.height = svgImage.height * scale;

            var context = canvas.getContext("2d");
            context.drawImage(svgImage, 0, 0, canvas.width, canvas.height);

            pngImage.src = canvas.toDataURL("image/png");
            pngImage.width = svgImage.width;
            pngImage.height = svgImage.height;

            if (callback !== undefined) {
                callback(null, pngImage);
            }
        }

        svgImage.onerror = function (e) {
            if (callback !== undefined) {
                callback(e);
            }
        }
        svgImage.src = svgXml;
    }


function renderGraph() {
    reviewer.classList.add("working");
    reviewer.classList.remove("error");

    let worker;

    if (worker) {
        worker.terminate();
    } else if (!worker) {
        worker = new Worker("./full.render.js");

        worker.addEventListener("message", function (e) {
            if (typeof e.data.error !== "undefined") {
                var event = new CustomEvent("error", {"detail": new Error(e.data.error.message)});
                worker.dispatchEvent(event);
                return
            }
            reviewer.classList.remove("working");
            reviewer.classList.remove("error");
            document.body.style.cursor = "default";
            updateOutput(e.data.result);
        }, false);
        worker.addEventListener('error', function (e) {
            show_error(e.detail);
            document.body.style.cursor = "default";
        }, false);
    }

    show_status("rendering...");
    var params = {
        "src": editor.getSession().getDocument().getValue(),
        "id": new Date().toJSON(),
        "options": {
            "files": [],
            "format": formatEl === "png-image-element" ? "png" : "svg",
            "engine": engineEl || "dot"
        },
    };
    worker.postMessage(params);
}

    function updateState() {
        var content = encodeURIComponent(editor.getSession().getDocument().getValue());
        history.pushState({"content": content}, "", "#" + content)
    }

    function updateOutput(result) {
        if (formatEl === "svg") {
            document.querySelector("#raw").classList.remove("disabled");
            rawEl.disabled = false;
        } else {
            document.querySelector("#raw").classList.add("disabled");
            rawEl.disabled = true;
        }

        var text = reviewer.querySelector("#text");
        if (text) {
            reviewer.removeChild(text);
        }

        var a = reviewer.querySelector("a");
        if (a) {
            reviewer.removeChild(a);
        }

        if (!result) {
            return;
        }

        reviewer.classList.remove("working");
        reviewer.classList.remove("error");

        if (formatEl == "svg" && !rawEl.checked) {
            var svg = parser.parseFromString(result, "image/svg+xml");
            //get svg source.
            var serializer = new XMLSerializer();
            var source = serializer.serializeToString(svg);
            //add name spaces.
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }
            //add xml declaration
            if (!source.startsWith("<?xml version")) {
                source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            }
            // https://stackoverflow.com/questions/18925210/download-blob-content-using-specified-charset
            //const blob = new Blob(["\ufeff", svg], {type: 'image/svg+xml;charset=utf-8'});
            const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
            downloadBtn.href = url;
            downloadBtn.download = "graphviz.svg";
            var a = document.createElement("a");
            var svgEl = svg.documentElement;
            a.appendChild(svgEl);
            reviewer.appendChild(a);

            if (svgEl) {
                svgPanZoom(svgEl, {
                    zoomEnabled: true,
                    controlIconsEnabled: true,
                    fit: true,
                    center: true,
                });
            } else {
                console.error("SVG element is invalid or not rendered.");
            }
        } else if (formatEl == "png-image-element") {
            var resultWithPNGHeader = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(result)));
            svgXmlToImage(resultWithPNGHeader, function (err, image) {
                if (err) {
                    show_error(err)
                    return
                }
                image.setAttribute("title", "graphviz");
                downloadBtn.href = image.src;
                downloadBtn.download = "graphviz.png";
                var a = document.createElement("a");
                a.appendChild(image);
                reviewer.appendChild(a);
            })
        } else {
            var text = document.createElement("div");
            text.id = "text";
            text.appendChild(document.createTextNode(result));
            reviewer.appendChild(text);
        }

        updateState()
    }

    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/dot");
    editor.getSession().on("change", function () {
        clearTimeout(lastHD);
        lastHD = setTimeout(renderGraph, 1500);
    });

    window.onpopstate = function(event) {
        if (event.state != null && event.state.content != undefined) {
            editor.getSession().setValue(decodeURIComponent(event.state.content));
        }
    };

    /*formatEl.addEventListener("change", renderGraph);
    engineEl.addEventListener("change", renderGraph);
    rawEl.addEventListener("change", renderGraph);
    share.addEventListener("click", copyShareURL);*/

    // Since apparently HTMLCollection does not implement the oh so convenient array functions
    HTMLOptionsCollection.prototype.indexOf = function(name) {
        for (let i = 0; i < this.length; i++) {
            if (this[i].value == name) {
                return i;
            }
        }

        return -1;
    };

    /* come from sharing */
    const params = new URLSearchParams(location.search.substring(1));
    if (params.has('engine')) {
        const engine = params.get('engine');
        const index = engineEl.options.indexOf(engine);
        if (index > -1) { // if index exists
            engineEl.selectedIndex = index;
        } else {
            show_error({ message: `invalid engine ${engine} selected` });
        }
    }

    if (params.has("presentation")) {
        document.body.classList.add("presentation");
    }

    if (params.has('raw')) {
        editor.getSession().setValue(params.get('raw'));
        renderGraph();
    } else if (params.has('compressed')) {
        const compressed = params.get('compressed');
        editor.getSession().setValue(LZString.decompressFromEncodedURIComponent(compressed));
    } else if (params.has('url')) {
        const url = params.get('url');
        let ok = false;
        fetch(url)
            .then(res => {
                ok = res.ok;
                return res.text();
            })
            .then(res => {
                if (!ok) {
                    throw { message: res };
                }

                editor.getSession().setValue(res);
                renderGraph();
            }).catch(e => {
            show_error(e);
        });
    } else if (location.hash.length > 1) {
        editor.getSession().setValue(decodeURIComponent(location.hash.substring(1)));
    } else if (editor.getValue()) { // Init
        renderGraph();
    }

})(document);