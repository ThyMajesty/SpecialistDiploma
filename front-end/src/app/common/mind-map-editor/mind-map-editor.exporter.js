class ExportSvg() {
    constructor(svg) {

    }





    let resize = (n) => {
        let cp = d3.select(this.editorSvg.node().cloneNode(true)),
            width = this.width,
            height = this.height,
            m = cp.select('g.main').attr('scale', '(' + n + ')');
        cp
            .attr("width", width)
            .attr("height", height)
            .style("width", width + 'px')
            .style("height", height + 'px')
        return { cp, width, height };
    }
    let save = (dataBlob, filesize) => {
        saveAs.saveAs(dataBlob, this.treeData.name + '.' + format); // FileSaver.js function
    }

    if (format == 'svg') {
        try {
            var isFileSaverSupported = !!new Blob();
        } catch (e) {
            alert("blob not supported");
        }

        var html = this.editorSvg
            .attr("title", this.treeData.name)
            .attr("version", 1.0)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

        var blob = new Blob([html], { type: "image/svg+xml" });
        saveAs.saveAs(blob, this.treeData.name + '.' + format);
    } else if (format == 'pdf') {
        svg_to_pdf(resize(scale).cp.node(), (pdf) => {
            download_pdf(this.treeData.name + +'.pdf', pdf.output('dataurlstring'));
        });
    } else {
        var svgString = getSVGString(resize(scale).cp.node(), this.width, this.height, 8);
        svgString2Image(svgString, 2 * this.width, 2 * this.height, format, save); // passes Blob and filesize String to the callback
    }


    function getSVGString(svgNode) {
        svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        var cssStyleText = getCSSStyles(svgNode);

        appendCSS(cssStyleText, svgNode)

        var serializer = new XMLSerializer();
        var svgString = serializer.serializeToString(svgNode);
        svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=') // Fix root xlink without namespace
        svgString = svgString.replace(/NS\d+:href/g, 'xlink:href') // Safari NS namespace fix

        return svgString;

        function getCSSStyles(parentElement) {
            var selectorTextArr = [];

            // Add Parent element Id and Classes to the list
            selectorTextArr.push('#' + parentElement.id);
            for (var c = 0; c < parentElement.classList.length; c++)
                if (!contains('.' + parentElement.classList[c], selectorTextArr))
                    selectorTextArr.push('.' + parentElement.classList[c]);

                // Add Children element Ids and Classes to the list
            var nodes = parentElement.getElementsByTagName("*");
            for (var i = 0; i < nodes.length; i++) {
                var id = nodes[i].id;
                if (!contains('#' + id, selectorTextArr))
                    selectorTextArr.push('#' + id);

                var classes = nodes[i].classList;
                for (var c = 0; c < classes.length; c++)
                    if (!contains('.' + classes[c], selectorTextArr))
                        selectorTextArr.push('.' + classes[c]);
            }

            // Extract CSS Rules
            var extractedCSSText = "";
            for (var i = 0; i < document.styleSheets.length; i++) {
                var s = document.styleSheets[i];

                try {
                    if (!s.cssRules) continue;
                } catch (e) {
                    if (e.name !== 'SecurityError') throw e; // for Firefox
                    continue;
                }

                var cssRules = s.cssRules;
                for (var r = 0; r < cssRules.length; r++) {
                    if (contains(cssRules[r].selectorText, selectorTextArr))
                        extractedCSSText += cssRules[r].cssText;
                }
            }
            return extractedCSSText

            function contains(str, arr) {
                return arr.indexOf(str) === -1 ? false : true;
            }

        }

        function appendCSS(cssText, element) {
            var styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.innerHTML = cssText;
            var refNode = element.hasChildNodes() ? element.children[0] : null;
            element.insertBefore(styleElement, refNode);
        }
    }




    svg_to_pdf(svg, callback) {
        saveSvgAsPng.svgAsDataUri(svg, {}, (svg_uri) => {
            let image = document.createElement('img');

            image.src = svg_uri;
            image.onload = () => {
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                let doc = new jsPDF('portrait', 'pt');
                let dataUrl;

                if (image.height < image.width) {
                    canvas.width = image.height;
                    canvas.height = image.width;
                    context.rotate((90) * Math.PI / 180);
                }

                context.drawImage(image, 0, 0, image.width, image.height);
                dataUrl = canvas.toDataURL('image/png');
                doc.addImage(dataUrl, 'PNG', 0, 0, image.width, image.height);

                callback(doc);
            }
        });
    }


    download_pdf(name, dataUriString) {
        let link = document.createElement('a');
        link.addEventListener('click', (ev) => {
            link.href = dataUriString;
            link.download = name;
            document.body.removeChild(link);
        }, false);
        document.body.appendChild(link);
        link.click();
    }


    svgString2Image(svgString, width, height, format, callback = () => {}) {
        let format = format ? format : 'png',
            canvas = document.createElement("canvas"),
            context = canvas.getContext("2d"),
            imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to dataurl

        canvas.width = width;
        canvas.height = height;

        let image = new Image;
        image.onload = () => {
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
            canvas.toBlob((blob) => {
                let filesize = Math.round(blob.length / 1024) + ' KB';
                callback(blob, filesize);
            });
        };

        image.src = imgsrc;
    }
}
